document.addEventListener("DOMContentLoaded", function () {
  const galleryContainer = document.getElementById("autoGallery");
  const dataScript = document.getElementById("galleryData");

  if (galleryContainer && dataScript) {
    const folder = galleryContainer.getAttribute("data-folder") || "Food-and-Coffee-Ads";
    
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
    } catch (e) {
      console.error("Error parsing gallery images:", e);
    }
  }
});
