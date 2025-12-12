// Minimal smooth-scroll behavior for anchor links and CTA + back-to-top toggle
document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const smoothScrollTo = (target) => {
    target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
  };

  const menuToggle = document.querySelector(".nav__toggle");
  const primaryMenu = document.querySelector("#primary-menu");

  const closeMenu = () => {
    primaryMenu?.classList.remove("is-open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  };

  if (menuToggle && primaryMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = primaryMenu.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      if (!isOpen) {
        primaryMenu.style.maxHeight = "";
      } else {
        primaryMenu.style.maxHeight = `${primaryMenu.scrollHeight}px`;
      }
    });

    primaryMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 780) {
        closeMenu();
      }
    });

    const handleScrollClose = () => {
      if (window.innerWidth <= 780 && primaryMenu.classList.contains("is-open")) {
        closeMenu();
      }
    };

    window.addEventListener("scroll", handleScrollClose, { passive: true });
  }

  const anchors = document.querySelectorAll("a[href^='#']");
  anchors.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href === "#" || href.trim() === "") return;

    const target = document.querySelector(href);
    if (!target) return;

    link.addEventListener("click", (event) => {
      event.preventDefault();
      smoothScrollTo(target);
    });
  });

  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    const toggleButton = () => {
      if (window.scrollY > 360) {
        backToTop.classList.add("is-visible");
      } else {
        backToTop.classList.remove("is-visible");
      }
    };

    toggleButton();
    window.addEventListener("scroll", toggleButton);

    backToTop.addEventListener("click", () => {
      if (prefersReduced) {
        window.scrollTo({ top: 0, behavior: "auto" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  const form = document.querySelector(".contact__form");
  if (form) {
    const fields = ["name", "email", "message"];
    const errorEls = {};
    fields.forEach((id) => {
      errorEls[id] = form.querySelector(`[data-error-for='${id}']`);
    });
    const successEl = form.querySelector(".form__success");

    const emailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const clearErrors = () => {
      fields.forEach((id) => {
        const input = form.querySelector(`#${id}`);
        input?.classList.remove("is-invalid");
        input?.setAttribute("aria-invalid", "false");
        if (errorEls[id]) errorEls[id].textContent = "";
      });
      if (successEl) successEl.textContent = "";
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearErrors();
      let hasError = false;
      const errors = {};

      const nameVal = form.name.value.trim();
      const emailVal = form.email.value.trim();
      const messageVal = form.message.value.trim();

      if (!nameVal) {
        hasError = true;
        errors.name = "Te rugăm să adaugi numele.";
      }

      if (!emailVal) {
        hasError = true;
        errors.email = "Te rugăm să adaugi emailul.";
      } else if (!emailValid(emailVal)) {
        hasError = true;
        errors.email = "Email invalid. Ex: nume@domeniu.com";
      }

      if (!messageVal) {
        hasError = true;
        errors.message = "Spune-ne câteva detalii despre rezervare.";
      }

      Object.entries(errors).forEach(([id, message]) => {
        const input = form.querySelector(`#${id}`);
        if (!input) return;
        input.classList.add("is-invalid");
        input.setAttribute("aria-invalid", "true");
        if (errorEls[id]) errorEls[id].textContent = message;
      });

      if (!hasError) {
        if (successEl) successEl.textContent = "Mulțumim! Trimite formularul cu providerul preferat (Formspree/EmailJS).";
        form.reset();
      }
    });
  }
});
