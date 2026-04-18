// ================================================
//   IRONPEAK GYM — script.js  (v2)
// ================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---- CUSTOM CURSOR ---- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx+'px'; cursor.style.top = my+'px'; });
  (function animateCursor(){ fx+=(mx-fx)*0.12; fy+=(my-fy)*0.12; follower.style.left=fx+'px'; follower.style.top=fy+'px'; requestAnimationFrame(animateCursor); })();
  document.querySelectorAll('a,button,.program-card,.trainer-card,.pricing-card,.gallery-item').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ cursor.style.transform='translate(-50%,-50%) scale(2)'; follower.style.transform='translate(-50%,-50%) scale(1.5)'; follower.style.opacity='0.3'; });
    el.addEventListener('mouseleave',()=>{ cursor.style.transform='translate(-50%,-50%) scale(1)'; follower.style.transform='translate(-50%,-50%) scale(1)'; follower.style.opacity='0.6'; });
  });

  /* ---- NAVBAR ---- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));
  hamburger.addEventListener('click', () => { hamburger.classList.toggle('open'); navLinks.classList.toggle('open'); document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : ''; });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { hamburger.classList.remove('open'); navLinks.classList.remove('open'); document.body.style.overflow = ''; }));

  /* ---- COUNTER ---- */
  let counted = false;
  function animateCounters() {
    if (counted) return;
    const el = document.querySelector('.hero-stats');
    if (!el) return;
    if (el.getBoundingClientRect().top < window.innerHeight) {
      counted = true;
      document.querySelectorAll('.stat-num').forEach(counter => {
        const target = +counter.dataset.target;
        let current = 0; const step = target / 60;
        const timer = setInterval(() => { current += step; if (current >= target) { current = target; clearInterval(timer); } counter.textContent = Math.floor(current).toLocaleString(); }, 25);
      });
    }
  }
  window.addEventListener('scroll', animateCounters);
  animateCounters();

  /* ---- SLIDER ---- */
  const track = document.getElementById('track');
  const dotsContainer = document.getElementById('dots');
  const cards = document.querySelectorAll('.testimonial-card');
  let currentSlide = 0;
  const visibleSlides = window.innerWidth < 768 ? 1 : 2;
  const maxDots = cards.length - visibleSlides + 1;
  for (let i = 0; i < maxDots; i++) {
    const dot = document.createElement('button'); dot.classList.add('dot-btn'); if (i===0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i)); dotsContainer.appendChild(dot);
  }
  function goToSlide(n) {
    currentSlide = Math.max(0, Math.min(n, maxDots-1));
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    document.querySelectorAll('.dot-btn').forEach((d,i) => d.classList.toggle('active', i===currentSlide));
  }
  document.getElementById('prevBtn').addEventListener('click', () => goToSlide(currentSlide - 1));
  document.getElementById('nextBtn').addEventListener('click', () => goToSlide(currentSlide + 1));
  setInterval(() => goToSlide((currentSlide + 1) % maxDots), 5000);

  /* ---- PRICING TOGGLE ---- */
  const toggleSwitch = document.getElementById('toggleSwitch');
  const monthlyLabel = document.getElementById('monthlyLabel');
  const annualLabel = document.getElementById('annualLabel');
  let isAnnual = false;
  toggleSwitch.addEventListener('click', () => {
    isAnnual = !isAnnual;
    toggleSwitch.classList.toggle('on', isAnnual);
    monthlyLabel.classList.toggle('active', !isAnnual);
    annualLabel.classList.toggle('active', isAnnual);
    document.querySelectorAll('.monthly-price').forEach(el => el.style.display = isAnnual ? 'none' : 'inline');
    document.querySelectorAll('.annual-price').forEach(el => el.style.display = isAnnual ? 'inline' : 'none');
  });

  /* ---- BMI CALCULATOR ---- */
  document.getElementById('calcBmi').addEventListener('click', () => {
    const height = parseFloat(document.getElementById('heightInput').value);
    const weight = parseFloat(document.getElementById('weightInput').value);
    if (!height || !weight || height < 50 || weight < 10) { showToast('Please enter valid height and weight values.', 'error'); return; }
    const bmi = weight / Math.pow(height / 100, 2);
    const rounded = Math.round(bmi * 10) / 10;
    let category, advice, pos;
    if (bmi < 18.5) { category='Underweight'; advice='💡 Our Strength & Power program can help you build healthy muscle mass.'; pos=Math.min((bmi/18.5)*25,25); }
    else if (bmi < 25) { category='Normal Weight ✓'; advice='🔥 You\'re in great shape! Our Pro membership will help you maintain and level up.'; pos=25+((bmi-18.5)/6.5)*25; }
    else if (bmi < 30) { category='Overweight'; advice='🏃 Our HIIT & Body Transformation programs are perfect for your goals.'; pos=50+((bmi-25)/5)*25; }
    else { category='Obese'; advice='❤️ Our trainers specialize in safe, effective weight loss. Start with a free trial!'; pos=Math.min(75+((bmi-30)/10)*25,98); }
    document.getElementById('bmiScore').textContent = rounded;
    document.getElementById('bmiCategory').textContent = category;
    document.getElementById('bmiAdvice').textContent = advice;
    document.getElementById('bmiIndicator').style.left = pos + '%';
    document.getElementById('bmiResult').classList.add('visible');
  });
  ['heightInput','weightInput'].forEach(id => document.getElementById(id).addEventListener('keydown', e => { if(e.key==='Enter') document.getElementById('calcBmi').click(); }));

  /* ---- CONTACT FORM ---- */
  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const orig = btn.innerHTML; btn.textContent = 'SENDING...'; btn.disabled = true;
    setTimeout(() => {
      document.getElementById('formSuccess').style.display = 'block';
      e.target.reset(); btn.innerHTML = orig; btn.disabled = false;
      setTimeout(() => { document.getElementById('formSuccess').style.display = 'none'; }, 5000);
    }, 1500);
  });

  /* ---- GALLERY FILTER ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const cat = item.dataset.cat;
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeUp 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ---- LIGHTBOX ---- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  let lightboxImages = [];
  let lightboxIndex = 0;

  function buildLightboxImages() {
    lightboxImages = [];
    document.querySelectorAll('.gallery-item:not(.hidden)').forEach(item => {
      const img = item.querySelector('img');
      const cap = item.querySelector('.gallery-overlay span');
      lightboxImages.push({ src: img.src, caption: cap ? cap.textContent : '' });
    });
  }

  function openLightbox(idx) {
    buildLightboxImages();
    lightboxIndex = idx;
    showLightboxImage();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function showLightboxImage() {
    const item = lightboxImages[lightboxIndex];
    if (!item) return;
    lightboxImg.src = item.src;
    lightboxCaption.textContent = item.caption;
  }

  galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      // Get index among visible items only
      const visible = Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));
      const visIdx = visible.indexOf(item);
      openLightbox(visIdx >= 0 ? visIdx : 0);
    });
  });

  document.getElementById('lightboxClose').addEventListener('click', () => { lightbox.classList.remove('open'); document.body.style.overflow = ''; });
  document.getElementById('lightboxBackdrop').addEventListener('click', () => { lightbox.classList.remove('open'); document.body.style.overflow = ''; });
  document.getElementById('lightboxPrev').addEventListener('click', () => { lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length; showLightboxImage(); });
  document.getElementById('lightboxNext').addEventListener('click', () => { lightboxIndex = (lightboxIndex + 1) % lightboxImages.length; showLightboxImage(); });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') { lightbox.classList.remove('open'); document.body.style.overflow = ''; }
    if (e.key === 'ArrowLeft') { lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length; showLightboxImage(); }
    if (e.key === 'ArrowRight') { lightboxIndex = (lightboxIndex + 1) % lightboxImages.length; showLightboxImage(); }
  });

  /* ---- SCROLL REVEAL ---- */
  const revealEls = document.querySelectorAll('.program-card,.trainer-card,.pricing-card,.award-card,.milestone,.gallery-item,.feature-item,.contact-item');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.style.opacity='1'; entry.target.style.transform='translateY(0)'; revealObs.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el, i) => {
    el.style.opacity='0'; el.style.transform='translateY(28px)';
    el.style.transition=`opacity 0.5s ease ${(i%5)*0.08}s,transform 0.5s ease ${(i%5)*0.08}s`;
    revealObs.observe(el);
  });

  const headerObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; headerObs.unobserve(e.target); } });
  }, { threshold:0.2 });
  document.querySelectorAll('.section-header,.about-text,.bmi-text,.contact-info,.milestones-header,.press-section').forEach(el => {
    el.style.opacity='0'; el.style.transform='translateY(24px)'; el.style.transition='opacity 0.7s ease,transform 0.7s ease';
    headerObs.observe(el);
  });

  /* ---- PROGRAM CARD TILT ---- */
  document.querySelectorAll('.program-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * 5;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * -5;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ---- PARALLAX HERO GRID ---- */
  const heroGrid = document.querySelector('.hero-grid');
  window.addEventListener('scroll', () => { if(heroGrid) heroGrid.style.transform=`translateY(${window.scrollY*0.25}px)`; });

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' }); }
    });
  });

  /* ---- TOAST ---- */
  function showToast(msg, type='info') {
    const t = document.createElement('div');
    t.style.cssText=`position:fixed;bottom:32px;right:32px;background:${type==='error'?'#e53935':'var(--accent)'};color:${type==='error'?'#fff':'#000'};padding:14px 24px;border-radius:4px;font-family:var(--font-body);font-size:0.9rem;font-weight:600;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.4);animation:fadeUp 0.3s ease`;
    t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),3500);
  }

  console.log('%c⚡ IRONPEAK GYM v2', 'color:#e8ff00;font-size:22px;font-weight:bold;');
  console.log('%cNow with real images, gallery & achievements 🏆', 'color:#888;font-size:12px;');
});