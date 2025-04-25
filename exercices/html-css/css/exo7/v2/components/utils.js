/**
 * Fonctions utilitaires pour le dashboard
 */

// Gestion sécurisée du localStorage avec JSON
const StorageManager = {
    /**
     * Récupère une valeur du localStorage et la parse comme JSON
     * @param {string} key - Clé de stockage
     * @param {any} defaultValue - Valeur par défaut si la clé n'existe pas ou si le parsing échoue
     * @returns {any} Valeur parsée ou valeur par défaut
     */
    get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            if (value === null) return defaultValue;
            return JSON.parse(value);
        } catch (error) {
            console.error(`Erreur lors de la récupération de ${key} depuis localStorage:`, error);
            return defaultValue;
        }
    },
    
    /**
     * Stocke une valeur dans localStorage après l'avoir convertie en JSON
     * @param {string} key - Clé de stockage
     * @param {any} value - Valeur à stocker
     * @returns {boolean} Succès ou échec
     */
    set(key, value) {
        try {
            const jsonValue = JSON.stringify(value);
            localStorage.setItem(key, jsonValue);
            return true;
        } catch (error) {
            console.error(`Erreur lors du stockage de ${key} dans localStorage:`, error);
            return false;
        }
    },
    
    /**
     * Supprime une entrée du localStorage
     * @param {string} key - Clé à supprimer
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Erreur lors de la suppression de ${key} de localStorage:`, error);
            return false;
        }
    },
    
    /**
     * Vérifie et répare les données JSON corrompues dans localStorage
     */
    validateAll() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                const value = localStorage.getItem(key);
                // Tenter de parser uniquement les valeurs qui semblent être du JSON
                if (value && (value.startsWith('{') || value.startsWith('['))) {
                    JSON.parse(value);
                }
            } catch (error) {
                console.warn(`Données JSON invalides trouvées dans ${key}, suppression...`);
                localStorage.removeItem(key);
            }
        }
    }
};

// Fonction debounce pour limiter la fréquence d'exécution
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

// Exporter les utilitaires
window.Utils = {
    StorageManager,
    debounce
};

// Exécuter la validation au chargement
document.addEventListener('DOMContentLoaded', () => {
    StorageManager.validateAll();
});
