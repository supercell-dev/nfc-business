// SuperTap Language Engine — Dropdown Renderer + i18n Logic
(function () {
    const LANGS = [
        // Core
        { code: 'en', flag: '🇺🇸', name: 'English', group: 'Core' },
        { code: 'fr', flag: '🇫🇷', name: 'Français', group: 'Core' },
        { code: 'ar', flag: '🇲🇦', name: 'العربية', group: 'Core' },
        // Darija
        { code: 'dj', flag: '🇲🇦', name: 'دارجة', group: 'دارجة' },
        { code: 'djl', flag: '🇲🇦', name: 'Darija', group: 'دارجة' },
        // European
        { code: 'es', flag: '🇪🇸', name: 'Español', group: 'European' },
        { code: 'de', flag: '🇩🇪', name: 'Deutsch', group: 'European' },
        { code: 'it', flag: '🇮🇹', name: 'Italiano', group: 'European' },
        { code: 'pt', flag: '🇵🇹', name: 'Português', group: 'European' },
        { code: 'nl', flag: '🇳🇱', name: 'Nederlands', group: 'European' },
        { code: 'tr', flag: '🇹🇷', name: 'Türkçe', group: 'European' }
    ];

    function renderPickers() {
        document.querySelectorAll('.lang-picker').forEach(container => {
            if (container.dataset.rendered) return;
            container.dataset.rendered = '1';

            const current = localStorage.getItem('lang') || 'en';
            const currentLang = LANGS.find(l => l.code === current) || LANGS[0];

            // Button
            const btn = document.createElement('button');
            btn.className = 'lang-btn';
            btn.innerHTML = `<span class="flag">${currentLang.flag}</span><span class="code">${currentLang.code.toUpperCase()}</span><span class="arrow">▾</span>`;
            btn.onclick = (e) => { e.stopPropagation(); container.classList.toggle('open'); };

            // Dropdown
            const dropdown = document.createElement('div');
            dropdown.className = 'lang-dropdown';

            // Search
            const search = document.createElement('input');
            search.type = 'text';
            search.placeholder = 'Search…';
            search.className = 'lang-search';
            search.onclick = (e) => e.stopPropagation();
            search.oninput = () => {
                const q = search.value.toLowerCase();
                dropdown.querySelectorAll('.lang-option').forEach(opt => {
                    opt.style.display = opt.dataset.name.toLowerCase().includes(q) || opt.dataset.code.includes(q) ? '' : 'none';
                });
                dropdown.querySelectorAll('.lang-group-label, .lang-divider').forEach(el => el.style.display = q ? 'none' : '');
            };
            dropdown.appendChild(search);

            let lastGroup = '';
            LANGS.forEach(lang => {
                if (lang.group !== lastGroup) {
                    if (lastGroup) { const d = document.createElement('div'); d.className = 'lang-divider'; dropdown.appendChild(d); }
                    const gl = document.createElement('div');
                    gl.className = 'lang-group-label';
                    gl.textContent = lang.group;
                    dropdown.appendChild(gl);
                    lastGroup = lang.group;
                }
                const opt = document.createElement('div');
                opt.className = 'lang-option' + (lang.code === current ? ' active' : '');
                opt.dataset.name = lang.name;
                opt.dataset.code = lang.code;
                opt.innerHTML = `<span class="flag">${lang.flag}</span><span class="label">${lang.name}</span>`;
                opt.onclick = (e) => { e.stopPropagation(); setLanguage(lang.code); };
                dropdown.appendChild(opt);
            });

            container.appendChild(btn);
            container.appendChild(dropdown);
        });
    }

    // Close on outside click
    document.addEventListener('click', () => {
        document.querySelectorAll('.lang-picker.open').forEach(p => p.classList.remove('open'));
    });

    function applyLanguage(lang) {
        const t = window.translations && window.translations[lang];
        if (!t) return;

        // Direction & font
        document.documentElement.dir = t.dir || 'ltr';
        document.documentElement.lang = lang;
        if (t.font) document.body.style.fontFamily = t.font;

        // Amiri font for RTL
        if (t.dir === 'rtl' && !document.getElementById('amiri-font')) {
            const link = document.createElement('link');
            link.id = 'amiri-font';
            link.rel = 'stylesheet';
            link.href = "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap";
            document.head.appendChild(link);
        }

        // Update all data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key] !== undefined) el.innerHTML = t[key];
        });

        // Update picker buttons
        const currentLang = LANGS.find(l => l.code === lang) || LANGS[0];
        document.querySelectorAll('.lang-picker').forEach(picker => {
            const btn = picker.querySelector('.lang-btn');
            if (btn) btn.innerHTML = `<span class="flag">${currentLang.flag}</span><span class="code">${currentLang.code.toUpperCase()}</span><span class="arrow">▾</span>`;
            picker.querySelectorAll('.lang-option').forEach(opt => {
                opt.classList.toggle('active', opt.dataset.code === lang);
            });
            picker.classList.remove('open');
        });

        localStorage.setItem('lang', lang);
    }

    window.setLanguage = function (lang) {
        applyLanguage(lang);
    };

    // Init on DOM ready
    function init() {
        renderPickers();
        const saved = window._pendingLang || localStorage.getItem('lang') || 'en';
        applyLanguage(saved);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
