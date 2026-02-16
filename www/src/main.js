const app = document.getElementById('app');
let state = CopyChatStorage.getStorageData();
let currentView = 'main'; // 'main', 'profile', 'pricing'

const LOGO_SVG = `
<svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="border-radius: 10px;">
  <rect width="100" height="100" rx="25" fill="#3B82F6"/>
  <path d="M30 50C30 38.9543 38.9543 30 50 30H70V45C70 56.0457 61.0457 65 50 65H30V50Z" fill="#020617"/>
  <path d="M45 40L55 50L45 60" stroke="#3B82F6" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

function render() {
    if (!state.user) {
        renderRegistration();
    } else if (currentView === 'profile') {
        renderProfile();
    } else if (currentView === 'pricing') {
        renderPricing();
    } else {
        renderMainApp();
    }
}

function renderRegistration() {
    app.innerHTML = `
        <div class="onboarding-screen">
            <div class="logo-svg-container" style="margin-bottom: 24px; filter: drop-shadow(0 0 15px var(--primary-glow));">
                ${LOGO_SVG.replace('width="40" height="40"', 'width="120" height="120"')}
            </div>
            <h1 style="font-size: 2.2rem; margin-bottom: 8px;">UnStuck</h1>
            <p style="color: var(--text-secondary); margin-bottom: 32px;">Sbloccati subito. Risposte smart istantanee.</p>
            
            <button id="btnGoogleLogin" class="btn-google">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg" style="width:20px" alt="G">
                Accedi con Google
            </button>
            <div style="margin: 20px 0; color: var(--text-secondary); font-size: 0.8rem;">oppure continua con il nome</div>
            <input type="text" id="userName" class="input-box" style="width: 100%; max-width: 320px; padding: 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--card-border); border-radius: 16px; color: white; margin-bottom: 16px;" placeholder="Il tuo nome">
            <button id="btnRegister" class="btn-primary" style="max-width: 320px;">Crea Account</button>
        </div>
    `;
    document.getElementById('btnGoogleLogin').addEventListener('click', handleGoogleLogin);
    document.getElementById('btnRegister').addEventListener('click', () => {
        const name = document.getElementById('userName').value.trim();
        if (name) { state = CopyChatStorage.registerUser(name); render(); }
    });
}

function renderMainApp() {
    const usageLimit = state.tier === 'base' ? 5 : Infinity;
    const isLocked = state.tier === 'base' && state.count >= usageLimit;

    app.innerHTML = `
        <header class="header">
            <div class="brand-container">
                <div style="transform: scale(0.8); margin-left: -5px;">${LOGO_SVG}</div>
                <h1 style="font-size: 1.2rem;">UnStuck</h1>
            </div>
            <div class="profile-trigger" id="profileTrigger">
                ${state.tier !== 'base' ? '<span style="color:var(--premium); font-size:0.8rem;">👑</span>' : ''}
                <div style="width:20px; height:20px; background:var(--primary); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-size:0.6rem; font-weight:800;">
                    ${state.user.name.charAt(0)}
                </div>
                <span>${state.user.name}</span>
            </div>
        </header>

        <main style="flex: 1; display: flex; flex-direction: column; gap: 20px;">
            <section class="input-container">
                <textarea id="chatInput" placeholder="Incolla qui il messaggio a cui vuoi rispondere..."></textarea>
                <div id="loading" style="display: none; height:4px; background:rgba(255,255,255,0.05); margin-top:10px; border-radius:2px; overflow:hidden;">
                    <div style="width:40%; height:100%; background:var(--primary); animation: load 1s infinite;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px;">
                    <div style="font-size: 0.7rem; color: var(--text-muted);">
                        ${state.tier !== 'base' ? `${state.tier.toUpperCase()} Attivo` : `Gratis: ${state.count}/${usageLimit}`}
                    </div>
                    <button id="btnGenerate" class="btn-primary" style="width: auto; padding: 10px 24px;" ${isLocked ? 'disabled' : ''}>Genera 4 Opzioni</button>
                </div>
            </section>

            <div id="results" class="results-container"></div>
            
            ${state.tier === 'base' ? `
            <div style="background: var(--surface); padding: 16px; border-radius: 20px; text-align: center; border: 1px dashed var(--premium);">
                <p style="font-size: 0.75rem; margin-bottom: 8px; color: var(--text-muted);">Passa a Premium per risposte illimitate!</p>
                <button id="goToPricing" style="background: var(--premium); color: black; border: none; padding: 8px 16px; border-radius: 10px; font-weight: 800; font-size: 0.7rem; cursor: pointer;">Piani Upgrade</button>
            </div>
            ` : ''}
        </main>
        <style>@keyframes load { from { transform: translateX(-100%); } to { transform: translateX(300%); } }</style>
    `;

    document.getElementById('btnGenerate').addEventListener('click', handleGenerate);
    document.getElementById('profileTrigger').addEventListener('click', () => { currentView = 'profile'; render(); });
    if (document.getElementById('goToPricing')) {
        document.getElementById('goToPricing').addEventListener('click', () => { currentView = 'pricing'; render(); });
    }
}

function renderPricing() {
    app.innerHTML = `
        <header class="header">
            <div style="cursor:pointer" id="backFromPricing">← Torna</div>
            <h1>Piani UnStuck</h1>
        </header>
        <div class="pricing-container">
            <div class="pricing-card premium">
                <h3>Premium</h3>
                <div class="price-tag">2,99€</div>
                <ul class="feature-list">
                    <li>✓ Risposte illimitate</li>
                    <li>✓ Tutte le opzioni</li>
                </ul>
                <button class="btn-primary buy-btn" data-tier="premium">Attiva</button>
            </div>
            <div class="pricing-card plus">
                <h3>Premium+</h3>
                <div class="price-tag">4,99€</div>
                <ul class="feature-list">
                    <li>✓ Tutto Premium</li>
                    <li>✓ Analisi Psicologica</li>
                </ul>
                <button class="btn-primary buy-btn" data-tier="premium_plus" style="background: var(--premium-plus); color: white;">Attiva</button>
            </div>
        </div>
    `;
    document.getElementById('backFromPricing').addEventListener('click', () => { currentView = 'main'; render(); });
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            state.tier = btn.dataset.tier;
            CopyChatStorage.saveState(state);
            alert("Piano attivato con successo!");
            currentView = 'main'; render();
        });
    });
}

function applyTheme() {
    if (state.theme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
}

function renderProfile() {
    app.innerHTML = `
        <div style="padding: 20px 0; cursor:pointer" id="backFromProfile">← Profilo</div>
        <div class="profile-header" style="text-align:center; margin-bottom: 32px;">
            <div class="profile-avatar-large" style="margin: 0 auto 15px;">${state.user.name.charAt(0)}</div>
            <h2 style="font-size: 1.5rem;">${state.user.name}</h2>
            <p style="color:var(--text-muted); font-size: 0.9rem;">${state.user.email}</p>
        </div>

        <div class="theme-switch-row">
            <span>Tema Chiaro</span>
            <div class="toggle-pill" id="themeToggle"></div>
        </div>

        <div class="profile-info-row"><span>Piano</span><span style="font-weight:700;">${state.tier.toUpperCase()}</span></div>
        <button id="goToPricingFromProfile" class="btn-primary" style="margin-top: 32px; background: var(--surface); color: var(--text-main); border: 1px solid var(--card-border); box-shadow: none;">Gestisci Abbonamento</button>
        <button id="btnLogout" class="btn-logout">Esci dall'account</button>
    `;
    document.getElementById('backFromProfile').addEventListener('click', () => { currentView = 'main'; render(); });
    document.getElementById('goToPricingFromProfile').addEventListener('click', () => { currentView = 'pricing'; render(); });
    document.getElementById('btnLogout').addEventListener('click', () => { state.user = null; CopyChatStorage.saveState(state); render(); });

    document.getElementById('themeToggle').addEventListener('click', () => {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        CopyChatStorage.saveState(state);
        applyTheme();
        render();
    });
}

async function handleGenerate() {
    const chatInput = document.getElementById('chatInput');
    const chatText = chatInput.value.trim();
    if (!chatText) return;

    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const btn = document.getElementById('btnGenerate');

    btn.disabled = true;
    loading.style.display = 'block';
    results.innerHTML = '';

    try {
        const responses = await CopyChatStorage.generateInternalAIResponse(chatText, 'gentle', state.tier);
        state.count += 1;
        CopyChatStorage.saveState(state);

        loading.style.display = 'none';
        btn.disabled = false;

        results.innerHTML = responses.map(resp => `
            <div class="response-card" style="border-left: 4px solid var(--primary); padding-top: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <span style="font-size: 0.7rem; color: var(--primary); font-weight: 800; text-transform: uppercase;">${resp.label}</span>
                    <span class="copy-hint" style="position: static; font-size: 0.7rem;">Copia</span>
                </div>
                
                ${resp.analysis ? `<div style="background: var(--primary-glow); color: var(--primary); font-size: 0.65rem; padding: 4px 8px; border-radius: 6px; margin-bottom: 12px; display: inline-block; font-weight: 600;">Analisi: ${resp.analysis}</div>` : ''}
                
                <p style="margin: 0; line-height: 1.5; font-size: 1rem;">${resp.text}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error("Errore generazione:", error);
        loading.style.display = 'none';
        btn.disabled = false;
        results.innerHTML = `<p style="color: var(--error); text-align: center;">Errore: Non riesco a generare la risposta. Riprova.</p>`;
    }

    document.querySelectorAll('.response-card').forEach(card => {
        card.addEventListener('click', () => {
            navigator.clipboard.writeText(card.querySelector('p').innerText);
            card.querySelector('.copy-hint').innerText = 'Fatto!';
            setTimeout(() => card.querySelector('.copy-hint').innerText = 'Copia', 2000);
        });
    });
}

async function handleGoogleLogin() {
    const name = prompt("Accedi con Google: Come ti chiami?");
    if (name) {
        state.user = { name: name, email: name.toLowerCase() + "@google.it", registeredAt: new Date().toISOString() };
        CopyChatStorage.saveState(state);
        render();
    }
}

applyTheme();
render();
