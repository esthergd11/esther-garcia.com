/* ============================================================
   ESTHER GARCÍA — PORTFOLIO · main.js
   ============================================================ */

/* ── PREFERENCIA DE MOVIMIENTO ──────────────────────────────── */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── AÑO FOOTER ─────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ── NAV ─────────────────────────────────────────────────────── */
const nav      = document.getElementById('nav');
const toggle   = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

toggle?.addEventListener('click', () => navLinks.classList.toggle('active'));
document.addEventListener('click', e => {
    if (!nav.contains(e.target)) navLinks?.classList.remove('active');
});
navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('active'));
});

/* ── SMOOTH SCROLL ───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - (nav.offsetHeight + 16),
            behavior: 'smooth'
        });
    });
});

/* ── REVEAL ON SCROLL ────────────────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        revealObs.unobserve(entry.target);
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Failsafe: si el observer no llega a disparar (error o JS parcial), revela todo a los 2.5s
setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
}, 2500);

/* ── PALABRA ROTATORIA (STATEMENT) ──────────────────────────── */
const rotWords   = document.querySelectorAll('.rot-word');
const rotContainer = document.querySelector('.statement__rotate');
let rotIdx = 0;

function setRotWidth() {
    if (!rotContainer || !rotWords.length) return;
    // Mide la palabra activa y ajusta el ancho del contenedor
    const active = rotWords[rotIdx];
    rotContainer.style.width = active.scrollWidth + 'px';
}

if (rotWords.length) {
    // Ajuste inicial tras cargar fuentes
    document.fonts.ready.then(setRotWidth);

    // Solo rota si el usuario no ha pedido reducir el movimiento
    if (!reduceMotion) {
        setInterval(() => {
            rotWords[rotIdx].classList.remove('active');
            rotWords[rotIdx].classList.add('exit');
            const prev = rotIdx;
            rotIdx = (rotIdx + 1) % rotWords.length;
            rotWords[rotIdx].classList.add('active');
            setRotWidth();
            setTimeout(() => rotWords[prev].classList.remove('exit'), 500);
        }, 2400);
    }
}

/* ── POPUP EXPERIENCIA ───────────────────────────────────────── */
const expData = [
    {
        num: '01',
        company: 'Dark Moon Academia',
        role: 'Profesora Paid Media',
        desc: 'Formaciones de TikTok Ads, PMax & Demand Gen, Estrategias de Búsqueda y Técnicas de Optimización en Google Ads. Comunidad PPC de referencia en habla hispana.',
        tags: ['Formación', 'TikTok Ads', 'Google Ads', 'PMax']
    },
    {
        num: '02',
        company: 'ESCP Europe Business School',
        role: 'Curso impartido',
        desc: 'Publicidad digital para expansión internacional — SEM y paid media. Formación especializada para estudiantes de negocios con proyección internacional.',
        tags: ['SEM', 'Paid Media', 'Internacional']
    },
    {
        num: '03',
        company: 'agenciaSEO.eu',
        role: 'Gestora de cuentas PPC/SEM',
        desc: 'Gestión y optimización de campañas en Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads y Spotify Ads. Análisis de datos con GTM y Looker Studio. Formación de perfiles junior.',
        tags: ['Google Ads', 'Meta Ads', 'TikTok Ads', 'Looker Studio']
    },
    {
        num: '04',
        company: 'CrackPPC',
        role: 'PPC/SEM Account Manager',
        desc: 'Agencia especializada en performance. Gestión de cuentas de clientes ecommerce y lead generation, con foco en análisis de datos y optimización continua.',
        tags: ['Performance', 'Ecommerce', 'Lead Gen']
    }
];

const expOverlay = document.getElementById('expOverlay');
const expClose   = document.getElementById('expClose');
let expLastFocused = null;

function openExpModal(idx) {
    const data = expData[idx];
    if (!data) return;
    document.getElementById('mNum').textContent     = data.num;
    document.getElementById('mCompany').textContent = data.company;
    document.getElementById('mRole').textContent    = data.role;
    document.getElementById('mDesc').textContent    = data.desc;
    document.getElementById('mTags').innerHTML      = data.tags.map(t => `<span>${t}</span>`).join('');
    expLastFocused = document.activeElement;          // recordar para devolver el foco
    expOverlay.classList.add('open');
    expOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    expClose?.focus();                                 // llevar el foco al modal
}

document.querySelectorAll('.exp__card').forEach(card => {
    const open = () => openExpModal(parseInt(card.dataset.exp));
    // El botón "→" es el control accesible: focusable y con Enter/Espacio nativos
    const btn = card.querySelector('.exp__card-btn');
    btn?.addEventListener('click', e => { e.stopPropagation(); open(); });
    // Click en cualquier punto de la tarjeta (comodidad con ratón)
    card.addEventListener('click', open);
});

function closeExpModal() {
    if (!expOverlay.classList.contains('open')) return;
    expOverlay.classList.remove('open');
    expOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    expLastFocused?.focus();                           // devolver el foco a la tarjeta
}
expClose?.addEventListener('click', closeExpModal);
expOverlay?.addEventListener('click', e => { if (e.target === expOverlay) closeExpModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeExpModal(); });
// Focus trap: mantener el foco dentro del modal (único control: cerrar)
expOverlay?.addEventListener('keydown', e => {
    if (e.key === 'Tab' && expOverlay.classList.contains('open')) {
        e.preventDefault();
        expClose?.focus();
    }
});

/* ── INDICADOR LATERAL DE PROGRESO ──────────────────────────── */
const ppDots    = document.querySelectorAll('.pp__dot');
const ppSections = Array.from(ppDots).map(dot =>
    document.querySelector(dot.getAttribute('href'))
).filter(Boolean);

function updateProgress() {
    const mid = window.innerHeight * 0.5;
    let activeIdx = 0;
    ppSections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= mid) activeIdx = i;
    });
    ppDots.forEach((dot, i) => dot.classList.toggle('active', i === activeIdx));
}

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

/* ── FORMULARIO ──────────────────────────────────────────────── */
const form    = document.getElementById('contactForm');
const formLoadedAtInput = document.getElementById('formLoadedAt');
const formLoadedAt = Date.now();

if (formLoadedAtInput) formLoadedAtInput.value = String(formLoadedAt);

form?.addEventListener('submit', (e) => {
    const elapsedMs = Date.now() - formLoadedAt;
    // Basic bot friction: reject submissions sent too quickly.
    if (elapsedMs < 4000) {
        e.preventDefault();
        alert('Espera unos segundos y vuelve a intentarlo.');
        return;
    }
    const btn = form.querySelector('.btn-submit');
    if (!btn) return;
    btn.innerHTML = 'Enviando… →';
    btn.disabled = true;
});
