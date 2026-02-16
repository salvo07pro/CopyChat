const CopyChatStorage = {
    getStorageData: () => {
        const data = localStorage.getItem('copychatt_v7');
        if (!data) return {
            user: null,
            count: 0,
            date: new Date().toLocaleDateString(),
            tier: 'base',
            theme: 'dark',
            botStyle: 'default',
            geminiKey: '',
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
        if (lower.includes('ti amo') || lower.includes('voglio bene') || lower.includes('tesoro')) intent = 'love';
        else if (lower.includes('manchi') || lower.includes('cuore')) intent = 'emotional';
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

    BOT_STYLES: {
        default: { name: "UnStuck", prefix: "", suffix: "" },
        fortnite: { name: "Fortnite", prefix: "[Victory Royale] ", suffix: " #Loot" },
        minecraft: { name: "Minecraft", prefix: "[Crafting] ", suffix: " *creeper sound*" },
        rocket: { name: "Rocket League", prefix: "[Goal!] ", suffix: " #Boost" },
        gta: { name: "GTA V", prefix: "[Mission Passed] ", suffix: " $1.000.000" },
        fifa: { name: "FC24", prefix: "[GOL!] ", suffix: " +3 Punti" },
        elon: { name: "Elon Musk", prefix: "[X] ", suffix: " #Mars" },
        ironman: { name: "Iron Man", prefix: "Jarvis, ", suffix: " - Fine trasmissione" },
        spiderman: { name: "Spider-Man", prefix: "Ehi, ", suffix: " #Spidey" },
        joker: { name: "Joker", prefix: "Perché sei così serio? ", suffix: " *hahaha*" },
        cr7: { name: "CR7", prefix: "SIUUU! ", suffix: " #IlMigliore" },
        messi: { name: "Messi", prefix: "Hola, ", suffix: " #GOAT" },
        jobs: { name: "Steve Jobs", prefix: "Stay hungry, ", suffix: " #ThinkDifferent" },
        batman: { name: "Batman", prefix: "Sono la notte. ", suffix: " #Giustizia" },
        sherlock: { name: "Sherlock", prefix: "Elementare, ", suffix: " #Indizio" },
        pirate: { name: "Pirata", prefix: "Arrr, ", suffix: " #Tesoro" },
        viking: { name: "Vichingo", prefix: "Per il Valhalla! ", suffix: " #Ascia" },
        samurai: { name: "Samurai", prefix: "Onore. ", suffix: " #Bushido" },
        chef: { name: "Chef", prefix: "Manca sale, ", suffix: " #Gusto" },
        rapper: { name: "Rapper", prefix: "Ehi yo, ", suffix: " #Trap" },
        robot: { name: "Robot", prefix: "Beep Boop. ", suffix: " #Logic" }
    },

    // Internal Intelligence Response Generation (No API Key Required)
    generateInternalAIResponse: async (chatText, tone = 'gentle', tier = 'base') => {
        // AI Thought Simulation delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const context = CopyChatStorage.analyzeContext(chatText);
        const library = {
            greeting: {
                gentle: ["Ehilà! Spero che tu stia passando una splendida giornata.", "Ciao! Che piacere sentirti, come vanno le cose?", "Ehi! È sempre un piacere scambiare due chiacchiere con te."],
                pro: ["Buongiorno. Confermo la ricezione del messaggio e resto in attesa.", "Saluti. Come posso assisterla professionalmente oggi?", "Buongiorno, procediamo pure con i punti della conversazione."],
                funny: ["Ancora tu? Ma non ti stanchi mai di me? Scherzo!", "Ehi! Il re della chat è tornato in città.", "Pura energia! Spara pure prima che mi dimentichi."],
                cold: ["Ricevuto. Sto ascoltando.", "Sì, dimmi.", "In attesa."]
            },
            conflict: {
                gentle: ["Mi dispiace davvero molto sentirlo. Forse parlarne con calma aiuterebbe.", "Capisco che sia un momento di tensione. Io sono qui per te.", "Forse un po' di spazio ci farà bene a entrambi per riflettere."],
                pro: ["Prendo atto delle sue divergenze. Suggerisco un approccio più analitico.", "Valutiamo le opzioni disponibili per risolvere questo punto di attrito.", "Procediamo alla risoluzione del problema senza coinvolgimenti emotivi."],
                funny: ["Uff, quanta drammaticità! Ma sorridi un po', la vita è bella!", "Oggi siamo decisamente in modalità soap opera, eh?", "Sei più difficile da gestire di un bug al lunedì mattina!"],
                cold: ["Va bene. Se questo è ciò che vuoi.", "Decisione registrata.", "Basta così."]
            },
            work: {
                gentle: ["Certamente! Mi occupo subito di questa cosa, non preoccuparti.", "Ottima idea sul progetto, ci lavoriamo insieme con calma.", "Ricevuto, ti do una mano volentieri con questa mail."],
                pro: ["Ricevuto. Inserisco l'attività nel task manager per follow-up immediato.", "Procedo all'analisi del progetto come richiesto. Le invierò aggiornamenti.", "Confermo i dettagli. Sistemo la bozza e procedo all'invio professionale."],
                funny: ["Lavoro? Ma non dovevamo andare ai tropici? Ok, procediamo.", "Sei un instancabile lavoratore! Dammi 2 minuti e sistemo tutto.", "Capo, il progetto è in mani sicure. Forse."],
                cold: ["Ok. Procedo.", "Task ricevuto.", "In lavorazione."]
            },
            emotional: {
                gentle: [
                    "Anche tu mi manchi molto. Ogni momento lontano è un'attesa del nostro prossimo incontro.",
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
                    "Ehi! Mi manchi già? Ma se sono l'unica cosa che vedi tutto il giorno!",
                    "Attenzione: rilevata mancanza acuta di carboidrati e di te! Urge rimedio immediato.",
                    "Sei un romanticone senza speranza! Ma confesso... anch'io un pochino.",
                    "Ti manco così tanto? Mi farai montare la testa!"
                ],
                cold: ["Ricevuto. Lo so.", "Va bene.", "Capito.", "Sì, anche qui."]
            },
            love: {
                gentle: ["Anch'io ti voglio bene. Sei una persona davvero speciale per me.", "Le tue parole mi scaldano il cuore. Grazie di esserci.", "Sei il mio pensiero più bello. Ti voglio un bene immenso."],
                pro: ["Ricambio sinceramente il tuo affetto. La nostra intesa è molto importante.", "Apprezzo molto la tua dichiarazione. Procediamo insieme con fiducia.", "Il tuo sentimento è prezioso. Farò del mio meglio per onorarlo."],
                funny: ["Attenzione: rilevata eccessiva dose di dolcezza. Mi fai arrossire i circuiti!", "Sei un romanticone irrecuperabile! Ma confesso che mi piace.", "Così mi fai sciogliere! Mi servirebbe un ventilatore per la commozione."],
                cold: ["Ricevuto.", "Bene.", "Capito.", "Ok."]
            },
            general: {
                gentle: [
                    "Che bella cosa! Raccontami pure i dettagli, ti ascolto con tutto l'interesse del mondo.",
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
                    "Ma dai! Questa proprio non l'avevo mai sentita. Incredibile ma vero!",
                    "Sei un vulcano di idee! Vediamo dove ci porterà questa nuova avventura oggi.",
                    "Ma che roba! Nemmeno nei fumetti di supereroi succederebbe una cosa simile.",
                    "Ma l'hai sognato di notte o sei un genio incompreso? Racconta tutto!"
                ],
                cold: ["Capito.", "Visto.", "Ok.", "Procedi."]
            }
        };

        const category = library[context.intent] || library.general;

        // Always generate 4 responses, one for each tone
        const finalResponses = ['gentle', 'pro', 'funny', 'cold'].map(t => {
            const list = category[t] || category.gentle;
            let resp = list[Math.floor(Math.random() * list.length)];

            let analysis = null;
            if (tier === 'premium_plus') {
                const psycho = {
                    urgent: "Stato di urgenza o ansia elevato",
                    positive: "Mood positivo ed entusiasta",
                    negative: "Tone deluso o critico",
                    emotional: "Forte legame affettivo o nostalgia",
                    love: "Dichiarazione affettiva profonda",
                    neutral: "Comunicazione neutra o informativa"
                };
                analysis = psycho[context.intent] || psycho[context.sentiment] || psycho.neutral;
            }

            // Apply Bot Style Transform
            const state = CopyChatStorage.getStorageData();
            const botStyle = CopyChatStorage.BOT_STYLES[state.botStyle] || CopyChatStorage.BOT_STYLES.default;

            let finalText = `${botStyle.prefix}${resp}${botStyle.suffix}`;

            // Add a label for the user to understand the tone context
            const labels = { gentle: 'Gentile', pro: 'Professionale', funny: 'Simpatico', cold: 'Distaccato' };
            return { text: finalText, label: labels[t], analysis: analysis };
        });

        return finalResponses;
    },

    generateGeminiResponse: async (chatText, botStyle, tier) => {
        const state = CopyChatStorage.getStorageData();
        if (!state.geminiKey) throw new Error("API Key missing");

        const prompt = `
            Sei un assistente AI super intelligente chiamato UnStuck.
            Devi analizzare questo messaggio: "${chatText}"
            
            RISPONDI ESCLUSIVAMENTE IN FORMATO JSON VALIDO con questa struttura:
            {
                "analysis": "Breve analisi psicologica del messaggio (max 10 parole)",
                "responses": {
                    "gentle": "Risposta in stile gentile",
                    "pro": "Risposta in stile professionale",
                    "funny": "Risposta in stile simpatico",
                    "cold": "Risposta in stile distaccato"
                }
            }

            REGOLE CRITICHE:
            1. Usa la personalità: "${botStyle.name}". (Prefisso: ${botStyle.prefix}, Suffisso: ${botStyle.suffix})
            2. NON USARE EMOJI.
            3. Lingua: Italiano.
            4. Se lo stile è Fortnite/Minecraft/ecc, usa il loro gergo specifico nel testo.
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${state.geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });

        if (!response.ok) throw new Error("Gemini API Error");
        const data = await response.json();
        const result = JSON.parse(data.candidates[0].content.parts[0].text);

        return ['gentle', 'pro', 'funny', 'cold'].map(t => {
            const labels = { gentle: 'Gentile', pro: 'Professionale', funny: 'Simpatico', cold: 'Distaccato' };
            return {
                text: `${botStyle.prefix}${result.responses[t]}${botStyle.suffix}`,
                label: labels[t],
                analysis: tier === 'premium_plus' ? result.analysis : null
            };
        });
    }
};

window.CopyChatStorage = CopyChatStorage;
