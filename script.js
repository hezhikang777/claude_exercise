// ========== Typewriter Effect ==========
const typewriter = document.getElementById('typewriter');
const roles = [
  '全栈开发者',
  'UI/UX 设计师',
  '开源爱好者',
  '终身学习者',
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
  const current = roles[roleIndex];

  if (isDeleting) {
    typewriter.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50;
  } else {
    typewriter.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 100;
  }

  if (!isDeleting && charIndex === current.length) {
    typeSpeed = 2000; // Pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typeSpeed = 500; // Pause before typing next
  }

  setTimeout(typeEffect, typeSpeed);
}

// Start typewriter after a slight delay
setTimeout(typeEffect, 1000);

// ========== Navbar Scroll Effect ==========
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

function updateNavbar() {
  const scrollY = window.scrollY;

  // Navbar background
  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back to top
  if (scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  sections.forEach((section) => {
    const top = section.offsetTop - 150;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);

    if (link && scrollY >= top && scrollY < bottom) {
      document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateNavbar, { passive: true });

// ========== Mobile Nav Toggle ==========
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// ========== Back to Top ==========
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== Scroll Reveal ==========
function setupReveal() {
  const elements = document.querySelectorAll(
    '.skill-card, .project-card, .about-image, .about-text, .contact-info, .contact-form'
  );
  elements.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Animate skill bars when visible
          const progressBar = entry.target.querySelector('.skill-progress');
          if (progressBar) {
            setTimeout(() => progressBar.classList.add('animate'), 200);
          }
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

setupReveal();

// ========== Counter Animation ==========
function animateCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const duration = 2000;
          const startTime = performance.now();

          function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target);
            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              el.textContent = target + (target >= 30 ? '+' : '');
            }
          }

          requestAnimationFrame(update);
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => counterObserver.observe(el));
}

animateCounters();

// ========== Project Filter ==========
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    // Filter cards with animation
    projectCards.forEach((card) => {
      const category = card.getAttribute('data-category');

      if (filter === 'all' || category === filter) {
        card.classList.remove('hidden');
        // Trigger re-animation
        card.style.animation = 'none';
        card.offsetHeight; // Force reflow
        card.style.animation = '';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ========== Contact Form ==========
const contactForm = document.getElementById('contactForm');

function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => toast.classList.add('show'));

  // Remove after delay
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showToast('请填写必要的字段', 'error');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('请输入有效的邮箱地址', 'error');
    return;
  }

  // Simulate sending (replace with actual API call)
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalHTML = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
  submitBtn.disabled = true;

  setTimeout(() => {
    showToast('消息已发送！感谢你的联系 🎉', 'success');
    contactForm.reset();
    submitBtn.innerHTML = originalHTML;
    submitBtn.disabled = false;
  }, 1500);
});

// ========== Parallax Effect on Hero ==========
const heroBg = document.querySelector('.hero-bg');

window.addEventListener(
  'mousemove',
  (e) => {
    if (!heroBg) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    heroBg.style.transform = `translate(${x}px, ${y}px)`;
  },
  { passive: true }
);

// ========== Smooth anchor scrolling (fallback) ==========
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ========== Keyboard shortcut: ESC closes mobile menu ==========
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('active')) {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
});
