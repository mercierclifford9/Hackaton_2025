// ============================================================================
// Simple Chatbot - Version minimaliste (fix encodage et guillemets)
// ============================================================================

class SimpleChatbot {
    constructor() {
        this.isOpen = false;
        this.responses = this.getSimpleResponses();
        this.init();
    }

    // Réponses simples et directes
    getSimpleResponses() {
        return {
            salutations: [
                "Bonjour ! Comment puis-je vous aider ?",
                "Salut ! Que puis-je faire pour vous ?",
                "Hello ! En quoi puis-je vous assister ?"
            ],
            services: [
                "Nous créons des chatbots IA pour votre site web. Intégration simple en 5 minutes !",
                "NexGen propose des solutions de chatbot intelligents et personnalisables."
            ],
            prix: [
                "Nos tarifs :\n• Starter : 29€/mois\n• Pro : 79€/mois\n• Enterprise : sur devis",
                "À partir de 29€/mois pour le plan de base. Contactez-nous pour plus d'infos !"
            ],
            contact: [
                "Email : hello@nexgen-labs.com\nTéléphone : +33 1 23 45 67 89",
                "Vous pouvez nous écrire à hello@nexgen-labs.com ou utiliser ce chat !"
            ],
            aide: [
                "Je peux vous renseigner sur nos services, tarifs et vous mettre en contact avec l'équipe.",
                "Posez-moi vos questions sur NexGen, nos solutions ou nos tarifs !"
            ],
            defaut: [
                "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler ?",
                "Désolé, je n'ai pas la réponse. Contactez notre équipe pour plus d'aide !",
                "Question intéressante ! Notre équipe pourra mieux vous répondre."
            ],
            aurevoir: [
                "Au revoir ! N'hésitez pas à revenir si vous avez d'autres questions.",
                "À bientôt ! Bonne journée !"
            ]
        };
    }

    // Analyse simple des messages
    analyzeMessage(message) {
        const msg = message.toLowerCase();
        if (/(bonjour|salut|hello|hey)/.test(msg)) return 'salutations';
        if (/(service|chatbot|solution|offre)/.test(msg)) return 'services';
        if (/(prix|tarif|coût|€|plan)/.test(msg)) return 'prix';
        if (/(contact|email|téléphone|joindre)/.test(msg)) return 'contact';
        if (/(aide|help|comment|assistance)/.test(msg)) return 'aide';
        if (/(au revoir|bye|merci|à bientôt)/.test(msg)) return 'aurevoir';
        return 'defaut';
    }

    init() {
        this.createSimpleChatWidget();
        this.attachEventListeners();
        // message de bienvenue
        const messagesContainer = document.getElementById('simpleChatMessages');
        if (messagesContainer) {
            this.addMessage("Bonjour ! Posez-moi vos questions sur NexGen 😊", 'bot');
        }
        console.log('[SimpleChatbot] initialisé');
    }

    // Interface minimaliste
    createSimpleChatWidget() {
        if (document.getElementById('simple-chatbot')) return; // éviter doublons
        const chatHTML = `
            <div id="simple-chatbot" class="simple-chatbot" role="dialog" aria-label="Chatbot simple">
                <div class="simple-chat-header">
                    <span>💬 Assistant NexGen</span>
                    <button type="button" class="simple-chat-close" id="simpleChatClose" aria-label="Fermer">&times;</button>
                </div>
                <div class="simple-chat-messages" id="simpleChatMessages"></div>
                <div class="simple-chat-input">
                    <input type="text" id="simpleChatInput" placeholder="Tapez votre message..." aria-label="Votre message" />
                    <button type="button" id="simpleChatSend" aria-label="Envoyer">➤</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    // Événements simplifiés
    attachEventListeners() {
        const input = document.getElementById('simpleChatInput');
        const sendBtn = document.getElementById('simpleChatSend');
        const closeBtn = document.getElementById('simpleChatClose');
        
        if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());
        if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.sendMessage(); });
        if (closeBtn) closeBtn.addEventListener('click', () => this.toggleChat());
    }

    // Basculer le chat
    toggleChat() {
        const chatbot = document.getElementById('simple-chatbot');
        const floatingBtn = document.getElementById('quickStart');
        if (!chatbot) return;

        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            chatbot.style.display = 'flex';
            chatbot.classList.add('simple-chat-open');
            if (floatingBtn) floatingBtn.style.display = 'none';
            const input = document.getElementById('simpleChatInput');
            if (input) setTimeout(() => input.focus(), 30);
        } else {
            chatbot.classList.remove('simple-chat-open');
            setTimeout(() => {
                chatbot.style.display = 'none';
                if (floatingBtn) floatingBtn.style.display = 'flex';
            }, 200);
        }
    }

    // Envoyer message
    sendMessage() {
        const input = document.getElementById('simpleChatInput');
        if (!input) return;
        const message = input.value.trim();
        if (message) {
            this.addMessage(message, 'user');
            input.value = '';
            setTimeout(() => {
                const type = this.analyzeMessage(message);
                const responses = this.responses[type];
                const response = responses[Math.floor(Math.random() * responses.length)];
                this.addMessage(response, 'bot');
            }, 400);
        }
    }

    // Ajouter un message
    addMessage(text, sender) {
        const messagesContainer = document.getElementById('simpleChatMessages');
        if (!messagesContainer) return;
        const messageDiv = document.createElement('div');
        messageDiv.className = `simple-message simple-${sender}-message`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function bootstrapSimpleChatbot() {
    window.simpleChatbot = new SimpleChatbot();
    const floatingBtn = document.getElementById('quickStart');
    if (floatingBtn) {
        // Assure un seul handler
        floatingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.simpleChatbot) window.simpleChatbot.toggleChat();
        }, { once: false });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapSimpleChatbot);
} else {
    bootstrapSimpleChatbot();
}

// cache-bust marker
// updated: ' + (Get-Date).ToString() + '
