import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { likePost, dislikePost } from "../api.js";
import { posts, goToPage, page } from "../index.js";
import { getUserFromLocalStorage } from "../helpers.js";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";


export function renderPostsPageComponent({ appEl }) {
  // @TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  const safeHtml = (htmlString) => {
    return htmlString
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  };
  let userHeaderHtml = "";
  if ((page === USER_POSTS_PAGE && posts.length > 0)) {
    const postUser = posts[0].user;
    userHeaderHtml = `
    <div class="posts-user-header">
        <img src="${postUser.imageUrl}" class="posts-user-header__user-image">
        <h2 class="posts-user-header__user-name">${safeHtml(postUser.name)}</h2>
    </div>
    `;
  }

  /**
   * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const postHtml = posts
    .map((post) => {
      const likeImage = post.isLiked
        ? "./assets/images/like-active.svg"
        : "./assets/images/like-not-active.svg";

      const postDateDistance = formatDistanceToNow(new Date(post.createdAt), {
        locale: ru,
        addSuffix: true,
      });

      return `
        <li class="post">
          ${
            page !== USER_POSTS_PAGE
              ? `
            <div class="post-header" data-user-id="${post.user.id}">
                <img src="${post.user.imageUrl}" class="post-header__user-image">
                <p class="post-header__user-name">${safeHtml(post.user.name)}</p>
            </div>
          `
              : ""
          }
          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="${post.id}" class="like-button">
              <img src="${likeImage}">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${post.likes.length}</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${safeHtml(post.user.name)}</span>
            ${safeHtml(post.description)}
          </p>
          <p class="post-date">
            ${postDateDistance}
          </p>
        </li>
      `;
    })
    .join("");

  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                ${userHeaderHtml}
                <ul class="posts">
                  ${postHtml}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  const currentUser = getUserFromLocalStorage();
  const token = currentUser ? `Bearer ${currentUser.token}` : undefined;

  for (let likeBtn of document.querySelectorAll(".like-button")) {
    likeBtn.addEventListener("click", () => {
      const postId = likeBtn.dataset.postId;
      const currentPost = posts.find((p) => p.id === postId);

      if (!token) {
        alert("Лайкать могут только авторизованные пользователи");
        return;
      }

      const apiMethod = currentPost.isLiked ? dislikePost : likePost;
      apiMethod({ token, postId })
        .then((updatedData) => {
          const index = posts.findIndex((p) => p.id === postId);
          posts[index] = updatedData.post;
          renderPostsPageComponent({ appEl });
        })
        .catch((error) => {
          console.error(error);
          alert("Не удалось поставить лайк");
        });
    });
  }
  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
