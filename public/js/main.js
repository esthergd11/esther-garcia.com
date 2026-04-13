/* ============================================================
   ESTHER GARCÍA — PORTFOLIO · main.js
   ============================================================ */

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

/* ── FUNNEL PROGRESS TRACKER ─────────────────────────────────── */
const funnelFill  = document.getElementById('funnelFill');
const funnelNodes = document.querySelectorAll('.funnel-node');

// Secciones que representan etapas del funnel
const funnelSections = ['#inicio', '#sobre-mi', '#servicios', '#contacto'].map(s =>
    document.querySelector(s)
).filter(Boolean);

function updateFunnel() {
    const scrolled  = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress  = Math.min(scrolled / maxScroll, 1);

    if (funnelFill) funnelFill.style.height = `${progress * 100}%`;

    // Activa cada nodo según la sección visible
    funnelSections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        const node = funnelNodes[i];
        if (!node) return;
        node.classList.toggle('active', rect.top < window.innerHeight * 0.6);
    });
}

window.addEventListener('scroll', updateFunnel, { passive: true });
updateFunnel();

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

document.querySelectorAll('.exp__card').forEach(card => {
    card.addEventListener('click', () => {
        const idx  = parseInt(card.dataset.exp);
        const data = expData[idx];
        document.getElementById('mNum').textContent     = data.num;
        document.getElementById('mCompany').textContent = data.company;
        document.getElementById('mRole').textContent    = data.role;
        document.getElementById('mDesc').textContent    = data.desc;
        document.getElementById('mTags').innerHTML      = data.tags.map(t => `<span>${t}</span>`).join('');
        expOverlay.classList.add('open');
        expOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    });
});

function closeExpModal() {
    expOverlay.classList.remove('open');
    expOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}
expClose?.addEventListener('click', closeExpModal);
expOverlay?.addEventListener('click', e => { if (e.target === expOverlay) closeExpModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeExpModal(); });

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
const success = document.getElementById('formSuccess');

form?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('.btn-submit');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Enviando… →';
    btn.disabled  = true;
    try {
        const res = await fetch(form.action, {
            method:  'POST',
            body:    new FormData(form),
            headers: { Accept: 'application/json' }
        });
        if (res.ok) {
            form.reset();
            success?.classList.remove('hidden');
            setTimeout(() => success?.classList.add('hidden'), 6000);
        } else {
            alert('Algo salió mal. Inténtalo de nuevo.');
        }
    } catch {
        alert('Error de conexión. Inténtalo de nuevo.');
    } finally {
        btn.innerHTML = orig;
        btn.disabled  = false;
    }
});
