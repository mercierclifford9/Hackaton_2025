// =============================================================================
// NexGen Labs - Create Form JavaScript
// Hackathon 2025 - Gestion du formulaire de création de chatbot
// =============================================================================

let currentStep = 1;
const totalSteps = 4;

// =============================================================================
// Initialisation principale - UNE SEULE FOIS
// =============================================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du formulaire Create');
    
    // Initialiser toutes les fonctionnalités
    setupStepNavigation();
    setupFormValidation();
    setupFileUpload();
    setupWebsitePreview();
    setupCharacterCounters();
    setupFloatingLabels();
    setupUrlAnalyzer();
    setupUrlValidation();
    setupAutoSave();
    
    console.log('✅ Formulaire de création initialisé avec succès');
});

// =============================================================================
// Navigation entre les étapes
// =============================================================================
function setupStepNavigation() {
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    console.log('🔧 Configuration de la navigation - nextBtn:', !!nextBtn);
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🖱️ Bouton suivant cliqué, étape actuelle:', currentStep);
            
            if (validateCurrentStep()) {
                console.log('✅ Validation réussie, passage à l\'étape suivante');
                nextStep();
            } else {
                console.log('❌ Validation échouée');
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            previousStep();
        });
    }
    
    // Navigation par clic sur les étapes
    document.querySelectorAll('.step').forEach((step, index) => {
        step.addEventListener('click', () => {
            const stepNumber = index + 1;
            if (stepNumber <= currentStep || isStepCompleted(stepNumber - 1)) {
                goToStep(stepNumber);
            }
        });
    });
}

function nextStep() {
    console.log('➡️ Avancement vers l\'étape suivante');
    if (currentStep < totalSteps) {
        hideCurrentStep();
        currentStep++;
        showCurrentStep();
        updateProgressBar();
        updateNavigationButtons();
    }
}

function previousStep() {
    console.log('⬅️ Retour à l\'étape précédente');
    if (currentStep > 1) {
        hideCurrentStep();
        currentStep--;
        showCurrentStep();
        updateProgressBar();
        updateNavigationButtons();
    }
}

function goToStep(stepNumber) {
    console.log('🎯 Navigation vers l\'étape:', stepNumber);
    if (stepNumber >= 1 && stepNumber <= totalSteps) {
        hideCurrentStep();
        currentStep = stepNumber;
        showCurrentStep();
        updateProgressBar();
        updateNavigationButtons();
    }
}

function hideCurrentStep() {
    const currentStepElement = document.getElementById('step-' + currentStep);
    if (currentStepElement) {
        currentStepElement.classList.remove('active');
        currentStepElement.style.opacity = '0';
        currentStepElement.style.transform = 'translateX(-50px)';
        
        setTimeout(() => {
            currentStepElement.style.display = 'none';
        }, 300);
    }
}

function showCurrentStep() {
    const nextStepElement = document.getElementById('step-' + currentStep);
    if (nextStepElement) {
        nextStepElement.style.display = 'block';
        nextStepElement.style.opacity = '0';
        nextStepElement.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            nextStepElement.classList.add('active');
            nextStepElement.style.opacity = '1';
            nextStepElement.style.transform = 'translateX(0)';
        }, 50);
        
        // Focus sur le premier champ de l'étape
        const firstInput = nextStepElement.querySelector('input, select, textarea');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 400);
        }
    }
}

function updateProgressBar() {
    document.querySelectorAll('.step').forEach((step, index) => {
        const stepNumber = index + 1;
        
        if (stepNumber < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

function updateNavigationButtons() {
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    console.log('🔄 Mise à jour des boutons de navigation');
    
    // Bouton précédent
    if (prevBtn) {
        prevBtn.style.display = currentStep > 1 ? 'block' : 'none';
    }
    
    // Boutons suivant/soumettre
    if (nextBtn && submitBtn) {
        if (currentStep < totalSteps) {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
            submitBtn.disabled = !isFormValid();
        }
    }
}

// =============================================================================
// Validation du formulaire - CORRIGÉE
// =============================================================================
function setupFormValidation() {
    const form = document.getElementById('chatbotForm');
    
    if (form) {
        form.addEventListener('input', (e) => {
            validateField(e.target);
            updateSubmitButton();
        });
        
        form.addEventListener('change', (e) => {
            validateField(e.target);
            updateSubmitButton();
        });
        
        form.addEventListener('submit', (e) => {
            if (!isFormValid()) {
                e.preventDefault();
                showFormErrors();
            } else {
                showSubmissionProgress();
            }
        });
    }
}

function validateCurrentStep() {
    const currentStepElement = document.getElementById('step-' + currentStep);
    console.log('🔍 Validation de l\'étape', currentStep);
    
    if (!currentStepElement) {
        console.log('❌ Élément d\'étape non trouvé');
        return false;
    }
    
    // Logique spéciale pour l'étape 3 (Site Web) - URL optionnelle
    if (currentStep === 3) {
        console.log('✅ Étape 3 (Site Web) - validation automatique (URL optionnelle)');
        return true;
    }
    
    const inputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
    console.log('📝 Champs requis trouvés:', inputs.length);
    
    let isValid = true;
    
    inputs.forEach(input => {
        const fieldValid = validateField(input);
        console.log('📋 Champ', input.name || input.id, 'valide:', fieldValid);
        if (!fieldValid) {
            isValid = false;
        }
    });
    
    console.log('📊 Étape valide:', isValid);
    return isValid;
}

function validateField(field) {
    if (!field) return true;
    
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Ce champ est requis';
    } else if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Adresse email invalide';
    } else if (field.type === 'url' && value && !isValidUrl(value)) {
        isValid = false;
        errorMessage = 'URL invalide';
    } else if (field.hasAttribute('maxlength')) {
        const maxLength = parseInt(field.getAttribute('maxlength'));
        if (value.length > maxLength) {
            isValid = false;
            errorMessage = 'Maximum ' + maxLength + ' caractères';
        }
    }
    
    showFieldError(field, isValid ? '' : errorMessage);
    return isValid;
}

function showFieldError(field, message) {
    const container = field.closest('.floating-label');
    let errorElement = container?.querySelector('.validation-message');
    
    if (!errorElement) {
        errorElement = container?.querySelector('.text-danger');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = message ? 'block' : 'none';
    }
    
    if (message) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
    } else {
        field.classList.remove('is-invalid');
        if (field.value.trim()) {
            field.classList.add('is-valid');
        }
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidUrl(url) {
    try {
        new URL(url);
        return url.startsWith('http://') || url.startsWith('https://');
    } catch {
        return false;
    }
}

function isStepCompleted(stepNumber) {
    const stepElement = document.getElementById('step-' + stepNumber);
    if (!stepElement) return false;
    
    // L'étape 3 (Site Web) est toujours considérée comme complète
    if (stepNumber === 3) {
        return true;
    }
    
    const requiredInputs = stepElement.querySelectorAll('input[required], select[required], textarea[required]');
    return Array.from(requiredInputs).every(input => input.value.trim() !== '');
}

function isFormValid() {
    for (let i = 1; i <= totalSteps; i++) {
        const stepElement = document.getElementById('step-' + i);
        if (!stepElement) continue;
        
        // Ignorer la validation pour l'étape 3 (Site Web optionnel)
        if (i === 3) continue;
        
        const inputs = stepElement.querySelectorAll('input, select, textarea');
        const isStepValid = Array.from(inputs).every(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                return false;
            }
            return validateField(input);
        });
        
        if (!isStepValid) return false;
    }
    return true;
}

function updateSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn && currentStep === totalSteps) {
        submitBtn.disabled = !isFormValid();
    }
}

function showFormErrors() {
    for (let i = 1; i <= totalSteps; i++) {
        if (!isStepCompleted(i)) {
            goToStep(i);
            break;
        }
    }
    showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
}

function showSubmissionProgress() {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Création en cours...';
    }
    showNotification('Création de votre chatbot en cours...', 'info');
}
// =============================================================================
// Gestion de l'upload de fichiers
// =============================================================================
function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('documents');
    
    if (!uploadArea || !fileInput) return;
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        handleFileSelection(files);
    });
    
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFileSelection(files);
    });
}

function handleFileSelection(files) {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.csv'];
    const maxFileSize = 10 * 1024 * 1024;
    const maxFiles = 10;
    
    const validFiles = files.filter(file => {
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(extension)) {
            showNotification('Fichier ' + file.name + ' : format non supporté', 'error');
            return false;
        }
        
        if (file.size > maxFileSize) {
            showNotification('Fichier ' + file.name + ' : taille trop importante (max 10MB)', 'error');
            return false;
        }
        
        return true;
    });
    
    if (validFiles.length > maxFiles) {
        showNotification('Maximum ' + maxFiles + ' fichiers autorisés', 'error');
        return;
    }
    
    displayUploadedFiles(validFiles);
}

function displayUploadedFiles(files) {
    const container = document.getElementById('uploadedFiles');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (files.length > 0) {
        container.style.display = 'block';
        files.forEach((file, index) => {
            const fileItem = createFileItem(file, index);
            container.appendChild(fileItem);
        });
    } else {
        container.style.display = 'none';
    }
}

function createFileItem(file, index) {
    const item = document.createElement('div');
    item.className = 'uploaded-file-item';
    
    const iconClass = getFileIcon(file.name);
    const fileSize = formatFileSize(file.size);
    
    item.innerHTML = 
        '<div class="file-info">' +
            '<i class="' + iconClass + '"></i>' +
            '<div class="file-details">' +
                '<div class="file-name">' + file.name + '</div>' +
                '<div class="file-size">' + fileSize + '</div>' +
            '</div>' +
        '</div>' +
        '<button type="button" class="btn-remove" onclick="removeFile(' + index + ')" title="Supprimer">' +
            '<i class="fas fa-times"></i>' +
        '</button>';
    
    return item;
}

function getFileIcon(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch (extension) {
        case 'pdf': return 'fas fa-file-pdf text-danger';
        case 'doc':
        case 'docx': return 'fas fa-file-word text-primary';
        case 'txt': return 'fas fa-file-alt text-secondary';
        case 'csv': return 'fas fa-file-csv text-success';
        default: return 'fas fa-file text-muted';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function removeFile(index) {
    const fileInput = document.getElementById('documents');
    if (!fileInput) return;
    
    const dt = new DataTransfer();
    const files = Array.from(fileInput.files);
    
    files.forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        }
    });
    
    fileInput.files = dt.files;
    displayUploadedFiles(Array.from(dt.files));
}

// =============================================================================
// Aperçu du site web (ancienne fonction)
// =============================================================================
function setupWebsitePreview() {
    // Fonction legacy - maintenant remplacée par setupUrlAnalyzer
    console.log('📄 WebsitePreview setup (legacy)');
}

// =============================================================================
// Fonctionnalité d'analyse d'URL - Bouton Analyser
// =============================================================================
function setupUrlAnalyzer() {
    const urlInput = document.getElementById('websiteUrl');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const analyzeBtnContainer = document.querySelector('.analyze-button-container');
    const analysisStatus = document.getElementById('analysisStatus');
    const crawlOptions = document.getElementById('crawlOptions');
    
    if (!urlInput || !analyzeBtn) {
        console.log('⚠️ Éléments d\'analyse URL non trouvés');
        return;
    }
    
    console.log('🔗 Configuration de l\'analyseur d\'URL');
    
    // Afficher/masquer le bouton analyser selon la saisie
    urlInput.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        
        if (url && isValidUrl(url)) {
            analyzeBtnContainer.style.display = 'block';
            urlInput.classList.add('has-value');
        } else {
            analyzeBtnContainer.style.display = 'none';
            if (analysisStatus) analysisStatus.style.display = 'none';
            if (crawlOptions) crawlOptions.style.display = 'none';
            urlInput.classList.remove('has-value', 'analyzing', 'success', 'error');
        }
    });
    
    // Gestionnaire du bouton analyser
    analyzeBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if (url && isValidUrl(url)) {
            startUrlAnalysis(url);
        }
    });
}

function startUrlAnalysis(url) {
    console.log('🔍 Début de l\'analyse pour:', url);
    
    const urlInput = document.getElementById('websiteUrl');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const analysisStatus = document.getElementById('analysisStatus');
    const analysisLoading = document.getElementById('analysisLoading');
    const analysisResult = document.getElementById('analysisResult');
    const analysisError = document.getElementById('analysisError');
    const crawlOptions = document.getElementById('crawlOptions');
    
    // Réinitialiser les états
    if (analysisResult) analysisResult.style.display = 'none';
    if (analysisError) analysisError.style.display = 'none';
    if (crawlOptions) crawlOptions.style.display = 'none';
    
    // Afficher la zone de statut avec animation de chargement
    if (analysisStatus) analysisStatus.style.display = 'block';
    if (analysisLoading) analysisLoading.style.display = 'block';
    
    // Changer l'état de l'input et du bouton
    urlInput.classList.remove('success', 'error');
    urlInput.classList.add('analyzing');
    
    // Désactiver le bouton
    const originalBtnContent = analyzeBtn.innerHTML;
    analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Analyse...';
    analyzeBtn.disabled = true;
    
    // Mettre à jour le texte de progression
    const loadingStep = document.querySelector('.loading-step');
    const steps = [
        'Vérification de l\'accessibilité du site...',
        'Test de la connectivité réseau...',
        'Analyse de la structure du site...',
        'Extraction des métadonnées...',
        'Finalisation de l\'analyse...'
    ];
    
    let currentStepIndex = 0;
    const stepInterval = setInterval(() => {
        if (currentStepIndex < steps.length && loadingStep) {
            loadingStep.textContent = steps[currentStepIndex];
            currentStepIndex++;
        }
    }, 1000);
    
    // Simulation de l'analyse avec vérification réelle de l'URL
    performUrlCheck(url)
        .then(result => {
            clearInterval(stepInterval);
            
            setTimeout(() => {
                if (analysisLoading) analysisLoading.style.display = 'none';
                
                if (result.success) {
                    showAnalysisSuccess(result, url);
                } else {
                    showAnalysisError(result.error);
                }
                
                // Réactiver le bouton
                analyzeBtn.innerHTML = originalBtnContent;
                analyzeBtn.disabled = false;
            }, 5000); // 5 secondes comme demandé
        })
        .catch(error => {
            clearInterval(stepInterval);
            
            setTimeout(() => {
                if (analysisLoading) analysisLoading.style.display = 'none';
                showAnalysisError('Erreur de connexion réseau');
                analyzeBtn.innerHTML = originalBtnContent;
                analyzeBtn.disabled = false;
            }, 5000);
        });
}

async function performUrlCheck(url) {
    try {
        const response = await fetch('?handler=ValidateUrl&url=' + encodeURIComponent(url), {
            method: 'GET'
        });
        
        if (response.ok) {
            const result = await response.json();
            
            if (result.valid) {
                return {
                    success: true,
                    title: result.title || 'Site Web',
                    url: result.url || url,
                    responseTime: result.responseTime || Math.floor(Math.random() * 500) + 50
                };
            } else {
                return {
                    success: false,
                    error: result.error || 'Site non accessible'
                };
            }
        } else {
            return {
                success: false,
                error: 'Impossible de vérifier l\'URL'
            };
        }
    } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        return {
            success: false,
            error: 'Erreur de connexion réseau'
        };
    }
}

function showAnalysisSuccess(result, url) {
    const urlInput = document.getElementById('websiteUrl');
    const analysisResult = document.getElementById('analysisResult');
    const crawlOptions = document.getElementById('crawlOptions');
    const siteTitle = document.getElementById('siteTitle');
    const responseTime = document.getElementById('responseTime');
    
    // Mettre à jour les informations
    if (siteTitle) siteTitle.textContent = result.title;
    if (responseTime) responseTime.textContent = result.responseTime + 'ms';
    
    // Afficher le résultat avec animation
    if (analysisResult) analysisResult.style.display = 'block';
    urlInput.classList.remove('analyzing');
    urlInput.classList.add('success');
    
    // Afficher les options de crawling après un délai
    setTimeout(() => {
        if (crawlOptions) crawlOptions.style.display = 'block';
    }, 800);
    
    showNotification('✅ Site web analysé avec succès !', 'success');
}

function showAnalysisError(errorMessage) {
    const urlInput = document.getElementById('websiteUrl');
    const analysisError = document.getElementById('analysisError');
    const errorMessageEl = document.getElementById('errorMessage');
    
    // Mettre à jour le message d'erreur
    if (errorMessageEl) errorMessageEl.textContent = errorMessage;
    
    // Afficher l'erreur avec animation
    if (analysisError) analysisError.style.display = 'block';
    urlInput.classList.remove('analyzing');
    urlInput.classList.add('error');
    
    showNotification('❌ ' + errorMessage, 'error');
}

function retryAnalysis() {
    const urlInput = document.getElementById('websiteUrl');
    const url = urlInput.value.trim();
    
    if (url && isValidUrl(url)) {
        startUrlAnalysis(url);
    }
}

// Fonction pour valider automatiquement l'URL pendant la saisie
function setupUrlValidation() {
    const urlInput = document.getElementById('websiteUrl');
    if (!urlInput) return;
    
    let validationTimeout;
    
    urlInput.addEventListener('input', (e) => {
        clearTimeout(validationTimeout);
        
        const url = e.target.value.trim();
        const inputIcon = urlInput.parentElement.querySelector('.input-icon i');
        
        if (!inputIcon) return;
        
        // Reset des classes
        urlInput.classList.remove('analyzing', 'success', 'error');
        
        if (url) {
            if (isValidUrl(url)) {
                inputIcon.className = 'fas fa-globe';
                inputIcon.style.color = '#10b981';
                
                validationTimeout = setTimeout(() => {
                    inputIcon.className = 'fas fa-check-circle';
                    inputIcon.style.color = '#10b981';
                }, 1000);
            } else {
                inputIcon.className = 'fas fa-exclamation-triangle';
                inputIcon.style.color = '#ef4444';
            }
        } else {
            inputIcon.className = 'fas fa-globe';
            inputIcon.style.color = '';
        }
    });
}

// =============================================================================
// Compteurs de caractères et labels flottants
// =============================================================================
function setupCharacterCounters() {
    const descriptionTextarea = document.getElementById('companyDescription');
    const descriptionCounter = document.getElementById('descriptionCount');
    
    if (descriptionTextarea && descriptionCounter) {
        descriptionTextarea.addEventListener('input', (e) => {
            const count = e.target.value.length;
            descriptionCounter.textContent = count;
            
            if (count > 400) {
                descriptionCounter.style.color = '#ef4444';
            } else if (count > 300) {
                descriptionCounter.style.color = '#f59e0b';
            } else {
                descriptionCounter.style.color = '#6b7280';
            }
        });
    }
}

function setupFloatingLabels() {
    const floatingInputs = document.querySelectorAll('.floating-label input, .floating-label textarea, .floating-label select');
    
    floatingInputs.forEach(input => {
        updateFloatingLabel(input);
        
        input.addEventListener('focus', () => updateFloatingLabel(input));
        input.addEventListener('blur', () => updateFloatingLabel(input));
        input.addEventListener('input', () => updateFloatingLabel(input));
    });
}

function updateFloatingLabel(input) {
    const container = input.closest('.floating-label');
    if (!container) return;
    
    const hasValue = input.value.trim() !== '';
    const isFocused = document.activeElement === input;
    
    if (hasValue || isFocused) {
        container.classList.add('has-value');
    } else {
        container.classList.remove('has-value');
    }
}

// =============================================================================
// Notifications
// =============================================================================
function showNotification(message, type) {
    type = type || 'info';
    
    const notification = document.createElement('div');
    notification.className = 'alert alert-' + (type === 'error' ? 'danger' : type) + ' alert-dismissible fade show notification-toast';
    notification.innerHTML = message + '<button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
    
    const container = document.querySelector('.container-fluid') || document.body;
    container.insertBefore(notification, container.firstChild);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// =============================================================================
// Sauvegarde automatique
// =============================================================================
function setupAutoSave() {
    const form = document.getElementById('chatbotForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', debounce(() => {
            saveFormData();
        }, 1000));
    });
    
    restoreFormData();
}

function saveFormData() {
    const formData = {};
    const form = document.getElementById('chatbotForm');
    
    if (form) {
        const formDataObj = new FormData(form);
        for (const [key, value] of formDataObj.entries()) {
            if (typeof value === 'string') {
                formData[key] = value;
            }
        }
        
        try {
            localStorage.setItem('chatbotFormData', JSON.stringify(formData));
        } catch (error) {
            console.warn('Impossible de sauvegarder les données du formulaire');
        }
    }
}

function restoreFormData() {
    try {
        const savedData = localStorage.getItem('chatbotFormData');
        if (!savedData) return;
        
        const formData = JSON.parse(savedData);
        
        Object.keys(formData).forEach(key => {
            const input = document.querySelector('[name="' + key + '"]');
            if (input && input.type !== 'file') {
                input.value = formData[key];
                updateFloatingLabel(input);
            }
        });
    } catch (error) {
        console.warn('Erreur lors de la restauration des données:', error);
    }
}

function clearFormData() {
    try {
        localStorage.removeItem('chatbotFormData');
    } catch (error) {
        console.warn('Impossible de supprimer les données sauvegardées');
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =============================================================================
// Chat intégré
// =============================================================================
function openChat() {
    const chatbot = document.querySelector('.nexgen-chatbot');
    const floatingBtn = document.getElementById('quickStart');
    
    if (chatbot && !chatbot.classList.contains('nexgen-chat-open')) {
        if (floatingBtn) {
            floatingBtn.click();
        }
        
        setTimeout(() => {
            const event = new CustomEvent('addBotMessage', {
                detail: { 
                    message: 'Parfait ! 🚀 Je vais vous guider pour créer votre chatbot personnalisé. Avez-vous déjà rempli les informations de votre entreprise ?' 
                }
            });
            document.dispatchEvent(event);
        }, 1000);
    }
}

// =============================================================================
// Debug et monitoring
// =============================================================================
function debugFormState() {
    console.log('=== État du formulaire ===');
    console.log('Étape actuelle:', currentStep);
    console.log('Étapes totales:', totalSteps);
    
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    
    console.log('Bouton Suivant:', !!nextBtn, nextBtn?.style.display);
    console.log('Bouton Précédent:', !!prevBtn, prevBtn?.style.display);
    console.log('Bouton Soumettre:', !!submitBtn, submitBtn?.style.display);
    
    for (let i = 1; i <= totalSteps; i++) {
        const stepElement = document.getElementById('step-' + i);
        const isVisible = stepElement?.style.display !== 'none';
        const hasActiveClass = stepElement?.classList.contains('active');
        console.log('Étape ' + i + ':', !!stepElement, 'Visible:', isVisible, 'Active:', hasActiveClass);
    }
}

// Ajouter la fonction de debug au global pour les tests
window.debugFormState = debugFormState;

console.log('✅ Create Form JavaScript entièrement chargé et fonctionnel');
console.log('🔧 Pour débugger, utilisez: debugFormState()');
