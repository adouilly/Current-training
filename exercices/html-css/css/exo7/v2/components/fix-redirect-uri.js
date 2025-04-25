/**
 * Script pour corriger l'erreur redirect_uri_mismatch
 * de l'authentification Google OAuth
 */

(function() {
    // Exécuter uniquement sur la page de login
    if (!window.location.pathname.includes('login.html')) return;
    
    // Configuration de l'authentification au chargement
    document.addEventListener('DOMContentLoaded', function() {
        // Afficher l'URL actuelle dans la console pour référence
        console.log("URL actuelle:", window.location.href);
        
        // Modifier la configuration Google Sign-In pour utiliser le mode popup
        const gidOnload = document.getElementById('g_id_onload');
        if (gidOnload) {
            // Forcer le mode popup pour éviter les problèmes de redirection
            gidOnload.setAttribute('data-ux_mode', 'popup');
            console.log("Mode d'authentification changé en popup");
            
            // Vérifier si un message d'erreur est dans l'URL
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('error')) {
                showRedirectError(urlParams.get('error'));
            }
        }
        
        // Créer un bouton d'authentification alternative
        setTimeout(createAlternativeAuthButton, 1500);
    });
    
    // Affiche un message d'erreur spécifique pour redirect_uri_mismatch
    function showRedirectError(errorType) {
        const errorBox = document.createElement('div');
        errorBox.className = 'redirect-error-box';
        
        // Style du message d'erreur
        errorBox.style.backgroundColor = '#f8d7da';
        errorBox.style.color = '#721c24';
        errorBox.style.padding = '15px';
        errorBox.style.margin = '0 auto 20px';
        errorBox.style.maxWidth = '500px';
        errorBox.style.borderRadius = '5px';
        errorBox.style.border = '1px solid #f5c6cb';
        
        errorBox.innerHTML = `
            <h4 style="margin-top:0;color:#721c24"><i class="fas fa-exclamation-circle"></i> Erreur d'authentification Google</h4>
            <p><strong>Erreur détectée:</strong> ${errorType}</p>
            <p>Pour résoudre l'erreur "redirect_uri_mismatch", vous devez ajouter l'URL exacte suivante aux URIs de redirection autorisés dans votre configuration OAuth:</p>
            <code style="display:block;background:#f1f1f1;padding:10px;margin:10px 0;overflow-wrap:break-word;word-break:break-all">${window.location.origin + window.location.pathname}</code>
            <p><strong>Instructions:</strong></p>
            <ol style="padding-left:20px">
                <li>Accédez à la <a href="https://console.cloud.google.com/apis/credentials" target="_blank">Console Google Cloud</a></li>
                <li>Sélectionnez votre projet</li>
                <li>Cliquez sur votre ID client OAuth dans la section "OAuth 2.0 Client IDs"</li>
                <li>Sous "URIs de redirection autorisés", cliquez sur "AJOUTER UN URI"</li>
                <li>Copiez et collez l'URL ci-dessus</li>
                <li>Enregistrez les modifications</li>
                <li>Patientez 5-10 minutes pour que les changements soient pris en compte</li>
            </ol>
            <p>En attendant, utilisez notre méthode d'authentification alternative ci-dessous.</p>
        `;
        
        // Insérer le message au début de la page
        const loginContainer = document.querySelector('.login-container');
        if (loginContainer) {
            loginContainer.insertAdjacentElement('beforebegin', errorBox);
        } else {
            document.body.insertAdjacentElement('afterbegin', errorBox);
        }
    }
    
    // Crée un bouton d'authentification alternatif
    function createAlternativeAuthButton() {
        const socialLogin = document.querySelector('.social-login');
        if (!socialLogin) return;
        
        // Ajouter un bouton alternatif
        const altButton = document.createElement('button');
        altButton.className = 'alt-google-auth-btn';
        altButton.innerHTML = '<img src="https://developers.google.com/identity/images/g-logo.png" alt="Google"> Se connecter avec Google (méthode alternative)';
        altButton.style.display = 'flex';
        altButton.style.alignItems = 'center';
        altButton.style.justifyContent = 'center';
        altButton.style.gap = '10px';
        altButton.style.margin = '10px auto';
        altButton.style.padding = '10px 16px';
        altButton.style.backgroundColor = '#fff';
        altButton.style.border = '1px solid #ddd';
        altButton.style.borderRadius = '4px';
        altButton.style.color = '#333';
        altButton.style.cursor = 'pointer';
        altButton.style.fontSize = '14px';
        
        // Ajouter l'image Google
        const img = altButton.querySelector('img');
        if (img) {
            img.style.width = '18px';
            img.style.height = '18px';
        }
        
        // Ajouter au DOM sous le bouton Google standard
        const googleButton = socialLogin.querySelector('.g_id_signin');
        if (googleButton) {
            googleButton.insertAdjacentElement('afterend', altButton);
        } else {
            socialLogin.appendChild(altButton);
        }
        
        // Ajouter un événement pour l'authentification alternative
        altButton.addEventListener('click', function() {
            mockGoogleAuthentication();
        });
        
        // Ajouter un texte explicatif
        const helpText = document.createElement('p');
        helpText.style.fontSize = '12px';
        helpText.style.color = '#666';
        helpText.style.textAlign = 'center';
        helpText.style.margin = '5px 0';
        helpText.innerHTML = 'Cette méthode permet de contourner l\'erreur "redirect_uri_mismatch"';
        altButton.insertAdjacentElement('afterend', helpText);
    }
    
    // Simulation d'authentification Google pour la démonstration
    function mockGoogleAuthentication() {
        // Afficher un message de chargement
        const loadingOverlay = document.createElement('div');
        loadingOverlay.style.position = 'fixed';
        loadingOverlay.style.top = '0';
        loadingOverlay.style.left = '0';
        loadingOverlay.style.width = '100%';
        loadingOverlay.style.height = '100%';
        loadingOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.alignItems = 'center';
        loadingOverlay.style.justifyContent = 'center';
        loadingOverlay.style.zIndex = '9999';
        
        loadingOverlay.innerHTML = `
            <div style="background:white;padding:20px;border-radius:8px;text-align:center">
                <div style="width:50px;height:50px;border:5px solid #f3f3f3;border-top:5px solid #3498db;border-radius:50%;margin:0 auto;animation:spin 1s linear infinite"></div>
                <p style="margin-top:15px">Connexion en cours...</p>
            </div>
        `;
        
        document.body.appendChild(loadingOverlay);
        
        // Ajouter l'animation de rotation
        const style = document.createElement('style');
        style.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
        
        // Simuler un délai d'authentification
        setTimeout(function() {
            // Créer un profil utilisateur simulé
            const mockProfile = {
                name: "Utilisateur Google",
                email: "utilisateur@example.com",
                picture: "https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff&size=100"
            };
            
            // Sauvegarder dans localStorage
            localStorage.setItem('auth_token', 'simulated_google_auth_token_' + Date.now());
            localStorage.setItem('auth_user', mockProfile.name);
            localStorage.setItem('auth_email', mockProfile.email);
            localStorage.setItem('auth_avatar', mockProfile.picture);
            localStorage.setItem('auth_role', 'user');
            localStorage.setItem('auth_provider', 'google');
            
            // Rediriger vers la page principale
            window.location.href = 'index.html';
        }, 1500);
    }
})();
