(() => {
  "use strict";

  /* -------- Header scroll state -------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* -------- Mobile nav toggle -------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* -------- Cursor spotlight (design-tool feel) -------- */
  const spotlight = document.getElementById("spotlight");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("pointermove", (e) => {
      spotlight.style.setProperty("--x", `${e.clientX}px`);
      spotlight.style.setProperty("--y", `${e.clientY}px`);
    }, { passive: true });
  }

  /* -------- Scroll reveal + skill bar fill -------- */
  const revealEls = document.querySelectorAll(".reveal");
  const skillFills = document.querySelectorAll(".skill-fill");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));

  const skillIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          skillIo.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  skillFills.forEach((el) => skillIo.observe(el));

  /* -------- Card carousels (for work cards with multiple images) -------- */
  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
    const dotsWrap = carousel.querySelector("[data-carousel-dots]");
    const prevBtn = carousel.querySelector("[data-carousel-prev]");
    const nextBtn = carousel.querySelector("[data-carousel-next]");

    if (slides.length <= 1) {
      if (prevBtn) prevBtn.style.display = "none";
      if (nextBtn) nextBtn.style.display = "none";
      return;
    }

    let current = 0;

    // Build dots
    const dots = slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Go to image ${i + 1}`);
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        goTo(i);
      });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("active", i === current));
    }

    prevBtn.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      goTo(current - 1);
      restartAutoplay();
    });
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      goTo(current + 1);
      restartAutoplay();
    });

    // Swipe support
    let startX = 0;
    let isDragging = false;

    carousel.addEventListener("pointerdown", (e) => {
      isDragging = true;
      startX = e.clientX;
    });
    carousel.addEventListener("pointerup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      const diff = e.clientX - startX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? goTo(current - 1) : goTo(current + 1);
        restartAutoplay();
      }
    });
    carousel.addEventListener("pointerleave", () => { isDragging = false; });

    // Autoplay
    const AUTOPLAY_DELAY = 3500;
    let autoplayTimer = null;

    function startAutoplay() {
      if (prefersReducedMotion) return;
      stopAutoplay();
      autoplayTimer = setInterval(() => goTo(current + 1), AUTOPLAY_DELAY);
    }
    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", startAutoplay);

    goTo(0);
    startAutoplay();
  });

})();
/*document.addEventListener("DOMContentLoaded", function () {
  // Mobile Nav Toggle
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("open");
      mainNav.classList.toggle("open");
    });
  }
});*/

document.addEventListener("DOMContentLoaded", function () {
  // Mobile Nav Toggle
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("open");
      mainNav.classList.toggle("open");
    });
  }

  // Automatic Gallery Generator
  const galleryContainer = document.getElementById("autoGallery");
  const dataScript = document.getElementById("galleryData");

  if (galleryContainer && dataScript) {
    const folder = galleryContainer.getAttribute("data-folder") || "Royal-Cable-Company";
    
    try {
      // Babasahin ang JSON mula sa script tag sa HTML
      const images = JSON.parse(dataScript.textContent);

      galleryContainer.innerHTML = images.map((imgName, index) => {
        const formattedIndex = String(index + 1).padStart(2, "0");
        const fullPath = `${folder}/${imgName}`;

        return `
          <article class="compilation-card">
            <div class="compilation-media">
              <img src="${fullPath}" alt="Design ${formattedIndex}" loading="lazy">
            </div>
            <div class="compilation-caption">
              <span>Creative Variant ${formattedIndex}</span>
              <span>4 : 5</span>
            </div>
          </article>
        `;
      }).join("");

      console.log("Gallery successfully generated!");
    } catch (e) {
      console.error("Error reading gallery data:", e);
    }
  }
});





