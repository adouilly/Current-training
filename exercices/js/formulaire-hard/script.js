/**
 * Gestionnaire de formulaire multi-étapes
 * Multi-step form handler
 */
document.addEventListener('DOMContentLoaded', () => {
    // Éléments du DOM / DOM elements
    const form = document.getElementById('quote-form');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressLines = document.querySelectorAll('.progress-line');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const submitButton = document.querySelector('.btn-submit');
    const textareas = document.querySelectorAll('textarea');
    
    // État actuel du formulaire / Current form state
    let currentStep = 1;
    let formData = {};
    const STORAGE_KEY = 'quote_form_data';
    
    /**
     * Initialisation
     * Initialization
     */
    function init() {
        // Charger les données sauvegardées (si disponibles) / Load saved data (if available)
        loadFromLocalStorage();
        
        // Afficher la première étape ou reprendre où l'utilisateur s'était arrêté
        // Display first step or resume where the user left off
        const savedStep = localStorage.getItem('quote_form_step');
        if (savedStep) {
            showStep(parseInt(savedStep));
        } else {
            showStep(currentStep);
        }
        
        // Configurer les compteurs de caractères / Set up character counters
        setupCharCounters();
        
        // Ajouter les écouteurs d'événements / Add event listeners
        setupEventListeners();
        
        // Configurer la sauvegarde automatique / Set up auto-save
        setupAutoSave();
        
        // Ajouter notification de données sauvegardées
        // Add saved data notification
        if (Object.keys(formData).length > 0) {
            showNotification('Vos données ont été restaurées. Vous pouvez continuer où vous vous êtes arrêté.', 'info');
            populateFormFields();
        }
    }
    
    /**
     * Afficher une notification
     * Show a notification
     * @param {string} message - Message à afficher / Message to display
     * @param {string} type - Type de notification / Notification type (success, error, info)
     */
    function showNotification(message, type = 'info') {
        // Créer l'élément de notification s'il n'existe pas déjà
        let notification = document.querySelector('.form-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'form-notification';
            form.insertBefore(notification, form.firstChild);
        }
        
        // Définir le message et le type
        notification.textContent = message;
        notification.className = `form-notification ${type}`;
        
        // Afficher la notification
        notification.classList.add('show');
        
        // Masquer après 5 secondes
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
    
    /**
     * Configurer la sauvegarde automatique
     * Set up auto-save
     */
    function setupAutoSave() {
        const allInputs = form.querySelectorAll('input, select, textarea');
        
        allInputs.forEach(input => {
            const eventType = input.type === 'checkbox' || input.type === 'select-one' || 
                             input.type === 'select-multiple' ? 'change' : 'input';
            
            input.addEventListener(eventType, debounce(() => {
                saveStepData(currentStep);
                saveToLocalStorage();
            }, 500));
        });
    }
    
    /**
     * Fonction debounce pour limiter les appels fréquents
     * Debounce function to limit frequent calls
     * @param {Function} func - Fonction à exécuter / Function to execute
     * @param {number} wait - Délai d'attente en ms / Wait time in ms
     */
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    
    /**
     * Sauvegarder les données dans localStorage
     * Save data to localStorage
     */
    function saveToLocalStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        localStorage.setItem('quote_form_step', currentStep.toString());
    }
    
    /**
     * Charger les données depuis localStorage
     * Load data from localStorage
     */
    function loadFromLocalStorage() {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            formData = JSON.parse(savedData);
        }
    }
    
    /**
     * Remplir les champs du formulaire avec les données sauvegardées
     * Populate form fields with saved data
     */
    function populateFormFields() {
        // Parcourir tous les champs du formulaire
        Object.keys(formData).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    // Pour les cases à cocher
                    if (Array.isArray(formData[key])) {
                        // Si plusieurs cases à cocher avec le même nom
                        const checkboxes = form.querySelectorAll(`[name="${key}"]`);
                        checkboxes.forEach(checkbox => {
                            checkbox.checked = formData[key].includes(checkbox.value);
                        });
                    } else {
                        // Si une seule case à cocher
                        input.checked = formData[key] === true;
                    }
                } else if (input.type === 'select-multiple') {
                    // Pour les sélections multiples
                    if (Array.isArray(formData[key])) {
                        Array.from(input.options).forEach(option => {
                            option.selected = formData[key].includes(option.value);
                        });
                    }
                } else {
                    // Pour les autres types de champs
                    input.value = formData[key];
                }
                
                // Mettre à jour les compteurs de caractères pour les zones de texte
                if (input.tagName === 'TEXTAREA') {
                    const counterId = `${input.id}-count`;
                    const counter = document.getElementById(counterId);
                    if (counter) {
                        counter.textContent = input.value.length;
                    }
                }
            }
        });
    }
    
    /**
     * Effacer les données sauvegardées
     * Clear saved data
     */
    function clearSavedData() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('quote_form_step');
        formData = {};
    }
    
    /**
     * Configuration des compteurs de caractères
     * Setting up character counters
     */
    function setupCharCounters() {
        textareas.forEach(textarea => {
            const counterId = `${textarea.id}-count`;
            const counter = document.getElementById(counterId);
            
            if (counter) {
                // Mise à jour initiale / Initial update
                counter.textContent = textarea.value.length;
                
                // Écouteur pour les changements / Listener for changes
                textarea.addEventListener('input', () => {
                    counter.textContent = textarea.value.length;
                });
            }
        });
    }
    
    /**
     * Configuration des écouteurs d'événements
     * Setting up event listeners
     */
    function setupEventListeners() {
        // Boutons suivant / Next buttons
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                const nextStep = parseInt(button.dataset.next);
                if (validateStep(currentStep)) {
                    saveStepData(currentStep);
                    saveToLocalStorage();
                    showStep(nextStep);
                }
            });
        });
        
        // Boutons précédent / Previous buttons
        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                const prevStep = parseInt(button.dataset.prev);
                saveStepData(currentStep);
                saveToLocalStorage();
                showStep(prevStep);
            });
        });
        
        // Soumission du formulaire / Form submission
        form.addEventListener('submit', handleSubmit);
        
        // Validation en temps réel / Real-time validation
        setupInputValidation();
        
        // Configurer l'upload de fichier / Set up file upload
        setupFileUpload();
    }
    
    /**
     * Configuration de l'upload de fichier
     * Setting up file upload
     */
    function setupFileUpload() {
        const fileInput = document.getElementById('reference-document');
        const filePreview = document.getElementById('file-preview');
        
        if (fileInput && filePreview) {
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    // Validation du type de fichier
                    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 
                                       'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                    const maxSize = 5 * 1024 * 1024; // 5 MB
                    
                    if (!validTypes.includes(file.type)) {
                        showFileError('Type de fichier non supporté. Veuillez choisir un PDF, une image ou un document Word.');
                        fileInput.value = '';
                        return;
                    }
                    
                    if (file.size > maxSize) {
                        showFileError('Fichier trop volumineux. La taille maximale est de 5 MB.');
                        fileInput.value = '';
                        return;
                    }
                    
                    // Afficher les informations du fichier
                    filePreview.innerHTML = `
                        <div class="file-info">
                            <p>Nom : ${file.name}</p>
                            <p>Type : ${file.type}</p>
                            <p>Taille : ${(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                    `;
                    
                    // Sauvegarder le nom du fichier dans formData
                    formData['referenceDocument'] = file.name;
                    
                    // Masquer les messages d'erreur
                    const errorElement = fileInput.parentElement.querySelector('.error-message');
                    if (errorElement) {
                        errorElement.textContent = '';
                    }
                } else {
                    filePreview.innerHTML = '';
                    delete formData['referenceDocument'];
                }
            });
        }
    }
    
    /**
     * Afficher une erreur pour l'upload de fichier
     * Show file upload error
     * @param {string} message - Message d'erreur / Error message
     */
    function showFileError(message) {
        const fileInput = document.getElementById('reference-document');
        const errorElement = fileInput.parentElement.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
    
    /**
     * Configuration de la validation des champs en temps réel
     * Setting up real-time input validation
     */
    function setupInputValidation() {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Valider à la sortie du champ / Validate on blur
            input.addEventListener('blur', () => {
                validateInput(input);
            });
            
            // Réinitialiser l'erreur lors de la saisie / Reset error on input
            input.addEventListener('input', () => {
                const errorElement = input.parentElement.querySelector('.error-message');
                input.classList.remove('input-error');
                if (errorElement) {
                    errorElement.textContent = '';
                }
            });
        });
    }
    
    /**
     * Afficher une étape spécifique
     * Show a specific step
     * @param {number} step - Numéro de l'étape à afficher / Step number to display
     */
    function showStep(step) {
        // Mettre à jour l'étape actuelle / Update current step
        currentStep = step;
        
        // Masquer toutes les étapes / Hide all steps
        steps.forEach(stepElement => {
            stepElement.classList.remove('active', 'slide-in', 'slide-out');
        });
        
        // Afficher l'étape demandée / Show requested step
        const currentStepElement = document.getElementById(`step-${step}`);
        currentStepElement.classList.add('active');
        
        // Ajouter l'animation / Add animation
        if (step === 3.5) {
            // Récapitulatif - animation spéciale
            currentStepElement.classList.add('zoom-in');
        } else {
            currentStepElement.classList.add('slide-in');
        }
        
        // Mettre à jour la barre de progression / Update progress bar
        updateProgressBar(step);
        
        // Défilement vers le haut du formulaire / Scroll to top of form
        form.scrollIntoView({ behavior: 'smooth' });
    }
    
    /**
     * Mettre à jour la barre de progression
     * Update progress bar
     * @param {number} step - Étape actuelle / Current step
     */
    function updateProgressBar(step) {
        // Gestion du récapitulatif (étape 3.5)
        const displayStep = step === 3.5 ? 3 : step;
        
        progressSteps.forEach((progressStep, index) => {
            const stepNumber = parseInt(progressStep.dataset.step);
            
            // Réinitialiser les classes / Reset classes
            progressStep.classList.remove('active', 'completed');
            
            // Appliquer les classes appropriées / Apply appropriate classes
            if (stepNumber === displayStep) {
                progressStep.classList.add('active');
            } else if (stepNumber < displayStep) {
                progressStep.classList.add('completed');
            }
        });
        
        // Mettre à jour les lignes de progression / Update progress lines
        progressLines.forEach((line, index) => {
            line.classList.remove('active');
            if (index < displayStep - 1) {
                line.classList.add('active');
            }
        });
    }
    
    /**
     * Valider une étape spécifique
     * Validate a specific step
     * @param {number} step - Numéro de l'étape à valider / Step number to validate
     * @returns {boolean} - Indique si l'étape est valide / Indicates if the step is valid
     */
    function validateStep(step) {
        // Ne pas valider le récapitulatif ou la confirmation
        if (step === 3.5 || step === 4) {
            return true;
        }
        
        const stepElement = document.getElementById(`step-${step}`);
        const inputs = stepElement.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            // Ne valider que les champs obligatoires ou remplis / Only validate required or filled fields
            if (input.required || input.value.trim() !== '') {
                const inputValid = validateInput(input);
                isValid = isValid && inputValid;
            }
        });
        
        return isValid;
    }
    
    /**
     * Valider un champ de formulaire
     * Validate a form field
     * @param {HTMLElement} input - Élément à valider / Element to validate
     * @returns {boolean} - Indique si le champ est valide / Indicates if the field is valid
     */
    function validateInput(input) {
        const errorElement = input.parentElement.querySelector('.error-message');
        let isValid = true;
        let errorMessage = '';
        
        // Réinitialiser l'état / Reset state
        input.classList.remove('input-error');
        
        // Vérification du champ vide pour les champs obligatoires
        // Check for empty field for required fields
        if (input.required && input.value.trim() === '') {
            isValid = false;
            errorMessage = 'Ce champ est obligatoire / This field is required';
        } 
        // Vérifications spécifiques par type / Specific validations by type
        else if (input.value.trim() !== '') {
            switch (input.type) {
                case 'email':
                    // Validation avancée des emails
                    const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (!emailPattern.test(input.value)) {
                        isValid = false;
                        errorMessage = 'Adresse email invalide. Format attendu: exemple@domaine.com';
                    }
                    break;
                    
                case 'tel':
                    // Validation avancée du téléphone (format français principalement)
                    if (input.id === 'phone') {
                        // Formats acceptés: 0612345678, 06 12 34 56 78, +33 6 12 34 56 78, etc.
                        const phoneValue = input.value.replace(/\s+/g, ''); // Supprimer les espaces
                        
                        // Format français (10 chiffres commençant par 0)
                        const frPattern = /^0[1-9][0-9]{8}$/;
                        
                        // Format international (commençant par +33 puis 9 chiffres)
                        const intPattern = /^\+33[1-9][0-9]{8}$/;
                        
                        if (!(frPattern.test(phoneValue) || intPattern.test(phoneValue))) {
                            isValid = false;
                            errorMessage = 'Numéro de téléphone invalide. Formats acceptés: 0612345678 ou +33612345678';
                        }
                    }
                    break;
                    
                case 'file':
                    // Validation du fichier gérée séparément dans l'écouteur d'événements
                    break;
                    
                default:
                    // Validation du pattern si défini / Pattern validation if defined
                    if (input.pattern && !new RegExp(input.pattern).test(input.value)) {
                        isValid = false;
                        if (input.id === 'firstName' || input.id === 'lastName') {
                            errorMessage = 'Seuls les caractères alphabétiques sont autorisés / Only alphabetic characters allowed';
                        } else {
                            errorMessage = 'Format invalide / Invalid format';
                        }
                    }
                    break;
            }
        }
        
        // Vérification spécifique pour les cases à cocher
        // Specific validation for checkboxes
        if (input.type === 'checkbox' && input.required && !input.checked) {
            isValid = false;
            errorMessage = 'Vous devez accepter pour continuer / You must accept to continue';
        }
        
        // Afficher le message d'erreur si nécessaire / Display error message if needed
        if (!isValid && errorElement) {
            errorElement.textContent = errorMessage;
            input.classList.add('input-error');
        } else if (errorElement) {
            errorElement.textContent = '';
        }
        
        return isValid;
    }
    
    /**
     * Sauvegarder les données de l'étape actuelle
     * Save current step data
     * @param {number} step - Étape à sauvegarder / Step to save
     */
    function saveStepData(step) {
        // Ne pas sauvegarder les données pour l'étape de récapitulatif ou de confirmation
        if (step === 3.5 || step === 4) {
            return;
        }
        
        const stepElement = document.getElementById(`step-${step}`);
        const inputs = stepElement.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            // Ignorer les entrées de fichier pour localStorage
            if (input.type === 'file') {
                return;
            }
            
            if (input.type === 'checkbox') {
                // Pour les cases à cocher, stocker l'état (coché/non coché)
                // For checkboxes, store checked state
                if (!formData[input.name]) {
                    formData[input.name] = [];
                }
                
                if (input.checked) {
                    if (!formData[input.name].includes(input.value)) {
                        formData[input.name].push(input.value);
                    }
                } else {
                    const index = formData[input.name].indexOf(input.value);
                    if (index > -1) {
                        formData[input.name].splice(index, 1);
                    }
                }
            } else if (input.type === 'select-multiple') {
                // Pour les sélections multiples, stocker un tableau de valeurs
                // For multiple select, store array of values
                formData[input.name] = Array.from(input.selectedOptions).map(option => option.value);
            } else {
                // Pour les autres types de champs, stocker la valeur
                // For other field types, store the value
                formData[input.name] = input.value;
            }
        });
    }
    
    /**
     * Générer le récapitulatif des données
     * Generate data summary
     * @returns {string} - HTML du récapitulatif / Summary HTML
     */
    function generateSummary() {
        let summaryHtml = '<div class="summary-container">';
        
        // Informations personnelles / Personal information
        summaryHtml += '<div class="summary-section">';
        summaryHtml += '<h3>Informations personnelles</h3>';
        summaryHtml += '<div class="summary-content">';
        summaryHtml += `<p><strong>Nom :</strong> ${escapeHtml(formData.firstName) || ''} ${escapeHtml(formData.lastName) || ''}</p>`;
        summaryHtml += `<p><strong>Email :</strong> ${escapeHtml(formData.email) || ''}</p>`;
        summaryHtml += `<p><strong>Téléphone :</strong> ${escapeHtml(formData.phone) || ''}</p>`;
        summaryHtml += '</div>';
        summaryHtml += '<button type="button" class="btn-edit" data-edit="1">Modifier</button>';
        summaryHtml += '</div>';
        
        // Détails du projet / Project details
        summaryHtml += '<div class="summary-section">';
        summaryHtml += '<h3>Détails du projet</h3>';
        summaryHtml += '<div class="summary-content">';
        
        // Type de projet / Project type
        const projectTypes = Array.isArray(formData.projectType) ? formData.projectType : [];
        const projectTypeLabels = projectTypes.map(value => {
            const option = document.querySelector(`#projectType option[value="${value}"]`);
            return option ? option.textContent : value;
        });
        summaryHtml += `<p><strong>Type de projet :</strong> ${escapeHtml(projectTypeLabels.join(', ')) || 'Non spécifié'}</p>`;
        
        // Budget / Budget
        const budgetOption = document.querySelector(`#budget option[value="${formData.budget}"]`);
        const budgetLabel = budgetOption ? budgetOption.textContent : formData.budget;
        summaryHtml += `<p><strong>Budget :</strong> ${escapeHtml(budgetLabel) || 'Non spécifié'}</p>`;
        
        // Date de livraison / Deadline
        summaryHtml += `<p><strong>Date de livraison :</strong> ${escapeHtml(formData.deadline) || 'Non spécifiée'}</p>`;
        
        // Description / Description
        summaryHtml += `<p><strong>Description :</strong> ${escapeHtml(formData.description) || 'Non spécifiée'}</p>`;
        
        summaryHtml += '</div>';
        summaryHtml += '<button type="button" class="btn-edit" data-edit="2">Modifier</button>';
        summaryHtml += '</div>';
        
        // Préférences / Preferences
        summaryHtml += '<div class="summary-section">';
        summaryHtml += '<h3>Préférences</h3>';
        summaryHtml += '<div class="summary-content">';
        
        // Fonctionnalités / Features
        const features = Array.isArray(formData.features) ? formData.features : [];
        const featureLabels = features.map(value => {
            const label = document.querySelector(`label[for="feature-${value}"]`);
            return label ? label.textContent : value;
        });
        summaryHtml += `<p><strong>Fonctionnalités :</strong> ${escapeHtml(featureLabels.length > 0 ? featureLabels.join(', ') : 'Aucune sélectionnée')}</p>`;
        
        // Préférence de contact / Contact preference
        const contactOption = document.querySelector(`#contactPreference option[value="${formData.contactPreference}"]`);
        const contactLabel = contactOption ? contactOption.textContent : formData.contactPreference;
        summaryHtml += `<p><strong>Préférence de contact :</strong> ${escapeHtml(contactLabel) || 'Non spécifiée'}</p>`;
        
        // Document de référence / Reference document
        summaryHtml += `<p><strong>Document de référence :</strong> ${escapeHtml(formData.referenceDocument) || 'Aucun document fourni'}</p>`;
        
        // Informations complémentaires / Additional information
        if (formData.additionalInfo) {
            summaryHtml += `<p><strong>Informations complémentaires :</strong> ${escapeHtml(formData.additionalInfo)}</p>`;
        }
        
        summaryHtml += '</div>';
        summaryHtml += '<button type="button" class="btn-edit" data-edit="3">Modifier</button>';
        summaryHtml += '</div>';
        
        summaryHtml += '</div>';
        
        return summaryHtml;
    }
    
    /**
     * Gérer la soumission du formulaire
     * Handle form submission
     * @param {Event} event - Événement de soumission / Submission event
     */
    function handleSubmit(event) {
        event.preventDefault();
        
        // Valider l'étape actuelle / Validate current step
        if (currentStep !== 3.5 && !validateStep(currentStep)) {
            return;
        }
        
        // Si nous ne sommes pas sur le récapitulatif, l'afficher d'abord
        if (currentStep !== 3.5) {
            saveStepData(currentStep);
            saveToLocalStorage();
            
            // Créer l'étape de récapitulatif si elle n'existe pas
            if (!document.getElementById('step-3.5')) {
                createSummaryStep();
            } else {
                // Mettre à jour le contenu du récapitulatif
                document.getElementById('summary-content').innerHTML = generateSummary();
            }
            
            showStep(3.5);
            return;
        }
        
        // Soumettre le formulaire / Submit the form
        console.log('Données du formulaire / Form data:', formData);
        
        // Effacer les données sauvegardées / Clear saved data
        clearSavedData();
        
        // Afficher la modale de confirmation au lieu de l'étape 4
        const modal = document.getElementById('confirmation-modal');
        const modalBody = modal.querySelector('.modal-body');
        
        // Préparer le contenu de la modale
        modalBody.innerHTML = `
            <div class="confirmation-message">
                <h2 class="second-title">Merci pour votre demande !</h2>
                <p>Nous avons bien reçu votre demande de devis et nous vous contacterons très rapidement.</p>
                <p>Un email de confirmation a été envoyé à l'adresse : <strong>${escapeHtml(formData.email)}</strong></p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn-close-modal">Fermer</button>
            </div>
        `;
        
        // Afficher la modale
        modal.classList.add('show');
        
        // Ajouter les écouteurs d'événements pour fermer la modale
        const closeModalBtn = modal.querySelector('.btn-close-modal');
        const closeModalX = modal.querySelector('.close-modal');
        
        closeModalBtn.addEventListener('click', closeModal);
        closeModalX.addEventListener('click', closeModal);
        
        // Fermer la modale en cliquant en dehors
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
        
        // En production, vous enverriez les données au serveur ici
        // In production, you would send the data to the server here
        // fetch('/submit-form', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // })
        // .then(response => response.json())
        // .then(data => {
        //     // Afficher la modale
        //     modal.classList.add('show');
        // })
        // .catch(error => {
        //     console.error('Erreur lors de la soumission / Error during submission:', error);
        // });
    }
    
    /**
     * Créer l'étape de récapitulatif
     * Create summary step
     */
    function createSummaryStep() {
        // Créer l'élément de l'étape
        const summaryStep = document.createElement('section');
        summaryStep.className = 'form-step';
        summaryStep.id = 'step-3.5';
        summaryStep.dataset.step = '3.5';
        
        // Contenu de l'étape
        summaryStep.innerHTML = `
            <h2 class="second-title">Récapitulatif de votre demande</h2>
            <p class="summary-intro">Veuillez vérifier les informations ci-dessous avant de soumettre votre demande.</p>
            
            <div id="summary-content">
                ${generateSummary()}
            </div>
            
            <div class="form-buttons">
                <button type="button" class="btn-prev" data-prev="3">Retour</button>
                <button type="submit" class="btn-submit">Confirmer et envoyer</button>
            </div>
        `;
        
        // Insérer avant l'étape de confirmation
        const confirmationStep = document.getElementById('step-4');
        form.insertBefore(summaryStep, confirmationStep);
        
        // Ajouter des écouteurs d'événements pour les boutons de modification
        summaryStep.addEventListener('click', event => {
            if (event.target.classList.contains('btn-edit')) {
                const stepToEdit = parseInt(event.target.dataset.edit);
                showStep(stepToEdit);
            }
        });
    }
    
    /**
     * Fermer la modale
     * Close the modal
     */
    function closeModal() {
        const modal = document.getElementById('confirmation-modal');
        modal.classList.remove('show');
        
        // Rediriger vers la page d'accueil ou réinitialiser le formulaire
        resetForm();
    }
    
    /**
     * Réinitialiser le formulaire
     * Reset the form
     */
    function resetForm() {
        // Réinitialiser les données du formulaire
        formData = {};
        currentStep = 1;
        
        // Réinitialiser les champs du formulaire
        form.reset();
        
        // Réinitialiser les compteurs de caractères
        setupCharCounters();
        
        // Afficher la première étape
        showStep(1);
    }
    
    /**
     * Échapper les caractères HTML dangereux
     * Escape dangerous HTML characters
     * @param {string} str - Chaîne à échapper / String to escape
     * @returns {string} - Chaîne échappée / Escaped string
     */
    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Démarrer l'application / Start the application
    init();
});