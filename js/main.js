(function () {
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const year = document.getElementById("year");
  const clock = document.getElementById("clock");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sectionIds = ["about", "education", "skills", "work", "contact"];

  if (year) year.textContent = String(new Date().getFullYear());

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function tick() {
    if (!clock) return;
    const now = new Date();
    const stamp =
      pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
    clock.textContent = stamp;
    clock.setAttribute("datetime", now.toISOString());
  }

  tick();
  setInterval(tick, 1000);

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

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    root.style.setProperty("--scroll", pct.toFixed(2) + "%");
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (!reduceMotion) {
    window.addEventListener(
      "pointermove",
      function (event) {
        root.style.setProperty("--mx", event.clientX + "px");
        root.style.setProperty("--my", event.clientY + "px");
      },
      { passive: true }
    );
  }

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
      if (section.offsetTop <= fromTop) current = section.id;
    });

    links.forEach(function (link) {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("is-active", href === "#" + current);
    });
  }

  window.addEventListener("scroll", updateActive, { passive: true });
  updateActive();

  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (node) {
      node.classList.add("is-in");
    });
  } else {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (node) {
      observer.observe(node);
    });
  }

  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        const box = card.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        card.style.transform =
          "rotateX(" + (y * -6).toFixed(2) + "deg) rotateY(" + (x * 8).toFixed(2) + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });
  }
})();
