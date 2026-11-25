(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  if (!document.querySelector(".call-fab")) {
    const call = document.createElement("a");
    call.className = "call-fab";
    call.href = "tel:01246922922";
    call.setAttribute("aria-label", "Call Darby House Interiors on 01246 922922");
    call.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.2 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2.2 2.2z"/></svg>';
    document.body.appendChild(call);
  }

  const syncHeaderScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  syncHeaderScroll();
  window.addEventListener("scroll", syncHeaderScroll, { passive: true });

  if (toggle && mobileNav) {
    const setMenuOpen = (open) => {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      mobileNav.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      if (header) header.classList.toggle("is-open", open);
    };

    toggle.addEventListener("click", () => {
      setMenuOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenuOpen(false);
      }
    });
  }

  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll(`[data-nav="${page}"]`).forEach((el) => {
      el.setAttribute("aria-current", "page");
    });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const activateRise = (el) => {
    if (!el) return;
    el.classList.add("in");
    el.querySelectorAll(".title-rise").forEach((title) => title.classList.add("in"));
  };

  // Hero / page-hero: upward fade on load (and when scrolled into view)
  const heroRise = document.querySelector("[data-hero-rise], .page-hero.reveal-stagger");
  if (heroRise) {
    if (reduceMotion) {
      activateRise(heroRise);
    } else {
      requestAnimationFrame(() => {
        setTimeout(() => activateRise(heroRise), 80);
      });
    }
  }

  const reveals = document.querySelectorAll(".reveal, .reveal-stagger");
  if (reveals.length && "IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activateRise(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => {
      if (el.matches("[data-hero-rise], .page-hero.reveal-stagger") && el.classList.contains("in")) {
        return;
      }
      io.observe(el);
    });
  } else {
    reveals.forEach((el) => activateRise(el));
  }

  const track = document.querySelector("[data-review-track]");
  const prev = document.querySelector("[data-review-prev]");
  const next = document.querySelector("[data-review-next]");
  if (track && prev && next) {
    const step = () => Math.min(track.clientWidth * 0.85, 400);
    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
  }

  const filters = document.querySelectorAll("[data-filter]");
  const items = document.querySelectorAll(".gallery-item[data-category]");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.getAttribute("data-filter");
      filters.forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
      items.forEach((item) => {
        const match = value === "all" || item.getAttribute("data-category") === value;
        item.classList.toggle("is-hidden", !match);
      });
    });
  });

  const form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const success = form.querySelector(".form-success");
      if (success) success.classList.add("show");
      form.reset();
    });
  }

  const brochureForm = document.querySelector("[data-brochure-form]");
  const brochureDownloads = document.querySelector("[data-brochure-downloads]");
  const otherToggle = document.querySelector("[data-other-room]");
  const otherField = document.querySelector("[data-other-field]");

  if (otherToggle && otherField) {
    otherToggle.addEventListener("change", () => {
      otherField.classList.toggle("is-hidden", !otherToggle.checked);
      if (!otherToggle.checked) {
        const input = otherField.querySelector("input");
        if (input) input.value = "";
      }
    });
  }

  if (brochureForm && brochureDownloads) {
    brochureForm.addEventListener("submit", (e) => {
      e.preventDefault();
      brochureDownloads.classList.remove("is-hidden");
      brochureDownloads.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
      brochureDownloads.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  }

  const slideshow = document.querySelector("[data-hero-slideshow]");
  if (slideshow) {
    const slides = [...slideshow.querySelectorAll("img")];
    if (slides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let index = slides.findIndex((img) => img.classList.contains("is-active"));
      if (index < 0) index = 0;
      setInterval(() => {
        slides[index].classList.remove("is-active");
        index = (index + 1) % slides.length;
        slides[index].classList.add("is-active");
      }, 10000);
    }
  }
})();
