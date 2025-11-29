// =============================================================================
// Footer Moderne JavaScript - Hackathon 2025
// Fonctionnalités interactives et animations du footer
// =============================================================================

document.addEventListener('DOMContentLoaded', function() {
    initializeModernFooter();
});

function initializeModernFooter() {
    setupNewsletterSubscription();
    setupStatsAnimation();
    setupSmoothScrolling();
    setupParticleAnimation();
    
    console.log('🚀 Footer moderne initialisé');
}

// =============================================================================
// Inscription Newsletter
// =============================================================================

function subscribeNewsletter(event) {
    event.preventDefault();
    
    const form = event.target;
    const emailInput = form.querySelector('.newsletter-input');
    const submitBtn = form.querySelector('.newsletter-btn');
    const email = emailInput.value.trim();
    
    // Validation email
    if (!isValidEmail(email)) {
        showFooterNotification('Veuillez entrer une adresse email valide', 'error');
        emailInput.classList.add('newsletter-error');
        setTimeout(() => emailInput.classList.remove('newsletter-error'), 3000);
        return;
    }
    
    // Animation du bouton
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;
    
    // Simulation d'envoi (remplacer par votre API)
    setTimeout(() => {
        // Succès
        submitBtn.innerHTML = '<i class="fas fa-check"></i>';
        submitBtn.classList.add('newsletter-success');
        emailInput.value = '';
        emailInput.classList.add('newsletter-success');
        
        showFooterNotification('✅ Inscription réussie ! Merci de rejoindre la communauté NexGen Labs', 'success');
        
        // Réinitialiser après 3 secondes
        setTimeout(() => {
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            submitBtn.classList.remove('newsletter-success');
            emailInput.classList.remove('newsletter-success');
        }, 3000);
        
        // Mettre à jour les statistiques
        updateUserStats();
        
    }, 1500);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// =============================================================================
// Animation des statistiques
// =============================================================================

function setupStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    
    // Observer pour déclencher l'animation au scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumber(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
    
    // Mise à jour périodique des stats
    setInterval(() => {
        updateRealTimeStats();
    }, 30000); // Toutes les 30 secondes
}

function animateStatNumber(element) {
    const finalValue = element.textContent;
    const numericValue = parseFloat(finalValue.replace(/[^0-9.]/g, ''));
    const suffix = finalValue.replace(/[0-9.]/g, '');
    
    let currentValue = 0;
    const increment = numericValue / 50;
    const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= numericValue) {
            currentValue = numericValue;
            clearInterval(timer);
        }
        
        element.textContent = formatStatNumber(currentValue) + suffix;
        element.parentElement.classList.add('stats-counting');
        
        setTimeout(() => {
            element.parentElement.classList.remove('stats-counting');
        }, 100);
    }, 40);
}

function formatStatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return Math.floor(num).toString();
}

function updateUserStats() {
    const userCountElement = document.getElementById('userCount');
    if (userCountElement) {
        const currentValue = parseFloat(userCountElement.textContent.replace(/[^0-9.]/g, ''));
        const newValue = currentValue + 0.1;
        userCountElement.textContent = formatStatNumber(newValue * 1000) + '+';
        userCountElement.parentElement.classList.add('stats-counting');
        setTimeout(() => {
            userCountElement.parentElement.classList.remove('stats-counting');
        }, 500);
    }
}

function updateRealTimeStats() {
    // Simulation de mise à jour des stats en temps réel
    const stats = [
        { id: 'userCount', increment: Math.random() * 5 },
        { id: 'botCount', increment: Math.random() * 2 },
        { id: 'messageCount', increment: Math.random() * 100 }
    ];
    
    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) {
            const currentValue = parseFloat(element.textContent.replace(/[^0-9.]/g, ''));
            const suffix = element.textContent.replace(/[0-9.]/g, '');
            const newValue = currentValue + stat.increment;
            
            element.textContent = formatStatNumber(newValue * (stat.id === 'messageCount' ? 1000 : 1000)) + suffix;
            
            // Animation de mise à jour
            element.parentElement.style.transform = 'scale(1.05)';
            element.parentElement.style.borderColor = 'var(--footer-accent)';
            
            setTimeout(() => {
                element.parentElement.style.transform = 'scale(1)';
                element.parentElement.style.borderColor = 'var(--footer-border)';
            }, 300);
        }
    });
}

// =============================================================================
// Scroll fluide pour les liens d'ancre
// =============================================================================

function setupSmoothScrolling() {
    const footerLinks = document.querySelectorAll('.footer-links a[href^="#"]');
    
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Feedback visuel
                this.style.color = 'var(--footer-accent)';
                setTimeout(() => {
                    this.style.color = '';
                }, 1000);
            }
        });
    });
}

// =============================================================================
// Animation des particules
// =============================================================================

function setupParticleAnimation() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        // Randomiser la position initiale
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        particle.style.left = randomX + '%';
        particle.style.top = randomY + '%';
        
        // Randomiser l'animation
        const duration = 5 + Math.random() * 10;
        const delay = Math.random() * 5;
        
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';
        
        // Changer la couleur périodiquement
        setInterval(() => {
            const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.backgroundColor = randomColor;
        }, 3000 + index * 1000);
    });
}

// =============================================================================
// Notifications du footer
// =============================================================================

function showFooterNotification(message, type) {
    // Supprimer les notifications existantes
    const existingNotification = document.querySelector('.footer-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Créer la nouvelle notification
    const notification = document.createElement('div');
    notification.className = 'footer-notification';
    
    const icon = type === 'success' ? 'check-circle' : 
                 type === 'error' ? 'exclamation-circle' : 'info-circle';
    const color = type === 'success' ? '#10b981' : 
                  type === 'error' ? '#ef4444' : '#3b82f6';
    
    notification.innerHTML = 
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-" style="color: ; font-size: 1.2rem;"></i>
            <span></span>
        </div>
    ;
    
    document.body.appendChild(notification);
    
    // Auto-suppression après 5 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-in forwards';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 5000);
}

// =============================================================================
// Interactions avancées
// =============================================================================

// Effet de hover sur les sections
document.addEventListener('DOMContentLoaded', function() {
    const footerSections = document.querySelectorAll('.footer-section');
    
    footerSections.forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        section.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Détection de scroll pour animations
let footerVisible = false;
function checkFooterVisibility() {
    const footer = document.querySelector('.nexgen-footer');
    if (!footer) return;
    
    const footerTop = footer.offsetTop;
    const scrollPosition = window.pageYOffset + window.innerHeight;
    
    if (scrollPosition > footerTop && !footerVisible) {
        footerVisible = true;
        footer.classList.add('footer-in-view');
        
        // Déclencher les animations
        setTimeout(() => {
            const sections = footer.querySelectorAll('.footer-section');
            sections.forEach((section, index) => {
                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, index * 150);
            });
        }, 100);
    }
}

window.addEventListener('scroll', checkFooterVisibility);
window.addEventListener('load', checkFooterVisibility);

// =============================================================================
// Easter Eggs et interactions cachées
// =============================================================================

// Konami Code pour activer le mode "développeur"
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        activateDeveloperMode();
        konamiCode = [];
    }
});

function activateDeveloperMode() {
    showFooterNotification('🚀 Mode développeur activé ! Easter egg découvert !', 'success');
    
    // Effet spécial sur les particules
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        particle.style.animation = 'none';
        particle.style.background = 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 20px currentColor';
        
        // Animation rainbow
        particle.style.animation = 'rainbowFloat 2s infinite ease-in-out';
    });
    
    // Ajouter l'animation CSS
    if (!document.getElementById('rainbow-animation')) {
        const style = document.createElement('style');
        style.id = 'rainbow-animation';
        style.textContent = 
            @keyframes rainbowFloat {
                0%, 100% { 
                    transform: translateY(0) rotate(0deg) scale(1);
                    filter: hue-rotate(0deg);
                }
                25% { 
                    transform: translateY(-20px) rotate(90deg) scale(1.2);
                    filter: hue-rotate(90deg);
                }
                50% { 
                    transform: translateY(-10px) rotate(180deg) scale(0.8);
                    filter: hue-rotate(180deg);
                }
                75% { 
                    transform: translateY(-30px) rotate(270deg) scale(1.4);
                    filter: hue-rotate(270deg);
                }
            }
        ;
        document.head.appendChild(style);
    }
    
    // Réinitialiser après 10 secondes
    setTimeout(() => {
        location.reload();
    }, 10000);
}

// Clic triple sur le logo pour afficher les infos de debug
let logoClickCount = 0;
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.logo-icon');
    if (logo) {
        logo.addEventListener('click', function() {
            logoClickCount++;
            
            if (logoClickCount === 3) {
                showDebugInfo();
                logoClickCount = 0;
            }
            
            setTimeout(() => {
                logoClickCount = 0;
            }, 2000);
        });
    }
});

function showDebugInfo() {
    const debugInfo = {
        'Version': '2.0.1-hackathon',
        'Build': 'Production',
        'Framework': 'ASP.NET Core 8.0',
        'Dernière MAJ': new Date().toLocaleString('fr-FR'),
        'Thème': 'Futuristic Modern',
        'Easter Eggs': '3 discovered'
    };
    
    let debugText = '🔧 Informations de Debug:\n\n';
    Object.entries(debugInfo).forEach(([key, value]) => {
        debugText += ${key}: \n;
    });
    
    showFooterNotification(debugText.replace(/\n/g, '<br>'), 'info');
}

console.log('✅ Footer moderne JavaScript chargé avec succès');
