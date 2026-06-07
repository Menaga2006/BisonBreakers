const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = document.querySelectorAll('.nav-links a');
const reveals = document.querySelectorAll('.reveal');
const galleryItems = document.querySelectorAll('.gallery-item');
const livePhotos = document.querySelectorAll('.live-photo');
const heroSection = document.getElementById('heroSection');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.querySelector('.lightbox-close');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const year = document.getElementById('year');

const applyLiveImages = () => {
  const timestamp = Date.now();
  const createLiveUrl = (size, query, seed) => {
    const [width, height] = size.split('x');
    const tags = query
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .join(',');
    return `https://loremflickr.com/${width}/${height}/${tags}?lock=${seed}`;
  };

  livePhotos.forEach((photo, index) => {
    const query = photo.dataset.liveQuery;
    const size = photo.dataset.liveSize || '900x650';
    if (!query) return;
    const fallbackSrc = photo.getAttribute('src');
    const liveSrc = createLiveUrl(size, query, timestamp + index);

    photo.onerror = () => {
      if (fallbackSrc) {
        photo.src = fallbackSrc;
      }
    };
    photo.src = liveSrc;
  });

  if (heroSection) {
    const heroQuery = heroSection.dataset.liveBgQuery || 'construction,demolition';
    const liveHero = createLiveUrl('1800x1100', heroQuery, timestamp + 999);
    const preload = new Image();
    preload.onload = () => {
      heroSection.style.backgroundImage =
        `linear-gradient(120deg, rgba(6, 10, 18, 0.82), rgba(9, 16, 29, 0.75)), url("${liveHero}")`;
    };
    preload.src = liveHero;
  }
};

const enableLiveImages = document.body.dataset.liveImages === 'true';
if (enableLiveImages) {
  applyLiveImages();
}

if (year) {
  year.textContent = new Date().getFullYear();
}

if (scrollTopBtn) {
  const toggleTopButton = () => {
    if (window.scrollY > 320) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  };

  toggleTopButton();
  window.addEventListener('scroll', toggleTopButton, { passive: true });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navAnchors.forEach((anchor) => {
    anchor.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach((item) => revealObserver.observe(item));

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    lightboxImage.src = item.src;
    lightboxImage.alt = item.alt;
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

const closeLightbox = () => {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
  document.body.style.overflow = '';
};

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('name');
  const phone = document.getElementById('phone');
  const message = document.getElementById('message');

  const trimmedName = name.value.trim();
  const trimmedPhone = phone.value.trim();
  const trimmedMessage = message.value.trim();

  if (!trimmedName || !trimmedPhone || !trimmedMessage) {
    formStatus.textContent = 'Please fill in all fields.';
    formStatus.style.color = '#ff8a8a';
    return;
  }

  if (!/^\d{10}$/.test(trimmedPhone)) {
    formStatus.textContent = 'Please enter a valid 10-digit phone number.';
    formStatus.style.color = '#ff8a8a';
    return;
  }

  formStatus.textContent = 'Thank you! We will contact you soon.';
  formStatus.style.color = '#ffd700';
  contactForm.reset();
});
