(function () {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const year = document.getElementById("year");
  const clock = document.getElementById("clock");
  const boot = document.getElementById("boot");
  const bootLine = document.getElementById("boot-line");
  const bootSkip = document.getElementById("boot-skip");
  const cursor = document.querySelector(".cursor");
  const scrollReadout = document.getElementById("scroll-readout");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const sectionIds = ["about", "education", "skills", "work", "contact"];
  const railIds = ["top"].concat(sectionIds);

  if (year) year.textContent = String(new Date().getFullYear());

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function tick() {
    if (!clock) return;
    const now = new Date();
    clock.textContent =
      pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
    clock.setAttribute("datetime", now.toISOString());
  }

  tick();
  setInterval(tick, 1000);

  function endBoot() {
    body.classList.remove("is-booting");
    body.classList.add("is-ready");
    boot?.classList.add("is-done");
  }

  function runBoot() {
    if (!boot || reduceMotion) {
      endBoot();
      return;
    }

    const lines = [
      "Establishing session",
      "Host landon.shaffer",
      "Stack IST / systems",
      "Link ready",
    ];
    let index = 0;

    function step() {
      if (boot.classList.contains("is-done")) return;
      if (bootLine) bootLine.textContent = lines[index];
      index += 1;
      if (index < lines.length) {
        window.setTimeout(step, 420);
      } else {
        window.setTimeout(endBoot, 520);
      }
    }

    window.setTimeout(step, 280);
    window.setTimeout(endBoot, 4200);
    bootSkip?.addEventListener("click", endBoot);
    document.addEventListener("keydown", function onKey(event) {
      if (event.key === "Escape" || event.key === "Enter") {
        endBoot();
        document.removeEventListener("keydown", onKey);
      }
    });
  }

  runBoot();

  function setOpen(open) {
    if (!header || !toggle) return;
    header.classList.toggle("is-open", open);
    body.classList.toggle("nav-open", open);
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
    if (scrollReadout) {
      scrollReadout.textContent = String(Math.round(pct)).padStart(3, "0") + "%";
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight * 0.2 };

  if (!reduceMotion) {
    window.addEventListener(
      "pointermove",
      function (event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        root.style.setProperty("--mx", event.clientX + "px");
        root.style.setProperty("--my", event.clientY + "px");
      },
      { passive: true }
    );
  }

  if (cursor && finePointer && !reduceMotion) {
    body.classList.add("has-cursor");
    let ringX = mouse.x;
    let ringY = mouse.y;

    function follow() {
      ringX += (mouse.x - ringX) * 0.18;
      ringY += (mouse.y - ringY) * 0.18;
      cursor.style.transform = "translate(" + ringX + "px, " + ringY + "px)";
      window.requestAnimationFrame(follow);
    }

    follow();

    window.addEventListener("pointerdown", function () {
      cursor.classList.add("is-down");
    });
    window.addEventListener("pointerup", function () {
      cursor.classList.remove("is-down");
    });

    document.querySelectorAll("a, button").forEach(function (el) {
      el.addEventListener("pointerenter", function () {
        cursor.classList.add("is-link");
      });
      el.addEventListener("pointerleave", function () {
        cursor.classList.remove("is-link");
      });
    });
  }

  const sections = railIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  const links = Array.from(nav?.querySelectorAll("a") || []);
  const rails = Array.from(document.querySelectorAll(".rail a"));

  function updateActive() {
    const fromTop = window.scrollY + 120;
    let current = "top";

    sections.forEach(function (section) {
      if (section.offsetTop <= fromTop) current = section.id;
    });

    links.forEach(function (link) {
      const href = link.getAttribute("href") || "";
      link.classList.toggle("is-active", href === "#" + current);
    });

    rails.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("data-rail") === current);
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

  if (!reduceMotion && finePointer) {
    document.querySelectorAll(".tilt").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        const box = card.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width - 0.5;
        const y = (event.clientY - box.top) / box.height - 0.5;
        card.style.transform =
          "rotateX(" +
          (y * -6).toFixed(2) +
          "deg) rotateY(" +
          (x * 8).toFixed(2) +
          "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transform = "";
      });
    });

    document.querySelectorAll(".magnetic").forEach(function (btn) {
      btn.addEventListener("pointermove", function (event) {
        const box = btn.getBoundingClientRect();
        const x = event.clientX - (box.left + box.width / 2);
        const y = event.clientY - (box.top + box.height / 2);
        btn.style.transform = "translate(" + x * 0.22 + "px, " + y * 0.28 + "px)";
      });
      btn.addEventListener("pointerleave", function () {
        btn.style.transform = "";
      });
    });
  }

  function initMesh() {
    const canvas = document.getElementById("mesh");
    const wrap = canvas && canvas.parentElement;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    wrap.classList.add("has-canvas");

    const brass = [224, 188, 116];
    const sage = [141, 179, 135];
    const nodes = [
      { label: "Systems", rx: 0.5, ry: 0.2, color: brass },
      { label: "Networks", rx: 0.2, ry: 0.44, color: brass },
      { label: "Data", rx: 0.8, ry: 0.44, color: brass },
      { label: "Security", rx: 0.5, ry: 0.66, color: brass },
      { label: "Support", rx: 0.5, ry: 0.88, color: sage },
    ].map(function (node) {
      return Object.assign({ x: 0, y: 0, vx: 0, vy: 0 }, node);
    });

    const edges = [
      [0, 1],
      [0, 2],
      [1, 2],
      [1, 3],
      [2, 3],
      [3, 4],
    ];

    const packets = edges.map(function (_, index) {
      return { edge: index, t: Math.random(), speed: 0.004 + Math.random() * 0.006 };
    });

    let width = 0;
    let height = 0;
    let visible = true;

    function resize() {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes.forEach(function (node) {
        node.x = node.rx * width;
        node.y = node.ry * height;
      });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const local = wrap.getBoundingClientRect();
      const mx = mouse.x - local.left;
      const my = mouse.y - local.top;

      if (!reduceMotion) {
        nodes.forEach(function (node) {
          const restX = node.rx * width;
          const restY = node.ry * height;
          const dx = mx - node.x;
          const dy = my - node.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 150) {
            node.vx += (dx / dist) * 0.12;
            node.vy += (dy / dist) * 0.12;
          }
          node.vx += (restX - node.x) * 0.045;
          node.vy += (restY - node.y) * 0.045;
          node.vx *= 0.86;
          node.vy *= 0.86;
          node.x += node.vx;
          node.y += node.vy;
        });
      }

      ctx.lineWidth = 1;
      edges.forEach(function (pair) {
        const a = nodes[pair[0]];
        const b = nodes[pair[1]];
        ctx.strokeStyle = "rgba(224, 188, 116, 0.38)";
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      });

      if (!reduceMotion) {
        packets.forEach(function (packet) {
          packet.t += packet.speed;
          if (packet.t > 1) packet.t -= 1;
          const pair = edges[packet.edge];
          const a = nodes[pair[0]];
          const b = nodes[pair[1]];
          const x = a.x + (b.x - a.x) * packet.t;
          const y = a.y + (b.y - a.y) * packet.t;
          ctx.fillStyle = "rgba(244, 239, 228, 0.9)";
          ctx.beginPath();
          ctx.arc(x, y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.font = "500 10px 'IBM Plex Mono', ui-monospace, monospace";
      ctx.textAlign = "center";

      nodes.forEach(function (node) {
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 28);
        glow.addColorStop(0, "rgba(" + node.color.join(",") + ",0.35)");
        glow.addColorStop(1, "rgba(" + node.color.join(",") + ",0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 28, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgb(" + node.color.join(",") + ")";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(168, 161, 144, 0.95)";
        ctx.fillText(node.label.toUpperCase(), node.x, node.y - 16);
      });
    }

    function loop() {
      if (visible) draw();
      window.requestAnimationFrame(loop);
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", function () {
      visible = document.visibilityState === "visible";
    });

    resize();
    loop();
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(initMesh);
  } else {
    initMesh();
  }
})();
