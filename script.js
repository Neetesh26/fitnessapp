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
  // 6A. BUTTON RIPPLE
  // ─────────────────────────────────────────────
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.5;
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size/2}px;
        top:  ${e.clientY - rect.top  - size/2}px;
      `;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });


  // ─────────────────────────────────────────────
  // 6B. FEATURE CARD MOUSE-GLOW (spotlight)
  // ─────────────────────────────────────────────
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });


  // ─────────────────────────────────────────────
  // 6C. SECTION TITLE UNDERLINE ON SCROLL
  // ─────────────────────────────────────────────
  const titleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('underline-active');
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.section-title').forEach(el => {
    titleObserver.observe(el);
  });


  // ─────────────────────────────────────────────
  // 6D. TAB INDICATOR PILL (sliding underline)
  // ─────────────────────────────────────────────
  const tabWrap = document.querySelector('.tab-buttons');
  if (tabWrap) {
    const indicator = document.createElement('div');
    indicator.className = 'tab-indicator';
    tabWrap.appendChild(indicator);

    function moveIndicator(btn) {
      indicator.style.left  = btn.offsetLeft + 'px';
      indicator.style.width = btn.offsetWidth + 'px';
    }

    const activeBtn = tabWrap.querySelector('.tab-btn.active');
    if (activeBtn) moveIndicator(activeBtn);

    tabWrap.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => moveIndicator(btn));
    });
  }


  // ─────────────────────────────────────────────
  // 6E. LOGO GLITCH — set data-text attribute
  // ─────────────────────────────────────────────
  document.querySelectorAll('.logo').forEach(el => {
    el.setAttribute('data-text', el.textContent);
  });


  // ─────────────────────────────────────────────
  // 6F. STAT NUMBER FLASH ON SCROLL
  // ─────────────────────────────────────────────
  const statNums = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('flash');
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 1 });
  statNums.forEach(n => statObserver.observe(n));


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