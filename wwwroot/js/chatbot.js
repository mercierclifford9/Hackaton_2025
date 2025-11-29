// ============================================================================
// Chatbot Frontend - NexGen Labs (Version améliorée)
// Chatbot interactif sans backend pour démonstration
// ============================================================================

class NexGenChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.responses = this.getResponses();
        this.currentContext = ''general'';
        this.userName = null;
        this.init();
        this.setupEventListeners();
    }

    // Réponses prédéfinies du chatbot (étendues)
    getResponses() {
        return {
            salutations: [
                "Bonjour ! 👋 Je suis l''assistant virtuel de NexGen. Comment puis-je vous aider ?",
                "Salut ! 🌟 Ravi de vous rencontrer. Que puis-je faire pour vous aujourd''hui ?",
                "Hello ! ✨ Je suis là pour répondre à vos questions sur NexGen et vous guider."
            ],
            horaires: [
                "Nos bureaux sont ouverts du lundi au vendredi de 9h à 18h. 🕘 Mais moi, je suis disponible 24h/24 !",
                "Notre équipe travaille du lundi au vendredi, 9h-18h. 📞 Pour un support immédiat, je suis là pour vous aider !"
            ],
            services: [
                "Nous créons des chatbots IA personnalisés ! 🤖 Nos services :\n• Configuration en 5 minutes ⚡\n• Training sur vos documents 📚\n• Widget responsive 📱\n• Support multilingue 🌍\n• Intégration 1-ligne 💻\n\nQue souhaitez-vous savoir de plus spécifique ?",
                "NexGen transforme vos FAQ en assistants intelligents ! ✨\n\nNos spécialités :\n🎯 Chatbots personnalisés\n🧠 IA conversationnelle\n🔧 Intégration facile\n📊 Analytics détaillés\n\nIntéressé par un domaine particulier ?"
            ],
            prix: [
                "Nos tarifs sont transparents ! 💰\n\n💡 **Starter** : 29€/mois\n• Jusqu''à 1000 conversations\n• 1 chatbot\n• Support email\n\n🚀 **Pro** : 79€/mois\n• Conversations illimitées\n• 5 chatbots\n• Analytics avancés\n• Support prioritaire\n\n🏢 **Enterprise** : Sur devis\n• Solutions sur mesure\n• Intégration personnalisée\n• Support dédié\n\nQuel plan vous intéresse ?",
                "Excellent choix de vous renseigner ! 📊 Nous avons 3 formules :\n\n🌱 Starter (29€/mois) - Parfait pour débuter\n⭐ Pro (79€/mois) - Notre plus populaire\n🏆 Enterprise - Pour les grandes entreprises\n\nVoulez-vous que je vous aide à choisir ?"
            ],
            demo: [
                "Fantastique ! 🎯 Vous utilisez actuellement notre démo live ! 🎮\n\nCe que vous voyez :\n✅ Interface conversationnelle\n✅ Réponses intelligentes\n✅ Design responsive\n✅ Intégration seamless\n\nImpressionnant non ? 😉 Voulez-vous voir d''autres fonctionnalités ?",
                "Vous êtes en pleine démo ! 🚀 Ce chatbot montre nos capacités :\n• Compréhension contextuelle\n• Réponses personnalisées\n• Interface élégante\n• Performance temps réel\n\nQue pensez-vous de l''expérience jusqu''ici ?"
            ],
            contact: [
                "Plusieurs façons de nous joindre ! 📬\n\n📧 **Email** : hello@nexgen-labs.com\n📞 **Téléphone** : +33 1 23 45 67 89\n💬 **Chat** : Ici même !\n🌐 **Site** : nexgen-labs.com\n📍 **Adresse** : 123 Avenue de l''Innovation, Paris\n\nQuel moyen préférez-vous ?",
                "Contactez-nous facilement ! 🤝\n\n• Email pour les questions détaillées\n• Téléphone pour un échange direct\n• Ce chat pour une aide immédiate\n• Notre site pour plus d''infos\n\nJe peux aussi programmer un rendez-vous ! 📅"
            ],
            aide: [
                "Je suis là pour vous aider ! 🎯 Voici mes spécialités :\n\n🛠️ **Services** - Découvrir nos solutions\n💰 **Tarifs** - Comparer les plans\n🎮 **Démonstrations** - Voir nos capacités\n🔧 **Support** - Résoudre vos questions\n📞 **Contact** - Parler à l''équipe\n🚀 **Création** - Démarrer votre projet\n\nQue vous interesse le plus ?",
                "Parfait ! Je peux vous accompagner sur :\n\n✨ Comprendre notre technologie\n💡 Choisir la bonne formule\n🎯 Planifier une démonstration\n🔧 Résoudre des problèmes techniques\n📞 Vous mettre en contact avec l''équipe\n\nPar où commençons-nous ?"
            ],
            creation: [
                "Excellent ! 🚀 Créer votre chatbot, c''est parti !\n\nÉtapes simples :\n1️⃣ **Configurez** - Nom, personnalité, domaine\n2️⃣ **Formez** - Uploadez vos documents/FAQ\n3️⃣ **Testez** - Vérifiez les réponses\n4️⃣ **Déployez** - Copiez le code d''intégration\n\nPar quelle étape voulez-vous commencer ?",
                "Super choix ! 🎯 En 5 minutes votre chatbot sera prêt :\n\n🎨 Personnalisation de l''interface\n🧠 Training sur vos contenus\n⚡ Test en temps réel\n💻 Code d''intégration automatique\n\nQuel type de site/business avez-vous ?"
            ],
            integration: [
                "L''intégration est ultra simple ! 💻\n\n**Méthode 1-ligne :**\n```html\n<script src=''//cdn.nexgen.com/widget.js'' data-key=''YOUR_KEY''></script>\n```\n\n**Ou méthode avancée :**\n```javascript\nNexGen.init({\n  apiKey: ''your-key'',\n  theme: ''dark'',\n  position: ''bottom-right''\n});\n```\n\nBesoin d''aide avec l''intégration ?",
                "C''est du copier-coller ! ⚡ Notre widget s''intègre sur :\n\n✅ WordPress, Shopify, Wix\n✅ React, Vue, Angular\n✅ HTML statique\n✅ CMS populaires\n\nSur quelle plateforme travaillez-vous ?"
            ],
            aurevoir: [
                "Ce fut un plaisir ! 😊 N''hésitez pas à revenir si vous avez d''autres questions.\n\nPetit rappel :\n📧 hello@nexgen-labs.com pour nous écrire\n🎯 Bouton ''Commencer'' pour créer votre chatbot\n\nBonne journée ! ✨",
                "Au revoir ! 👋 J''espère avoir pu vous aider.\n\n🎁 **Bonus** : Utilisez le code DEMO20 pour 20% de réduction sur votre premier mois !\n\nÀ très bientôt ! 🚀"
            ],
            defaut: [
                "Excellente question ! 🤔 Je vais faire de mon mieux pour vous aider.\n\nPouvez-vous me donner plus de détails ou choisir parmi ces sujets :\n• 🛠️ Nos services\n• 💰 Tarification\n• 🎮 Démonstration\n• 🔧 Support technique\n• 📞 Contact humain\n\nQu''est-ce qui vous intéresse le plus ?",
                "Hmm, je ne suis pas sûr de bien comprendre. 🤷‍♂️\n\nMais notre équipe sera ravie de vous aider ! Voulez-vous :\n• 📧 Envoyer un email à notre équipe\n• 📞 Programmer un appel\n• 🔄 Reformuler votre question\n• 🎯 Explorer nos services\n\nQue préférez-vous ?"
            ]
        };
    }

    // Analyse du message utilisateur et détermine le type de réponse
    analyzeMessage(message) {
        const msg = message.toLowerCase();
        
        // Détection des intentions avec plus de précision
        if (msg.match(/(bonjour|salut|hello|hey|bonsoir|coucou)/)) return ''salutations'';
        if (msg.match(/(horaire|heure|ouvert|fermé|quand|disponible)/)) return ''horaires'';
        if (msg.match(/(service|offre|propose|fait|chatbot|ia|intelligence|solution)/)) return ''services'';
        if (msg.match(/(prix|tarif|coût|combien|€|euro|plan|abonnement|forfait)/)) return ''prix'';
        if (msg.match(/(demo|démonstration|test|essai|voir|montrer|exemple)/)) return ''demo'';
        if (msg.match(/(contact|email|téléphone|joindre|appeler|parler|équipe)/)) return ''contact'';
        if (msg.match(/(aide|help|comment|puis-je|pouvez|assistance|support)/)) return ''aide'';
        if (msg.match(/(créer|création|commencer|démarrer|nouveau|projet|build)/)) return ''creation'';
        if (msg.match(/(intégr|install|code|embed|widget|script|html)/)) return ''integration'';
        if (msg.match(/(au revoir|bye|merci|à bientôt|tchao|stop|fin)/)) return ''aurevoir'';
        
        return ''defaut'';
    }

    // Configuration des événements personnalisés
    setupEventListeners() {
        // Écoute les événements personnalisés des pages
        document.addEventListener(''addBotMessage'', (event) => {
            this.addBotMessage(event.detail.message);
        });
        
        // Écoute les changements de contexte
        document.addEventListener(''setChatContext'', (event) => {
            this.currentContext = event.detail.context;
        });
    }

    // Initialise le chatbot
    init() {
        this.createChatWidget();
        this.attachEventListeners();
        setTimeout(() => this.addWelcomeMessage(), 1000);
    }

    // Crée la structure HTML du chatbot (améliorée)
    createChatWidget() {
        const chatHTML = `
            <div id="nexgen-chatbot" class="nexgen-chatbot">
                <div class="nexgen-chat-header">
                    <div class="nexgen-chat-avatar">
                        <div class="nexgen-avatar-icon">🤖</div>
                        <div class="nexgen-status-dot"></div>
                    </div>
                    <div class="nexgen-chat-info">
                        <h4>Assistant NexGen</h4>
                        <span class="nexgen-status">En ligne • Répond instantanément</span>
                    </div>
                    <div class="nexgen-header-actions">
                        <button class="nexgen-action-btn" id="refreshChatBtn" title="Nouveau chat">🔄</button>
                        <button class="nexgen-chat-close" id="closeChatBtn" title="Fermer">&times;</button>
                    </div>
                </div>
                
                <div class="nexgen-chat-messages" id="chatMessages">
                    <!-- Messages apparaîtront ici -->
                </div>
                
                <div class="nexgen-chat-input">
                    <div class="nexgen-quick-replies" id="quickReplies">
                        <button class="nexgen-quick-btn" data-message="Vos services">🛠️ Services</button>
                        <button class="nexgen-quick-btn" data-message="Vos tarifs">💰 Tarifs</button>
                        <button class="nexgen-quick-btn" data-message="Une démonstration">🎮 Démo</button>
                        <button class="nexgen-quick-btn" data-message="Créer mon chatbot">🚀 Créer</button>
                    </div>
                    <div class="nexgen-input-group">
                        <input type="text" id="chatInput" placeholder="Tapez votre message..." class="nexgen-input" autocomplete="off">
                        <button id="sendBtn" class="nexgen-send-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="nexgen-chat-footer">
                    <small>Propulsé par <strong>NexGen Labs</strong> ✨ • <span id="responseTime">Réponse moyenne: ~1s</span></small>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML(''beforeend'', chatHTML);
    }

    // Attache les événements (améliorés)
    attachEventListeners() {
        const chatInput = document.getElementById(''chatInput'');
        const sendBtn = document.getElementById(''sendBtn'');
        const closeChatBtn = document.getElementById(''closeChatBtn'');
        const refreshChatBtn = document.getElementById(''refreshChatBtn'');
        const quickReplies = document.querySelectorAll(''.nexgen-quick-btn'');
        
        // Bouton d''envoi
        sendBtn.addEventListener(''click'', () => this.sendMessage());
        
        // Entrée sur le champ de saisie
        chatInput.addEventListener(''keypress'', (e) => {
            if (e.key === ''Enter'' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Indicateur de frappe
        chatInput.addEventListener(''input'', () => {
            clearTimeout(this.typingTimeout);
            this.showTypingIndicator();
            this.typingTimeout = setTimeout(() => this.hideTypingIndicator(), 1000);
        });
        
        // Fermeture du chat
        closeChatBtn.addEventListener(''click'', () => this.toggleChat());
        
        // Rafraîchir le chat
        refreshChatBtn.addEventListener(''click'', () => this.refreshChat());
        
        // Réponses rapides
        quickReplies.forEach(btn => {
            btn.addEventListener(''click'', () => {
                const message = btn.getAttribute(''data-message'');
                this.addUserMessage(message);
                setTimeout(() => this.generateBotResponse(message), 600);
            });
        });
    }

    // Ajoute le message de bienvenue adaptatif
    addWelcomeMessage() {
        const page = document.title;
        let welcomeMsg = this.responses.salutations[0];
        
        if (page.includes(''Créer'')) {
            welcomeMsg = "Bonjour ! 🚀 Parfait, vous êtes sur la page de création ! Je vais vous guider étape par étape pour créer votre chatbot. Prêt à commencer ?";
        } else if (page.includes(''Documentation'')) {
            welcomeMsg = "Hello ! 📚 Je vois que vous consultez notre documentation. Des questions sur l''intégration ou la configuration ? Je suis là pour vous aider !";
        }
        
        this.addBotMessage(welcomeMsg);
    }

    // Rafraîchir le chat
    refreshChat() {
        const messagesContainer = document.getElementById(''chatMessages'');
        messagesContainer.innerHTML = '''';
        this.messages = [];
        this.addWelcomeMessage();
    }

    // Méthodes d''indication de frappe
    showTypingIndicator() {
        const statusSpan = document.querySelector(''.nexgen-status'');
        if (statusSpan) statusSpan.textContent = ''En train d''''écrire...'';
    }
    
    hideTypingIndicator() {
        const statusSpan = document.querySelector(''.nexgen-status'');
        if (statusSpan) statusSpan.textContent = ''En ligne • Répond instantanément'';
    }

    // Bascule l''ouverture/fermeture du chat (améliorée)
    toggleChat() {
        const chatbot = document.getElementById(''nexgen-chatbot'');
        const floatingBtn = document.getElementById(''quickStart'');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatbot.classList.add(''nexgen-chat-open'');
            floatingBtn.classList.add(''nexgen-btn-hidden'');
            // Focus avec un petit délai pour l''animation
            setTimeout(() => {
                const input = document.getElementById(''chatInput'');
                if (input) input.focus();
            }, 300);
        } else {
            chatbot.classList.remove(''nexgen-chat-open'');
            floatingBtn.classList.remove(''nexgen-btn-hidden'');
        }
    }

    // Envoie un message utilisateur (amélioré)
    sendMessage() {
        const input = document.getElementById(''chatInput'');
        const message = input.value.trim();
        
        if (message) {
            this.addUserMessage(message);
            input.value = '''';
            
            // Simule un délai de réponse réaliste
            const responseTime = Math.random() * 1000 + 500; // 500ms à 1.5s
            setTimeout(() => this.generateBotResponse(message), responseTime);
        }
    }

    // Ajoute un message utilisateur
    addUserMessage(message) {
        const messagesContainer = document.getElementById(''chatMessages'');
        const messageElement = this.createMessageElement(message, ''user'');
        messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        // Stocke le message
        this.messages.push({ type: ''user'', content: message, timestamp: new Date() });
    }

    // Ajoute un message du bot (amélioré)
    addBotMessage(message) {
        const messagesContainer = document.getElementById(''chatMessages'');
        
        // Indicateur de frappe
        const typingIndicator = this.createTypingIndicator();
        messagesContainer.appendChild(typingIndicator);
        this.scrollToBottom();
        
        setTimeout(() => {
            messagesContainer.removeChild(typingIndicator);
            const messageElement = this.createMessageElement(message, ''bot'');
            messagesContainer.appendChild(messageElement);
            this.scrollToBottom();
            
            // Stocke le message
            this.messages.push({ type: ''bot'', content: message, timestamp: new Date() });
        }, 1200);
    }

    // Crée un élément de message (amélioré)
    createMessageElement(message, sender) {
        const div = document.createElement(''div'');
        div.className = `nexgen-message nexgen-message-${sender}`;
        
        const time = new Date().toLocaleTimeString(''fr-FR'', { 
            hour: ''2-digit'', 
            minute: ''2-digit'' 
        });
        
        // Traitement des liens et formatting
        const formattedMessage = this.formatMessage(message);
        
        div.innerHTML = `
            <div class="nexgen-message-content">
                ${formattedMessage}
            </div>
            <div class="nexgen-message-time">${time}</div>
        `;
        
        return div;
    }

    // Formate les messages (nouveaux)
    formatMessage(message) {
        return message
            .replace(/\n/g, ''<br>'')
            .replace(/\*\*(.*?)\*\*/g, ''<strong>$1</strong>'')
            .replace(/\*(.*?)\*/g, ''<em>$1</em>'')
            .replace(/`(.*?)`/g, ''<code>$1</code>'')
            .replace(/```([\s\S]*?)```/g, ''<pre><code>$1</code></pre>'')
            .replace(/(https?:\/\/[^\s]+)/g, ''<a href="$1" target="_blank">$1</a>'');
    }

    // Crée l''indicateur de frappe (identique)
    createTypingIndicator() {
        const div = document.createElement(''div'');
        div.className = ''nexgen-message nexgen-message-bot nexgen-typing'';
        div.innerHTML = `
            <div class="nexgen-message-content">
                <div class="nexgen-typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        return div;
    }

    // Génère une réponse du bot (améliorée)
    generateBotResponse(userMessage) {
        const responseType = this.analyzeMessage(userMessage);
        const responses = this.responses[responseType];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        this.addBotMessage(randomResponse);
        
        // Suggestions de follow-up basées sur le contexte
        if (responseType === ''prix'') {
            setTimeout(() => {
                this.addBotMessage("💡 Astuce : Voulez-vous que je vous aide à choisir le plan qui correspond le mieux à vos besoins ?");
            }, 3000);
        }
    }

    // Fait défiler vers le bas
    scrollToBottom() {
        const messagesContainer = document.getElementById(''chatMessages'');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // API publique
    static getInstance() {
        return window.nexgenChatbot;
    }
    
    // Méthodes publiques
    sendCustomMessage(message) {
        this.addBotMessage(message);
    }
    
    setContext(context) {
        this.currentContext = context;
    }
}

// Initialise le chatbot quand la page est chargée
document.addEventListener(''DOMContentLoaded'', function() {
    // Initialise le chatbot
    window.nexgenChatbot = new NexGenChatbot();
    
    // Connecte le bouton flottant au chatbot
    const floatingBtn = document.getElementById(''quickStart'');
    if (floatingBtn) {
        floatingBtn.addEventListener(''click'', () => window.nexgenChatbot.toggleChat());
        
        // Améliore le bouton flottant avec une animation
        floatingBtn.style.transition = ''all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'';
    }
});
