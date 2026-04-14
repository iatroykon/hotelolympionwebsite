/* ==============================================
   HOTEL OLYMPION — JAVASCRIPT
   ============================================== */

/* --- Loader --- */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
    const navbar = document.getElementById("navbar");
    navbar.style.opacity = "1";
    navbar.style.pointerEvents = "auto";
  }, 1800); // Keep this for the main loader transition

  // Trigger hero stats animation to sync with its appearance
  setTimeout(animateHeroStats, 1100); // Matches the animation-delay of .hero-strip
});

/* --- AOS --- */
AOS.init({
  duration: 750,
  easing: "ease-out-quad",
  once: true,
  offset: 70,
});

/* --- Navbar scroll + back-to-top --- */
const navbar = document.getElementById("navbar");
const backToTop = document.getElementById("backToTop");

window.addEventListener(
  "scroll",
  () => {
    const y = window.scrollY;
    navbar.classList.toggle("scrolled", y > 60);
    backToTop.classList.toggle("visible", y > 500);
  },
  { passive: true },
);

backToTop.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

/* --- Hamburger / mobile menu --- */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("open");
});

document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("open");
  });
});

/* --- Smooth scroll for all anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* --- Hero stats counter animation on load --- */
function animateHeroStats() {
  const heroStatNums = document.querySelectorAll(".hst-num");
  if (!heroStatNums.length) return;

  heroStatNums.forEach((el) => {
    const target = parseFloat(el.dataset.target);
    if (isNaN(target)) return;

    const suffix = el.dataset.suffix || "";
    const isDecimal = String(target).includes(".");
    const duration = 2000; // 2 seconds as requested
    const steps = 60; // Keep animation smooth
    const increment = target / steps;
    let currentValue = 0;

    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= target) {
        currentValue = target;
        clearInterval(timer);
      }

      let displayValue = isDecimal
        ? currentValue.toFixed(1)
        : Math.floor(currentValue);

      el.textContent = displayValue + suffix;
    }, duration / steps);
  });
}

/* --- Swiper testimonials --- */
new Swiper(".testimonial-swiper", {
  loop: true,
  speed: 700,
  autoplay: { delay: 5500, disableOnInteraction: false },
  pagination: { el: ".swiper-pagination", clickable: true },
  navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
  grabCursor: true,
});

/* --- Room buttons → pre-select room & scroll to booking --- */
document.querySelectorAll(".room-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn
      .closest(".room-card")
      .querySelector(".room-name").textContent;
    const roomSelect = document.getElementById("roomtype");
    Array.from(roomSelect.options).forEach((opt, i) => {
      if (name.includes("Double") && opt.text.includes("Double"))
        roomSelect.selectedIndex = i;
      if (name.includes("Triple") && opt.text.includes("Triple"))
        roomSelect.selectedIndex = i;
      if (name.includes("Family") && opt.text.includes("Family"))
        roomSelect.selectedIndex = i;
    });
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
    showToast(`Room selected: ${name}`);
  });
});

/* --- Booking form date logic --- */
const checkinEl = document.getElementById("checkin");
const checkoutEl = document.getElementById("checkout");
const fmt = (d) => d.toISOString().split("T")[0];
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

if (checkinEl) {
  checkinEl.min = fmt(today);
  checkinEl.value = fmt(today);
}
if (checkoutEl) {
  checkoutEl.min = fmt(tomorrow);
  checkoutEl.value = fmt(tomorrow);
}

checkinEl?.addEventListener("change", () => {
  const nextDay = new Date(checkinEl.value);
  nextDay.setDate(nextDay.getDate() + 1);
  checkoutEl.min = fmt(nextDay);
  if (new Date(checkoutEl.value) <= new Date(checkinEl.value)) {
    checkoutEl.value = fmt(nextDay);
  }
});

document.getElementById("bookingBtn")?.addEventListener("click", () => {
  const ci = checkinEl.value;
  const co = checkoutEl.value;
  if (!ci || !co) {
    showToast("Please select check-in and check-out dates.");
    return;
  }
  if (new Date(co) <= new Date(ci)) {
    showToast("Check-out must be after check-in.");
    return;
  }
  showToast("Checking availability — we'll be in touch shortly!");
});

/* --- Active nav highlight on scroll --- */
const sections = document.querySelectorAll("section[id]");
const navLinksAll = document.querySelectorAll(".nav-link");

const secObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinksAll.forEach((l) => l.classList.remove("active"));
        const active = document.querySelector(
          `.nav-link[href="#${entry.target.id}"]`,
        );
        if (active) active.classList.add("active");
      }
    });
  },
  { threshold: 0.35 },
);

sections.forEach((s) => secObserver.observe(s));

/* --- Toast notification --- */
function showToast(message) {
  document.querySelector(".toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "32px",
    left: "50%",
    transform: "translateX(-50%) translateY(16px)",
    background: "#c9a84c",
    color: "#0d0d0d",
    padding: "13px 28px",
    fontFamily: "'Montserrat', sans-serif",
    fontSize: "0.82rem",
    fontWeight: "700",
    letterSpacing: "1px",
    zIndex: "9000",
    opacity: "0",
    transition: "all 0.35s ease",
    maxWidth: "90vw",
    textAlign: "center",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  });
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(16px)";
    setTimeout(() => toast.remove(), 360);
  }, 3500);
}

/* --- Console branding --- */
console.log(
  "%c Hotel Olympion %c Potos · Thassos · Greece ",
  "background:#c9a84c;color:#0d0d0d;font-weight:700;font-size:13px;padding:5px 12px;",
  "background:#141414;color:#c9a84c;font-size:12px;padding:5px 10px;",
);
