const nav = document.getElementById("nav");
const navLinks = document.getElementById("nav-links");
const menuToggle = document.querySelector(".menu-toggle");
const form = document.getElementById("contactForm");
const feedback = document.getElementById("formFeedback");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  navLinks.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  navLinks.classList.toggle("is-open", !isOpen);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuToggle.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menuToggle.focus();
  }
});

document.addEventListener("click", (event) => {
  if (
    !nav.contains(event.target) &&
    menuToggle.getAttribute("aria-expanded") === "true"
  )
    closeMenu();
});

const sections = [...document.querySelectorAll("main section[id]")];
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.querySelectorAll("a").forEach((link) => {
          if (link.hash === "#" + entry.target.id)
            link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px" },
  );
  sections.forEach((section) => sectionObserver.observe(section));
}

function updateNav() {
  nav.classList.toggle("scrolled", window.scrollY > 24);
}
updateNav();
window.addEventListener("scroll", updateNav, { passive: true });

if ("IntersectionObserver" in window && !reduceMotion.matches) {
  const revealTargets = document.querySelectorAll(
    ".intro .section-container > div, .reason-card, .access-grid > *, .landscape-panel, .exp-card, .media-header, .video-container, .photo-grid figure, .manifesto-inner, .contact > *",
  );
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
  );

  revealTargets.forEach((target, index) => {
    target.dataset.reveal = "";
    if (index % 4) target.dataset.revealDelay = String(index % 4);
    revealObserver.observe(target);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  feedback.textContent =
    "Consulta registrada no projeto. Este formulário é demonstrativo e não envia dados para um servidor.";
  form.reset();
});
