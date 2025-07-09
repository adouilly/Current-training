// Éléments du DOM
const passwordOutput = document.getElementById('password-output');
const passwordLengthSlider = document.getElementById('password-length');
const displayPasswordLength = document.getElementById('display-password-length');
const generateButton = document.getElementById('generateButton');

// Configuration des types de caractères avec leurs éléments DOM
const charsetConfig = [
    {
        id: 'lowercase',
        element: document.getElementById('lowercase'),
        chars: 'abcdefghijklmnopqrstuvwxyz'
    },
    {
        id: 'uppercase',
        element: document.getElementById('uppercase'),
        chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    },
    {
        id: 'numbers',
        element: document.getElementById('numbers'),
        chars: '0123456789'
    },
    {
        id: 'symbols',
        element: document.getElementById('symbols'),
        chars: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    }
];

// Fonction pour générer un mot de passe
function generatePassword() {
    const length = parseInt(passwordLengthSlider.value);
    let availableChars = '';
    
    // Construire la chaîne de caractères disponibles avec forEach
    charsetConfig.forEach(config => {
        if (config.element.checked) {
            availableChars += config.chars;
        }
    });
    
    // Vérifier qu'au moins une option est sélectionnée
    if (availableChars === '') {
        passwordOutput.value = 'Sélectionnez au moins un type de caractère';
        return;
    }
    
    // Générer le mot de passe
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        password += availableChars[randomIndex];
    }
    
    passwordOutput.value = password;
}

// Fonction pour mettre à jour l'affichage de la longueur
function updatePasswordLength() {
    displayPasswordLength.value = passwordLengthSlider.value;
}

// Fonction pour copier le mot de passe dans le presse-papiers
async function copyPassword() {
    if (passwordOutput.value && passwordOutput.value !== 'Générateur de MDP' && passwordOutput.value !== 'Sélectionnez au moins un type de caractère') {
        try {
            // API Clipboard moderne
            await navigator.clipboard.writeText(passwordOutput.value);
            
            // Feedback visuel temporaire
            const originalValue = passwordOutput.value;
            passwordOutput.value = 'Copié!';
            setTimeout(() => {
                passwordOutput.value = originalValue;
            }, 1000);
        } catch (err) {
            console.error('Erreur lors de la copie:', err);
            // Fallback pour les anciens navigateurs
            passwordOutput.select();
            document.execCommand('copy');
        }
    }
}

// Event listeners
passwordLengthSlider.addEventListener('input', updatePasswordLength);
generateButton.addEventListener('click', generatePassword);
passwordOutput.addEventListener('click', copyPassword);

// Génération automatique quand les options changent - avec forEach
charsetConfig.forEach(config => {
    config.element.addEventListener('change', generatePassword);
});
passwordLengthSlider.addEventListener('input', generatePassword);
