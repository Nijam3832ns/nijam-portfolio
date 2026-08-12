/**
 * N. NIJAM MAIDEEN PORTFOLIO — PREMIUM INTERACTIVE ENGINE
 * Features: Particle system, cursor glow, scroll reveal, typing effect,
 * animated counters, tilt cards, skill bars, back-to-top progress, and more.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ======================== PRELOADER ========================
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = 'auto';
      initScrollReveal();
      animateCounters();
      animateSkillBars();
    }, 1200);
  });
  // Fallback: always hide preloader after 3s
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = 'auto';
    initScrollReveal();
  }, 3000);

  // ======================== PARTICLE BACKGROUND ========================
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    resizeCanvas();
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.06 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animFrameId = requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

  // ======================== CURSOR GLOW ========================
  const cursorGlow = document.getElementById('cursor-glow');
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';
  });

  // Card glow follow
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });

  // ======================== TILT CARD EFFECT ========================
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });

  // ======================== THEME TOGGLE ========================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('nijam_portfolio_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const current = htmlRoot.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    htmlRoot.setAttribute('data-theme', next);
    localStorage.setItem('nijam_portfolio_theme', next);
    updateThemeIcon(next);
    showToast(`Switched to ${next === 'dark' ? '🌙 Dark' : '☀️ Light'} Mode`);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggleBtn.querySelector('i');
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  // ======================== NAVBAR SCROLL ========================
  const navbarContainer = document.querySelector('.navbar-container');
  window.addEventListener('scroll', () => {
    navbarContainer.classList.toggle('scrolled', window.scrollY > 50);
    highlightActiveNav();
    updateBackToTop();
  });

  // ======================== MOBILE MENU ========================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');

  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.className = navLinks.classList.contains('active') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileMenuBtn.querySelector('i').className = 'fa-solid fa-bars';
    });
  });

  // ======================== ACTIVE NAV SECTION SPY ========================
  const sections = document.querySelectorAll('section[id]');
  function highlightActiveNav() {
    const scrollY = window.pageYOffset;
    sections.forEach(sec => {
      const top = sec.offsetTop - 130;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href*="${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY > top && scrollY <= top + height);
      }
    });
  }

  // ======================== TYPING EFFECT ========================
  const typingPhrases = [
    'responsive web apps.',
    'beautiful user interfaces.',
    'clean semantic HTML5.',
    'modern CSS3 animations.',
    'interactive JavaScript.',
    'mobile-first designs.'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingEl = document.getElementById('typing-text');

  function typeEffect() {
    const currentPhrase = typingPhrases[phraseIndex];

    if (isDeleting) {
      typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 35 : 70;

    if (!isDeleting && charIndex === currentPhrase.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      speed = 400;
    }

    setTimeout(typeEffect, speed);
  }

  typeEffect();

  // ======================== SCROLL REVEAL (Intersection Observer) ========================
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || '0');
          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // ======================== ANIMATED COUNTERS ========================
  function animateCounters() {
    const counters = document.querySelectorAll('.counter-number');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isDecimal = counter.getAttribute('data-decimal') === 'true';
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;

        counter.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = isDecimal ? target.toFixed(2) : target;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // ======================== ANIMATED SKILL BARS ========================
  function animateSkillBars() {
    const progressBars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.getAttribute('data-width');
          entry.target.style.width = width + '%';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    progressBars.forEach(bar => observer.observe(bar));
  }

  // ======================== SKILL FILTERS ========================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      skillCards.forEach(card => {
        const show = filter === 'all' || card.getAttribute('data-category') === filter;
        card.style.display = show ? 'block' : 'none';
        if (show) {
          card.style.animation = 'fadeIn 0.45s ease forwards';
          // Re-trigger skill bar animation
          const bar = card.querySelector('.skill-progress');
          if (bar) {
            bar.style.width = '0%';
            setTimeout(() => {
              bar.style.width = bar.getAttribute('data-width') + '%';
            }, 100);
          }
        }
      });
    });
  });

  // ======================== COPY TO CLIPBOARD ========================
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(() => {
        showToast(`✅ Copied: ${text}`);
        btn.querySelector('i').className = 'fa-solid fa-check';
        setTimeout(() => {
          btn.querySelector('i').className = 'fa-regular fa-copy';
        }, 2000);
      });
    });
  });

  // ======================== CONTACT FORM ========================
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;

    // Button loading state
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      showToast(`🎉 Thank you, ${name}! Message sent successfully.`);
      contactForm.reset();
      submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
      submitBtn.disabled = false;
    }, 1500);
  });

  // ======================== RESUME DRAWER ========================
  const openDrawerBtn = document.getElementById('open-resume-drawer');
  const closeDrawerBtn = document.getElementById('close-resume-drawer');
  const resumeDrawer = document.getElementById('resume-drawer');
  const printResumeBtn = document.getElementById('print-resume-btn');

  function openResumeDrawer() { resumeDrawer.classList.add('active'); }
  function closeResumeDrawer() { resumeDrawer.classList.remove('active'); }

  if (openDrawerBtn) openDrawerBtn.addEventListener('click', openResumeDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeResumeDrawer);
  resumeDrawer.addEventListener('click', (e) => { if (e.target === resumeDrawer) closeResumeDrawer(); });
  printResumeBtn.addEventListener('click', () => window.print());

  // ======================== PROJECT MODAL ========================
  const projectModal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBody = document.getElementById('modal-body');

  document.querySelectorAll('.open-project-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      renderModalContent(btn.getAttribute('data-project'));
      projectModal.classList.add('active');
    });
  });

  modalCloseBtn.addEventListener('click', () => projectModal.classList.remove('active'));
  projectModal.addEventListener('click', (e) => { if (e.target === projectModal) projectModal.classList.remove('active'); });

  function renderModalContent(type) {
    if (type === 'surveillance') {
      modalBody.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.5rem; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-shield-halved" style="color: #3b82f6;"></i> Intelligent Surveillance System
          </h3>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Real-time detection console & monitoring dashboard</p>
        </div>
        
        <div style="background: rgba(0,0,0,0.45); padding: 1.4rem; border-radius: 14px; border: 1px solid var(--bg-card-border); margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <span style="font-size: 0.82rem; font-weight: 700; color: #10b981; display: flex; align-items: center; gap: 0.35rem;"><span style="width:8px;height:8px;background:#10b981;border-radius:50%;display:inline-block;box-shadow:0 0 8px #10b981;"></span> SYSTEM ACTIVE</span>
            <span style="font-size: 0.72rem; background: rgba(59,130,246,0.15); padding: 0.2rem 0.7rem; border-radius: 6px; color: #3b82f6; font-weight: 700;">Detection Rate: 99.4%</span>
          </div>
          <div style="height: 190px; background: linear-gradient(135deg, #0a0a0a, #111827); border-radius: 10px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; border: 1px solid #1f2937;">
            <div style="position: absolute; top: 10px; left: 10px; background: rgba(239,68,68,0.85); color: #fff; padding: 0.15rem 0.55rem; border-radius: 4px; font-size: 0.68rem; font-weight: 700; display: flex; align-items: center; gap: 0.3rem;"><span style="width:6px;height:6px;background:#fff;border-radius:50%;display:inline-block;animation:pulse 1.5s infinite;"></span> REC 1080p</div>
            <div style="position: absolute; top: 10px; right: 10px; font-size: 0.68rem; color: #6b7280; font-family: 'JetBrains Mono', monospace;">CAM-01 | 2026-08-12 18:45:23</div>
            <div style="width: 80px; height: 80px; border: 2px dashed #10b981; border-radius: 6px; position: relative; animation: scan 3s ease-in-out infinite;">
              <span style="position: absolute; top: -18px; left: 0; background: #10b981; color: #000; font-size: 0.62rem; font-weight: 800; padding: 0.1rem 0.4rem; border-radius: 2px; white-space: nowrap;">OBJECT DETECTED</span>
            </div>
            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #3b82f6, transparent); animation: scanLine 2.5s linear infinite;"></div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.5rem;">
          <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: 10px; text-align: center; border: 1px solid var(--bg-card-border);">
            <p style="font-size: 0.72rem; color: var(--text-dim); margin-bottom: 0.2rem;">Status</p>
            <p style="font-weight: 700; color: #10b981; font-size: 0.95rem;">Monitoring</p>
          </div>
          <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: 10px; text-align: center; border: 1px solid var(--bg-card-border);">
            <p style="font-size: 0.72rem; color: var(--text-dim); margin-bottom: 0.2rem;">Frame Rate</p>
            <p style="font-weight: 700; color: var(--accent-primary); font-size: 0.95rem;">60 FPS</p>
          </div>
          <div style="background: var(--bg-surface); padding: 0.85rem; border-radius: 10px; text-align: center; border: 1px solid var(--bg-card-border);">
            <p style="font-size: 0.72rem; color: var(--text-dim); margin-bottom: 0.2rem;">Alerts</p>
            <p style="font-weight: 700; color: var(--accent-secondary); font-size: 0.95rem;">0 Active</p>
          </div>
        </div>

        <button class="btn btn-glass btn-block" onclick="document.getElementById('project-modal').classList.remove('active')">
          <i class="fa-solid fa-xmark"></i> Close Demo
        </button>
      `;
    } else if (type === 'surveillance-details') {
      modalBody.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.5rem; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-diagram-project" style="color: #8b5cf6;"></i> System Architecture
          </h3>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Technical specifications for the Intelligent Surveillance Solution</p>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="display: flex; gap: 0.85rem; padding: 1rem; background: var(--bg-surface); border-radius: 12px; border: 1px solid var(--bg-card-border);">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(59,130,246,0.12); color: #3b82f6; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fa-solid fa-display"></i></div>
            <div>
              <strong style="font-size: 0.92rem;">Frontend Dashboard</strong>
              <p style="font-size: 0.82rem; color: var(--text-muted);">Responsive HTML5 & CSS3 monitoring interface with real-time status widgets</p>
            </div>
          </div>
          <div style="display: flex; gap: 0.85rem; padding: 1rem; background: var(--bg-surface); border-radius: 12px; border: 1px solid var(--bg-card-border);">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(139,92,246,0.12); color: #8b5cf6; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fa-solid fa-brain"></i></div>
            <div>
              <strong style="font-size: 0.92rem;">Detection Engine</strong>
              <p style="font-size: 0.82rem; color: var(--text-muted);">Algorithmic event triggers for movement and anomaly detection</p>
            </div>
          </div>
          <div style="display: flex; gap: 0.85rem; padding: 1rem; background: var(--bg-surface); border-radius: 12px; border: 1px solid var(--bg-card-border);">
            <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(16,185,129,0.12); color: #10b981; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"><i class="fa-solid fa-lock"></i></div>
            <div>
              <strong style="font-size: 0.92rem;">Security Protocol</strong>
              <p style="font-size: 0.82rem; color: var(--text-muted);">Encrypted streaming endpoints and role-based access control</p>
            </div>
          </div>
        </div>

        <button class="btn btn-glass btn-block" onclick="document.getElementById('project-modal').classList.remove('active')">
          <i class="fa-solid fa-xmark"></i> Close
        </button>
      `;
    } else if (type === 'portfolio-details') {
      modalBody.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.5rem; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-code" style="color: #06b6d4;"></i> Portfolio Tech Specification
          </h3>
          <p style="color: var(--text-muted); font-size: 0.88rem;">Under the hood of this portfolio website</p>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.88rem;">
            <i class="fa-solid fa-check-circle" style="color: #10b981;"></i>
            <span><strong>Vite</strong> — Ultra-fast module bundler for instant HMR development</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.88rem;">
            <i class="fa-solid fa-check-circle" style="color: #10b981;"></i>
            <span><strong>Canvas Particles</strong> — Real-time animated constellation background</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.88rem;">
            <i class="fa-solid fa-check-circle" style="color: #10b981;"></i>
            <span><strong>Glassmorphism</strong> — Frosted-glass UI with backdrop-filter blur</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.88rem;">
            <i class="fa-solid fa-check-circle" style="color: #10b981;"></i>
            <span><strong>3D Tilt Cards</strong> — Perspective-based hover micro-interactions</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.88rem;">
            <i class="fa-solid fa-check-circle" style="color: #10b981;"></i>
            <span><strong>Scroll Reveal</strong> — IntersectionObserver-powered entrance animations</span>
          </div>
          <div style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.88rem;">
            <i class="fa-solid fa-check-circle" style="color: #10b981;"></i>
            <span><strong>Dark/Light Themes</strong> — CSS variable-based dynamic theming</span>
          </div>
        </div>

        <button class="btn btn-glass btn-block" onclick="document.getElementById('project-modal').classList.remove('active')">
          <i class="fa-solid fa-xmark"></i> Close
        </button>
      `;
    }
  }

  // Add scanning animation keyframes dynamically
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes scan {
      0%, 100% { transform: translate(0, 0); }
      25% { transform: translate(20px, 10px); }
      50% { transform: translate(-15px, 20px); }
      75% { transform: translate(10px, -10px); }
    }
    @keyframes scanLine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `;
  document.head.appendChild(styleSheet);

  // ======================== BACK TO TOP ========================
  const backToTop = document.getElementById('back-to-top');
  const progressCircle = document.getElementById('progress-circle');
  const circumference = 2 * Math.PI * 16; // r=16

  function updateBackToTop() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollTop / docHeight;

    backToTop.classList.toggle('visible', scrollTop > 400);

    // Update SVG progress ring
    const offset = circumference - (progress * circumference);
    progressCircle.style.strokeDashoffset = offset;
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ======================== TOAST SYSTEM ========================
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  let toastTimer;

  function showToast(message) {
    toastMsg.textContent = message;
    toast.classList.add('active');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('active'), 3500);
  }

  // ======================== KEYBOARD SHORTCUTS ========================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      projectModal.classList.remove('active');
      resumeDrawer.classList.remove('active');
    }
  });

});
