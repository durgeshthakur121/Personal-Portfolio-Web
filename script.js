/* ============================================================
   PORTFOLIO — script.js
   Handles: AOS init, navbar scroll, hamburger menu,
            custom cursor, skill bar animation,
            contact form validation & submission
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. DETECT DESKTOP (for custom cursor) ─────────────────
  const isDesktop = window.matchMedia('(pointer: fine)').matches;
  if (isDesktop) document.body.classList.add('desktop');

  // ── 2. AOS INIT ────────────────────────────────────────────
  // AOS (Animate On Scroll) — lightweight scroll animation library
  // CDN: https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-quad',
      once: true,
      offset: 60,
    });
  }

  // ── 3. NAVBAR SCROLL EFFECT ────────────────────────────────
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ── 4. HAMBURGER / MOBILE MENU ─────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobLinks   = document.querySelectorAll('.mob-link');

  const toggleMenu = () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow =
      mobileMenu.classList.contains('open') ? 'hidden' : '';
  };

  const closeMenu = () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggleMenu);
  mobLinks.forEach(link => link.addEventListener('click', closeMenu));

  // ── 5. SMOOTH SCROLL FOR NAV LINKS ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = navbar.offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── 6. CUSTOM CURSOR ───────────────────────────────────────
  // A large ring that follows the mouse slightly behind a
  // small dot. Gives the site a high-end interactive feel.
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower && isDesktop) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    // Smooth follow for the ring
    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.14;
      followerY += (mouseY - followerY) * 0.14;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    };
    animateFollower();

    // Grow ring on hoverable elements
    const hoverables = document.querySelectorAll(
      'a, button, .tag, .project-card, input, textarea'
    );
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
        follower.style.transform = 'translate(-50%,-50%) scale(1.6)';
        follower.style.opacity = '0.25';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        follower.style.transform = 'translate(-50%,-50%) scale(1)';
        follower.style.opacity = '0.5';
      });
    });
  }

  // ── 7. SKILL BAR ANIMATION ─────────────────────────────────
  // Bars animate to their target width when scrolled into view
  // using IntersectionObserver (no extra library needed).
  const barFills = document.querySelectorAll('.bar-fill');

  if (barFills.length > 0) {
    const barObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar   = entry.target;
          const width = bar.dataset.width;
          // Small delay for a staggered feel
          setTimeout(() => {
            bar.style.width = width + '%';
          }, 200);
          barObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.2 });

    barFills.forEach(bar => barObserver.observe(bar));
  }

  // ── 8. CONTACT FORM VALIDATION & SUBMIT ────────────────────
  // Pure vanilla JS validation — no external lib required.
  // Replace the mock submit logic with your actual endpoint
  // (EmailJS, Formspree, or a custom backend).
  const form       = document.getElementById('contactForm');
  const btnText    = form && form.querySelector('.btn-text');
  const btnLoader  = document.getElementById('btnLoader');
  const formSuccess = document.getElementById('formSuccess');

  const fields = {
    name: {
      el:    document.getElementById('name'),
      error: document.getElementById('nameError'),
      validate: v => v.trim().length >= 2 ? '' : 'Please enter your name.',
    },
    email: {
      el:    document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? '' : 'Please enter a valid email address.',
    },
    message: {
      el:    document.getElementById('message'),
      error: document.getElementById('messageError'),
      validate: v => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.',
    },
  };

  // Real-time validation on blur
  Object.values(fields).forEach(({ el, error, validate }) => {
    if (!el) return;
    el.addEventListener('blur', () => {
      error.textContent = validate(el.value);
    });
    el.addEventListener('input', () => {
      if (error.textContent) error.textContent = validate(el.value);
    });
  });

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      // Validate all fields
      let valid = true;
      Object.values(fields).forEach(({ el, error, validate }) => {
        if (!el) return;
        const msg = validate(el.value);
        error.textContent = msg;
        if (msg) valid = false;
      });
      if (!valid) return;

      // Show loading state
      btnText.textContent = 'Sending…';
      btnLoader.classList.add('show');
      form.querySelector('button[type="submit"]').disabled = true;

      // ── REPLACE THIS BLOCK with your real submission logic ──
      // Example with EmailJS:
      //   await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', formData);
      // Example with Formspree:
      //   await fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body: new FormData(form) });
      await mockSubmit();
      // ────────────────────────────────────────────────────────

      // Reset form and show success
      form.reset();
      btnText.textContent = 'Send Message';
      btnLoader.classList.remove('show');
      form.querySelector('button[type="submit"]').disabled = false;
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    });
  }

  // Mock async delay (remove when using a real endpoint)
  function mockSubmit() {
    return new Promise(resolve => setTimeout(resolve, 1500));
  }

  // ── 9. BACK-TO-TOP VISIBILITY ──────────────────────────────
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.style.opacity = window.scrollY > 500 ? '1' : '0.3';
    }, { passive: true });
  }

  // ── 10. ACTIVE NAV HIGHLIGHT ON SCROLL ─────────────────────
  // Highlights the nav link corresponding to the visible section
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active-link',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

});