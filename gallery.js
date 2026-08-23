document.addEventListener("DOMContentLoaded", function () {
  const galleryContainer = document.getElementById("autoGallery");
  const dataScript = document.getElementById("galleryData");

  if (galleryContainer && dataScript) {
    const folder = galleryContainer.getAttribute("data-folder") || "Royal-Cable-Company";

    try {
      const images = JSON.parse(dataScript.textContent);

      galleryContainer.innerHTML = images.map((imgName, index) => {
        const formattedIndex = String(index + 1).padStart(2, " ");
        const fullPath = `${folder}/${imgName}`;

        return `
          <article class="compilation-card">
            <div class="compilation-media">
              <img src="${fullPath}" alt="Design ${formattedIndex}" loading="lazy">
            </div>
            <div class="compilation-caption">
              <span>Design${formattedIndex}</span>
              <span></span>
            </div>
          </article>
        `;
      }).join("");

      console.log("Gallery successfully loaded via gallery.js!");

      galleryContainer.addEventListener("click", function (e) {
        const img = e.target.closest("img");
        if (img) {
          const index = Array.from(galleryContainer.querySelectorAll("img")).indexOf(img);
          openLightbox(images, folder, index);
        }
      });
    } catch (e) {
      console.error("Error parsing gallery images:", e);
    }
  }
});

let currentLightboxIndex = 0;
let currentLightboxImages = [];
let currentLightboxFolder = "";

function openLightbox(images, folder, index) {
  currentLightboxImages = images;
  currentLightboxFolder = folder;
  currentLightboxIndex = index;

  document.body.classList.add("lightbox-open");

  let lightbox = document.getElementById("lightbox");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.className = "lightbox-overlay";
    lightbox.innerHTML = `
      <button class="lightbox-close" id="lightboxClose">&times;</button>
      <button class="lightbox-nav lightbox-prev" id="lightboxPrev">&#10094;</button>
      <img id="lightboxImg" src="" alt="Preview">
      <button class="lightbox-nav lightbox-next" id="lightboxNext">&#10095;</button>
      <div class="lightbox-counter" id="lightboxCounter"></div>
    `;
    document.body.appendChild(lightbox);

    document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
    document.getElementById("lightboxPrev").addEventListener("click", showPrevImage);
    document.getElementById("lightboxNext").addEventListener("click", showNextImage);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrevImage();
      if (e.key === "ArrowRight") showNextImage();
    });
  }

  updateLightboxImage();
  lightbox.classList.add("active");
}

function updateLightboxImage() {
  const img = document.getElementById("lightboxImg");
  const counter = document.getElementById("lightboxCounter");
  img.src = `${currentLightboxFolder}/${currentLightboxImages[currentLightboxIndex]}`;
  counter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("active");
  document.body.classList.remove("lightbox-open");
}

function showPrevImage() {
  currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
  updateLightboxImage();
}

function showNextImage() {
  currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
  updateLightboxImage();
}