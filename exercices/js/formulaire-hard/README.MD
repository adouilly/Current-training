# Multi-Step Quote Form with Glassmorphism UI

## Project Overview
A responsive multi-step form for quote requests featuring a modern glassmorphism design. This form guides users through a logical process to collect information while providing visual feedback.

## Key Features
- **Multi-step navigation**: Intuitive progression through form steps with visual progress tracking
- **Local storage persistence**: Automatically saves user input to resume later
- **Real-time validation**: Immediate feedback on input errors
- **File upload**: Support for reference documents (PDF, Word, images)
- **Data summary**: Review all information before final submission
- **Confirmation modal**: Professional success message upon completion
- **Responsive design**: Optimized for all devices and screen sizes
- **Glassmorphism UI**: Modern, translucent interface with subtle depth effects

## Technical Highlights
- **Form navigation**: Smooth transitions between steps using CSS animations
- **Data persistence**: Utilizes localStorage with automatic saving (setupAutoSave function)
- **Validation**: Client-side validation with custom validators (validateInput function)
- **File handling**: Size and type validation for document uploads (setupFileUpload function)
- **Modern UI**: CSS variables, flexbox and backdrop-filter for glassmorphism effects

## Setup Instructions
1. Download or clone the repository
2. No build process required - open index.html directly in a browser
3. For form submission functionality, connect to your backend API (modify handleSubmit function)

## Browser Compatibility
- Works best in modern browsers that support CSS variables and backdrop-filter
- Includes fallbacks for older browsers
- Tested in Chrome, Firefox, Safari, and Edge

## Technical Implementation

### JavaScript Architecture

The form's functionality is powered by a well-structured JavaScript architecture divided into several core modules:

#### 1. Initialization and State Management

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // DOM elements are cached for performance
    const form = document.getElementById('quote-form');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    // The form's state is maintained in memory
    let currentStep = 1;
    let formData = {};
    const STORAGE_KEY = 'quote_form_data';
    
    function init() {
        // Loads previously saved data from localStorage
        loadFromLocalStorage();
        
        // Resumes from where the user left off
        const savedStep = localStorage.getItem('quote_form_step');
        if (savedStep) {
            showStep(parseInt(savedStep));
        } else {
            showStep(currentStep);
        }
        
        // Sets up various form features
        setupCharCounters();
        setupEventListeners();
        setupAutoSave();
        
        // Notifies the user if data was restored
        if (Object.keys(formData).length > 0) {
            showNotification('Your data has been restored. You can continue where you left off.', 'info');
            populateFormFields();
        }
    }
});
```

#### 2. Local Storage System

The form implements an efficient automatic saving mechanism that preserves user input:

```javascript
function setupAutoSave() {
    const allInputs = form.querySelectorAll('input, select, textarea');
    
    allInputs.forEach(input => {
        // Chooses the appropriate event based on input type
        const eventType = input.type === 'checkbox' || input.type === 'select-one' || 
                         input.type === 'select-multiple' ? 'change' : 'input';
        
        // Uses debounce to prevent excessive saving operations
        input.addEventListener(eventType, debounce(() => {
            saveStepData(currentStep);
            saveToLocalStorage();
        }, 500));
    });
}

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

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    localStorage.setItem('quote_form_step', currentStep.toString());
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        formData = JSON.parse(savedData);
    }
}

function populateFormFields() {
    // Iterates through all saved data and populates corresponding fields
    Object.keys(formData).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            // Special handling for different input types
            if (input.type === 'checkbox') {
                // Handles both single and multiple checkboxes
                if (Array.isArray(formData[key])) {
                    const checkboxes = form.querySelectorAll(`[name="${key}"]`);
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = formData[key].includes(checkbox.value);
                    });
                } else {
                    input.checked = formData[key] === true;
                }
            } else if (input.type === 'select-multiple') {
                // Handles multi-select elements
                if (Array.isArray(formData[key])) {
                    Array.from(input.options).forEach(option => {
                        option.selected = formData[key].includes(option.value);
                    });
                }
            } else {
                // Standard input handling
                input.value = formData[key];
            }
            
            // Updates character counters for textareas
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
```

#### 3. Step Navigation and Visual Progress

The form provides intuitive step navigation with visual feedback:

```javascript
function showStep(step) {
    // Updates the current step
    currentStep = step;
    
    // Hides all steps and removes animation classes
    steps.forEach(stepElement => {
        stepElement.classList.remove('active', 'slide-in', 'slide-out');
    });
    
    // Shows the requested step with appropriate animation
    const currentStepElement = document.getElementById(`step-${step}`);
    currentStepElement.classList.add('active');
    
    // Adds different animations based on the step
    if (step === 3.5) {
        // Special animation for summary view
        currentStepElement.classList.add('zoom-in');
    } else {
        currentStepElement.classList.add('slide-in');
    }
    
    // Updates the progress bar
    updateProgressBar(step);
    
    // Smooth scrolling to the top of the form
    form.scrollIntoView({ behavior: 'smooth' });
}

function updateProgressBar(step) {
    // Handles special case for summary step
    const displayStep = step === 3.5 ? 3 : step;
    
    progressSteps.forEach((progressStep, index) => {
        const stepNumber = parseInt(progressStep.dataset.step);
        
        // Resets classes
        progressStep.classList.remove('active', 'completed');
        
        // Applies appropriate classes based on step state
        if (stepNumber === displayStep) {
            progressStep.classList.add('active');
        } else if (stepNumber < displayStep) {
            progressStep.classList.add('completed');
        }
    });
    
    // Updates progress lines between steps
    progressLines.forEach((line, index) => {
        line.classList.remove('active');
        if (index < displayStep - 1) {
            line.classList.add('active');
        }
    });
}
```

#### 4. Form Validation

The form implements comprehensive validation with real-time feedback:

```javascript
function validateStep(step) {
    // Skip validation for summary or confirmation
    if (step === 3.5 || step === 4) {
        return true;
    }
    
    const stepElement = document.getElementById(`step-${step}`);
    const inputs = stepElement.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        // Only validate required or filled fields
        if (input.required || input.value.trim() !== '') {
            const inputValid = validateInput(input);
            isValid = isValid && inputValid;
        }
    });
    
    return isValid;
}

function validateInput(input) {
    const errorElement = input.parentElement.querySelector('.error-message');
    let isValid = true;
    let errorMessage = '';
    
    // Reset state
    input.classList.remove('input-error');
    
    // Empty field check for required fields
    if (input.required && input.value.trim() === '') {
        isValid = false;
        errorMessage = 'This field is required';
    } 
    // Type-specific validations
    else if (input.value.trim() !== '') {
        switch (input.type) {
            case 'email':
                // Advanced email validation using regex
                const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!emailPattern.test(input.value)) {
                    isValid = false;
                    errorMessage = 'Invalid email address. Expected format: example@domain.com';
                }
                break;
                
            case 'tel':
                // Advanced phone validation for French formats
                // Uses the validators.js utility
                if (input.id === 'phone') {
                    if (!Validators.phone(input.value)) {
                        isValid = false;
                        errorMessage = 'Invalid phone number. Accepted formats: 0612345678 or +33612345678';
                    }
                }
                break;
                
            // Additional validations for other types...
        }
    }
    
    // Checkbox validation
    if (input.type === 'checkbox' && input.required && !input.checked) {
        isValid = false;
        errorMessage = 'You must accept to continue';
    }
    
    // Display error message if needed
    if (!isValid && errorElement) {
        errorElement.textContent = errorMessage;
        input.classList.add('input-error');
    } else if (errorElement) {
        errorElement.textContent = '';
    }
    
    return isValid;
}
```

#### 5. File Upload Handling

The form supports document uploads with validation:

```javascript
function setupFileUpload() {
    const fileInput = document.getElementById('reference-document');
    const filePreview = document.getElementById('file-preview');
    
    if (fileInput && filePreview) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type and size
                const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 
                                   'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                const maxSize = 5 * 1024 * 1024; // 5 MB
                
                // Validate file type
                if (!validTypes.includes(file.type)) {
                    showFileError('Unsupported file type. Please choose a PDF, image, or Word document.');
                    fileInput.value = '';
                    return;
                }
                
                // Validate file size
                if (file.size > maxSize) {
                    showFileError(`File too large (${(file.size / 1024 / 1024).toFixed(2)} MB). Maximum 5 MB`);
                    fileInput.value = '';
                    return;
                }
                
                // Display file information
                filePreview.innerHTML = `
                    <div class="file-info">
                        <p>Name: ${file.name}</p>
                        <p>Type: ${file.type}</p>
                        <p>Size: ${(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                `;
                
                // Save file name in formData
                formData['referenceDocument'] = file.name;
                
                // Clear any error messages
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
```

#### 6. Data Summary Generation

Before final submission, the form presents a comprehensive summary:

```javascript
function generateSummary() {
    let summaryHtml = '<div class="summary-container">';
    
    // Personal information section
    summaryHtml += '<div class="summary-section">';
    summaryHtml += '<h3>Personal Information</h3>';
    summaryHtml += '<div class="summary-content">';
    summaryHtml += `<p><strong>Name:</strong> ${escapeHtml(formData.firstName || '')} ${escapeHtml(formData.lastName || '')}</p>`;
    summaryHtml += `<p><strong>Email:</strong> ${escapeHtml(formData.email || '')}</p>`;
    summaryHtml += `<p><strong>Phone:</strong> ${escapeHtml(formData.phone || '')}</p>`;
    summaryHtml += '</div>';
    summaryHtml += '<button type="button" class="btn-edit" data-edit="1">Edit</button>';
    summaryHtml += '</div>';
    
    // Project details section
    // Similar structure...
    
    // Preferences section
    // Similar structure...
    
    summaryHtml += '</div>';
    
    return summaryHtml;
}

// Security: Escape HTML to prevent XSS attacks
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
```

#### 7. Form Submission

The form handles the submission process with validation:

```javascript
function handleSubmit(event) {
    event.preventDefault();
    
    // Validate current step
    if (currentStep !== 3.5 && !validateStep(currentStep)) {
        return;
    }
    
    // Show summary if not already viewing it
    if (currentStep !== 3.5) {
        saveStepData(currentStep);
        saveToLocalStorage();
        
        // Create summary step if it doesn't exist
        if (!document.getElementById('step-3.5')) {
            createSummaryStep();
        } else {
            // Update summary content
            document.getElementById('summary-content').innerHTML = generateSummary();
        }
        
        showStep(3.5);
        return;
    }
    
    // Submit form data
    console.log('Form data:', formData);
    
    // Clear saved data
    clearSavedData();
    
    // Display confirmation message
    document.getElementById('confirmation-email').textContent = formData.email;
    showStep(4);
    
    // In production, you would send the data to the server here
    // fetch('/submit-form', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     showStep(4);
    // })
    // .catch(error => {
    //     console.error('Error during submission:', error);
    // });
}
```

### Validators Module

For advanced validation, a separate validators.js module is used:

```javascript
const Validators = {
    // Email validation with strict regex
    email: function(email) {
        const strictPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return strictPattern.test(email);
    },
    
    // Phone validation for French formats
    phone: function(phone) {
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        const frPattern = /^0[1-9][0-9]{8}$/;
        const intPattern = /^\+33[1-9][0-9]{8}$/;
        return frPattern.test(cleanPhone) || intPattern.test(cleanPhone);
    },
    
    // More validators...
};
```

### Glassmorphism UI Design

The UI features a modern glassmorphism style with:

- Translucent glass-like surfaces with backdrop-filter blur effects
- Subtle borders to define boundaries
- Soft shadows for depth
- Gradient backgrounds with organic shapes
- Animated transitions between steps
- Responsive layout using CSS Grid and Flexbox

Performance optimizations are included:
- Reduced effects for users with motion sensitivity preferences
- Fallbacks for browsers that don't support backdrop-filter
- Optimized animations with hardware acceleration

### Accessibility Features

The form includes several accessibility enhancements:
- ARIA roles and attributes for screen readers
- Focus management across steps
- Keyboard navigation
- Visible focus states
- Error messaging that works with assistive technology
- Support for prefers-reduced-motion media query

## Browser Compatibility

The form is compatible with all modern browsers. For older browsers without backdrop-filter support, a fallback style is provided.

----

# Formulaire de Demande de Devis Multi-étapes avec UI Glassmorphism

## Aperçu du Projet

Ce projet implémente un formulaire de demande de devis sophistiqué à plusieurs étapes avec un design moderne de type glassmorphism. Le formulaire comprend une validation côté client, une persistance automatique des données, des téléchargements de fichiers, une navigation par étapes et une vue récapitulative avant soumission. L'interface utilisateur est entièrement responsive et suit les meilleures pratiques d'accessibilité.

## Fonctionnalités Clés

- **Navigation multi-étapes** : Progression intuitive à travers 4 étapes avec retour visuel
- **Persistance via localStorage** : Sauvegarde automatique des données permettant aux utilisateurs de reprendre leur progression
- **Validation en temps réel** : Validation côté client avec messages d'erreur pertinents
- **Téléchargement de fichiers** : Support pour les téléchargements de documents avec validation (PDF, Word, images)
- **Récapitulatif des données** : Revue complète de toutes les informations avant soumission finale
- **Design responsive** : Optimisé pour tous les appareils sans media queries
- **Interface glassmorphism** : UI moderne et transparente avec effets de flou et ombres subtiles
- **Accessibilité** : Attributs ARIA, navigation au clavier et respect des préférences de mouvement

## Implémentation Technique

### Architecture JavaScript

Les fonctionnalités du formulaire sont alimentées par une architecture JavaScript bien structurée divisée en plusieurs modules principaux :

#### 1. Initialisation et Gestion d'État

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Les éléments DOM sont mis en cache pour la performance
    const form = document.getElementById('quote-form');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    // L'état du formulaire est maintenu en mémoire
    let currentStep = 1;
    let formData = {};
    const STORAGE_KEY = 'quote_form_data';
    
    function init() {
        // Charge les données précédemment sauvegardées depuis localStorage
        loadFromLocalStorage();
        
        // Reprend là où l'utilisateur s'était arrêté
        const savedStep = localStorage.getItem('quote_form_step');
        if (savedStep) {
            showStep(parseInt(savedStep));
        } else {
            showStep(currentStep);
        }
        
        // Configure diverses fonctionnalités du formulaire
        setupCharCounters();
        setupEventListeners();
        setupAutoSave();
        
        // Notifie l'utilisateur si des données ont été restaurées
        if (Object.keys(formData).length > 0) {
            showNotification('Vos données ont été restaurées. Vous pouvez continuer où vous vous êtes arrêté.', 'info');
            populateFormFields();
        }
    }
});
```

#### 2. Système de Stockage Local

Le formulaire implémente un mécanisme de sauvegarde automatique efficace qui préserve les entrées de l'utilisateur :

```javascript
function setupAutoSave() {
    const allInputs = form.querySelectorAll('input, select, textarea');
    
    allInputs.forEach(input => {
        // Choisit l'événement approprié selon le type d'entrée
        const eventType = input.type === 'checkbox' || input.type === 'select-one' || 
                         input.type === 'select-multiple' ? 'change' : 'input';
        
        // Utilise debounce pour éviter des opérations de sauvegarde excessives
        input.addEventListener(eventType, debounce(() => {
            saveStepData(currentStep);
            saveToLocalStorage();
        }, 500));
    });
}

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

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    localStorage.setItem('quote_form_step', currentStep.toString());
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        formData = JSON.parse(savedData);
    }
}

function populateFormFields() {
    // Parcourt toutes les données sauvegardées et remplit les champs correspondants
    Object.keys(formData).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            // Traitement spécial pour différents types d'entrée
            if (input.type === 'checkbox') {
                // Gère les cases à cocher simples et multiples
                if (Array.isArray(formData[key])) {
                    const checkboxes = form.querySelectorAll(`[name="${key}"]`);
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = formData[key].includes(checkbox.value);
                    });
                } else {
                    input.checked = formData[key] === true;
                }
            } else if (input.type === 'select-multiple') {
                // Gère les éléments multi-sélection
                if (Array.isArray(formData[key])) {
                    Array.from(input.options).forEach(option => {
                        option.selected = formData[key].includes(option.value);
                    });
                }
            } else {
                // Gestion standard des entrées
                input.value = formData[key];
            }
            
            // Met à jour les compteurs de caractères pour les zones de texte
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
```

#### 3. Navigation par Étapes et Progression Visuelle

Le formulaire fournit une navigation intuitive par étapes avec retour visuel :

```javascript
function showStep(step) {
    // Met à jour l'étape actuelle
    currentStep = step;
    
    // Cache toutes les étapes et supprime les classes d'animation
    steps.forEach(stepElement => {
        stepElement.classList.remove('active', 'slide-in', 'slide-out');
    });
    
    // Affiche l'étape demandée avec l'animation appropriée
    const currentStepElement = document.getElementById(`step-${step}`);
    currentStepElement.classList.add('active');
    
    // Ajoute différentes animations selon l'étape
    if (step === 3.5) {
        // Animation spéciale pour la vue récapitulative
        currentStepElement.classList.add('zoom-in');
    } else {
        currentStepElement.classList.add('slide-in');
    }
    
    // Met à jour la barre de progression
    updateProgressBar(step);
    
    // Défilement fluide vers le haut du formulaire
    form.scrollIntoView({ behavior: 'smooth' });
}

function updateProgressBar(step) {
    // Gère le cas spécial de l'étape récapitulative
    const displayStep = step === 3.5 ? 3 : step;
    
    progressSteps.forEach((progressStep, index) => {
        const stepNumber = parseInt(progressStep.dataset.step);
        
        // Réinitialise les classes
        progressStep.classList.remove('active', 'completed');
        
        // Applique les classes appropriées selon l'état de l'étape
        if (stepNumber === displayStep) {
            progressStep.classList.add('active');
        } else if (stepNumber < displayStep) {
            progressStep.classList.add('completed');
        }
    });
    
    // Met à jour les lignes de progression entre les étapes
    progressLines.forEach((line, index) => {
        line.classList.remove('active');
        if (index < displayStep - 1) {
            line.classList.add('active');
        }
    });
}
```

#### 4. Validation du Formulaire

Le formulaire implémente une validation complète avec retour en temps réel :

```javascript
function validateStep(step) {
    // Ignore la validation pour le récapitulatif ou la confirmation
    if (step === 3.5 || step === 4) {
        return true;
    }
    
    const stepElement = document.getElementById(`step-${step}`);
    const inputs = stepElement.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        // Valide uniquement les champs obligatoires ou remplis
        if (input.required || input.value.trim() !== '') {
            const inputValid = validateInput(input);
            isValid = isValid && inputValid;
        }
    });
    
    return isValid;
}

function validateInput(input) {
    const errorElement = input.parentElement.querySelector('.error-message');
    let isValid = true;
    let errorMessage = '';
    
    // Réinitialise l'état
    input.classList.remove('input-error');
    
    // Vérification de champ vide pour les champs obligatoires
    if (input.required && input.value.trim() === '') {
        isValid = false;
        errorMessage = 'Ce champ est obligatoire';
    } 
    // Validations spécifiques par type
    else if (input.value.trim() !== '') {
        switch (input.type) {
            case 'email':
                // Validation avancée d'email en utilisant regex
                const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!emailPattern.test(input.value)) {
                    isValid = false;
                    errorMessage = 'Adresse email invalide. Format attendu : exemple@domaine.com';
                }
                break;
                
            case 'tel':
                // Validation avancée du téléphone pour formats français
                // Utilise le module validators.js
                if (input.id === 'phone') {
                    if (!Validators.phone(input.value)) {
                        isValid = false;
                        errorMessage = 'Numéro de téléphone invalide. Formats acceptés : 0612345678 ou +33612345678';
                    }
                }
                break;
                
            // Validations supplémentaires pour d'autres types...
        }
    }
    
    // Validation des cases à cocher
    if (input.type === 'checkbox' && input.required && !input.checked) {
        isValid = false;
        errorMessage = 'Vous devez accepter pour continuer';
    }
    
    // Affiche le message d'erreur si nécessaire
    if (!isValid && errorElement) {
        errorElement.textContent = errorMessage;
        input.classList.add('input-error');
    } else if (errorElement) {
        errorElement.textContent = '';
    }
    
    return isValid;
}
```

#### 5. Gestion des Téléchargements de Fichiers

Le formulaire prend en charge les téléchargements de documents avec validation :

```javascript
function setupFileUpload() {
    const fileInput = document.getElementById('reference-document');
    const filePreview = document.getElementById('file-preview');
    
    if (fileInput && filePreview) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Valide le type et la taille du fichier
                const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 
                                   'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                const maxSize = 5 * 1024 * 1024; // 5 MB
                
                // Valide le type de fichier
                if (!validTypes.includes(file.type)) {
                    showFileError('Type de fichier non pris en charge. Veuillez choisir un PDF, une image ou un document Word.');
                    fileInput.value = '';
                    return;
                }
                
                // Valide la taille du fichier
                if (file.size > maxSize) {
                    showFileError(`Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(2)} MB). Maximum 5 MB`);
                    fileInput.value = '';
                    return;
                }
                
                // Affiche les informations du fichier
                filePreview.innerHTML = `
                    <div class="file-info">
                        <p>Nom : ${file.name}</p>
                        <p>Type : ${file.type}</p>
                        <p>Taille : ${(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                `;
                
                // Sauvegarde le nom du fichier dans formData
                formData['referenceDocument'] = file.name;
                
                // Efface les messages d'erreur
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
```

#### 6. Génération du Récapitulatif des Données

Avant la soumission finale, le formulaire présente un récapitulatif complet :

```javascript
function generateSummary() {
    let summaryHtml = '<div class="summary-container">';
    
    // Section informations personnelles
    summaryHtml += '<div class="summary-section">';
    summaryHtml += '<h3>Informations personnelles</h3>';
    summaryHtml += '<div class="summary-content">';
    summaryHtml += `<p><strong>Nom :</strong> ${escapeHtml(formData.firstName || '')} ${escapeHtml(formData.lastName || '')}</p>`;
    summaryHtml += `<p><strong>Email :</strong> ${escapeHtml(formData.email || '')}</p>`;
    summaryHtml += `<p><strong>Téléphone :</strong> ${escapeHtml(formData.phone || '')}</p>`;
    summaryHtml += '</div>';
    summaryHtml += '<button type="button" class="btn-edit" data-edit="1">Modifier</button>';
    summaryHtml += '</div>';
    
    // Section détails du projet
    // Structure similaire...
    
    // Section préférences
    // Structure similaire...
    
    summaryHtml += '</div>';
    
    return summaryHtml;
}

// Sécurité : Échappe le HTML pour prévenir les attaques XSS
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/<//g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"//g, '&quot;')
        .replace(/'/g, '&#039;');
}
```

#### 7. Soumission du Formulaire

Le formulaire gère le processus de soumission avec validation :

```javascript
function handleSubmit(event) {
    event.preventDefault();
    
    // Valide l'étape actuelle
    if (currentStep !== 3.5 && !validateStep(currentStep)) {
        return;
    }
    
    // Affiche le récapitulatif si pas déjà affiché
    if (currentStep !== 3.5) {
        saveStepData(currentStep);
        saveToLocalStorage();
        
        // Crée l'étape de récapitulation si elle n'existe pas
        if (!document.getElementById('step-3.5')) {
            createSummaryStep();
        } else {
            // Met à jour le contenu du récapitulatif
            document.getElementById('summary-content').innerHTML = generateSummary();
        }
        
        showStep(3.5);
        return;
    }
    
    // Soumet les données du formulaire
    console.log('Données du formulaire :', formData);
    
    // Efface les données sauvegardées
    clearSavedData();
    
    // Affiche le message de confirmation
    document.getElementById('confirmation-email').textContent = formData.email;
    showStep(4);
    
    // En production, vous enverriez les données au serveur ici
    // fetch('/submit-form', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     showStep(4);
    // })
    // .catch(error => {
    //     console.error('Erreur lors de la soumission :', error);
    // });
}
```

### Module Validators

Pour une validation avancée, un module validators.js séparé est utilisé :

```javascript
const Validators = {
    // Validation d'email avec regex stricte
    email: function(email) {
        const strictPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return strictPattern.test(email);
    },
    
    // Validation de téléphone pour formats français
    phone: function(phone) {
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        const frPattern = /^0[1-9][0-9]{8}$/;
        const intPattern = /^\+33[1-9][0-9]{8}$/;
        return frPattern.test(cleanPhone) || intPattern.test(cleanPhone);
    },
    
    // Plus de validateurs...
};
```

### Design UI Glassmorphism

L'interface utilisateur présente un style glassmorphism moderne avec :

- Surfaces translucides de type verre avec effets de flou backdrop-filter
- Bordures subtiles pour définir les limites
- Ombres douces pour la profondeur
- Arrière-plans dégradés avec formes organiques
- Transitions animées entre les étapes
- Mise en page responsive utilisant CSS Grid et Flexbox

Des optimisations de performance sont incluses :
- Effets réduits pour les utilisateurs ayant des préférences de sensibilité au mouvement
- Solutions de repli pour les navigateurs qui ne prennent pas en charge backdrop-filter
- Animations optimisées avec accélération matérielle

### Fonctionnalités d'Accessibilité

Le formulaire inclut plusieurs améliorations d'accessibilité :
- Rôles et attributs ARIA pour les lecteurs d'écran
- Gestion du focus à travers les étapes
- Navigation au clavier
- États de focus visibles
- Messagerie d'erreur compatible avec la technologie d'assistance
- Support pour la requête média prefers-reduced-motion

## Compatibilité des Navigateurs

Le formulaire est compatible avec tous les navigateurs modernes. Pour les navigateurs plus anciens sans support backdrop-filter, un style de repli est fourni.
```
//////////LOCAL STORAGE SYSTEM//////////////

<!--  Pour sauvegarder les données d'un formulaire de contact dans le localStorage, 
vous devez suivre plusieurs étapes. Tout d'abord, installez le package @formkit/addons qui contient le plugin de sauvegarde 
dans le localStorage. Ensuite, configurez ce plugin dans votre fichier de configuration FormKit. -->

import { defaultConfig } from '@formkit/vue'
import { createLocalStoragePlugin } from '@formkit/addons'

const config = defaultConfig({
  plugins: [
    createLocalStoragePlugin({
      prefix: 'formkit', // préfixe par défaut
      key: 'contact', // clé optionnelle pour identifier le formulaire de contact
      maxAge: 3600000, // données valides pendant 1 heure
      debounce: 200, // délai d'attente avant sauvegarde
      beforeSave: undefined, // callback avant la sauvegarde
      beforeLoad: undefined // callback avant le chargement
    }),
  ],
})
export default config

<!-- 
Pour activer la sauvegarde dans le localStorage pour votre formulaire de contact, 
joutez l'attribut use-local-storage à votre formulaire FormKit. Par exemple : -->

<formkit type="form" id="contact" use-local-storage>
  <!-- champs du formulaire de contact -->
</formkit>