(function(){
  // ---------- header scroll ----------
  const topbar = document.getElementById('topbar');
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => {
    topbar.classList.toggle('scrolled', window.scrollY > 30);
    backTop.classList.toggle('show', window.scrollY > 500);
  });
  backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  // ---------- mobile menu ----------
  const menuBtn = document.getElementById('menuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  menuBtn.addEventListener('click', () => mobileMenu.classList.add('open'));
  closeMenuBtn.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

  // ---------- active nav link on scroll ----------
  const navLinks = document.querySelectorAll('#navTabs a');
  const sections = Array.from(navLinks).map(a => document.querySelector(a.getAttribute('href')));
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const id = '#' + entry.target.id;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
      }
    });
  }, {rootMargin:'-45% 0px -50% 0px'});
  sections.forEach(s => s && navObserver.observe(s));

  // ---------- reveal on scroll ----------
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ---------- portfolio filter ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projCards = document.querySelectorAll('.proj-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      projCards.forEach(card => {
        const show = f === 'all' || card.dataset.cat === f;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  // ---------- resume tabs ----------
  const rTabs = document.querySelectorAll('.r-tab');
  const rPanels = document.querySelectorAll('.r-panel');
  rTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      rTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      rPanels.forEach(p => p.classList.toggle('active', p.id === tab.dataset.tab));
      if(tab.dataset.tab === 'skill') animateSkills();
    });
  });

  // ---------- skill bars ----------
  let skillsAnimated = false;
  function animateSkills(){
    if(skillsAnimated) return;
    skillsAnimated = true;
    document.querySelectorAll('.sb-fill').forEach(fill => {
      fill.style.width = fill.dataset.w + '%';
    });
  }
  // also trigger when resume section scrolls into view (in case skills tab opened directly)
  const resumeSection = document.getElementById('resume');
  new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateSkills();
        obs.disconnect();
      }
    });
  }, {threshold:0.3}).observe(resumeSection);

  // ---------- testimonial carousel ----------
  const slides = document.querySelectorAll('.testi-slide');
  const dots = document.querySelectorAll('.testi-dots button');
  let current = 0;
  function showSlide(i){
    slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    dots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    current = i;
  }
  dots.forEach(dot => dot.addEventListener('click', () => showSlide(parseInt(dot.dataset.i))));
  setInterval(() => showSlide((current + 1) % slides.length), 5000);

  // ---------- contact form (demo only, no backend) ----------
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    note.classList.add('show');
    form.reset();
    setTimeout(() => note.classList.remove('show'), 4000);
  });

  // ---------- smooth scroll offset (account for fixed header) ----------
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if(target){
        e.preventDefault();
        const offset = window.innerWidth < 1024 ? 20 : 90;
        window.scrollTo({top: target.offsetTop - offset, behavior:'smooth'});
      }
    });
  });
})();