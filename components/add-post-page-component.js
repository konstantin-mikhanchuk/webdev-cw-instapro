import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let description = "";
  let imageUrl = "";
  const render = () => {
    // @TODO: Реализовать страницу добавления поста
    
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          
          <div class="upload-image-container"></div>
          
          <p class="post-text" style="text-align: left;">
            Опишите фотографию:
          </p>
          
          <textarea 
            id="description-input" 
            class="input textarea" 
            placeholder="Введите описание поста..."
          ></textarea>
          
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({ element: document.querySelector(".header-container") });
    const uploadImageContainer = appEl.querySelector(".upload-image-container")
    if (uploadImageContainer) {
        renderUploadImageComponent({ 
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      })
    }


    document.getElementById("add-button").addEventListener("click", () => {
      description = document.querySelector("#description-input").value
      if (!imageUrl) {
        alert("Пожалуйста, выберите и загрузите фото")
        return
      }
      if (!description.trim()) {
        alert("Пожалуйста, опишите фотографию")
        return
      }
      onAddPostClick({
        description: description,
        imageUrl: imageUrl,
      });
    });
  };

  render();
}
