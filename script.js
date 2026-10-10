/* =========================================
   BF BARBER — INTERACTIONS
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ELEMENTS
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-navigation");
  const progressBar = document.querySelector(".page-progress");
  const yearElement = document.querySelector("#current-year");
  const revealElements = document.querySelectorAll(".reveal");

  // CURRENT YEAR
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // MOBILE NAVIGATION
  function closeMenu() {
    if (!menuToggle || !navigation) return;

    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && navigation) {
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      navigation.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      const clickedInsideNavigation =
        navigation.contains(event.target);

      const clickedToggle =
        menuToggle.contains(event.target);

      if (!clickedInsideNavigation && !clickedToggle) {
        closeMenu();
      }
    });
  }

  // SCROLL PROGRESS + HEADER
  let ticking = false;

  function updateScrollEffects() {
    const scrollTop =
      window.scrollY ||
      document.documentElement.scrollTop;

    const scrollableHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const progress =
      scrollableHeight > 0
        ? (scrollTop / scrollableHeight) * 100
        : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (header) {
      header.classList.toggle("is-scrolled", scrollTop > 30);
    }

    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    },
    { passive: true }
  );

  updateScrollEffects();

  // REVEAL ANIMATIONS
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  // STAGGERED CARD ANIMATIONS
  const cardGroups = document.querySelectorAll(
    ".work-grid, .services-grid, .collaboration-grid, .gallery-grid"
  );

  if ("IntersectionObserver" in window) {
    const cardObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll(
              ".work-card, .service-card, .collaboration-card, .gallery-item"
            );

            cards.forEach((card, index) => {
              card.style.transitionDelay =
                `${Math.min(index * 80, 400)}ms`;

              card.classList.add("is-visible");
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    cardGroups.forEach((group) => {
      cardObserver.observe(group);
    });
  }

  // SMOOTH ANCHOR NAVIGATION
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches
            ? "auto"
            : "smooth",
          block: "start"
        });

        if (window.history.replaceState) {
          window.history.replaceState(null, "", targetId);
        }
      }
    });
  });

  // IMAGE LOADING FALLBACK
  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.classList.add("image-error");
      console.warn(
        "Could not load image:",
        image.getAttribute("src")
      );
    });
  });

  // PREVENT ANIMATION FLASH
  document.documentElement.classList.add("js-ready");

  console.log("BF Barber website initialized successfully.");
});
