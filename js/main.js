(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const year = document.getElementById("year");
  const sectionIds = ["about", "education", "skills", "work", "contact"];

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  function setOpen(open) {
    if (!header || !toggle) return;
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle?.addEventListener("click", function () {
    setOpen(!header.classList.contains("is-open"));
  });

  nav?.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setOpen(false);
  });

  window.addEventListener(
    "scroll",
    function () {
      header?.classList.toggle("is-scrolled", window.scrollY > 8);
    },
    { passive: true }
  );

  const sections = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  const links = Array.from(nav?.querySelectorAll("a") || []);

  function updateActive() {
    const fromTop = window.scrollY + 96;
    let current = "";

    sections.forEach(function (section) {
      if (section.offsetTop <= fromTop) {
        current = section.id;
      }
    });

    links.forEach(function (link) {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("is-active", href === "#" + current);
    });
  }

  window.addEventListener("scroll", updateActive, { passive: true });
  updateActive();
})();
