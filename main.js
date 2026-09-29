/* ============================================================
   AKHILESH B S — Unreal Engine 5 Developer & XR Simulation Engineer
   Interactive Features & Smooth Scroll Reveal Architecture
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. CUSTOM CURSOR (Desktop only) ──────────────────────────
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  if (window.matchMedia('(hover: hover)').matches && cur && ring) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cur.style.left = mx + 'px';
      cur.style.top  = my + 'px';
    });

    (function animRing() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();

    const interactives = 'a, button, .service-card, .service-card-v2, .css-badge-pill, .project-tri-card, .plugin-showcase-card, .stack-card-header, .stack-btn-action, .stack-gallery-item, .skill-tile-card, .floating-tech-card, .tech-badge-item, .hsb-item, .as-card, .ce-pill, .profile-card-mockup';
    document.querySelectorAll(interactives).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cur.style.width = '14px';
        cur.style.height = '14px';
        cur.style.background = '#ffffff';
        ring.style.width = '46px';
        ring.style.height = '46px';
        ring.style.borderColor = 'rgba(255, 107, 0, 0.7)';
      });
      el.addEventListener('mouseleave', () => {
        cur.style.width = '8px';
        cur.style.height = '8px';
        cur.style.background = 'var(--orange)';
        ring.style.width = '34px';
        ring.style.height = '34px';
        ring.style.borderColor = 'rgba(255, 107, 0, 0.4)';
      });
    });
  }

  // ── 2. TYPEWRITER EFFECT ─────────────────────────────────────
  const roles = [
    'Unreal Engine 5 Developer',
    'XR Simulation Engineer',
    'Flight Simulation Specialist',
    'Digital Twin Architect',
    'Epic Fab Plugin Creator',
    'C++ Systems Engineer'
  ];

  let roleIdx = 0, charIdx = 0, isDeleting = false, isPaused = false;
  const typedEl = document.getElementById('typewriterText');

  function typeTick() {
    if (!typedEl) return;

    if (isPaused) {
      setTimeout(typeTick, 1800);
      isPaused = false;
      return;
    }

    const current = roles[roleIdx];

    if (!isDeleting) {
      typedEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        isDeleting = true;
        isPaused = true;
      }
      setTimeout(typeTick, 70);
    } else {
      typedEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
      setTimeout(typeTick, 35);
    }
  }
  typeTick();

  // ── 3. SMOOTH SCROLL REVEAL ANIMATIONS ───────────────────────
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.anim-reveal, .service-card, .service-card-v2, .core-stack-strip-v2, .project-tri-card, .plugin-showcase-card, .as-card, .testi-card, .exp-row-card, .skill-category-box');

  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || 0, 10);
          if (delay > 0) {
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, delay);
          } else {
            entry.target.classList.add('is-visible');
          }
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
      el.classList.add('anim-reveal');
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible');
      } else {
        revealObserver.observe(el);
      }
    });
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // ── 4. SMOOTH SCROLL FOR ALL ANCHOR LINKS ────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const headerOffset = 74;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Handle direct hash navigation on page load
  if (window.location.hash) {
    const hashTarget = document.querySelector(window.location.hash);
    if (hashTarget) {
      setTimeout(() => {
        hashTarget.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, 20);
    }
  }

  // ── 5. ACTIVE NAVIGATION LINK ON SCROLL ───────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });

  // ── 6. INITIALIZE PINNED STACKING ACCORDION ──────────────────
  initPluginsAccordion();

}); // End DOMContentLoaded

// ── 6. MOBILE NAVIGATION DRAWER ────────────────────────────────
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenuEl    = document.getElementById('navMenu');

if (hamburgerBtn && navMenuEl) {
  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('open');
    navMenuEl.classList.toggle('open');
    document.body.style.overflow = navMenuEl.classList.contains('open') ? 'hidden' : '';
  });
}

function closeNav() {
  if (hamburgerBtn && navMenuEl) {
    hamburgerBtn.classList.remove('open');
    navMenuEl.classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.addEventListener('click', e => {
  if (navMenuEl && navMenuEl.classList.contains('open') &&
      !navMenuEl.contains(e.target) &&
      hamburgerBtn && !hamburgerBtn.contains(e.target)) {
    closeNav();
  }
});

// ── 7. UNIFIED MODAL LIGHTBOX ──────────────────────────────────
function openMedia(src, type, title = '', description = '') {
  const lightbox  = document.getElementById('lightbox');
  const container = document.getElementById('lightboxContent');
  const lbTitle   = document.getElementById('lbTitle');
  const lbDesc    = document.getElementById('lbDesc');

  if (lbTitle) lbTitle.textContent = title || 'Project Demonstration';
  if (lbDesc)  lbDesc.textContent  = description || '';

  if (type === 'video') {
    container.innerHTML = `<video src="${src}" controls autoplay playsinline style="width:100%; border-radius:0 0 14px 14px;"></video>`;
  } else {
    container.innerHTML = `<img src="${src}" alt="${title}" style="max-width:100%; max-height:75vh; border-radius:0 0 14px 14px; object-fit:contain;"/>`;
  }

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMedia() {
  const lightbox  = document.getElementById('lightbox');
  const container = document.getElementById('lightboxContent');
  if (container) container.innerHTML = '';
  if (lightbox)  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function handleLightboxClick(e) {
  const dialog = document.getElementById('lightboxDialog');
  if (dialog && !dialog.contains(e.target)) {
    closeMedia();
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMedia();
});

// ── 8. INTERACTIVE CONTACT FORM SUBMISSION ──────────────────────
function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('senderName').value;
  const email = document.getElementById('senderEmail').value;
  const projectType = document.getElementById('projectType').value || 'General Inquiry';
  const budget = document.getElementById('budgetRange').value || 'Not specified';
  const msg = document.getElementById('messageBody').value;
  const statusMsg = document.getElementById('formStatusMsg');

  if (statusMsg) {
    statusMsg.style.display = 'block';
    statusMsg.textContent = `Thank you, ${name}! Preparing email message...`;
  }

  const subject = encodeURIComponent(`[Portfolio Inquiry] ${projectType} - from ${name}`);
  const body = encodeURIComponent(
    `Hello Akhilesh,\n\nName: ${name}\nEmail: ${email}\nProject Type: ${projectType}\nEngagement / Timeline: ${budget}\n\nMessage:\n${msg}\n`
  );

  setTimeout(() => {
    window.location.href = `mailto:bsakhileshshetty@gmail.com?subject=${subject}&body=${body}`;
    if (statusMsg) {
      statusMsg.textContent = 'Message ready in your email client! You can also chat directly via WhatsApp: +91 7989591934.';
    }
  }, 600);
}

// ── 9. PINNED SCROLL-DRIVEN STACKING ACCORDION (FAB PLUGINS) ───
function initPluginsAccordion() {
  const section = document.getElementById('plugins');
  const stackWrapper = document.getElementById('accordionStack');
  if (!section || !stackWrapper) return;

  const card1 = document.getElementById('pcard-1');
  const card2 = document.getElementById('pcard-2');

  const body1 = document.getElementById('pbody-1');
  const body2 = document.getElementById('pbody-2');

  if (!card1 || !card2 || !body1 || !body2) return;

  const OFFSET_STEP = 80; // Sequential stacking offset with generous 18px gap below Card 1

  // Check reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Check if GSAP and ScrollTrigger are available
    let tl = null;
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Initial setup
      gsap.set(card1, { top: 0, zIndex: 10 });
      gsap.set(body1, { height: 'auto', opacity: 1 });
      card1.classList.add('is-expanded');

      gsap.set(card2, { top: 485, zIndex: 20 });
      gsap.set(body2, { height: 0, opacity: 0, paddingBottom: 0, paddingTop: 0 });

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#plugins',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          snap: {
            snapTo: [0, 1],
            duration: { min: 0.25, max: 0.4 },
            delay: 0.05,
            ease: 'power2.out'
          },
          invalidateOnRefresh: true
        }
      });

      // Collapse Card 1 to top header pill, slide Card 2 to top: 80px and expand
      tl.to(body1, {
        height: 0,
        opacity: 0,
        paddingTop: 0,
        paddingBottom: 0,
        ease: 'power2.inOut',
        duration: 1
      }, 0)
      .to(card2, {
        top: OFFSET_STEP,
        ease: 'power2.out',
        duration: 1
      }, 0)
      .to(body2, {
        height: 'auto',
        opacity: 1,
        paddingTop: 24,
        paddingBottom: 26,
        ease: 'power2.inOut',
        duration: 1,
        onStart: () => {
          card1.classList.remove('is-expanded');
          card2.classList.add('is-expanded');
        },
        onReverseComplete: () => {
          card2.classList.remove('is-expanded');
          card1.classList.add('is-expanded');
        }
      }, 0.1);
    }

    // Interactive Click / Keyboard accordion support
    const cards = [
      { card: card1, body: body1, top: 0 },
      { card: card2, body: body2, top: OFFSET_STEP }
    ];

    cards.forEach((item, idx) => {
      const header = item.card.querySelector('.stack-card-header');
      if (!header) return;

      function handleToggle(e) {
        if (e.target.closest('a')) return;

        const isExpanded = item.card.classList.contains('is-expanded');
        if (isExpanded) return; // Already active

        if (tl) {
          gsap.to(tl, {
            progress: idx === 1 ? 1 : 0,
            duration: 0.45,
            ease: 'power2.out'
          });
          if (tl.scrollTrigger) {
            const targetPos = idx === 1 ? tl.scrollTrigger.end : tl.scrollTrigger.start;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
          }
        } else {
          cards.forEach((c, cIdx) => {
            if (cIdx === idx) {
              c.card.classList.add('is-expanded');
              c.card.setAttribute('aria-expanded', 'true');
              if (typeof gsap !== 'undefined') {
                gsap.to(c.card, { top: c.top, duration: 0.45, ease: 'power2.out' });
                gsap.to(c.body, { height: 'auto', opacity: 1, paddingTop: 24, paddingBottom: 26, duration: 0.45, ease: 'power2.out' });
              }
            } else if (cIdx < idx) {
              c.card.classList.remove('is-expanded');
              c.card.setAttribute('aria-expanded', 'false');
              if (typeof gsap !== 'undefined') {
                gsap.to(c.card, { top: c.top, duration: 0.4, ease: 'power2.out' });
                gsap.to(c.body, { height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0, duration: 0.4, ease: 'power2.out' });
              }
            } else {
              c.card.classList.remove('is-expanded');
              c.card.setAttribute('aria-expanded', 'false');
              if (typeof gsap !== 'undefined') {
                gsap.to(c.card, { top: 485, duration: 0.4, ease: 'power2.out' });
                gsap.to(c.body, { height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0, duration: 0.4, ease: 'power2.out' });
              }
            }
          });
        }
      }

      header.addEventListener('click', handleToggle);
      header.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle(e);
        }
      });
    });
}

