// ============================================================
// SOCRATIC ARCHIPEDENCE — script.js
// Navigasi mobile, scroll reveal, dan form kontak (front-end only)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  /* ---------- Toggle menu mobile ---------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen);
    });

    // Tutup menu saat salah satu link diklik
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Efek nav saat scroll ---------- */
  window.addEventListener("scroll", () => {
    if (window.scrollY > 12) {
      nav.style.borderColor = "rgba(237,230,217,0.22)";
    } else {
      nav.style.borderColor = "rgba(237,230,217,0.10)";
    }
  });

  /* ---------- Spotlight kursor di hero ---------- */
  const hero = document.getElementById("hero");
  const heroGlow = document.getElementById("heroGlow");
  if (hero && heroGlow && !isTouchDevice && !prefersReducedMotion) {
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      heroGlow.style.setProperty("--mx", x + "%");
      heroGlow.style.setProperty("--my", y + "%");
    });
  }

  /* ---------- Efek tilt 3D pada kartu ---------- */
  if (!isTouchDevice && !prefersReducedMotion) {
    document.querySelectorAll(".tilt").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-4px) rotateX(${(-py * 8).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------- Animasi hitung angka statistik ---------- */
  const statEls = document.querySelectorAll(".stat-num[data-count]");
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-count"), 10);
        const suffix = el.getAttribute("data-suffix") || "";
        if (prefersReducedMotion) {
          el.textContent = target + suffix;
        } else {
          const duration = 1200;
          const start = performance.now();
          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
        statObserver.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  statEls.forEach((el) => statObserver.observe(el));

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll(".reveal-up");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));

  /* ---------- Lightbox galeri portofolio ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  document.querySelectorAll(".rev-thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const fullSrc = thumb.getAttribute("data-full");
      lightboxImg.src = fullSrc;
      lightboxImg.alt = thumb.querySelector("img").alt;
      lightbox.classList.add("open");
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightboxImg.src = "";
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------- Form kontak: terhubung ke WhatsApp & Email ---------- */
  // PENTING: ganti nomor ini dengan nomor WhatsApp asli kamu.
  // Format: kode negara tanpa "+" dan tanpa "0" di depan. Contoh: 0812-3456-7890 -> "6281234567890"
  const WA_NUMBER = "6289507530946";
  // Ganti dengan email asli kamu (harus sama dengan yang ada di kartu kontak).
  const CONTACT_EMAIL = "homedeskdesign19@gmail.com";

  const form = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  const waBtn = document.getElementById("sendWhatsapp");
  const emailBtn = document.getElementById("sendEmail");

  function getFormData() {
    if (!form.reportValidity()) return null; // munculkan validasi bawaan browser kalau ada field kosong
    return {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
    };
  }

  if (waBtn) {
    waBtn.addEventListener("click", () => {
      const data = getFormData();
      if (!data) return;
      const text =
        `Halo Socratic Archipedence, saya ${data.name} (${data.email}).\n\n${data.message}`;
      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
      formNote.textContent = "Membuka WhatsApp di tab baru — tinggal tekan kirim di sana.";
      window.open(url, "_blank", "noopener");
    });
  }

  if (emailBtn) {
    emailBtn.addEventListener("click", () => {
      const data = getFormData();
      if (!data) return;
      const subject = `Pesan dari Website — ${data.name}`;
      const body = `Nama: ${data.name}\nEmail: ${data.email}\n\nPesan:\n${data.message}`;
      const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      formNote.textContent = "Membuka aplikasi email — tinggal tekan kirim di sana.";
      window.location.href = mailto;
    });
  }

});
