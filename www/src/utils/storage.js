const CopyChatStorage = {
    getStorageData: () => {
        const data = localStorage.getItem('copychatt_v7');
        if (!data) return {
            user: null,
            count: 0,
            date: new Date().toLocaleDateString(),
            tier: 'base',
            theme: 'dark',
            history: []
        };
        const parsed = JSON.parse(data);
        const today = new Date().toLocaleDateString();
        if (parsed.date !== today) return { ...parsed, count: 0, date: today };
        return parsed;
    },

    saveState: (state) => {
        localStorage.setItem('copychatt_v7', JSON.stringify(state));
    },

    registerUser: (name) => {
        const state = CopyChatStorage.getStorageData();
        state.user = {
            name: name,
            email: `${name.toLowerCase().replace(/\s/g, '')}@gmail.com`,
            registeredAt: new Date().toISOString()
        };
        CopyChatStorage.saveState(state);
        return state;
    },

    // Proprietary Core Engine Analysis
    analyzeContext: (text) => {
        const lower = text.toLowerCase();
        let sentiment = 'neutral';
        let intent = 'general';

        // Intent detection
        if (lower.includes('manchi') || lower.includes('amore') || lower.includes('ti amo') || lower.includes('cuore')) intent = 'emotional';
        else if (lower.includes('lasciare') || lower.includes('basta') || lower.includes('odio') || lower.includes('arrabbiato')) intent = 'conflict';
        else if (lower.includes('giocare') || lower.includes('game') || lower.includes('partita')) intent = 'gaming';
        else if (lower.includes('invito') || lower.includes('uscire') || lower.includes('cena')) intent = 'invitation';
        else if (lower.includes('lavoro') || lower.includes('mail') || lower.includes('progetto')) intent = 'work';
        else if (lower.includes('?') || lower.includes('perché') || lower.includes('come')) intent = 'question';
        else if (lower.includes('ciao') || lower.includes('ehi')) intent = 'greeting';

        // Sentiment detection
        if (lower.includes('!') || lower.includes('subito') || lower.includes('urgente')) sentiment = 'urgent';
        else if (lower.includes('grazie') || lower.includes('bello') || lower.includes('felice')) sentiment = 'positive';
        else if (lower.includes('no') || lower.includes('triste') || lower.includes('male')) sentiment = 'negative';

        return { intent, sentiment };
    },

    // Internal Intelligence Response Generation (No API Key Required)
    generateInternalAIResponse: async (chatText, tone = 'gentle', tier = 'base') => {
        // AI Thought Simulation delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const context = CopyChatStorage.analyzeContext(chatText);

        const library = {
            greeting: {
                gentle: ["Ehilà! Spero che tu stia passando una splendida giornata. 😊", "Ciao! Che piacere sentirti, come vanno le cose?", "Ehi! È sempre un piacere scambiare due chiacchiere con te."],
                pro: ["Buongiorno. Confermo la ricezione del messaggio e resto in attesa.", "Saluti. Come posso assisterla professionalmente oggi?", "Buongiorno, procediamo pure con i punti della conversazione."],
                funny: ["Ancora tu? Ma non ti stanchi mai di me? Scherzo! 😂", "Ehi! Il re della chat è tornato in città.", "Pura energia! Spara pure prima che mi dimentichi."],
                cold: ["Ricevuto. Sto ascoltando.", "Sì, dimmi.", "In attesa."]
            },
            conflict: {
                gentle: ["Mi dispiace davvero molto sentirlo. Forse parlarne con calma aiuterebbe. ❤️", "Capisco che sia un momento di tensione. Io sono qui per te.", "Forse un po' di spazio ci farà bene a entrambi per riflettere."],
                pro: ["Prendo atto delle sue divergenze. Suggerisco un approccio più analitico.", "Valutiamo le opzioni disponibili per risolvere questo punto di attrito.", "Procediamo alla risoluzione del problema senza coinvolgimenti emotivi."],
                funny: ["Uff, quanta drammaticità! Ma sorridi un po', la vita è bella!", "Oggi siamo decisamente in modalità soap opera, eh?", "Sei più difficile da gestire di un bug al lunedì mattina! 🎭"],
                cold: ["Va bene. Se questo è ciò che vuoi.", "Decisione registrata.", "Basta così."]
            },
            work: {
                gentle: ["Certamente! Mi occupo subito di questa cosa, non preoccuparti. 😊", "Ottima idea sul progetto, ci lavoriamo insieme con calma.", "Ricevuto, ti do una mano volentieri con questa mail."],
                pro: ["Ricevuto. Inserisco l'attività nel task manager per follow-up immediato.", "Procedo all'analisi del progetto come richiesto. Le invierò aggiornamenti.", "Confermo i dettagli. Sistemo la bozza e procedo all'invio professionale."],
                funny: ["Lavoro? Ma non dovevamo andare ai tropici? 😂 Ok, procediamo.", "Sei un instancabile lavoratore! Dammi 2 minuti e sistemo tutto.", "Capo, il progetto è in mani sicure. Forse."],
                cold: ["Ok. Procedo.", "Task ricevuto.", "In lavorazione."]
            },
            emotional: {
                gentle: [
                    "Anche tu mi manchi molto. Ogni momento lontano è un'attesa del nostro prossimo incontro. ❤️",
                    "Sei sempre nel mio cuore. Ti mando tutta la dolcezza del mondo.",
                    "Sentire la tua mancanza mi ricorda quanto sei speciale per me. Un abbraccio immenso.",
                    "Vorrei essere lì con te in questo momento. Mi manchi davvero tanto."
                ],
                pro: [
                    "Apprezzo sinceramente il tuo pensiero e i sentimenti che condividi. La tua presenza è fondamentale.",
                    "La tua vicinanza ha un valore inestimabile per me. Spero di poter ricambiare presto il tuo affetto.",
                    "Ti ringrazio per la tua onestà emotiva. Resto a tua disposizione con tutto il mio supporto.",
                    "È un onore sapere di mancarti. Farò il possibile per essere presente al più presto."
                ],
                funny: [
                    "Ehi! Mi manchi già? Ma se sono l'unica cosa che vedi tutto il giorno! 😂",
                    "Attenzione: rilevata mancanza acuta di carboidrati e di te! Urge rimedio immediato. 🚨",
                    "Sei un romanticone senza speranza! Ma confesso... anch'io un pochino.",
                    "Ti manco così tanto? Mi farai montare la testa! 😎"
                ],
                cold: ["Ricevuto. Lo so.", "Va bene.", "Capito.", "Sì, anche qui."]
            },
            general: {
                gentle: [
                    "Che bella cosa! Raccontami pure i dettagli, ti ascolto con tutto l'interesse del mondo. 😊",
                    "Sembra un'ottima iniziativa, sono assolutamente d'accordo con te. Procediamo pure!",
                    "Capisco perfettamente quello che provi, sembra una scelta molto saggia e ponderata.",
                    "Sono così felice di sentirti! Dimmi tutto, sono qui per darti supporto."
                ],
                pro: [
                    "Punto estremamente interessante. Valutiamo attentamente l'efficacia di questa proposta.",
                    "Procediamo con la pianificazione strategica di questo specifico argomento per massimizzare i risultati.",
                    "Analisi in corso. Suggerisco di approfondire gli aspetti tecnici e operativi della questione.",
                    "Confermo la ricezione. Procederò ad elaborare una soluzione professionale ed efficiente."
                ],
                funny: [
                    "Ma dai! Questa proprio non l'avevo mai sentita. Incredibile ma vero! 😂",
                    "Sei un vulcano di idee! Vediamo dove ci porterà questa nuova avventura oggi.",
                    "Ma che roba! Nemmeno nei fumetti di supereroi succederebbe una cosa simile.",
                    "Ma l'hai sognato di notte o sei un genio incompreso? Racconta tutto!"
                ],
                cold: ["Capito.", "Visto.", "Ok.", "Procedi."]
            }
        };

        const category = library[context.intent] || library.general;
        const responses = category[tone] || category.gentle;

        let finalResponses = [...responses];

        // Premium+ logic: Psychological Analysis
        if (tier === 'premium_plus') {
            const psycho = {
                urgent: "[UnStuck Analysis: Stato di urgenza/ansia elevato]",
                positive: "[UnStuck Analysis: Mood positivo ed entusiasta]",
                negative: "[UnStuck Analysis: Tone deluso o critico]",
                emotional: "[UnStuck Analysis: Forte legame affettivo/nostalgia]",
                neutral: "[UnStuck Analysis: Comunicazione neutra/informativa]"
            };
            const prefix = psycho[context.intent === 'emotional' ? 'emotional' : context.sentiment] || psycho.neutral;
            finalResponses = finalResponses.map(r => `${prefix} ${r}`);
        }

        return finalResponses.sort(() => 0.5 - Math.random()).slice(0, 3);
    }
};

window.CopyChatStorage = CopyChatStorage;
