// Scroll-reveal: fade sections and cards in as they enter the viewport.
(function () {
  var targets = document.querySelectorAll('main section, .card');
  targets.forEach(function (el) { el.classList.add('reveal'); });

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(function (el) { observer.observe(el); });
})();

// Scroll progress bar, nav shadow, and back-to-top button.
(function () {
  var progress = document.getElementById('progress');
  var nav = document.getElementById('nav');
  var toTop = document.getElementById('to-top');
  if (!progress || !nav || !toTop) return;

  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = pct + '%';
    nav.classList.toggle('scrolled', window.scrollY > 8);
    toTop.classList.toggle('show', window.scrollY > 600);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// Center sections in the viewport when jumping via nav/footer tabs.
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var rect = target.getBoundingClientRect();
      var top = window.scrollY + rect.top - 84;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      history.pushState(null, '', id);
    });
  });
})();

// Lightbox: click a project photo to view a larger version.
(function () {
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCaption = document.getElementById('lightbox-caption');
  var closeBtn = document.getElementById('lightbox-close');
  if (!lightbox || !lightboxImg) return;

  function openSrc(src, alt, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxCaption.textContent = caption || alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function openLightbox(img) {
    var caption = '';
    var wrap = img.closest('.project-img, .hero-photo');
    if (wrap) {
      var cap = wrap.classList.contains('hero-photo') ? wrap.querySelector('figcaption') : wrap.nextElementSibling;
      if (cap && (cap.classList.contains('caption') || cap.tagName === 'FIGCAPTION')) caption = cap.textContent;
    }
    openSrc(img.src, img.alt, caption);
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-img img, .hero-photo img').forEach(function (img) {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Enlarge photo: ' + img.alt);
    img.addEventListener('click', function () { openLightbox(img); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(img); }
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Clickable cards (e.g. education box): pop up the linked photo.
  document.querySelectorAll('[data-full]').forEach(function (card) {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    function activate() { openSrc(card.getAttribute('data-full'), card.getAttribute('data-caption') || '', card.getAttribute('data-caption') || ''); }
    card.addEventListener('click', activate);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
})();
