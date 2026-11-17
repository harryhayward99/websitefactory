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

const form = document.querySelector("[data-contact-form]");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lines = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Phone: ${data.get("phone")}`,
      `Clinic: ${data.get("clinic")}`,
      `About: ${data.get("about")}`,
      "",
      String(data.get("message") || "")
    ];
    const href = `mailto:info@therapyandperformanceclinic.co.uk?subject=${encodeURIComponent("Message for TAP Clinics")}&body=${encodeURIComponent(lines.join("\n"))}`;
    const note = form.querySelector(".form-note");
    if (note) note.textContent = "Your email app should open with this message to TAP. If nothing opens, call or text 07904 839521.";
    window.location.href = href;
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
