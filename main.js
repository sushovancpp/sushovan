// ===============================================
// Modern Portfolio - Optimized JavaScript
// ===============================================

// ===== DOM ELEMENTS =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const navLinkElements = document.querySelectorAll('[data-nav-link]');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');
const sections = document.querySelectorAll('section[id]');

// ===== STATE MANAGEMENT =====
const state = {
  isMenuOpen: false,
  lastScrollTop: 0,
  notificationStylesInjected: false
};

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait = 10) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, wait = 16) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      func.apply(this, args);
    }
  };
}

// ===== CUSTOM CURSOR =====
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && cursorDot && cursorOutline) {
  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;
  let isHovering = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  // Smooth cursor outline animation
  function animateCursor() {
    const delay = 0.1;
    outlineX += (mouseX - outlineX) * delay;
    outlineY += (mouseY - outlineY) * delay;
    
    const scale = isHovering ? 1.5 : 1;
    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top = outlineY + 'px';
    cursorOutline.style.transform = `translate(-50%, -50%) scale(${scale})`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Cursor interactions - use event delegation
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .project-card, .skill-card, .gallery-item')) {
      isHovering = true;
    }
  });
  
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, .project-card, .skill-card, .gallery-item')) {
      isHovering = false;
    }
  });
}

// ===== MOBILE NAVIGATION =====
function toggleMenu(shouldOpen) {
  const isOpen = shouldOpen ?? !state.isMenuOpen;
  
  state.isMenuOpen = isOpen;
  navToggle?.classList.toggle('active', isOpen);
  navLinks?.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => toggleMenu());

  // Close menu when clicking on a link
  navLinkElements.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close menu when clicking outside (only if menu is open)
  document.addEventListener('click', (e) => {
    if (state.isMenuOpen && 
        !navLinks.contains(e.target) && 
        !navToggle.contains(e.target)) {
      toggleMenu(false);
    }
  });
}

// ===== ACTIVE NAV LINK ON SCROLL =====
function highlightNavigation() {
  const scrollY = window.pageYOffset;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinkElements.forEach(link => link.classList.remove('active'));
      navLink?.classList.add('active');
    }
  });
}

// ===== UNIFIED SCROLL HANDLER =====
function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Navbar scrolled class
  if (navbar) {
    navbar.classList.toggle('scrolled', scrollTop > 50);
    
    // Hide/show navbar on scroll (only if not at top)
    if (scrollTop > 200) {
      if (scrollTop > state.lastScrollTop) {
        navbar.style.transform = 'translateY(-100%)';
      } else {
        navbar.style.transform = 'translateY(0)';
      }
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    state.lastScrollTop = scrollTop;
  }
  
  // Back to top button
  if (backToTop) {
    backToTop.classList.toggle('show', scrollTop > 500);
  }
  
  // Active navigation highlighting
  highlightNavigation();
}

// Attach single scroll listener with throttle for performance
window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true });

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    if (href === '#' || href === '#hero') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ===== BACK TO TOP BUTTON =====
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll('[data-scroll-reveal]');

if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

// ===== HERO ANIMATIONS =====
const animateElements = document.querySelectorAll('[data-animate]');

if (animateElements.length > 0) {
  window.addEventListener('load', () => {
    animateElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, index * 100);
    });
  });
}

// ===== FORM HANDLING =====
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Validate
    if (!data.name || !data.email || !data.message) {
      showNotification('Please fill in all required fields.', 'error');
      return;
    }
    
    // Show success message
    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    
    // Reset form
    contactForm.reset();
    
    // In production, send to server
    console.log('Form data:', data);
  });
}

// ===== NOTIFICATION SYSTEM (FIXED) =====
function showNotification(message, type = 'info') {
  // Inject styles only once
  if (!state.notificationStylesInjected) {
    const style = document.createElement('style');
    style.setAttribute('data-notification-styles', '');
    style.textContent = `
      .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
      }
      
      .notification-success {
        border-left: 4px solid #22c55e;
      }
      
      .notification-error {
        border-left: 4px solid #ef4444;
      }
      
      .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-family: 'DM Sans', sans-serif;
        font-weight: 500;
      }
      
      .notification-success i {
        color: #22c55e;
        font-size: 1.25rem;
      }
      
      .notification-error i {
        color: #ef4444;
        font-size: 1.25rem;
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    state.notificationStylesInjected = true;
  }
  
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  const iconName = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${iconName}"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 4000);
}

// ===== SKILL CARD TILT EFFECT (FIXED) =====
const skillCards = document.querySelectorAll('.skill-card');

skillCards.forEach(card => {
  let isHovering = false;
  
  card.addEventListener('mouseenter', () => {
    isHovering = true;
  });
  
  card.addEventListener('mousemove', (e) => {
    if (!isHovering) return;
    
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    // Preserve the translateY hover effect from CSS
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    isHovering = false;
    // Remove inline transform to let CSS handle the hover state
    card.style.transform = '';
  });
});

// ===== PARALLAX EFFECT (FIXED - Only if elements exist) =====
const parallaxElements = document.querySelectorAll('[data-parallax]');

if (parallaxElements.length > 0) {
  const handleParallax = throttle(() => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.5;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }, 16);
  
  window.addEventListener('scroll', handleParallax, { passive: true });
}

// ===== LAZY LOADING IMAGES =====
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// ===== PROJECT CARD ANIMATIONS =====
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach((card, index) => {
  card.style.animationDelay = `${index * 0.1}s`;
});

// ===== FOOTER YEAR =====
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer-bottom p:first-child');
if (footerText) {
  footerText.innerHTML = footerText.innerHTML.replace('2024', currentYear);
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Skip to main content
const skipLink = document.createElement('a');
skipLink.href = '#hero';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
skipLink.style.cssText = `
  position: absolute;
  top: -40px;
  left: 0;
  background: #6366f1;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 10000;
  transition: top 0.2s;
`;

skipLink.addEventListener('focus', () => {
  skipLink.style.top = '0';
});

skipLink.addEventListener('blur', () => {
  skipLink.style.top = '-40px';
});

document.body.insertBefore(skipLink, document.body.firstChild);

// ===== PRELOADER (Optional) =====
window.addEventListener('load', () => {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 300);
    }, 500);
  }
});

// ===== CONSOLE MESSAGE =====
console.log('%c👋 Hello there!', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cWelcome to my portfolio! If you\'re checking the console, you must be curious about the code. Feel free to reach out if you want to collaborate!', 'font-size: 12px; color: #64748b;');
console.log('%c🚀 Built with HTML, CSS, and JavaScript', 'font-size: 12px; color: #22c55e;');

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
  console.error('An error occurred:', e.error);
});

// ===== INITIAL CALL =====
// Call handleScroll once on load to set initial state
handleScroll();

// ===== CLEANUP ON PAGE UNLOAD (Optional) =====
window.addEventListener('beforeunload', () => {
  // Clean up any resources if needed
  document.body.style.overflow = '';
});