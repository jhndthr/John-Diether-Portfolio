const portfolioOpeners =
  document.querySelectorAll("[data-portfolio-open]");

const portfolioClosers =
  document.querySelectorAll("[data-portfolio-close]");


portfolioOpeners.forEach((card) => {

  card.addEventListener("click", (event) => {

    /*
      Important:
      kapag carousel arrow/dot ang pinindot,
      HUWAG buksan ang portfolio modal.
    */

    if (
      event.target.closest(".carousel-arrow") ||
      event.target.closest(".carousel-dot")
    ) {
      return;
    }


    const modalId =
      card.dataset.portfolioOpen;

    const modal =
      document.getElementById(modalId);


    if (!modal) return;


    modal.classList.add("active");

    modal.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.classList.add(
      "portfolio-open"
    );


    const scrollArea =
      modal.querySelector(
        ".portfolio-scroll"
      );

    if (scrollArea) {
      scrollArea.scrollTop = 0;
    }

  });


  /* Keyboard support */

  card.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {

        event.preventDefault();

        card.click();

      }

    }
  );

});


portfolioClosers.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      const modal =
        button.closest(
          ".portfolio-modal"
        );

      if (!modal) return;


      modal.classList.remove(
        "active"
      );

      modal.setAttribute(
        "aria-hidden",
        "true"
      );

      document.body.classList.remove(
        "portfolio-open"
      );

    }
  );

});


/* ESC KEY */

document.addEventListener(
  "keydown",
  (event) => {

    if (event.key !== "Escape") {
      return;
    }


    const modal =
      document.querySelector(
        ".portfolio-modal.active"
      );


    if (!modal) return;


    modal.classList.remove(
      "active"
    );

    modal.setAttribute(
      "aria-hidden",
      "true"
    );

    document.body.classList.remove(
      "portfolio-open"
    );

  }
);