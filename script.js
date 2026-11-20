/* =========================================================
   SUZERON | Samit Pudasaini portfolio
   ========================================================= */
(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    /* ---------- 2. PARTICLE BACKGROUND ---------- */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationId = null;
    let particleColor = '#00f0ff';

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.directionX = (Math.random() * 0.2) - 0.1;
            this.directionY = (Math.random() * 0.2) - 0.1;
            this.size = Math.random() * 2;
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            this.x += this.directionX;
            this.y += this.directionY;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = particleColor;
            ctx.globalAlpha = 0.5;
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        // fewer particles on small screens keeps phones fast
        const density = window.innerWidth < 768 ? 26000 : 15000;
        const count = Math.min(140, (canvas.width * canvas.height) / density);
        for (let i = 0; i < count; i++) particlesArray.push(new Particle());
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
        if (prefersReducedMotion) drawFrame(false);
    }

    function drawFrame(move) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            if (move) particlesArray[i].update();
            particlesArray[i].draw();
            for (let j = i; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                if (dx * dx + dy * dy < 10000) {
                    ctx.beginPath();
                    ctx.strokeStyle = particleColor;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        drawFrame(true);
        animationId = requestAnimationFrame(animateParticles);
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeCanvas, 150);
    });

    // pause the animation when the tab is hidden (saves battery and CPU)
    document.addEventListener('visibilitychange', () => {
        if (prefersReducedMotion) return;
        if (document.hidden) { cancelAnimationFrame(animationId); animationId = null; }
        else if (!animationId) animateParticles();
    });

    /* ---------- 2b. LIGHT / DARK THEME ---------- */
    const root = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle');
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    function applyTheme(theme, save) {
        root.setAttribute('data-theme', theme);
        particleColor = getComputedStyle(root).getPropertyValue('--accent').trim() || '#00f0ff';
        if (themeMeta) themeMeta.setAttribute('content', theme === 'light' ? '#eef3f7' : '#050505');
        if (themeBtn) {
            const next = theme === 'light' ? 'dark' : 'light';
            themeBtn.setAttribute('aria-label', `Switch to ${next} theme`);
            themeBtn.setAttribute('title', `Switch to ${next} theme`);
        }
        if (save) { try { localStorage.setItem('suz-theme', theme); } catch (e) {} }
        if (prefersReducedMotion && particlesArray.length) drawFrame(false);
    }
    applyTheme(root.getAttribute('data-theme') || 'dark', false);
    if (themeBtn) themeBtn.addEventListener('click', () => applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true));

    /* ---------- 3. TYPEWRITER ---------- */
    const typeTarget = document.getElementById('dynamic-text');
    const texts = [ 'logs into actionable insights', 'and mitigate security threats' ];
    let count = 0;
    function initTypewriter() {
        if (!typeTarget || prefersReducedMotion) return;
        if (count >= texts.length) count = 0;
        typeTarget.classList.remove('slide-text');
        void typeTarget.offsetWidth;
        typeTarget.textContent = texts[count];
        typeTarget.classList.add('slide-text');
        count++;
        setTimeout(initTypewriter, 3000);
    }

    /* ---------- 4. SCROLL REVEAL ---------- */
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active-reveal');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        $$('.reveal').forEach(el => revealObserver.observe(el));
    } else {
        $$('.reveal').forEach(el => el.classList.add('active-reveal'));
    }

    /* ---------- 5. MOBILE MENU ---------- */
    const menu = document.getElementById('mobile-menu');
    const toggleBtn = $('.mobile-toggle');
    function setMenu(open) {
        menu.classList.toggle('active', open);
        menu.setAttribute('aria-hidden', String(!open));
        toggleBtn.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
        if (open) $('.close-btn', menu).focus(); else toggleBtn.focus({ preventScroll: true });
    }
    toggleBtn.addEventListener('click', () => setMenu(true));
    $('.close-btn', menu).addEventListener('click', () => setMenu(false));
    $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('active')) setMenu(false); });
    // keep for any old inline handlers
    window.toggleMenu = () => setMenu(!menu.classList.contains('active'));

    /* ---------- 6. ACTIVE NAV ---------- */
    if ('IntersectionObserver' in window) {
        const navLinks = $$('.nav-links a');
        const navObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                navLinks.forEach(a => {
                    const on = a.getAttribute('href') === '#' + entry.target.id;
                    a.classList.toggle('active', on);
                    if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        $$('main section[id]').forEach(s => navObserver.observe(s));
    }

    /* ---------- 7. LIVE EXPERIENCE COUNTER ---------- */
    const CAREER_START = new Date(2024, 6, 1); // July 2024
    function updateExperience() {
        const now = new Date();
        let months = (now.getFullYear() - CAREER_START.getFullYear()) * 12 + (now.getMonth() - CAREER_START.getMonth());
        if (months < 0) months = 0;
        const years = Math.floor(months / 12);
        const rem = months % 12;
        const yearsEl = document.getElementById('exp-years');
        const sinceEl = document.getElementById('exp-since');
        const heroEl = document.getElementById('exp-counter');
        if (yearsEl) yearsEl.innerHTML = `${years}<span class="small"> ${years === 1 ? 'Year' : 'Years'}${rem ? ` ${rem} ${rem === 1 ? 'Month' : 'Months'}` : ''}</span>`;
        if (sinceEl) sinceEl.textContent = 'Since Jul 2024';
        if (heroEl) heroEl.textContent = years + (rem ? '+' : '') + (years === 1 ? ' yr' : ' yrs');
    }

    /* ---------- 8. CERTIFICATION FILTER ---------- */
    const filterBtns = $$('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const f = btn.dataset.filter;
            filterBtns.forEach(b => {
                const on = b === btn;
                b.classList.toggle('active', on);
                b.setAttribute('aria-pressed', String(on));
            });
            $$('.cert-card[data-cat], .badge-list li[data-cat]').forEach(el => {
                const show = f === 'all' || el.dataset.cat === f;
                el.classList.toggle('is-hidden', !show);
                if (show) el.classList.add('active-reveal');
            });
            const subHeading = $('.sub-heading');
            const anyBadges = $$('.badge-list li:not(.is-hidden)').length > 0;
            if (subHeading) subHeading.style.display = anyBadges ? '' : 'none';
        });
    });

    /* ---------- 9. TOAST + COPY EMAIL ---------- */
    const toastEl = document.getElementById('toast');
    let toastTimer;
    function toast(msg) {
        toastEl.textContent = msg;
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
    }
    function copyText(text, label) {
        const done = () => toast(`${label} copied to clipboard`);
        const fallback = () => {
            const t = document.createElement('textarea');
            t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
            document.body.appendChild(t); t.select();
            try { document.execCommand('copy'); done(); } catch (e) { toast('Copy failed. Please select the text.'); }
            t.remove();
        };
        if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
        else fallback();
    }
    const copyBtn = document.getElementById('copy-email');
    if (copyBtn) copyBtn.addEventListener('click', () => copyText(copyBtn.dataset.copy, 'Email'));

    /* ---------- 10. INIT ---------- */
    document.getElementById('year').textContent = new Date().getFullYear();
    updateExperience();

    window.addEventListener('load', () => {
        initTypewriter();
        resizeCanvas();
        if (!prefersReducedMotion) animateParticles();
    });

    console.log('%cSUZERON', 'color:#00f0ff;font:700 28px monospace;text-shadow:0 0 10px #00f0ff');
    console.log('%cLooking under the hood? Say hi: pudasainisamit@gmail.com', 'color:#94a3b8;font:13px monospace');
})();
