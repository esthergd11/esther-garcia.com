/* ============================================================
   ESTHER GARCÍA DELGADO — PORTFOLIO · main.js
   ============================================================ */

/* ── NAVEGACIÓN ─────────────────────────────────────────────── */
const nav       = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

// Añade clase "scrolled" al hacer scroll
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
});

// Abre / cierra el menú en móvil
navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
});

// Cierra el menú al hacer clic en un enlace
navMenu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', false);
    });
});

// Cierra el menú al hacer clic fuera
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
        // Pequeño retraso escalonado por grupos
        const delay = (i % 4) * 100;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
    });
}, {
    threshold:  0.12,
    rootMargin: '0px 0px -60px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

/* ── FORMULARIO DE CONTACTO ─────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;

        // Estado "enviando"
        btn.innerHTML = 'Enviando… &nbsp;<i class="fas fa-spinner fa-spin"></i>';
        btn.disabled  = true;

        try {
            const response = await fetch(contactForm.action, {
                method:  'POST',
                body:    new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                contactForm.reset();
                formSuccess.classList.remove('hidden');
                // Oculta el mensaje de éxito tras 6 s
                setTimeout(() => formSuccess.classList.add('hidden'), 6000);
            } else {
                const data = await response.json();
                const msg  = data?.errors?.map(e => e.message).join(', ')
                             || 'Ha ocurrido un error. Inténtalo de nuevo.';
                showFormError(msg);
            }
        } catch {
            showFormError('No se ha podido enviar el mensaje. Comprueba tu conexión.');
        } finally {
            btn.innerHTML = originalHTML;
            btn.disabled  = false;
        }
    });
}

function showFormError(msg) {
    // Crea (o reutiliza) un elemento de error
    let errEl = document.getElementById('formError');
    if (!errEl) {
        errEl    = document.createElement('p');
        errEl.id = 'formError';
        errEl.style.cssText = `
            color:#FCA5A5; font-size:.9rem; padding:12px 18px;
            background:rgba(239,68,68,.12); border:1px solid rgba(239,68,68,.3);
            border-radius:10px; margin-top:4px;
        `;
        contactForm.appendChild(errEl);
    }
    errEl.textContent = msg;
    setTimeout(() => errEl.remove(), 5000);
}

/* ── SMOOTH SCROLL PARA ANCLAS ──────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = nav.offsetHeight + 16;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ── AÑO ACTUAL EN EL FOOTER ────────────────────────────────── */
const yearEl = document.querySelector('.footer p');
if (yearEl) {
    yearEl.innerHTML = yearEl.innerHTML.replace('2025', new Date().getFullYear());
}
