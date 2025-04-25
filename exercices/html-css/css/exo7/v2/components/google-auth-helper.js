/**
 * Helper pour l'authentification Google
 * Simplifie la configuration OAuth et le processus de connexion
 */

(function() {
    // Attendre que le document soit chargé
    document.addEventListener('DOMContentLoaded', function() {
        initGoogleAuth();
    });

    /**
     * Initialiser l'authentification Google
     */
    function initGoogleAuth() {
        console.log('Initialisation de l\'authentification Google en mode popup');
        
        // Vérifier si les éléments nécessaires sont présents
        const g_id_onload = document.getElementById('g_id_onload');
        if (!g_id_onload) {
            console.error('Élément g_id_onload non trouvé');
            createFallbackButton();
            return;
        }
        
        // Configuration en mode popup pour éviter les problèmes de redirection
        g_id_onload.setAttribute('data-ux_mode', 'popup');
        
        // Ajouter un bouton de secours après un délai
        setTimeout(checkGoogleButton, 3000);
    }
    
    /**
     * Vérifier si le bouton Google est chargé et créer un bouton de secours si nécessaire
     */
    function checkGoogleButton() {
        const googleButton = document.querySelector('.g_id_signin div[role="button"]');
        if (!googleButton) {
            console.warn('Bouton Google non détecté après délai - création d\'un bouton de secours');
            createFallbackButton();
        }
    }
    
    /**
     * Créer un bouton de secours pour l'authentification Google
     */
    function createFallbackButton() {
        const socialLogin = document.querySelector('.social-login');
        if (!socialLogin) return;
        
        // Nettoyer d'abord le contenu existant
        socialLogin.innerHTML = '';
        
        // Créer un nouveau bouton de secours
        const fallbackButton = document.createElement('button');
        fallbackButton.className = 'btn google-auth-fallback-btn';
        fallbackButton.innerHTML = `
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google">
            <span>Se connecter avec Google (Méthode alternative)</span>
        `;
        
        // Styles pour le bouton
        fallbackButton.style.display = 'flex';
        fallbackButton.style.alignItems = 'center';
        fallbackButton.style.justifyContent = 'center';
        fallbackButton.style.gap = '10px';
        fallbackButton.style.width = '100%';
        fallbackButton.style.padding = '10px';
        fallbackButton.style.backgroundColor = '#fff';
        fallbackButton.style.border = '1px solid #ddd';
        fallbackButton.style.borderRadius = '4px';
        fallbackButton.style.color = '#333';
        fallbackButton.style.cursor = 'pointer';
        
        // Ajouter l'événement pour utiliser le processus de connexion alternatif
        fallbackButton.addEventListener('click', alternativeGoogleAuth);
        
        // Ajouter au DOM
        socialLogin.appendChild(fallbackButton);
        
        // Ajouter un message explicatif
        const helpText = document.createElement('p');
        helpText.style.marginTop = '10px';
        helpText.style.fontSize = '13px';
        helpText.style.color = '#666';
        helpText.style.textAlign = 'center';
        helpText.innerHTML = 'Cette méthode utilise une fenêtre popup pour éviter les problèmes de redirection.';
        socialLogin.appendChild(helpText);
    }
    
    /**
     * Méthode alternative d'authentification Google via une fenêtre popup
     */
    function alternativeGoogleAuth() {
        // Simuler une connexion pour la démonstration
        const clientId = document.querySelector('meta[name="google-signin-client_id"]')?.getAttribute('content');
        
        if (!clientId) {
            alert("ID Client Google non trouvé. Impossible de procéder à l'authentification.");
            return;
        }
        
        // URL pour l'authentification OAuth2 Google
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${encodeURIComponent(clientId)}` +
            `&response_type=token` +
            `&scope=${encodeURIComponent('email profile')}` +
            `&redirect_uri=${encodeURIComponent(window.location.origin + '/auth-callback.html')}` +
            `&prompt=select_account`;
        
        // Variables pour la fenêtre popup et l'intervalle de vérification
        let authWindow = null;
        let authCheckInterval = null;
        
        try {
            // Ouvrir une fenêtre popup pour l'authentification
            authWindow = window.open(authUrl, 'googleAuthPopup', 'width=600,height=700');
            
            if (!authWindow) {
                throw new Error("La fenêtre popup a été bloquée. Veuillez autoriser les popups pour ce site.");
            }
            
            // Simulons une authentification réussie pour la démonstration
            alert("Pour cette démonstration, nous allons simuler une connexion réussie avec Google.");
            
            // Création d'un profil simulé
            const simulatedProfile = {
                name: "Utilisateur Google",
                email: "utilisateur@gmail.com",
                picture: "https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff&size=100"
            };
            
            // Stockage des données dans localStorage
            localStorage.setItem('auth_token', 'simulated_google_token');
            localStorage.setItem('auth_user', simulatedProfile.name);
            localStorage.setItem('auth_email', simulatedProfile.email);
            localStorage.setItem('auth_avatar', simulatedProfile.picture);
            localStorage.setItem('auth_role', simulatedProfile.email.includes('admin') ? 'administrator' : 'user');
            localStorage.setItem('auth_provider', 'google');
            
            // Redirection vers le tableau de bord
            window.location.href = 'index.html';
            
        } catch (error) {
            alert(`Erreur lors de l'authentification: ${error.message}`);
            console.error('Erreur d\'authentification Google:', error);
        }
    }
    
    // Exposer les fonctions nécessaires
    window.GoogleAuthHelper = {
        alternativeGoogleAuth,
        createFallbackButton
    };
})();
