/* =========================================================
   FACILIA — editorial interactions + lang toggle
   ========================================================= */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {

        /* ===== Nav: hairline/bg ao rolar ===== */
        const nav = document.getElementById('nav');
        const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 12);
        updateNav();
        window.addEventListener('scroll', updateNav, { passive: true });

        /* ===== Menu mobile ===== */
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        navToggle.addEventListener('click', () => {
            const open = navMenu.classList.toggle('open');
            navToggle.classList.toggle('active', open);
            navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Menu');
            document.body.style.overflow = open ? 'hidden' : '';
        });

        navMenu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        /* ===== Lang toggle PT | EN ===== */
        const langBtns = document.querySelectorAll('.lang-btn');
        const TITLES = {
            pt: 'Facilia. Consultoria em Dados & Inteligência Artificial',
            en: 'Facilia. Data & Artificial Intelligence Consultancy'
        };

        const setLang = (lang) => {
            document.documentElement.setAttribute('data-lang', lang);
            document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'pt-BR');
            document.title = TITLES[lang];
            try { localStorage.setItem('facilia-lang', lang); } catch (e) {}
        };

        langBtns.forEach((btn) => {
            btn.addEventListener('click', () => setLang(btn.dataset.lang));
        });

        // Sync title with initial lang (set by inline script in <head>)
        const initialLang = document.documentElement.getAttribute('data-lang') || 'pt';
        document.title = TITLES[initialLang];

        /* ===== Reveal on scroll ===== */
        const revealEls = document.querySelectorAll('.reveal');

        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const siblings = Array.from(
                                entry.target.parentElement?.querySelectorAll('.reveal') || []
                            );
                            const idx = siblings.indexOf(entry.target);
                            entry.target.style.transitionDelay = `${Math.max(0, idx) * 60}ms`;
                            entry.target.classList.add('visible');
                            io.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
            );
            revealEls.forEach((el) => io.observe(el));
        } else {
            revealEls.forEach((el) => el.classList.add('visible'));
        }

        /* ===== Filtro de entregas ===== */
        const chips = document.querySelectorAll('.chip');
        const deliverables = document.querySelectorAll('.deliverable');

        chips.forEach((chip) => {
            chip.addEventListener('click', function () {
                const filter = this.dataset.filter;
                chips.forEach((c) => c.classList.remove('chip-active'));
                this.classList.add('chip-active');

                deliverables.forEach((card) => {
                    const match = filter === 'all' || card.dataset.category === filter;
                    card.classList.toggle('hidden', !match);
                });
            });
        });

        /* ===== Ano no rodapé ===== */
        const year = new Date().getFullYear();
        const yearEl = document.getElementById('year');
        const yearElEn = document.getElementById('year-en');
        if (yearEl) yearEl.textContent = year;
        if (yearElEn) yearElEn.textContent = year;

        /* ===== Scroll suave com offset para nav fixa ===== */
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href.length < 2) return;
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();
                const navH = nav.offsetHeight;
                const top = target.getBoundingClientRect().top + window.pageYOffset - navH + 1;
                window.scrollTo({ top, behavior: 'smooth' });
            });
        });

        /* ===== Parallax sutil na scatter do hero ===== */
        const scatter = document.querySelector('.hero-scatter');
        const heroStage = document.querySelector('.hero-logo-stage');
        const heroVisual = document.querySelector('.hero-visual');

        if (scatter && heroStage && heroVisual && window.matchMedia('(pointer: fine)').matches) {
            let rafId = null;

            heroVisual.addEventListener('mousemove', (e) => {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => {
                    const rect = heroVisual.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    scatter.style.transform = `translate(${x * -14}px, ${y * -14}px)`;
                    heroStage.style.transform = `translate(calc(-50% + ${x * 8}px), calc(-50% + ${y * 8}px))`;
                });
            });

            heroVisual.addEventListener('mouseleave', () => {
                scatter.style.transform = '';
                heroStage.style.transform = '';
            });
        }
    });
})();
