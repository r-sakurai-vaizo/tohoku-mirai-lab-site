const preloader = document.querySelector("[data-preloader]");
const loaderStartedAt = performance.now();
let preloaderHidden = false;
let currentSlide = 0;
let slideTimer = null;

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function hidePreloader() {
  if (!preloader || preloaderHidden) return;
  preloaderHidden = true;
  preloader.classList.add("is-hidden");
  document.body.classList.remove("is-loading");
  window.setTimeout(() => {
    preloader.setAttribute("aria-hidden", "true");
  }, 980);
}

function schedulePreloaderHide() {
  if (!preloader) return;
  const minDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 500 : 1900;
  const elapsed = performance.now() - loaderStartedAt;
  window.setTimeout(hidePreloader, Math.max(0, minDuration - elapsed));
}

function initPreloader() {
  if (!preloader) return;
  if (document.readyState === "complete") {
    schedulePreloaderHide();
  } else {
    window.addEventListener("load", schedulePreloaderHide, { once: true });
  }
  window.setTimeout(schedulePreloaderHide, 4600);
}

function renderSlides(index) {
  const slides = Array.from(document.querySelectorAll("[data-slide]"));
  const dots = Array.from(document.querySelectorAll("[data-slide-dot]"));
  if (slides.length === 0) return;

  currentSlide = (index + slides.length) % slides.length;
  const previous = (currentSlide - 1 + slides.length) % slides.length;
  const next = (currentSlide + 1) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === currentSlide);
    slide.classList.toggle("is-prev", slideIndex === previous);
    slide.classList.toggle("is-next", slideIndex === next);
    slide.classList.toggle("is-hidden", slideIndex !== currentSlide && slideIndex !== previous && slideIndex !== next);
    slide.setAttribute("aria-hidden", String(slideIndex !== currentSlide));
  });

  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === currentSlide);
    dot.setAttribute("aria-selected", String(dotIndex === currentSlide));
  });

  document.querySelectorAll("[data-slide-count]").forEach((count) => {
    Array.from(count.children).forEach((number, numberIndex) => {
      number.classList.toggle("is-active", numberIndex === currentSlide);
    });
  });
}

function startSlideshow() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  stopSlideshow();
  slideTimer = window.setInterval(() => renderSlides(currentSlide + 1), 5200);
}

function stopSlideshow() {
  if (!slideTimer) return;
  window.clearInterval(slideTimer);
  slideTimer = null;
}

function initSlideshow() {
  if (!document.querySelector("[data-slide]")) return;

  document.querySelector("[data-slide-prev]")?.addEventListener("click", () => {
    renderSlides(currentSlide - 1);
    startSlideshow();
  });

  document.querySelector("[data-slide-next]")?.addEventListener("click", () => {
    renderSlides(currentSlide + 1);
    startSlideshow();
  });

  document.querySelectorAll("[data-slide-dot]").forEach((dot) => {
    dot.addEventListener("click", () => {
      renderSlides(Number(dot.dataset.slideDot || 0));
      startSlideshow();
    });
  });

  document.querySelector("[data-slide-stage]")?.addEventListener("mouseenter", stopSlideshow);
  document.querySelector("[data-slide-stage]")?.addEventListener("mouseleave", startSlideshow);
  document.querySelector("[data-slide-stage]")?.addEventListener("focusin", stopSlideshow);
  document.querySelector("[data-slide-stage]")?.addEventListener("focusout", startSlideshow);

  renderSlides(0);
  startSlideshow();
}

function initFlowSlideshow() {
  const tracks = Array.from(document.querySelectorAll("[data-flow-track]"));
  if (tracks.length === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  tracks.forEach((track) => {
    let offset = 0;
    let lastTime = performance.now();
    let loopWidth = Math.max(1, track.scrollWidth / 2);
    let paused = false;
    const speed = 46;

    const measure = () => {
      loopWidth = Math.max(1, track.scrollWidth / 2);
    };

    const tick = (time) => {
      const delta = Math.min(64, time - lastTime);
      lastTime = time;
      if (!paused) {
        offset = (offset + (delta / 1000) * speed) % loopWidth;
        track.style.setProperty("--flow-offset", `${-offset}px`);
      }
      requestAnimationFrame(tick);
    };

    track.closest(".impact-visual")?.addEventListener("mouseenter", () => {
      paused = true;
    });
    track.closest(".impact-visual")?.addEventListener("mouseleave", () => {
      paused = false;
    });
    window.addEventListener("resize", measure);
    measure();
    requestAnimationFrame(tick);
  });
}

async function readJSON(path, fallback) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return await response.json();
  } catch (error) {
    return fallback;
  }
}

function limitItems(items, element) {
  const limit = Number(element.dataset.limit || 0);
  return limit > 0 ? items.slice(0, limit) : items;
}

function renderActivities(items) {
  document.querySelectorAll("[data-activities-list]").forEach((list) => {
    if (items.length === 0) {
      list.innerHTML = '<p class="loading">公開できる活動はまだありません</p>';
      return;
    }

    const visible = limitItems(items, list);
    if (visible.length === 0) {
      list.innerHTML = '<p class="loading">公開できる活動はまだありません</p>';
      return;
    }

    list.innerHTML = visible
      .map(
        (item) => `
          <article class="content-item">
            <div class="content-thumb">
              <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.imageAlt || item.title)}" loading="lazy">
            </div>
            <div class="content-body">
              <div class="backnumber-meta">
                <span class="status-chip">${escapeHTML(item.category)}</span>
                <span class="status-chip">${escapeHTML(item.status)}</span>
              </div>
              <h3>${escapeHTML(item.title)}</h3>
              <p>${escapeHTML(item.summary)}</p>
            </div>
          </article>
        `,
      )
      .join("");
  });
}

function renderRecords(items) {
  document.querySelectorAll("[data-records-list]").forEach((list) => {
    if (items.length === 0) {
      list.innerHTML = '<p class="loading">公開できる記録はまだありません</p>';
      return;
    }
    if (items.length === 0) {
      list.innerHTML = '<p class="loading">公開できる記録はまだありません</p>';
      return;
    }

    const visible = limitItems(items, list);
    if (visible.length === 0) {
      list.innerHTML = '<p class="loading">公開できる記録はまだありません</p>';
      return;
    }

    list.innerHTML = visible
      .map(
        (item) => `
          <article class="backnumber-item">
            <div class="backnumber-thumb">
              <img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.imageAlt || item.title)}" loading="lazy">
            </div>
            <div class="backnumber-meta">
              <time datetime="${escapeHTML(item.date || "")}">${escapeHTML(item.dateLabel)}</time>
              <span class="status-chip">${escapeHTML(item.type)}</span>
            </div>
            <div class="backnumber-body">
              <h3>${escapeHTML(item.title)}</h3>
              <p>${escapeHTML(item.summary)}</p>
            </div>
            <div class="backnumber-footer">
              <span class="status-chip">${escapeHTML(item.status)}</span>
            </div>
          </article>
        `,
      )
      .join("");
  });
}

async function initPublicData() {
  const hasActivities = document.querySelector("[data-activities-list]");
  const hasRecords = document.querySelector("[data-records-list]");

  if (hasActivities) {
    const activities = await readJSON("./data/activities.json", []);
    renderActivities(activities);
  }

  if (hasRecords) {
    const records = await readJSON("./data/records.json", []);
    renderRecords(records);
  }
}

function initKnotLoading() {
  const loading = document.querySelector("#loading");
  if (!document.body.classList.contains("knot-site") || !loading) return;

  const hide = () => {
    loading.classList.add("hide");
  };

  if (document.readyState === "complete") {
    window.setTimeout(hide, 360);
  } else {
    window.addEventListener("load", () => window.setTimeout(hide, 360), { once: true });
  }
}

function initKnotReveal() {
  const targets = Array.from(document.querySelectorAll("body.knot-site [data-target]"));
  if (targets.length === 0) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("action"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("action");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
  );

  targets.forEach((target) => observer.observe(target));
}

function initKnotMenu() {
  const button = document.querySelector("[data-knot-menu]");
  const nav = document.querySelector("#globalNavi");
  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("is-nav-open", !isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      button.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("is-nav-open");
    });
  });
}

function initKnotFollowHeader() {
  const hero = document.querySelector(".encounter-hero");
  const underHeroMenu = document.querySelector("[data-under-hero-menu]");
  const header = document.querySelector("[data-follow-header]");
  const button = document.querySelector("[data-knot-menu]");
  if (!document.body.classList.contains("knot-site") || !hero) return;

  const desktop = window.matchMedia("(min-width: 1200px)");

  const update = () => {
    const revealLine = underHeroMenu
      ? underHeroMenu.offsetTop + underHeroMenu.offsetHeight
      : hero.offsetTop + hero.offsetHeight;
    const pastHero = window.scrollY >= revealLine - 1;
    const active = desktop.matches && pastHero;
    const navOpen = document.body.classList.contains("is-nav-open");
    document.body.classList.toggle("is-past-hero", active);

    if (header) {
      header.setAttribute("aria-hidden", String(!active));
    }

    if (button) {
      button.tabIndex = desktop.matches && !active && !navOpen ? -1 : 0;
    }
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  desktop.addEventListener?.("change", update);
}

function initNewsCarousel() {
  const carousels = Array.from(document.querySelectorAll("[data-news-carousel]"));
  if (!carousels.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  carousels.forEach((carousel) => {
    const slides = Array.from(carousel.querySelectorAll("[data-news-slide]"));
    const dots = Array.from(carousel.querySelectorAll("[data-news-dot]"));
    const prev = carousel.querySelector("[data-news-prev]");
    const next = carousel.querySelector("[data-news-next]");
    if (!slides.length) return;

    let current = 0;
    let timer = null;

    const show = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === current;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("is-active", dotIndex === current);
        dot.setAttribute("aria-selected", String(dotIndex === current));
      });
    };

    const stop = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    };

    const start = () => {
      if (reducedMotion) return;
      stop();
      timer = window.setInterval(() => show(current + 1), 5200);
    };

    prev?.addEventListener("click", () => {
      show(current - 1);
      start();
    });
    next?.addEventListener("click", () => {
      show(current + 1);
      start();
    });
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        show(Number(dot.dataset.newsDot || 0));
        start();
      });
    });
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);

    show(0);
    start();
  });
}

initPreloader();
initSlideshow();
initFlowSlideshow();
initPublicData();
initKnotLoading();
initKnotReveal();
initKnotMenu();
initKnotFollowHeader();
initNewsCarousel();
