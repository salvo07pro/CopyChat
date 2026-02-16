const app = document.getElementById('app');
let state = CopyChatStorage.getStorageData();
let currentView = 'main'; // 'main', 'profile', 'pricing'
let selectedTone = 'gentle';

const TONES = [
    { id: 'gentle', label: 'Gentile', icon: '😊', premium: false },
    { id: 'pro', label: 'Pro', icon: '💼', premium: false },
    { id: 'funny', label: 'Funny', icon: '😂', premium: true },
    { id: 'cold', label: 'Freddo', icon: '❄️', premium: true }
];

const LOGO_SVG = `
<svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="border-radius: 10px;">
  <rect width="100" height="100" rx="25" fill="#10B981"/>
  <path d="M30 35C30 32.2386 32.2386 30 35 30H65C67.7614 30 70 32.2386 70 35V55C70 57.7614 67.7614 60 65 60H50L35 75V60C32.2386 60 30 57.7614 30 55V35Z" fill="#020617"/>
  <path d="M42 40L52 50L42 60" stroke="#10B981" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
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
            <h1 style="font-size: 2.2rem; margin-bottom: 8px;">CopyChatt</h1>
            <p style="color: var(--text-secondary); margin-bottom: 32px;">Intelligenza proprietaria. Senza limiti.</p>
            
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
                <h1 style="font-size: 1.2rem;">CopyChatt</h1>
            </div>
            <div class="profile-trigger" id="profileTrigger">
                ${state.tier !== 'base' ? '<span style="color:var(--premium); font-size:0.8rem;">👑</span>' : ''}
                <div style="width:20px; height:20px; background:var(--primary); border-radius:50%; display:flex; align-items:center; justify-content:center; color:black; font-size:0.6rem; font-weight:800;">
                    ${state.user.name.charAt(0)}
                </div>
                <span>${state.user.name}</span>
            </div>
        </header>

        <main style="flex: 1; display: flex; flex-direction: column; gap: 20px;">
            <div class="tone-selector">
                ${TONES.map(tone => {
        const isTonePremium = tone.premium && state.tier === 'base';
        return `
                        <button class="tone-btn ${selectedTone === tone.id ? 'active' : ''} ${isTonePremium ? 'locked' : ''}" data-id="${tone.id}">
                            <span>${tone.icon}</span>
                            <span>${tone.label}</span>
                        </button>
                    `;
    }).join('')}
            </div>

            <section class="input-container">
                <textarea id="chatInput" placeholder="Incolla il messaggio..."></textarea>
                <div id="loading" style="display: none; height:4px; background:rgba(255,255,255,0.05); margin-top:10px; border-radius:2px; overflow:hidden;">
                    <div style="width:40%; height:100%; background:var(--primary); animation: load 1s infinite;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px;">
                    <div style="font-size: 0.7rem; color: var(--text-secondary);">
                        ${state.tier !== 'base' ? `${state.tier.toUpperCase()} Attivo` : `Gratis: ${state.count}/${usageLimit}`}
                    </div>
                    <button id="btnGenerate" class="btn-primary" style="width: auto; padding: 10px 24px;" ${isLocked ? 'disabled' : ''}>Genera Smart</button>
                </div>
            </section>

            <div id="results" class="results-container"></div>
            
            ${state.tier === 'base' ? `
            <div style="background: var(--card-bg); padding: 16px; border-radius: 20px; text-align: center; border: 1px dashed var(--premium);">
                <p style="font-size: 0.75rem; margin-bottom: 8px;">Passa a Premium per risposte illimitate!</p>
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

    document.querySelectorAll('.tone-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('locked')) {
                alert("Questa tonalità è esclusiva per utenti Premium!");
                currentView = 'pricing';
                render();
                return;
            }
            selectedTone = btn.dataset.id;
            render();
        });
    });
}

function renderPricing() {
    app.innerHTML = `
        <header class="header">
            <div style="cursor:pointer" id="backFromPricing">← Torna</div>
            <h1>Piani CopyChatt</h1>
        </header>
        <div class="pricing-container">
            <div class="pricing-card premium">
                <h3>Premium</h3>
                <div class="price-tag">2,99€</div>
                <ul class="feature-list">
                    <li>✓ Risposte illimitate</li>
                    <li>✓ Tutte le tonalità</li>
                </ul>
                <button class="btn-primary buy-btn" data-tier="premium">Attiva</button>
            </div>
            <div class="pricing-card plus">
                <h3>Premium+</h3>
                <div class="price-tag">4,99€</div>
                <ul class="feature-list">
                    <li>✓ Tutto Premium</li>
                    <li>✓ Analisi Psicologica AI</li>
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

function renderProfile() {
    app.innerHTML = `
        <div style="padding: 20px 0; cursor:pointer" id="backFromProfile">← Profilo</div>
        <div class="profile-header" style="text-align:center;">
            <div class="profile-avatar-large" style="margin: 0 auto 15px;">${state.user.name.charAt(0)}</div>
            <h2>${state.user.name}</h2>
            <p style="color:var(--text-secondary)">${state.user.email}</p>
        </div>
        <div class="profile-info-row" style="margin-top:20px;"><span>Piano</span><span>${state.tier.toUpperCase()}</span></div>
        <button id="goToPricingFromProfile" class="btn-primary" style="margin-top: 20px; background: var(--secondary); color: white;">Gestisci Abbonamento</button>
        <button id="btnLogout" class="btn-logout">Esci</button>
    `;
    document.getElementById('backFromProfile').addEventListener('click', () => { currentView = 'main'; render(); });
    document.getElementById('goToPricingFromProfile').addEventListener('click', () => { currentView = 'pricing'; render(); });
    document.getElementById('btnLogout').addEventListener('click', () => { state.user = null; CopyChatStorage.saveState(state); render(); });
}

async function handleGenerate() {
    const chatText = document.getElementById('chatInput').value.trim();
    if (!chatText) return;

    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const btn = document.getElementById('btnGenerate');

    btn.disabled = true;
    loading.style.display = 'block';
    results.innerHTML = '';

    const responses = await CopyChatStorage.generateInternalAIResponse(chatText, selectedTone, state.tier);
    state.count += 1;
    CopyChatStorage.saveState(state);

    loading.style.display = 'none';
    btn.disabled = false;

    results.innerHTML = responses.map(resp => `
        <div class="response-card">
            <div class="copy-hint">Copia</div>
            <p>${resp}</p>
        </div>
    `).join('');

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

render();
