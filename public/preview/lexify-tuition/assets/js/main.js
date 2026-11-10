(() => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const siteHeader = document.querySelector(".site-header");

  // Keep sticky cards framed just below the header with an inset border
  const syncStickyOffsets = () => {
    if (!siteHeader) return;
    const h = Math.round(siteHeader.getBoundingClientRect().height);
    const inset = window.innerWidth <= 1100 ? 14 : 16;
    document.documentElement.style.setProperty("--header-h", `${h}px`);
    document.documentElement.style.setProperty("--card-inset", `${inset}px`);
    document.documentElement.style.setProperty("--card-top", `${h + inset}px`);
  };
  syncStickyOffsets();
  window.addEventListener("resize", syncStickyOffsets);

  if (menuToggle && navLinks) {
    const setMenuOpen = (open) => {
      navLinks.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    };

    menuToggle.addEventListener("click", () => {
      setMenuOpen(!navLinks.classList.contains("open"));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    });

    document.addEventListener("click", (e) => {
      if (!navLinks.classList.contains("open")) return;
      if (navLinks.contains(e.target) || menuToggle.contains(e.target)) return;
      setMenuOpen(false);
    });
  }

  // Mouse parallax for floating letters (Elementor Motion FX style)
  const floats = Array.from(document.querySelectorAll("[data-parallax]"));
  if (floats.length) {
    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;

    window.addEventListener(
      "mousemove",
      (e) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2;
        const ny = (e.clientY / window.innerHeight - 0.5) * 2;
        mx = nx;
        my = ny;
      },
      { passive: true }
    );

    const tick = () => {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      floats.forEach((el) => {
        const speed = Number(el.dataset.parallax || 0.5);
        // negative direction like the live site
        const x = -cx * speed * 28;
        const y = -cy * speed * 18;
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Scroll reveal
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  // Reviews carousel
  const slides = Array.from(document.querySelectorAll(".review-slide"));
  if (slides.length) {
    let index = 0;
    const currentEl = document.querySelector("[data-review-current]");
    const totalEl = document.querySelector("[data-review-total]");
    if (totalEl) totalEl.textContent = String(slides.length);
    const show = (i) => {
      slides.forEach((s, n) => s.classList.toggle("active", n === i));
      if (currentEl) currentEl.textContent = String(i + 1);
    };
    show(0);
    const prev = document.querySelector("[data-review-prev]");
    const next = document.querySelector("[data-review-next]");
    prev?.addEventListener("click", () => {
      index = (index - 1 + slides.length) % slides.length;
      show(index);
    });
    next?.addEventListener("click", () => {
      index = (index + 1) % slides.length;
      show(index);
    });
  }

  // Dyslexia symptom tabs
  const tabBtns = Array.from(document.querySelectorAll("[data-tab]"));
  if (tabBtns.length) {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.tab;
        tabBtns.forEach((b) => {
          const on = b === btn;
          b.classList.toggle("active", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
        document.querySelectorAll(".tab-panel").forEach((panel) => {
          panel.classList.toggle("active", panel.id === id);
        });
      });
    });
  }

  // Contact form — front-end only
  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const note = form.querySelector(".form-note");
      if (note) {
        note.textContent =
          "Thanks — this demo form does not send email. Please call or email Lexify Tuition directly.";
      }
      form.reset();
    });
  }
})();
