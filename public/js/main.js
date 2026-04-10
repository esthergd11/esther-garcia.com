/* ============================================================
   ESTHER GARCÍA DELGADO — PORTFOLIO · main.js
   ============================================================ */

/* ── NAVEGACIÓN ─────────────────────────────────────────────── */
const nav       = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
});

navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', false);
    });
});

document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', false);
    }
});

/* ── ANIMACIÓN REVEAL AL HACER SCROLL ──────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        const delay = (i % 4) * 100;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── FORMULARIO DE CONTACTO ─────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = 'Enviando… &nbsp;<i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                contactForm.reset();
                formSuccess.classList.remove('hidden');
                setTimeout(() => formSuccess.classList.add('hidden'), 6000);
            } else {
                alert('Ha ocurrido un error. Inténtalo de nuevo.');
            }
        } catch {
            alert('No se pudo enviar el mensaje. Comprueba tu conexión.');
        } finally {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
    });
}

/* ── SMOOTH SCROLL ──────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = nav.offsetHeight + 16;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
});

/* ── AÑO ACTUAL EN EL FOOTER ────────────────────────────────── */
const yearEl = document.querySelector('.footer p');
if (yearEl) yearEl.innerHTML = yearEl.innerHTML.replace('2025', new Date().getFullYear());
