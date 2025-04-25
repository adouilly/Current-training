/**
 * Script d'assistance pour la configuration OAuth
 * Aide à vérifier et configurer les paramètres OAuth pour Google
 */

(function() {
    // Exécuter uniquement sur la page de login
    if (!window.location.pathname.includes('login.html')) return;
    
    // Vérifier si l'ID client a été remplacé
    window.addEventListener('DOMContentLoaded', function() {
        setTimeout(checkOAuthSetup, 1000);
    });
    
    function checkOAuthSetup() {
        const metaClientId = document.querySelector('meta[name="google-signin-client_id"]');
        const onloadClientId = document.querySelector('#g_id_onload');
        
        if (!metaClientId || !onloadClientId) return;
        
        const metaContent = metaClientId.getAttribute('content');
        const onloadContent = onloadClientId.getAttribute('data-client_id');
        
        const defaultValue = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
        
        if (metaContent === defaultValue || onloadContent === defaultValue) {
            showSetupHelper();
        } else if (!metaContent.endsWith('.apps.googleusercontent.com') || !onloadContent.endsWith('.apps.googleusercontent.com')) {
            showInvalidFormatWarning();
        } else {
            console.log('Configuration OAuth semble valide. ID Client : ' + metaContent.substring(0, 8) + '...');
        }
    }
    
    function showSetupHelper() {
        const loginContainer = document.querySelector('.login-container');
        if (!loginContainer) return;
        
        const setupHelper = document.createElement('div');
        setupHelper.className = 'oauth-setup-helper';
        setupHelper.innerHTML = `
            <h3><i class="fas fa-exclamation-triangle"></i> Configuration OAuth requise</h3>
            <p>Pour activer la connexion avec Google, vous devez configurer un ID client OAuth 2.0.</p>
            <ol>
                <li>Accédez à la <a href="https://console.cloud.google.com/apis/credentials" target="_blank">Console Google Cloud</a></li>
                <li>Créez ou sélectionnez un projet</li>
                <li>Créez un ID client OAuth 2.0 pour application Web</li>
                <li>Ajoutez l'URL actuelle aux origines autorisées: <code>${window.location.origin}</code></li>
                <li>Copiez l'ID client et remplacez <code>YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com</code> dans login.html</li>
            </ol>
            <p><strong>En attendant, utilisez la connexion standard:</strong></p>
            <p>Nom d'utilisateur: <code>admin</code>, Mot de passe: <code>admin</code></p>
            <button id="dismiss-helper" class="btn btn-sm">Fermer ce message</button>
        `;
        
        loginContainer.parentNode.insertBefore(setupHelper, loginContainer);
        
        document.getElementById('dismiss-helper').addEventListener('click', function() {
            setupHelper.style.opacity = '0';
            setTimeout(() => setupHelper.remove(), 300);
        });
    }
    
    function showInvalidFormatWarning() {
        const loginContainer = document.querySelector('.login-container');
        if (!loginContainer) return;
        
        const warningMsg = document.createElement('div');
        warningMsg.className = 'oauth-warning';
        warningMsg.innerHTML = `
            <p><i class="fas fa-exclamation-circle"></i> Format d'ID client OAuth incorrect</p>
            <p>L'ID client doit se terminer par <code>.apps.googleusercontent.com</code></p>
        `;
        
        loginContainer.insertAdjacentElement('beforebegin', warningMsg);
    }
})();
