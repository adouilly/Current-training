/**
 * Validateurs avancés pour le formulaire
 * Advanced validators for the form
 */

const Validators = {
    /**
     * Valider un email
     * Validate an email
     * @param {string} email - Email à valider / Email to validate
     * @returns {boolean} - Indique si l'email est valide / Indicates if the email is valid
     */
    email: function(email) {
        // Format de base: exemple@domaine.com
        const basicPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Validation plus stricte pour les domaines, etc.
        const strictPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        return strictPattern.test(email);
    },
    
    /**
     * Valider un numéro de téléphone (formats français)
     * Validate a phone number (French formats)
     * @param {string} phone - Téléphone à valider / Phone to validate
     * @returns {boolean} - Indique si le téléphone est valide / Indicates if the phone is valid
     */
    phone: function(phone) {
        // Supprimer tous les caractères non numériques sauf +
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        
        // Format français (10 chiffres commençant par 0)
        const frPattern = /^0[1-9][0-9]{8}$/;
        
        // Format international (commençant par +33 puis 9 chiffres)
        const intPattern = /^\+33[1-9][0-9]{8}$/;
        
        return frPattern.test(cleanPhone) || intPattern.test(cleanPhone);
    },
    
    /**
     * Valider un nom ou prénom
     * Validate a name
     * @param {string} name - Nom à valider / Name to validate
     * @returns {boolean} - Indique si le nom est valide / Indicates if the name is valid
     */
    name: function(name) {
        // Lettres, espaces, tirets, apostrophes et caractères accentués
        const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ\s\-']+$/;
        
        // Vérifier également que le nom a une longueur raisonnable
        return namePattern.test(name) && name.length >= 2 && name.length <= 50;
    },
    
    /**
     * Valider un fichier
     * Validate a file
     * @param {File} file - Fichier à valider / File to validate
     * @param {Array} allowedTypes - Types autorisés / Allowed types
     * @param {number} maxSize - Taille maximale en octets / Maximum size in bytes
     * @returns {Object} - Résultat de la validation / Validation result
     */
    file: function(file, allowedTypes, maxSize) {
        if (!file) {
            return { valid: false, message: 'Aucun fichier sélectionné / No file selected' };
        }
        
        if (!allowedTypes.includes(file.type)) {
            return { valid: false, message: 'Type de fichier non autorisé / File type not allowed' };
        }
        
        if (file.size > maxSize) {
            return { 
                valid: false, 
                message: `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(2)} MB). Maximum ${(maxSize / 1024 / 1024).toFixed(2)} MB` 
            };
        }
        
        return { valid: true };
    },
    
    /**
     * Normaliser un numéro de téléphone
     * Normalize a phone number
     * @param {string} phone - Numéro à normaliser / Number to normalize
     * @returns {string} - Numéro normalisé / Normalized number
     */
    normalizePhone: function(phone) {
        // Supprimer tous les caractères non numériques sauf +
        let cleaned = phone.replace(/[^\d+]/g, '');
        
        // Convertir format 0X... en +33X...
        if (cleaned.startsWith('0')) {
            cleaned = '+33' + cleaned.substring(1);
        }
        
        return cleaned;
    }
};

// Pour l'utilisation dans d'autres fichiers / For use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validators;
}