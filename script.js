const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector("#main-menu");
const navbar = document.querySelector(".navbar");

function closeMobileMenu() {
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Abrir menu");
  menu?.classList.remove("is-open");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  menu?.classList.toggle("is-open", !isOpen);
});

menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileMenu));

document.addEventListener("click", (event) => {
  if (menu?.classList.contains("is-open") && navbar && !navbar.contains(event.target)) closeMobileMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileMenu();
});

document.querySelectorAll("[data-whatsapp]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.getAttribute("href") === "#") {
      event.preventDefault();
    }
  });
});

const revealItems = document.querySelectorAll(".reveal");

document.querySelectorAll(".sector-row span").forEach((item, index) => {
  item.style.setProperty("--sector-index", index);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -45px" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const projectsTrack = document.querySelector(".projects-track");
const projectCards = projectsTrack ? [...projectsTrack.querySelectorAll(".project-card")] : [];
const previousProject = document.querySelector(".carousel-prev");
const nextProject = document.querySelector(".carousel-next");
let projectIndex = 0;

function updateProjectsCarousel() {
  if (!projectsTrack || !projectCards.length) return;
  const visibleCards = window.innerWidth <= 820 ? 1 : 3;
  const maximumIndex = Math.max(0, projectCards.length - visibleCards);
  projectIndex = Math.min(Math.max(projectIndex, 0), maximumIndex);
  const cardWidth = projectCards[0].getBoundingClientRect().width;
  const gap = Number.parseFloat(getComputedStyle(projectsTrack).gap) || 0;
  projectsTrack.style.transform = `translateX(-${projectIndex * (cardWidth + gap)}px)`;
  if (previousProject) previousProject.disabled = projectIndex === 0;
  if (nextProject) nextProject.disabled = projectIndex === maximumIndex;
}

previousProject?.addEventListener("click", () => {
  projectIndex -= 1;
  updateProjectsCarousel();
});

nextProject?.addEventListener("click", () => {
  projectIndex += 1;
  updateProjectsCarousel();
});

window.addEventListener("resize", () => {
  updateProjectsCarousel();
  if (window.innerWidth > 820) closeMobileMenu();
});
updateProjectsCarousel();

const problemCarousel = document.querySelector(".problem-mobile-carousel");
const problemViewport = problemCarousel?.querySelector(".problem-mobile-viewport");
const problemTrack = problemCarousel?.querySelector(".problem-mobile-track");
const problemCards = problemTrack ? [...problemTrack.querySelectorAll(".problem-mobile-card")] : [];
const problemDots = problemCarousel ? [...problemCarousel.querySelectorAll(".problem-mobile-dot")] : [];
let problemIndex = 0;
let problemTimer;
let problemPointerStart = 0;

function showProblem(index) {
  if (!problemTrack || !problemCards.length) return;
  problemIndex = (index + problemCards.length) % problemCards.length;
  problemTrack.style.transform = `translateX(-${problemIndex * 100}%)`;
  problemCards.forEach((card, cardIndex) => {
    card.setAttribute("aria-hidden", String(cardIndex !== problemIndex));
  });
  problemDots.forEach((dot, dotIndex) => {
    const isCurrent = dotIndex === problemIndex;
    dot.classList.toggle("is-active", isCurrent);
    if (isCurrent) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
}

function stopProblemsCarousel() {
  window.clearInterval(problemTimer);
}

function startProblemsCarousel() {
  stopProblemsCarousel();
  if (
    window.innerWidth > 820 ||
    problemCards.length < 2 ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }
  problemTimer = window.setInterval(() => showProblem(problemIndex + 1), 3000);
}

problemDots.forEach((dot, dotIndex) => {
  dot.addEventListener("click", () => {
    showProblem(dotIndex);
    startProblemsCarousel();
  });
});

problemViewport?.addEventListener("pointerdown", (event) => {
  problemPointerStart = event.clientX;
  stopProblemsCarousel();
});

problemViewport?.addEventListener("pointerup", (event) => {
  const distance = event.clientX - problemPointerStart;
  if (Math.abs(distance) > 40) showProblem(problemIndex + (distance < 0 ? 1 : -1));
  startProblemsCarousel();
});

problemViewport?.addEventListener("pointercancel", startProblemsCarousel);
problemCarousel?.addEventListener("mouseenter", stopProblemsCarousel);
problemCarousel?.addEventListener("mouseleave", startProblemsCarousel);
problemCarousel?.addEventListener("focusin", stopProblemsCarousel);
problemCarousel?.addEventListener("focusout", startProblemsCarousel);

window.addEventListener("resize", () => {
  showProblem(problemIndex);
  startProblemsCarousel();
});

showProblem(0);
startProblemsCarousel();

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    faqItems.forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});

const testimonialsCarousel = document.querySelector(".testimonials-carousel");
const testimonialCards = testimonialsCarousel
  ? [...testimonialsCarousel.querySelectorAll(".testimonial-card")]
  : [];
const testimonialDots = testimonialsCarousel
  ? [...testimonialsCarousel.querySelectorAll(".testimonial-dot")]
  : [];
let testimonialIndex = 0;
let testimonialTimer;

function showTestimonial(index) {
  if (!testimonialCards.length) return;
  const previousIndex = testimonialIndex;
  testimonialIndex = (index + testimonialCards.length) % testimonialCards.length;
  testimonialCards.forEach((card, cardIndex) => {
    const isActive = cardIndex === testimonialIndex;
    card.classList.remove("is-leaving");
    card.classList.toggle("is-active", isActive);
    card.setAttribute("aria-hidden", String(!isActive));
  });
  if (previousIndex !== testimonialIndex) {
    const previousCard = testimonialCards[previousIndex];
    previousCard?.classList.add("is-leaving");
    window.setTimeout(() => previousCard?.classList.remove("is-leaving"), 760);
  }
  testimonialDots.forEach((dot, dotIndex) => {
    const isCurrent = dotIndex === testimonialIndex;
    dot.classList.toggle("is-active", isCurrent);
    if (isCurrent) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
}

function stopTestimonials() {
  window.clearInterval(testimonialTimer);
}

function startTestimonials() {
  stopTestimonials();
  if (testimonialCards.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  testimonialTimer = window.setInterval(() => showTestimonial(testimonialIndex + 1), 5000);
}

testimonialsCarousel?.addEventListener("mouseenter", stopTestimonials);
testimonialsCarousel?.addEventListener("mouseleave", startTestimonials);
testimonialsCarousel?.addEventListener("focusin", stopTestimonials);
testimonialsCarousel?.addEventListener("focusout", startTestimonials);
testimonialDots.forEach((dot, dotIndex) => {
  dot.addEventListener("click", () => {
    showTestimonial(dotIndex);
    startTestimonials();
  });
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopTestimonials();
    stopProblemsCarousel();
  } else {
    startTestimonials();
    startProblemsCarousel();
  }
});

showTestimonial(0);
startTestimonials();

/* =========================================================
   MELHORIAS UX — ANIMAÇÕES GERAIS DO SITE
   ========================================================= */

(() => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const animatedSelectors = [
    ".hero-copy",
    ".machine-wrap",
    ".section-title",
    ".problem-mobile-carousel",
    ".problems-cta",
    ".solutions-heading",
    ".solution-card",
    ".why-title",
    ".why-card",
    ".why-cta",
    ".sectors-copy",
    ".sectors-tags",
    ".capacity-heading",
    ".unit-card",
    ".capacity-cta",
    ".projects-title",
    ".project-card",
    ".external-machine",
    ".external-copy",
    ".about-kicker",
    ".about-illustration",
    ".about-copy",
    ".testimonials-title",
    ".testimonials-carousel",
    ".faq-section > h2",
    ".faq-item",
    ".footer-brand",
    ".footer-links",
    ".footer-social",
  ];

  const animatedItems = document.querySelectorAll(
    animatedSelectors.join(",")
  );

  animatedItems.forEach((element, index) => {
    if (element.classList.contains("sectors-tags")) {
      element.classList.add("ux-reveal-right");
      return;
    }

    if (
      element.classList.contains("machine-wrap") ||
      element.classList.contains("external-machine")
    ) {
      element.classList.add("ux-reveal-left");
      return;
    }

    element.classList.add("ux-reveal");

    if (
      element.classList.contains("solution-card") ||
      element.classList.contains("why-card") ||
      element.classList.contains("project-card") ||
      element.classList.contains("unit-card") ||
      element.classList.contains("faq-item")
    ) {
      element.style.transitionDelay = `${Math.min(index * 55, 330)}ms`;
    }
  });

  const showAllAnimatedItems = () => {
    animatedItems.forEach((element) => {
      element.classList.add("ux-visible");
    });
  };

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    showAllAnimatedItems();
    return;
  }

  const animationObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("ux-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -55px",
    }
  );

  animatedItems.forEach((element) => {
    animationObserver.observe(element);
  });

  reducedMotion.addEventListener?.("change", (event) => {
    if (event.matches) {
      showAllAnimatedItems();
      animationObserver.disconnect();
    }
  });
})();

/* =========================================================
   MICROINTERAÇÕES DE TOQUE NO MOBILE
   ========================================================= */

(() => {
  if (!window.matchMedia("(pointer: coarse)").matches) return;

  const interactiveElements = document.querySelectorAll(
    ".button, .solution-button, .unit-content a, .nav-links a, .carousel-button, .floating-whatsapp"
  );

  interactiveElements.forEach((element) => {
    element.addEventListener(
      "touchstart",
      () => {
        element.classList.add("is-touching");
      },
      { passive: true }
    );

    element.addEventListener(
      "touchend",
      () => {
        window.setTimeout(() => {
          element.classList.remove("is-touching");
        }, 180);
      },
      { passive: true }
    );

    element.addEventListener(
      "touchcancel",
      () => {
        element.classList.remove("is-touching");
      },
      { passive: true }
    );
  });
})();

/* =========================================================
   FECHA O MENU MOBILE AO ROLAR A PÁGINA
   ========================================================= */

(() => {
  let lastScrollPosition = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      const currentScrollPosition = window.scrollY;

      if (
        currentScrollPosition > lastScrollPosition + 20 &&
        menu?.classList.contains("is-open")
      ) {
        closeMobileMenu();
      }

      lastScrollPosition = currentScrollPosition;
    },
    { passive: true }
  );
})();

/* =========================================================
   PAUSA ANIMAÇÕES QUANDO A ABA NÃO ESTÁ VISÍVEL
   ========================================================= */

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    document.body.classList.add("page-not-visible");
  } else {
    document.body.classList.remove("page-not-visible");
  }
});