// Native dialog handles modal focus, Escape and inert page content.
const nav = document.querySelector('.main-nav');
const toggle = document.querySelector('.nav-toggle');
const mobile = window.matchMedia('(max-width: 900px)');
function closeMenu(returnFocus = false) {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Ouvrir le menu');
  nav.hidden = mobile.matches;
  if (returnFocus) toggle.focus();
}
closeMenu();
mobile.addEventListener('change', () => closeMenu());
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  nav.hidden = !open;
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true);
});
document.addEventListener('click', event => {
  if (mobile.matches && !event.target.closest('.site-header')) closeMenu();
});
const dialog = document.querySelector('.lightbox');
const image = dialog.querySelector('img');
let opener;
document.querySelectorAll('[data-image]').forEach(item => item.addEventListener('click', () => {
  opener = item;
  image.src = item.dataset.image;
  image.alt = item.dataset.title || 'Création graphique';
  dialog.querySelector('h2').textContent = item.dataset.title || 'Création graphique';
  dialog.querySelector('.lightbox-description').textContent = item.dataset.description || '';
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}));
dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  image.removeAttribute('src');
  opener?.focus();
});
// Project details open only after a visitor's explicit action.
const projectDetails = document.getElementById('toutes-realisations');
projectDetails.open = false;
window.addEventListener('pageshow', () => { projectDetails.open = false; });

// A direct link to the former graphics section expands its preserved gallery.
function revealHash() {
  if (location.hash === '#creations') {
    const archive = document.getElementById('creations');
    archive.open = true;
    archive.scrollIntoView();
  }
}
window.addEventListener('hashchange', revealHash);
revealHash();

// Animation control also stops pointer-driven depth. Respect the OS preference.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const motionButton = document.querySelector('.motion-toggle');
const motionControls = document.querySelectorAll('.motion-toggle, .showcase-pause');
let userPaused = false;
function syncMotion() {
  const paused = reducedMotion.matches || userPaused;
  document.body.classList.toggle('motion-paused', paused);
  motionControls.forEach(control => {
    control.disabled = reducedMotion.matches;
    control.setAttribute('aria-pressed', String(paused));
    control.setAttribute('aria-label', reducedMotion.matches ? 'Animations réduites selon vos préférences système' : paused ? 'Activer les animations' : 'Mettre les animations en pause');
    const compact = control.classList.contains('showcase-pause');
    const label = reducedMotion.matches ? 'Mouvements réduits' : compact ? (paused ? 'Reprendre' : 'Pause') : (paused ? 'Animations en pause' : 'Animations actives');
    control.innerHTML = `<span aria-hidden="true">${paused ? '▷' : 'Ⅱ'}</span> ${label}`;
  });
}
motionControls.forEach(control => control.addEventListener('click', () => { userPaused = !userPaused; syncMotion(); }));
reducedMotion.addEventListener('change', syncMotion);
syncMotion();

if ('IntersectionObserver' in window) {
  const reveals = document.querySelectorAll('.section-heading, .work, .about > div, .skill-panel, .timeline-columns > div');
  document.body.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach(element => { element.classList.add('reveal'); revealObserver.observe(element); });
  // Keyboard navigation makes an offscreen animated item immediately visible.
  document.addEventListener('focusin', event => event.target.closest('.reveal')?.classList.add('is-visible'));
}

document.querySelectorAll('[data-tilt]').forEach(surface => {
  let frame = 0;
  let nextX = 0;
  let nextY = 0;
  const portrait = surface.classList.contains('hero-portrait');
  function resetDepth() {
    cancelAnimationFrame(frame);
    frame = 0;
    surface.style.removeProperty('--tilt-x');
    surface.style.removeProperty('--tilt-y');
    if (portrait) surface.style.removeProperty('transform');
  }
  surface.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion.matches || userPaused) return;
    const rect = surface.getBoundingClientRect();
    nextX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    nextY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
    if (frame) return;
    frame = requestAnimationFrame(() => {
      const rx = (0.5 - nextY) * 7;
      const ry = (nextX - 0.5) * 9;
      surface.style.setProperty('--tilt-x', `${rx}deg`);
      surface.style.setProperty('--tilt-y', `${ry}deg`);
      surface.style.setProperty('--light-x', `${nextX * 100}%`);
      surface.style.setProperty('--light-y', `${nextY * 100}%`);
      if (portrait) surface.style.transform = `rotate(-4deg) rotateX(${rx}deg) rotateY(${ry}deg)`;
      frame = 0;
    });
  });
  surface.addEventListener('pointerleave', resetDepth);
  motionControls.forEach(control => control.addEventListener('click', resetDepth));
  reducedMotion.addEventListener('change', resetDepth);
});

// Keep the collage still while it is outside the viewport.
const showcase = document.querySelector('.showcase');
if ('IntersectionObserver' in window) {
  const showcaseObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-active', entry.isIntersecting));
  }, { threshold: 0 });
  showcaseObserver.observe(showcase);
} else {
  showcase.classList.add('is-active');
}
// Also support a second click on an already selected hash after details were closed.
document.querySelectorAll('a[href="#toutes-realisations"]').forEach(link => {
  link.addEventListener('click', () => {
    projectDetails.open = true;
    projectDetails.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
  });
});


// Orientation stays available without a menu or a compulsory interaction.
const progressBar = document.querySelector('.reading-progress');
let progressFrame = 0;
function updateProgress() {
  progressFrame = 0;
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${distance > 0 ? Math.min(1, window.scrollY / distance) : 0})`;
}
window.addEventListener('scroll', () => {
  if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
}, { passive: true });
window.addEventListener('resize', updateProgress);
document.querySelectorAll('details').forEach(details => details.addEventListener('toggle', updateProgress));
updateProgress();
if ('IntersectionObserver' in window) {
  const shortcuts = document.querySelectorAll('.mobile-shortcuts a[href^="#"]');
  const orientationObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        shortcuts.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-15% 0px -60% 0px', threshold: 0 });
  document.querySelectorAll('main > section[id]').forEach(section => orientationObserver.observe(section));
}
