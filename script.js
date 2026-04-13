/* ===========================
   CUSTOM CURSOR
   =========================== */
const cursor     = document.getElementById('cursor');
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0;
let glowX  = 0, glowY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth glow follow
function animateGlow() {
  glowX += (mouseX - glowX) * 0.12;
  glowY += (mouseY - glowY) * 0.12;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top  = glowY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();

// Hover state on interactive elements
document.querySelectorAll('a, button, .skill-card, .cert-card, .timeline-card, .edu-card, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hovering');
    cursorGlow.classList.add('hovering');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hovering');
    cursorGlow.classList.remove('hovering');
  });
});

/* ===========================
   NAVIGATION
   =========================== */
const nav        = document.getElementById('nav');
const navToggle  = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks   = document.querySelectorAll('.nav-link');
const sections   = document.querySelectorAll('section[id]');

// Scroll effects
window.addEventListener('scroll', () => {
  // Add scrolled class
  nav.classList.toggle('scrolled', window.scrollY > 50);

  // Active nav link
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 200) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  // Animate hamburger → X
  const spans = navToggle.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

function closeMobile() {
  mobileMenu.classList.remove('open');
  const spans = navToggle.querySelectorAll('span');
  spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
}

/* ===========================
   PARTICLE CANVAS
   =========================== */
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');

let particles = [];
let W, H;
let mouse = { x: -999, y: -999 };

function resizeCanvas() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}

window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});
canvas.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r  = Math.random() * 2 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.2;
  }

  update() {
    // Mouse repulsion
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 100) {
      const force = (100 - dist) / 100;
      this.vx += (dx / dist) * force * 0.5;
      this.vy += (dy / dist) * force * 0.5;
    }

    // Speed limit
    const speed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
    if (speed > 2) { this.vx = (this.vx/speed)*2; this.vy = (this.vy/speed)*2; }

    // Friction
    this.vx *= 0.99;
    this.vy *= 0.99;

    this.x += this.vx;
    this.y += this.vy;

    // Bounce off edges
    if (this.x < 0 || this.x > W) { this.vx *= -1; this.x = Math.max(0, Math.min(W, this.x)); }
    if (this.y < 0 || this.y > H) { this.vy *= -1; this.y = Math.max(0, Math.min(H, this.y)); }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(0,212,255,${this.alpha})`;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.floor((W * H) / 12000);
  particles = Array.from({ length: Math.min(count, 100) }, () => new Particle());
}

function drawConnections() {
  const maxDist = 150;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i+1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < maxDist) {
        const alpha = (1 - dist/maxDist) * 0.25;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}

resizeCanvas();
initParticles();
animateParticles();

/* ===========================
   TYPEWRITER EFFECT
   =========================== */
const typeEl  = document.getElementById('typewriter');
const phrases = [
  'Frontend Developer',
  'Digital Marketer',
  'IT Specialist',
  'Digital Nomad',
  'Content Creator',
  'Print on Demand Seller',
  'WordPress Developer',
  'UI/UX Enthusiast',
  'Online Entrepreneur',
];
let phraseIdx = 0;
let charIdx   = 0;
let deleting  = false;
let typingTimeout;

function type() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    typeEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      typingTimeout = setTimeout(type, 2000);
      return;
    }
  } else {
    typeEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingTimeout = setTimeout(type, 300);
      return;
    }
  }
  typingTimeout = setTimeout(type, deleting ? 50 : 80);
}

setTimeout(type, 1000);

/* ===========================
   SCROLL REVEAL
   =========================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
        // Trigger skill bar animation when skill cards appear
        const fill = entry.target.querySelector('.skill-fill');
        if (fill) {
          const w = fill.getAttribute('data-w');
          fill.style.width = w + '%';
        }
      }, i * 60);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-up').forEach(el => {
  revealObserver.observe(el);
});

/* ===========================
   HERO ELEMENTS — trigger immediately
   =========================== */
window.addEventListener('load', () => {
  document.querySelectorAll('#hero .reveal-up').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
  });
});

/* ===========================
   SKILLS FILTER
   =========================== */
const filterBtns  = document.querySelectorAll('.filter-btn');
const skillCards  = document.querySelectorAll('.skill-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    skillCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      const show = filter === 'all' || cat === filter;

      if (show) {
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
        // Re-animate skill bar
        const fill = card.querySelector('.skill-fill');
        if (fill) {
          fill.style.width = '0';
          setTimeout(() => { fill.style.width = fill.getAttribute('data-w') + '%'; }, 50);
        }
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });
  });
});

/* ===========================
   CONTACT FORM
   =========================== */
const form        = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const btnLabel    = submitBtn.querySelector('.btn-label');
const btnLoader   = document.getElementById('btnLoader');
const btnIcon     = submitBtn.querySelector('.btn-icon');
const formSuccess = document.getElementById('formSuccess');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setError(inputId, errId, show) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errId);
  if (show) {
    input.classList.add('error');
    err.classList.add('show');
  } else {
    input.classList.remove('error');
    err.classList.remove('show');
  }
}

// Clear error on input
['fname','femail','fsubject','fmessage'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    document.getElementById(id).classList.remove('error');
    const errMap = { fname:'fnameErr', femail:'femailErr', fsubject:'fsubjectErr', fmessage:'fmessageErr' };
    document.getElementById(errMap[id]).classList.remove('show');
  });
});

form.addEventListener('submit', e => {
  e.preventDefault();

  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const subject = document.getElementById('fsubject').value.trim();
  const message = document.getElementById('fmessage').value.trim();

  let valid = true;

  if (!name)             { setError('fname',    'fnameErr',    true); valid = false; } else { setError('fname','fnameErr',false); }
  if (!validateEmail(email)) { setError('femail','femailErr',true); valid = false; } else { setError('femail','femailErr',false); }
  if (!subject)          { setError('fsubject', 'fsubjectErr', true); valid = false; } else { setError('fsubject','fsubjectErr',false); }
  if (!message)          { setError('fmessage', 'fmessageErr', true); valid = false; } else { setError('fmessage','fmessageErr',false); }

  if (!valid) return;

  // Simulate sending
  btnLabel.style.opacity = '0';
  btnIcon.style.display  = 'none';
  btnLoader.style.display = 'block';
  submitBtn.disabled = true;

  setTimeout(() => {
    btnLoader.style.display = 'none';
    btnLabel.style.opacity  = '1';
    btnIcon.style.display   = '';
    submitBtn.disabled = false;
    formSuccess.classList.remove('hidden');

    // Open mailto as fallback
    const mailto = `mailto:omaramhaoud@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailto;

    // Reset form
    form.reset();
    setTimeout(() => formSuccess.classList.add('hidden'), 6000);
  }, 1500);
});

/* ===========================
   SMOOTH ANCHOR OFFSET (for fixed nav)
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});
