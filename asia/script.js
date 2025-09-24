// ===== Slider Config =====
const AUTO_INTERVAL_MS = 1000; // ganti gambar tiap 1 detik

const hero = document.getElementById('hero');
const slides = Array.from(hero.querySelectorAll('.slide'));
const prevBtn = hero.querySelector('.arrow--prev');
const nextBtn = hero.querySelector('.arrow--next');
const dotsWrap = hero.querySelector('.dots');

let idx = 0, timer = null, isPaused = false;

// Build dots
slides.forEach((_, i) => {
  const b = document.createElement('button');
  b.className = 'dot' + (i===0 ? ' active' : '');
  b.setAttribute('aria-label', 'Ke slide ' + (i+1));
  b.addEventListener('click', () => go(i, true));
  dotsWrap.appendChild(b);
});
const dots = Array.from(dotsWrap.children);

function go(n, user=false){
  slides[idx].classList.remove('active');
  dots[idx].classList.remove('active');
  idx = (n + slides.length) % slides.length;
  slides[idx].classList.add('active');
  dots[idx].classList.add('active');
  if(user) restart();
}
const next = () => go(idx+1);
const prev = () => go(idx-1);

function start(){ if(timer) clearInterval(timer); timer = setInterval(() => { if(!isPaused) next(); }, AUTO_INTERVAL_MS); }
function restart(){ start(); }

nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);

// Pause saat hover/focus
hero.addEventListener('mouseenter', () => isPaused = true);
hero.addEventListener('mouseleave', () => isPaused = false);
hero.addEventListener('focusin',  () => isPaused = true);
hero.addEventListener('focusout', () => isPaused = false);

// Keyboard
window.addEventListener('keydown', (e)=>{
  if(e.key==='ArrowRight') next();
  if(e.key==='ArrowLeft')  prev();
});

// Swipe (mobile)
let sx=0, sy=0;
hero.addEventListener('touchstart', e=>{ sx=e.touches[0].clientX; sy=e.touches[0].clientY; }, {passive:true});
hero.addEventListener('touchend', e=>{
  const dx = e.changedTouches[0].clientX - sx;
  const dy = e.changedTouches[0].clientY - sy;
  if(Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30){ dx < 0 ? next() : prev(); }
}, {passive:true});

// Autoplay
start();


// ===== Search Drawer =====
const drawer = document.getElementById('searchDrawer');
const btnSearch = document.getElementById('btnSearch');
const btnClose = document.getElementById('btnCloseSearch');

function openDrawer(){ drawer.setAttribute('aria-hidden','false'); }
function closeDrawer(){ drawer.setAttribute('aria-hidden','true'); }

btnSearch.addEventListener('click', openDrawer);
btnClose.addEventListener('click', closeDrawer);
drawer.addEventListener('click', (e)=>{ if(e.target === drawer) closeDrawer(); });

// ===== (Optional) Language toggle demo =====
document.querySelectorAll('.util__lang').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.util__lang').forEach(b=>b.style.outline='');
    btn.style.outline='2px solid #0ea5e9';
    // tempatkan logika ganti bahasa Anda di sini
  });
});
/* ===== Counter-up untuk Project Completion ===== */
(function initCounters(){
  const section = document.getElementById('project');
  if(!section) return;

  const nums = Array.from(section.querySelectorAll('.num[data-target]'));
  let played = false;

  function animate(el){
    const target = +el.getAttribute('data-target');
    const duration = 1200; // ms total animasi
    const start = performance.now();

    function tick(now){
      const p = Math.min((now - start) / duration, 1);              // 0..1
      const eased = 1 - Math.pow(1 - p, 3);                         // easeOutCubic
      const value = Math.round(eased * target);
      el.textContent = value.toString();
      if(p < 1) requestAnimationFrame(tick);
      else el.textContent = target.toString();                      // pastikan angka akhir
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting && !played){
        played = true;
        nums.forEach(animate);
        io.disconnect();
      }
    });
  }, { threshold: 0.35 });

  io.observe(section);
})();
/* ===== Galeri Project kiri: autoplay per detik ===== */
(function initProjectGallery(){
  const media = document.querySelector('.project__media');
  if(!media) return;
  const imgs = Array.from(media.querySelectorAll('.p-slide'));
  let i = 0;
  setInterval(()=>{
    imgs[i].classList.remove('active');
    i = (i + 1) % imgs.length;
    imgs[i].classList.add('active');
  }, 1000); // 1 detik ganti
})();
