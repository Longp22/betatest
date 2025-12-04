// Typing demo + reveal on scroll
document.addEventListener('DOMContentLoaded', () => {
  // Typing effect
  const el = document.getElementById('hero-typing');
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  if (el){
    const phrases = ['Hiền Tài Là Nguyên Khí Quốc Gia', 'Ươm mầm tri thức', 'Phát triển toàn diện'];
    let pi = 0, ci = 0, forward = true;
    el.classList.add('typing');
    el.appendChild(cursor);

    function step(){
      const text = phrases[pi];
      if (forward){
        el.childNodes[0] && (el.childNodes[0].nodeValue = text.slice(0, ci));
        ci++;
        if (ci > text.length){ forward = false; setTimeout(step, 1200); return; }
      } else {
        el.childNodes[0] && (el.childNodes[0].nodeValue = text.slice(0, ci));
        ci--;
        if (ci < 0){ forward = true; pi = (pi+1)%phrases.length; ci = 0; }
      }
      setTimeout(step, forward?100:40);
    }
    // initialize text node
    el.insertBefore(document.createTextNode(''), cursor);
    step();
  }

  // Reveal on scroll using IntersectionObserver
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length){
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    reveals.forEach(r => obs.observe(r));
  } else {
    // fallback: activate all
    reveals.forEach(r => r.classList.add('active'));
  }

  // small CTA entrance
  const cta = document.querySelector('.btn-primary');
  if (cta) setTimeout(()=> cta.classList.add('cta-pulse'), 900);
});

// Note: minimal lightbox removed to avoid duplicate overlay creation.
// The enhanced gallery/lightbox implementation below handles .lightbox-trigger elements,
// supports gallery groups and keyboard navigation.

// Enhance lightbox to support gallery groups and keyboard navigation
(function(){
  // Find all lightbox trigger elements and group by data-gallery
  const triggers = Array.from(document.querySelectorAll('.lightbox-trigger'));
  const galleries = {};
  triggers.forEach(el => {
    const g = el.dataset.gallery || '_default';
    if (!galleries[g]) galleries[g] = [];
    galleries[g].push(el);
  });

  function openGallery(galleryName, index){
    const items = galleries[galleryName] || [];
    if (!items.length || index < 0 || index >= items.length) return;
    const src = items[index].dataset.full || items[index].getAttribute('href') || items[index].src;
    if (!src) return;
    const ov = document.createElement('div'); ov.className = 'lightbox-overlay';
    const img = document.createElement('img'); img.src = src; img.alt = items[index].alt || '';
    const close = document.createElement('button'); close.className='lightbox-close'; close.innerHTML='✕';
    const nav = document.createElement('div'); nav.className='lightbox-nav';
    const prevBtn = document.createElement('button'); prevBtn.innerHTML='◀';
    const nextBtn = document.createElement('button'); nextBtn.innerHTML='▶';
    nav.appendChild(prevBtn); nav.appendChild(nextBtn);
    ov.appendChild(img); ov.appendChild(close); ov.appendChild(nav);
    document.body.appendChild(ov);
    // force paint then open
    requestAnimationFrame(()=> ov.classList.add('open'));
    let current = index;

    function show(i){
      if (i<0) i = items.length-1; if (i>=items.length) i = 0;
      current = i;
      // fade out, change src, then fade in
      img.style.opacity = '0';
      setTimeout(()=>{
        img.src = items[current].dataset.full || items[current].getAttribute('href') || items[current].src;
        // preload neighbors
        const nextI = (current+1)%items.length; const prevI = (current-1+items.length)%items.length;
        const p1 = new Image(); p1.src = items[nextI].dataset.full || items[nextI].getAttribute('href') || items[nextI].src;
        const p2 = new Image(); p2.src = items[prevI].dataset.full || items[prevI].getAttribute('href') || items[prevI].src;
        setTimeout(()=> img.style.opacity='1', 50);
      }, 180);
    }

    function remove(){
      ov.classList.remove('open');
      setTimeout(()=>{ ov.remove(); document.body.style.overflow=''; }, 280);
      window.removeEventListener('keydown', onKey);
    }
    function onKey(e){
      if (e.key === 'Escape') remove();
      if (e.key === 'ArrowLeft') show(current-1);
      if (e.key === 'ArrowRight') show(current+1);
    }

    prevBtn.addEventListener('click', (ev)=>{ ev.stopPropagation(); show(current-1); });
    nextBtn.addEventListener('click', (ev)=>{ ev.stopPropagation(); show(current+1); });
    close.addEventListener('click', remove);
    ov.addEventListener('click', (ev)=>{ if (ev.target===ov) remove(); });
    window.addEventListener('keydown', onKey);
    document.body.style.overflow='hidden';
  }

  // delegate click to open gallery-aware overlay
  document.addEventListener('click', function(e){
    const t = e.target.closest && e.target.closest('.lightbox-trigger');
    if (!t) return;
    const gallery = t.dataset.gallery || '_default';
    const list = galleries[gallery] || [];
    const idx = list.indexOf(t);
    if (idx === -1) return;
    e.preventDefault();
    openGallery(gallery, idx);
  });
})();

// Back-to-top button behavior
(function(){
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  function onScroll(){
    if (window.scrollY > 300) btn.classList.add('visible'); else btn.classList.remove('visible');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', (e)=>{ e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
  // init
  onScroll();
})();

// Ripple effect on button/link click
(function(){
  function addRipple(e){
    if (e.button && e.button !== 0) return; // ignore right-click
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  // Apply ripple to all buttons, .btn, primary buttons, nav links, and bordered link buttons
  const rippleTargets = document.querySelectorAll('button, .btn, .btn-primary, .bg-sky-600, header nav a, nav a, a[class*="border"], .lightbox-close, .lightbox-nav button');
  rippleTargets.forEach(el => {
    el.classList.add('ripple-effect');
    el.addEventListener('mousedown', addRipple);
  });
})();

// Mobile menu toggle
(function(){
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) { console.log('mobile menu: button or menu not found', !!btn, !!menu); return; }
  console.log('mobile menu init', btn.id, menu.id);
  btn.addEventListener('click', ()=>{
    // toggle both Tailwind 'hidden' and our fallback 'show' class
    menu.classList.toggle('hidden');
    menu.classList.toggle('show');
    if (menu.classList.contains('show')) menu.style.display = 'block'; else menu.style.display = '';
    console.log('mobile menu toggled, show=', menu.classList.contains('show'));
  });
  // Close menu when clicking a link
  menu.addEventListener('click', (e)=>{
    if (e.target.tagName === 'A') menu.classList.add('hidden');
  });
})();
