/* ===========================
   APEX FITNESS WATCH — JS
   Vanilla JS only
=========================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─────────────────────────────────────────────
  // 1. MOBILE NAV TOGGLE
  // ─────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });


  // ─────────────────────────────────────────────
  // 2. STICKY HEADER — add shadow on scroll
  // ─────────────────────────────────────────────
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
    } else {
      header.style.boxShadow = 'none';
    }
  }, { passive: true });


  // ─────────────────────────────────────────────
  // 3. FEATURE TABS (interactive component)
  // ─────────────────────────────────────────────
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels  = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Deactivate all
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => p.classList.remove('active'));

      // Activate chosen
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = document.getElementById('tab-' + target);
      if (panel) {
        panel.classList.add('active');
        // Re-trigger reveal for newly shown cards
        panel.querySelectorAll('.feature-card').forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 80);
        });
      }
    });
  });


  // ─────────────────────────────────────────────
  // 4. TESTIMONIAL SLIDER
  // ─────────────────────────────────────────────
  const track     = document.getElementById('testiTrack');
  const dotsWrap  = document.getElementById('testiDots');
  const prevBtn   = document.getElementById('testiPrev');
  const nextBtn   = document.getElementById('testiNext');

  if (track) {
    const cards      = track.querySelectorAll('.testi-card');
    const total      = cards.length;
    let current      = 0;
    let autoInterval = null;

    // Build dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    function getCardWidth() {
      // Card width + gap (24px)
      const card = cards[0];
      const style = window.getComputedStyle(card);
      const gap = 24;
      return card.offsetWidth + gap;
    }

    function goTo(index) {
      current = (index + total) % total;
      const offset = current * getCardWidth();
      track.style.transform = `translateX(-${offset}px)`;

      // Update dots
      dotsWrap.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    prevBtn.addEventListener('click', () => {
      resetAuto();
      goTo(current - 1);
    });

    nextBtn.addEventListener('click', () => {
      resetAuto();
      goTo(current + 1);
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX   = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        resetAuto();
        diff > 0 ? goTo(current + 1) : goTo(current - 1);
      }
    }, { passive: true });

    // Auto-advance every 5s
    function startAuto() {
      autoInterval = setInterval(() => goTo(current + 1), 5000);
    }
    function resetAuto() {
      clearInterval(autoInterval);
      startAuto();
    }

    startAuto();

    // Recalculate on resize
    window.addEventListener('resize', () => goTo(current), { passive: true });
  }


  // ─────────────────────────────────────────────
  // 5. FORM VALIDATION
  // ─────────────────────────────────────────────
  const form        = document.getElementById('signupForm');
  const nameInput   = document.getElementById('nameInput');
  const emailInput  = document.getElementById('emailInput');
  const nameError   = document.getElementById('nameError');
  const emailError  = document.getElementById('emailError');
  const formSuccess = document.getElementById('formSuccess');

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.trim());
  }

  function showError(input, errorEl, msg) {
    input.classList.add('error');
    errorEl.textContent = msg;
  }

  function clearError(input, errorEl) {
    input.classList.remove('error');
    errorEl.textContent = '';
  }

  // Live validation on blur
  nameInput.addEventListener('blur', () => {
    if (!nameInput.value.trim()) {
      showError(nameInput, nameError, 'Please enter your name.');
    } else {
      clearError(nameInput, nameError);
    }
  });

  emailInput.addEventListener('blur', () => {
    if (!emailInput.value.trim()) {
      showError(emailInput, emailError, 'Please enter your email address.');
    } else if (!validateEmail(emailInput.value)) {
      showError(emailInput, emailError, 'Please enter a valid email address.');
    } else {
      clearError(emailInput, emailError);
    }
  });

  // Clear on focus
  nameInput.addEventListener('focus',  () => clearError(nameInput,  nameError));
  emailInput.addEventListener('focus', () => clearError(emailInput, emailError));

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;

    if (!nameInput.value.trim()) {
      showError(nameInput, nameError, 'Please enter your name.');
      valid = false;
    } else {
      clearError(nameInput, nameError);
    }

    if (!emailInput.value.trim()) {
      showError(emailInput, emailError, 'Please enter your email address.');
      valid = false;
    } else if (!validateEmail(emailInput.value)) {
      showError(emailInput, emailError, 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError(emailInput, emailError);
    }

    if (!valid) return;

    // Simulate success
    form.querySelectorAll('input, button[type="submit"]').forEach(el => {
      el.disabled = true;
      el.style.opacity = '0.5';
    });
    formSuccess.classList.add('visible');
  });


  // ─────────────────────────────────────────────
  // 6. SCROLL REVEAL
  // ─────────────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.feature-card, .plan-card, .testi-card, .signup-text, .signup-form, .hero-text, .hero-visual'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children of the same parent
        const siblings = Array.from(entry.target.parentElement.children);
        const index    = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));


  // ─────────────────────────────────────────────
  // 7. ACTIVE NAV LINK ON SCROLL
  // ─────────────────────────────────────────────
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === '#' + id
            ? 'var(--white)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

});