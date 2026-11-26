const header = document.querySelector(".site-header");
const toggle = document.querySelector(".menu-toggle");
if (toggle && header) {
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.textContent = open ? "Close" : "Menu";
  });
}

document.querySelectorAll(".treat-nav button").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.treat;
    const closing = button.getAttribute("aria-expanded") === "true" && window.matchMedia("(max-width: 980px)").matches;
    document.querySelectorAll(".treat-nav button").forEach((item) => {
      const on = !closing && item === button;
      item.setAttribute("aria-pressed", on ? "true" : "false");
      item.setAttribute("aria-expanded", on ? "true" : "false");
    });
    document.querySelectorAll("[data-panel]").forEach((panel) => {
      panel.hidden = closing || panel.dataset.panel !== id;
    });
    document.querySelectorAll(".treat-stage img").forEach((img) => {
      img.classList.toggle("is-on", !closing && img.dataset.treat === id);
    });
  });
});

document.querySelectorAll(".visit-board").forEach((board) => {
  const rails = board.querySelectorAll(".visit-rail");
  const shows = board.querySelectorAll(".visit-show");
  rails.forEach((rail) => {
    rail.addEventListener("click", () => {
      const id = rail.dataset.stat;
      rails.forEach((item) => item.setAttribute("aria-pressed", item === rail ? "true" : "false"));
      shows.forEach((show) => show.classList.toggle("is-on", show.dataset.stat === id));
    });
  });
});

document.querySelectorAll(".review-board").forEach((board) => {
  const picks = [...board.querySelectorAll(".review-pick")];
  const photos = [...board.querySelectorAll(".review-photo")];
  const quotes = [...board.querySelectorAll(".review-quote")];
  const setActive = (index) => {
    const i = (index + picks.length) % picks.length;
    board.dataset.active = String(i);
    picks.forEach((pick, n) => pick.setAttribute("aria-selected", n === i ? "true" : "false"));
    photos.forEach((photo, n) => photo.classList.toggle("is-on", n === i));
    quotes.forEach((quote, n) => quote.classList.toggle("is-on", n === i));
  };
  picks.forEach((pick, index) => pick.addEventListener("click", () => setActive(index)));
  board.querySelector(".review-prev")?.addEventListener("click", () => setActive(Number(board.dataset.active || 0) - 1));
  board.querySelector(".review-next")?.addEventListener("click", () => setActive(Number(board.dataset.active || 0) + 1));
  setActive(0);
});

const form = document.querySelector("[data-contact-form]");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const note = form.querySelector(".form-note");
    if (note) note.textContent = "This preview does not send enquiries. Please book online or call Sophie.";
  });
}

const fronds = document.querySelectorAll(".frond:not(.wind)");
if (fronds.length) {
  let frame = 0;
  const placeFronds = () => {
    frame = 0;
    const view = window.innerHeight;
    fronds.forEach((frond) => {
      const rect = frond.getBoundingClientRect();
      const anchor = rect.top + window.scrollY;
      const traveled = Math.max(0, window.scrollY - Math.max(0, anchor - view * 0.8));
      const heroLeaf = frond.classList.contains("a");
      const tilt = Math.min(heroLeaf ? 22 : 12, traveled * (heroLeaf ? 0.08 : 0.02));
      frond.style.setProperty("--tilt", `${tilt.toFixed(2)}deg`);
    });
  };
  window.addEventListener("scroll", () => {
    if (!frame) frame = requestAnimationFrame(placeFronds);
  }, { passive: true });
  placeFronds();
}

if (window.matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".nav details").forEach((menu) => {
    menu.addEventListener("mouseenter", () => { menu.open = true; });
    menu.addEventListener("mouseleave", () => { menu.open = false; });
  });
}
