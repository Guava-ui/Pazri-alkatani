"use strict";

/* ---------------- Loader ---------------- */
const Loader = (() => {
  const el = document.getElementById("loader");
  const hide = () => el && el.classList.add("is-done");
  const init = () => {
    // Hide as soon as the page is ready, max 1s.
    window.addEventListener("load", hide, { once: true });
    setTimeout(hide, 1000);
  };
  return { init };
})();

/* ---------------- Navbar ---------------- */
const Navbar = (() => {
  const navbar = document.getElementById("navbar");
  const burger = document.getElementById("navBurger");
  const menu = document.getElementById("navMenu");
  const links = Array.from(document.querySelectorAll(".navbar__link"));
  const sections = Array.from(document.querySelectorAll("section[id]"));

  const onScroll = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  const closeMenu = () => {
    menu.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  };

  const toggleMenu = () => {
    const open = menu.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  };

  const highlight = () => {
    const pos = window.scrollY + 140;
    let currentId = "home";
    for (const sec of sections) {
      if (sec.offsetTop <= pos) currentId = sec.id;
    }
    links.forEach((a) => {
      a.classList.toggle(
        "is-active",
        a.getAttribute("href") === "#" + currentId,
      );
    });
  };

  const init = () => {
    onScroll();
    highlight();
    window.addEventListener(
      "scroll",
      () => {
        onScroll();
        highlight();
      },
      { passive: true },
    );
    burger.addEventListener("click", toggleMenu);
    links.forEach((a) => a.addEventListener("click", closeMenu));
    document.addEventListener("click", (e) => {
      if (
        menu.classList.contains("is-open") &&
        !menu.contains(e.target) &&
        !burger.contains(e.target)
      )
        closeMenu();
    });
  };
  return { init };
})();

/* ---------------- Typing animation ---------------- */
const Typing = (() => {
  const el = document.getElementById("typed");
  const phrases = [
    "Full Stack Developer",
    "Computer Science Student",
    "JavaScript Enthusiast",
    "Problem Solver",
  ];
  let pi = 0,
    ci = 0,
    deleting = false;

  const tick = () => {
    const phrase = phrases[pi];
    ci += deleting ? -1 : 1;
    el.textContent = phrase.slice(0, ci);
    let delay = deleting ? 38 : 78;
    if (!deleting && ci === phrase.length) {
      deleting = true;
      delay = 1700;
    } else if (deleting && ci === 0) {
      deleting = false;
      pi = (pi + 1) % phrases.length;
      delay = 420;
    }
    setTimeout(tick, delay);
  };

  const init = () => {
    if (el) tick();
  };
  return { init };
})();

/* ---------------- Scroll reveal ---------------- */
const Reveal = (() => {
  const init = () => {
    const items = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      items.forEach((i) => i.classList.add("is-revealed"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            // Stagger siblings inside grids
            const parent = el.parentElement;
            const siblings = parent
              ? Array.from(parent.children).filter((c) =>
                  c.hasAttribute("data-reveal"),
                )
              : [el];
            const idx = Math.max(0, siblings.indexOf(el));
            el.style.transitionDelay = Math.min(idx * 70, 420) + "ms";
            el.classList.add("is-revealed");
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    items.forEach((i) => io.observe(i));
  };
  return { init };
})();

/* ---------------- Counters ---------------- */
const Counters = (() => {
  const animate = (el) => {
    const target = parseInt(el.dataset.counter, 10);
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const init = () => {
    const els = document.querySelectorAll("[data-counter]");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => (el.textContent = el.dataset.counter));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 },
    );
    els.forEach((el) => io.observe(el));
  };
  return { init };
})();

/* ---------------- Parallax (hero) ---------------- */
const Parallax = (() => {
  const els = Array.from(document.querySelectorAll("[data-parallax]"));
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.2) {
      els.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = "translateY(" + y * speed + "px)";
      });
    }
    ticking = false;
  };

  const init = () => {
    if (
      !els.length ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true },
    );
  };
  return { init };
})();

/* ---------------- Certificates slider ---------------- */
const CertSlider = (() => {
  const viewport = document.getElementById("certsViewport");
  const track = document.getElementById("certsTrack");
  let offset = 0;
  let loopWidth = 0;
  let paused = false;
  let dragging = false;
  let dragStartX = 0;
  let dragStartOffset = 0;
  let moved = 0;
  let rafId = null;
  const SPEED = 0.55; // px per frame

  const setup = () => {
    // Duplicate cards for infinite loop
    const cards = Array.from(track.children);
    cards.forEach((c) => {
      const clone = c.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("button").forEach((b) => (b.tabIndex = -1));
      track.appendChild(clone);
    });
    const gap = parseFloat(getComputedStyle(track).gap) || 26;
    loopWidth = cards.reduce((w, c) => w + c.offsetWidth + gap, 0);
  };

  const normalize = () => {
    if (offset >= loopWidth) offset -= loopWidth;
    if (offset < 0) offset += loopWidth;
  };

  const render = () => {
    track.style.transform = "translateX(" + -offset + "px)";
  };

  const loop = () => {
    if (!paused && !dragging) {
      offset += SPEED;
      normalize();
      render();
    }
    rafId = requestAnimationFrame(loop);
  };

  const nudge = (dir) => {
    const card = track.children[0];
    const gap = parseFloat(getComputedStyle(track).gap) || 26;
    const target = offset + dir * (card.offsetWidth + gap);
    const start = offset;
    const startTime = performance.now();
    const dur = 450;
    const anim = (now) => {
      const p = Math.min((now - startTime) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      offset = start + (target - start) * eased;
      normalize();
      render();
      if (p < 1) requestAnimationFrame(anim);
    };
    requestAnimationFrame(anim);
  };

  const pointerDown = (e) => {
    dragging = true;
    moved = 0;
    dragStartX = e.clientX;
    dragStartOffset = offset;
    viewport.classList.add("is-dragging");
    viewport.setPointerCapture(e.pointerId);
  };
  const pointerMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    moved = Math.max(moved, Math.abs(dx));
    offset = dragStartOffset - dx;
    normalize();
    render();
  };
  const pointerUp = () => {
    dragging = false;
    viewport.classList.remove("is-dragging");
  };

  const init = () => {
    if (!viewport || !track) return;
    setup();
    render();
    rafId = requestAnimationFrame(loop);

    viewport.addEventListener("mouseenter", () => (paused = true));
    viewport.addEventListener("mouseleave", () => (paused = false));

    viewport.addEventListener("pointerdown", pointerDown);
    viewport.addEventListener("pointermove", pointerMove);
    viewport.addEventListener("pointerup", pointerUp);
    viewport.addEventListener("pointercancel", pointerUp);

    // Prevent click-through after dragging
    viewport.addEventListener(
      "click",
      (e) => {
        if (moved > 8) {
          e.stopPropagation();
          e.preventDefault();
        }
      },
      true,
    );

    document
      .getElementById("certPrev")
      .addEventListener("click", () => nudge(-1));
    document
      .getElementById("certNext")
      .addEventListener("click", () => nudge(1));

    // Recompute widths on resize
    let t;
    window.addEventListener("resize", () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const gap = parseFloat(getComputedStyle(track).gap) || 26;
        const half = Array.from(track.children).slice(
          0,
          track.children.length / 2,
        );
        loopWidth = half.reduce((w, c) => w + c.offsetWidth + gap, 0);
        normalize();
        render();
      }, 200);
    });
  };
  return { init };
})();

/* ---------------- Certificate modal ---------------- */
const CertModal = (() => {
  const modal = document.getElementById("certModal");
  const img = document.getElementById("modalImg");
  const caption = document.getElementById("modalCaption");

  const open = (src, title) => {
    img.src = src;
    img.alt = title;
    caption.textContent = title;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  const init = () => {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cert]");
      if (btn) {
        open(btn.dataset.cert, btn.dataset.title);
        return;
      }
      if (e.target.closest("[data-modal-close]")) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) close();
    });
  };
  return { init };
})();

/* ---------------- Contact form → WhatsApp ---------------- */
const ContactForm = (() => {
  const form = document.getElementById("contactForm");
  const PHONE = "6283134708667";

  const init = () => {
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      let valid = true;
      [form.name, form.email, form.message].forEach((f) => {
        const bad =
          !f.value.trim() ||
          (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value));
        f.classList.toggle("is-invalid", bad);
        if (bad) valid = false;
      });
      if (!valid) return;

      const text =
        "Halo Pazri! %0A%0A" +
        "*Nama:* " +
        encodeURIComponent(name) +
        "%0A" +
        "*Email:* " +
        encodeURIComponent(email) +
        "%0A%0A" +
        "*Pesan:*%0A" +
        encodeURIComponent(message);

      window.open(
        "https://wa.me/" + PHONE + "?text=" + text,
        "_blank",
        "noopener",
      );
      form.reset();
    });

    form.querySelectorAll("input, textarea").forEach((f) => {
      f.addEventListener("input", () => f.classList.remove("is-invalid"));
    });
  };
  return { init };
})();

/* ---------------- Back to top ---------------- */
const BackTop = (() => {
  const btn = document.getElementById("backTop");
  const init = () => {
    window.addEventListener(
      "scroll",
      () => {
        btn.classList.toggle("is-visible", window.scrollY > 560);
      },
      { passive: true },
    );
    btn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  };
  return { init };
})();

/* ---------------- Button ripple ---------------- */
const Ripple = (() => {
  const init = () => {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-ripple]");
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const span = document.createElement("span");
      span.className = "ripple";
      span.style.width = span.style.height = size + "px";
      span.style.left = e.clientX - rect.left - size / 2 + "px";
      span.style.top = e.clientY - rect.top - size / 2 + "px";
      btn.appendChild(span);
      span.addEventListener("animationend", () => span.remove());
    });
  };
  return { init };
})();

/* ---------------- Misc ---------------- */
const Misc = (() => {
  const init = () => {
    const y = document.getElementById("year");
    if (y) y.textContent = new Date().getFullYear();
  };
  return { init };
})();

/* ---------------- Boot ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  Loader.init();
  Navbar.init();
  Typing.init();
  Reveal.init();
  Counters.init();
  Parallax.init();
  CertSlider.init();
  CertModal.init();
  ContactForm.init();
  BackTop.init();
  Ripple.init();
  Misc.init();
});
