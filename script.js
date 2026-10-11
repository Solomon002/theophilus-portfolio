/* =========================================================
   SETTINGS
   ▸ CONTACT_EMAIL is where every message from the form is
     delivered. Put your client's real email address here.
========================================================= */
const CONTACT_EMAIL = "theoatansuyi@gmail.com";

/* =========================================================
   GALLERY DATA
========================================================= */
const GALLERY = {
  editorial: [
    "/images/EDITORIALS/editorial1.jpg",
    "/images/EDITORIALS/editorial2.jpg",
    "/images/EDITORIALS/editorial3.jpg",
    "/images/EDITORIALS/editorial4.jpg",
    "/images/EDITORIALS/editorial6.jpg",
    "/images/EDITORIALS/editorial8.JPG",
    "/images/EDITORIALS/editorial9.jpeg",
    "/images/EDITORIALS/editorial10.jpeg",
    "/images/EDITORIALS/editorial11.jpeg",
    "/images/EDITORIALS/editorial12.jpeg",
    "/images/EDITORIALS/editorial13.jpeg",
    "/images/EDITORIALS/editorial14.jpeg",
  ],
  portrait: [
    "/images/PORTRAITS/portrait1.jpg",
    "/images/PORTRAITS/portrait2.jpg",
    "/images/PORTRAITS/portrait3.jpg",
    "/images/PORTRAITS/portrait4.jpg",
    "/images/PORTRAITS/portrait5.jpg",
    "/images/PORTRAITS/portrait6.jpg",
    "/images/PORTRAITS/portrait7.jpg",
    "/images/PORTRAITS/portrait8.jpg",
    "/images/PORTRAITS/portrait9.jpg",
    "/images/PORTRAITS/portrait10.jpg",
    "/images/PORTRAITS/portrait11.jpg",
    "/images/PORTRAITS/portrait12.jpg",
    "/images/PORTRAITS/portrait13.jpg"
  ],
  product: [
    "/images/PRODUCTS/product1.jpg",
    "/images/PRODUCTS/product2.jpg",
    "/images/PRODUCTS/product3.jpg",
    "/images/PRODUCTS/product4.jpg",
    "/images/PRODUCTS/product5.jpg",
    "/images/PRODUCTS/product6.jpg",
    "/images/PRODUCTS/product7.jpg"
  ],
  event: [
    "/images/EVENTS/event1.jpg",
    "/images/EVENTS/event2.jpg",
    "/images/EVENTS/event3.jpg",
    "/images/EVENTS/event4.jpg"
  ]
};

/* =========================================================
   SLIDESHOW (Only runs on index.html)
========================================================= */
const hero = document.querySelector(".hero");
if (hero) {
  const slides = [...document.querySelectorAll(".slide")];
  const dots = document.querySelector(".slide-dots");
  const counter = document.querySelector(".slide-count");
  const SLIDE_DELAY = 1500;
  let currentSlide = 0;
  let slideTimer;

  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slide-dot";
    dot.setAttribute("aria-label", `Show photo ${index + 1}`);
    dot.setAttribute("aria-current", index === 0 ? "true" : "false");
    dot.addEventListener("click", () => showSlide(index, true));
    dots.append(dot);
  });

  function showSlide(index, resetTimer = false) {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === currentSlide);
    });
    [...dots.children].forEach((dot, i) => {
      dot.setAttribute("aria-current", i === currentSlide ? "true" : "false");
    });
    if (counter) {
      counter.textContent = `${String(currentSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    }
    if (resetTimer) startSlideTimer();
  }

  function startSlideTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => showSlide(currentSlide + 1), SLIDE_DELAY);
  }

  document.querySelectorAll(".slider-arrow").forEach(button => {
    button.addEventListener("click", () => {
      showSlide(currentSlide + (button.dataset.direction === "next" ? 1 : -1), true);
    });
  });

  let touchStartX = null;
  hero.addEventListener("touchstart", event => { touchStartX = event.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", event => {
    if (touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 50) showSlide(currentSlide + (distance < 0 ? 1 : -1), true);
    touchStartX = null;
  });

  startSlideTimer();
}

/* =========================================================
   SCROLL ANIMATIONS
========================================================= */
const quote = document.querySelector("#quote");
if (quote) {
  const words = quote.textContent.trim().split(/\s+/);
  quote.setAttribute("aria-label", words.join(" "));
  quote.textContent = "";
  words.forEach((word, i) => {
    const span = document.createElement("span");
    span.className = "w";
    span.setAttribute("aria-hidden", "true");
    span.style.setProperty("--wd", `${i * 0.06}s`);
    span.textContent = word;
    quote.append(span, " ");
  });
}

document.querySelectorAll("[data-stagger]").forEach(parent => {
  const cols = parseInt(parent.dataset.cols, 10) || 99;
  [...parent.children].forEach((child, i) => {
    if (!child.hasAttribute("data-anim")) {
      child.setAttribute("data-anim", parent.dataset.stagger || "up");
    }
    child.style.setProperty("--d", `${(i % cols) * 0.12}s`);
  });
});

document.querySelectorAll("[data-delay]").forEach(el => {
  el.style.setProperty("--d", `${el.dataset.delay}s`);
});

const settleTimers = new WeakMap();
function settle(el) {
  clearTimeout(settleTimers.get(el));
  const delay = parseFloat(el.style.getPropertyValue("--d")) || 0;
  settleTimers.set(el, setTimeout(() => el.classList.add("settled"), (delay + 1) * 1000 + 300));
}

function reveal(el) {
  if (el.classList.contains("in")) return;
  el.classList.add("in");
  settle(el);
}

function reset(el) {
  clearTimeout(settleTimers.get(el));
  el.classList.remove("in", "settled");
}

let revealObserver = null;
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.intersectionRatio >= 0.1) reveal(entry.target);
      else if (!entry.isIntersecting) reset(entry.target);
    });
  }, { threshold: [0, 0.1], rootMargin: "0px 0px -30px 0px" });
}

function observeAnim(el) {
  if (revealObserver) revealObserver.observe(el);
  else el.classList.add("in", "settled");
}
document.querySelectorAll("[data-anim]").forEach(observeAnim);

/* =========================================================
   GALLERY RENDER
========================================================= */
const galleryEl = document.querySelector("#gallery");
const overlayTemplate = `
  <div class="gallery-item__overlay" aria-hidden="true">
    <span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 3h6v6"/>
        <path d="M9 21H3v-6"/>
        <path d="M21 3l-7 7"/>
        <path d="M3 21l7-7"/>
      </svg>
      Click to view all images
    </span>
  </div>
`;

/* Detect if device is touch-based */
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

function renderGallery() {
  if (!galleryEl) return;

  // If we are on the index page (no PAGE_CATEGORY), do NOT run the script.
  if (!window.PAGE_CATEGORY) return;

  const category = window.PAGE_CATEGORY;
  const items = (GALLERY[category] || []).map(src => ({ category, src }));

  galleryEl.innerHTML = "";

  items.forEach((item, i) => {
    const a = document.createElement("a");
    a.className = "gallery-item";
    a.href = "#"; 
    a.dataset.category = item.category;
    a.dataset.full = item.src;

    a.setAttribute("data-anim", "zoom");
    a.style.setProperty("--d", `${(i % 3) * 0.12}s`);

    a.innerHTML = `
      <img loading="lazy" src="${item.src}" alt="${item.category}">
      ${overlayTemplate}
    `;

    a.classList.add("in");
    galleryEl.appendChild(a);
  });

  /* =========================================================
     BIND TOUCH + CLICK EVENTS
     
     Desktop: hover shows overlay via CSS, click opens lightbox immediately.
     Mobile: touchstart shows overlay, touchend hides it, click opens lightbox.
  ========================================================= */
  galleryEl.querySelectorAll(".gallery-item").forEach(item => {
    let touchStartTime = 0;
    let isTouched = false;

    // Mobile: show overlay on touch start
    item.addEventListener("touchstart", () => {
      touchStartTime = Date.now();
      isTouched = true;
      item.classList.add("is-touched");
    }, { passive: true });

    // Mobile: hide overlay on touch end
    item.addEventListener("touchend", () => {
      // Small delay so user sees the overlay before it disappears
      setTimeout(() => {
        isTouched = false;
        item.classList.remove("is-touched");
      }, 100);
    }, { passive: true });

    // Handle click (both desktop and mobile)
    item.addEventListener("click", event => {
      event.preventDefault();

      // On mobile, if the touch was very brief (< 150ms), it's a tap → open lightbox
      // If the user held longer, they were probably reading the overlay, so don't open
      if (isTouchDevice) {
        const touchDuration = Date.now() - touchStartTime;
        if (touchDuration < 150) {
          const list = [...galleryEl.querySelectorAll(".gallery-item")];
          openLightbox(list.indexOf(item));
        }
      } else {
        // Desktop: open lightbox immediately
        const list = [...galleryEl.querySelectorAll(".gallery-item")];
        openLightbox(list.indexOf(item));
      }
    });
  });
}

renderGallery();

galleryEl?.addEventListener("error", event => {
  if (event.target.tagName === "IMG") {
    event.target.classList.add("is-broken");
  }
}, true);

/* =========================================================
   HEADER + SCROLL PROGRESS
========================================================= */
const topbar = document.querySelector(".topbar");
const progress = document.querySelector(".progress");
let ticking = false;

function onScroll() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.transform = `scaleX(${maxScroll > 0 ? scrollTop / maxScroll : 0})`;
  if (topbar) topbar.classList.toggle("scrolled", scrollTop > 20);
  ticking = false;
}

window.addEventListener("scroll", () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
onScroll();

/* =========================================================
   LIGHTBOX
========================================================= */
const lightbox = document.querySelector("#lightbox");
const lightboxImg = document.querySelector("#lightbox-img");
const lightboxCounter = document.querySelector("#lightbox-counter");
let lightboxIndex = 0;

function currentItems() {
  return [...document.querySelectorAll(".gallery-item")];
}

function openLightbox(index) {
  const items = currentItems();
  if (!items.length) return;
  lightboxIndex = (index + items.length) % items.length;
  const item = items[lightboxIndex];
  const src = item.dataset.full;
  const alt = item.querySelector("img")?.alt || "";
  if (!src) return;
  lightboxImg.classList.remove("is-loaded");
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightboxCounter.textContent = `${lightboxIndex + 1} / ${items.length}`;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  lightboxImg.classList.remove("is-loaded");
  lightboxImg.src = "";
}

function showNext(step) {
  const items = currentItems();
  if (!items.length) return;
  lightboxIndex = (lightboxIndex + step + items.length) % items.length;
  const item = items[lightboxIndex];
  const src = item.dataset.full;
  const alt = item.querySelector("img")?.alt || "";
  if (!src) return;
  lightboxImg.classList.remove("is-loaded");
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightboxCounter.textContent = `${lightboxIndex + 1} / ${items.length}`;
}

if (lightboxImg) lightboxImg.addEventListener("load", () => lightboxImg.classList.add("is-loaded"));
lightbox?.querySelectorAll("[data-lightbox-close]").forEach(el => el.addEventListener("click", closeLightbox));
lightbox?.querySelector('[data-nav="prev"]').addEventListener("click", () => showNext(-1));
lightbox?.querySelector('[data-nav="next"]').addEventListener("click", () => showNext(1));

lightbox?.addEventListener("click", event => {
  if (event.target === lightbox || event.target.classList.contains("lightbox__stage")) closeLightbox();
});

document.addEventListener("keydown", event => {
  if (!lightbox?.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  else if (event.key === "ArrowLeft") showNext(-1);
  else if (event.key === "ArrowRight") showNext(1);
});

let lbTouchStartX = null;
lightbox?.addEventListener("touchstart", event => { lbTouchStartX = event.touches[0].clientX; }, { passive: true });
lightbox?.addEventListener("touchend", event => {
  if (lbTouchStartX === null) return;
  const distance = event.changedTouches[0].clientX - lbTouchStartX;
  if (Math.abs(distance) > 50) showNext(distance < 0 ? 1 : -1);
  lbTouchStartX = null;
});

/* =========================================================
   CONTACT POP-UP + EMAIL FORM
========================================================= */
const modal = document.querySelector("#contact-modal");
const modalCard = modal?.querySelector(".modal-card");
const form = document.querySelector("#contact-form");
const statusBox = document.querySelector("#form-status");
const sendBtn = document.querySelector("#send-btn");
const sendLabel = sendBtn?.querySelector("span");
let lastFocused = null;

function openModal() {
  lastFocused = document.activeElement;
  if (modal.classList.contains("sent")) {
    modal.classList.remove("sent");
    form.reset();
  }
  statusBox.textContent = "";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setTimeout(() => form.elements.name.focus(), 120);
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll('[data-open-contact]').forEach(el => {
  el.addEventListener("click", event => { event.preventDefault(); openModal(); });
});

modal?.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeModal));

document.addEventListener("keydown", event => {
  if (!modal?.classList.contains("open")) return;
  if (event.key === "Escape") { closeModal(); return; }
  if (event.key === "Tab") {
    const focusable = [...modalCard.querySelectorAll("button, a[href], input, select, textarea")].filter(el => !el.disabled && el.tabIndex !== -1 && el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

/* =========================================================
   CONTACT FORM SUBMISSION
========================================================= */
const dateInput = document.querySelector("#cf-date");
if (dateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

const timeInput = document.querySelector("#cf-time");
if (timeInput) {
  timeInput.addEventListener("input", function() {
    if (this.value && (this.value < "10:00" || this.value > "17:00")) {
      alert("Please select a time between 10:00 AM and 5:00 PM.");
      this.value = "";
    }
  });
}

form?.addEventListener("submit", async event => {
  event.preventDefault();
  if (form.elements._honey.value) return;
  statusBox.textContent = "";
  if (CONTACT_EMAIL.includes("YOUR-CLIENT")) {
    console.warn("Set CONTACT_EMAIL in the script to your client's email address.");
    statusBox.textContent = "This form isn't connected to an email address yet.";
    return;
  }
  sendBtn.disabled = true;
  sendLabel.textContent = "Sending…";
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        date: form.elements.date.value,
        time: form.elements.time.value,
        message: form.elements.message.value.trim(),
        _replyto: form.elements.email.value.trim(),
        _subject: `New photography enquiry from ${form.elements.name.value.trim()}`,
        _template: "table",
        _captcha: "false"
      })
    });
    const result = await response.json();
    if (!response.ok || (result.success !== "true" && result.success !== true)) {
      throw new Error(result.message || "Request failed");
    }
    modal.classList.add("sent");
    form.reset();
  } catch (error) {
    console.error(error);
    statusBox.textContent = "Couldn't send: " + error.message;
  } finally {
    sendBtn.disabled = false;
    sendLabel.textContent = "Send message";
  }
});

/* =========================================================
   MOBILE MENU (Animated Hamburger + Portfolio Accordion)
========================================================= */
const menu = document.querySelector(".menu");
const nav = document.querySelector(".nav");
const navDropdown = document.querySelector(".nav-dropdown");
const navDropdownTrigger = document.querySelector(".nav-dropdown__trigger");

function toggleMenu(forceOpen) {
  const isOpen = typeof forceOpen === "boolean" 
    ? forceOpen 
    : !nav.classList.contains("open");
  
  nav.classList.toggle("open", isOpen);
  menu.setAttribute("aria-expanded", String(isOpen));
  menu.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");

  // When closing the main menu, also close the Portfolio accordion
  if (!isOpen && navDropdown) {
    navDropdown.classList.remove("is-open");
  }
}

menu?.addEventListener("click", () => toggleMenu());

/* Make the Portfolio trigger toggle the accordion on mobile instead of navigating */
navDropdownTrigger?.addEventListener("click", event => {
  // Only intercept on mobile (screen width <= 640px)
  if (window.innerWidth <= 640) {
    event.preventDefault();
    navDropdown.classList.toggle("is-open");
  }
});

/* Close the whole menu when a real link (not the trigger) is clicked */
nav?.querySelectorAll("a").forEach(link => {
  if (link === navDropdownTrigger) return;
  link.addEventListener("click", () => toggleMenu(false));
});

/* =========================================================
   CURRENT YEAR
========================================================= */
const yearEl = document.querySelector("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();