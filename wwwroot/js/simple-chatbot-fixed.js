// ============================================================================
// Simple Chatbot - Version corrigée pour le problème du widget flottant
// ============================================================================

class SimpleChatbot {
    constructor() {
        this.isOpen = false;
        this.responses = this.getSimpleResponses();
        this.chatElement = null;
        this.initialized = false;
    }

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
                "À partir de 29€/mois pour le plan de base. Contactez-nous pour plus d''infos !"
            ],
            contact: [
                "Email : hello@nexgen-labs.com\nTéléphone : +33 1 23 45 67 89",
                "Vous pouvez nous écrire à hello@nexgen-labs.com ou utiliser ce chat !"
            ],
            aide: [
                "Je peux vous renseigner sur nos services, tarifs et vous mettre en contact avec l''équipe.",
                "Posez-moi vos questions sur NexGen, nos solutions ou nos tarifs !"
            ],
            defaut: [
                "Je ne suis pas sûr de comprendre. Pouvez-vous reformuler ?",
                "Désolé, je n''ai pas la réponse. Contactez notre équipe pour plus d''aide !",
                "Question intéressante ! Notre équipe pourra mieux vous répondre."
            ],
            aurevoir: [
                "Au revoir ! N''hésitez pas à revenir si vous avez d''autres questions.",
                "À bientôt ! Bonne journée !"
            ]
        };
    }

    analyzeMessage(message) {
        const msg = message.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (/(bonjour|salut|hello|hey|hi)/.test(msg)) return "salutations";
        if (/(service|chatbot|solution|offre|produit)/.test(msg)) return "services";
        if (/(prix|tarif|cout|euro|plan|abonnement)/.test(msg)) return "prix";
        if (/(contact|email|telephone|joindre|appeler)/.test(msg)) return "contact";
        if (/(aide|help|comment|assistance|info)/.test(msg)) return "aide";
        if (/(au revoir|bye|merci|a bientot|ciao)/.test(msg)) return "aurevoir";
        return "defaut";
    }

    init() {
        if (this.initialized) {
            console.warn("[SimpleChatbot] Déjà initialisé");
            return;
        }

        console.log("[SimpleChatbot] Initialisation...");
        
        // Créer le widget de chat
        this.createChatWidget();
        
        // Attacher les événements
        this.attachEventListeners();
        
        // Attacher le bouton flottant
        this.attachFloatingButton();
        
        // Message de bienvenue
        this.addWelcomeMessage();
        
        this.initialized = true;
        console.log("[SimpleChatbot] Initialisé avec succès");
    }

    createChatWidget() {
        // Supprimer l''ancien widget s''il existe
        const existingChat = document.getElementById("simple-chatbot");
        if (existingChat) {
            existingChat.remove();
        }

        const chatHTML = `
            <div id="simple-chatbot" class="simple-chatbot" role="dialog" aria-label="Chatbot simple" style="display: none;">
                <div class="simple-chat-header">
                    <span>🤖 Assistant NexGen</span>
                    <button type="button" class="simple-chat-close" id="simpleChatClose" aria-label="Fermer">&times;</button>
                </div>
                <div class="simple-chat-messages" id="simpleChatMessages"></div>
                <div class="simple-chat-input">
                    <input type="text" id="simpleChatInput" placeholder="Tapez votre message..." aria-label="Votre message" />
                    <button type="button" id="simpleChatSend" aria-label="Envoyer">➤</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML("beforeend", chatHTML);
        this.chatElement = document.getElementById("simple-chatbot");
    }

    attachEventListeners() {
        const input = document.getElementById("simpleChatInput");
        const sendBtn = document.getElementById("simpleChatSend");
        const closeBtn = document.getElementById("simpleChatClose");
        
        if (sendBtn) {
            sendBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }
        
        if (input) {
            input.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener("click", (e) => {
                e.preventDefault();
                this.closeChat();
            });
        }
    }

    attachFloatingButton() {
        const floatingBtn = document.getElementById("quickStart");
        if (!floatingBtn) {
            console.error("[SimpleChatbot] Bouton flottant #quickStart introuvable");
            return;
        }

        // Supprimer tous les anciens gestionnaires
        floatingBtn.replaceWith(floatingBtn.cloneNode(true));
        const newBtn = document.getElementById("quickStart");
        
        // Attacher le nouveau gestionnaire
        newBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("[SimpleChatbot] Clic sur le bouton flottant détecté");
            this.openChat();
        });
        
        console.log("[SimpleChatbot] Bouton flottant configuré");
    }

    openChat() {
        if (!this.chatElement) {
            console.error("[SimpleChatbot] Élément de chat introuvable");
            return;
        }

        console.log("[SimpleChatbot] Ouverture du chat...");
        
        this.isOpen = true;
        this.chatElement.style.display = "flex";
        
        // Animation d''ouverture
        setTimeout(() => {
            this.chatElement.classList.add("simple-chat-open");
        }, 10);
        
        // Masquer le bouton flottant
        const floatingBtn = document.getElementById("quickStart");
        if (floatingBtn) {
            floatingBtn.style.display = "none";
        }
        
        // Focus sur l''input
        const input = document.getElementById("simpleChatInput");
        if (input) {
            setTimeout(() => input.focus(), 300);
        }
    }

    closeChat() {
        if (!this.chatElement) return;
        
        console.log("[SimpleChatbot] Fermeture du chat...");
        
        this.isOpen = false;
        this.chatElement.classList.remove("simple-chat-open");
        
        // Animation de fermeture
        setTimeout(() => {
            this.chatElement.style.display = "none";
            
            // Réafficher le bouton flottant
            const floatingBtn = document.getElementById("quickStart");
            if (floatingBtn) {
                floatingBtn.style.display = "flex";
            }
        }, 300);
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    sendMessage() {
        const input = document.getElementById("simpleChatInput");
        if (!input) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        // Ajouter le message utilisateur
        this.addMessage(message, "user");
        input.value = "";
        
        // Simuler une réponse du bot
        setTimeout(() => {
            const type = this.analyzeMessage(message);
            const responses = this.responses[type];
            const response = responses[Math.floor(Math.random() * responses.length)];
            this.addMessage(response, "bot");
        }, 600);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById("simpleChatMessages");
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement("div");
        messageDiv.className = `simple-message simple-${sender}-message`;
        messageDiv.textContent = text;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addWelcomeMessage() {
        setTimeout(() => {
            this.addMessage("Bonjour ! Posez-moi vos questions sur NexGen 🚀", "bot");
        }, 500);
    }
}

// ============================================================================
// Initialisation globale
// ============================================================================

function initializeChatbot() {
    if (window.simpleChatbot) {
        console.warn("[SimpleChatbot] Instance déjà créée");
        return;
    }
    
    console.log("[SimpleChatbot] Création de l''instance...");
    window.simpleChatbot = new SimpleChatbot();
    window.simpleChatbot.init();
}

// Initialisation à la fois pour le DOM chargé et l''état ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeChatbot);
} else {
    // DOM déjà chargé
    setTimeout(initializeChatbot, 100);
}

// Export pour debug
window.debugChatbot = function() {
    console.log("=== Debug Chatbot ===");
    console.log("Instance:", window.simpleChatbot);
    console.log("Bouton flottant:", document.getElementById("quickStart"));
    console.log("Chat element:", document.getElementById("simple-chatbot"));
    console.log("Initialized:", window.simpleChatbot ? window.simpleChatbot.initialized : "No instance");
};
