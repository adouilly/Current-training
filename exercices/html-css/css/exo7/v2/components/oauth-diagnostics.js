/**
 * Script de diagnostic pour l'authentification OAuth
 * Aide à résoudre les problèmes courants de configuration OAuth
 */

(function() {
    // Exécuter uniquement sur la page de login
    if (!window.location.pathname.includes('login.html')) return;

    // Ajouter un événement au chargement de la page
    window.addEventListener('DOMContentLoaded', function() {
        // Afficher l'URL actuelle pour aider à la configuration
        console.log('=========== INFORMATIONS DE DIAGNOSTIC OAUTH ===========');
        console.log('URL actuelle (ajoutez-la aux URIs de redirection autorisées) :');
        console.log(window.location.href.split('?')[0]);
        console.log('=========================================================');

        // Créer un bouton de diagnostic
        setTimeout(createDiagnosticButton, 500);
    });

    function createDiagnosticButton() {
        const loginContainer = document.querySelector('.login-container');
        if (!loginContainer) return;

        const diagButton = document.createElement('button');
        diagButton.className = 'oauth-diag-button';
        diagButton.innerHTML = '<i class="fas fa-stethoscope"></i> Diagnostiquer problèmes OAuth';
        
        loginContainer.appendChild(diagButton);
        
        // Ajouter les styles
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            .oauth-diag-button {
                background-color: #6c757d;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 8px 12px;
                font-size: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                margin-top: 20px;
                width: 100%;
            }

            .oauth-diag-button:hover {
                background-color: #5a6268;
            }

            .oauth-diag-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0,0,0,0.5);
                z-index: 1000;
                align-items: center;
                justify-content: center;
            }
            
            .oauth-diag-modal.open {
                display: flex;
            }
            
            .oauth-diag-content {
                background-color: #fff;
                border-radius: 8px;
                padding: 20px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }

            body.dark-mode .oauth-diag-content {
                background-color: #1e2937;
                color: #e9ecef;
            }
            
            .oauth-diag-close {
                float: right;
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #6c757d;
            }
            
            .oauth-diag-close:hover {
                color: #343a40;
            }

            body.dark-mode .oauth-diag-close:hover {
                color: #f8f9fa;
            }
            
            .oauth-diag-results {
                margin-top: 15px;
                font-family: monospace;
                font-size: 14px;
            }
            
            .oauth-diag-results pre {
                background-color: #f8f9fa;
                border: 1px solid #e9ecef;
                padding: 10px;
                border-radius: 4px;
                overflow-x: auto;
            }

            body.dark-mode .oauth-diag-results pre {
                background-color: #343a40;
                border-color: #495057;
            }
            
            .oauth-diag-result-item {
                margin-bottom: 10px;
                padding: 10px;
                border-radius: 4px;
            }
            
            .oauth-diag-success {
                background-color: #d4edda;
                color: #155724;
            }

            body.dark-mode .oauth-diag-success {
                background-color: #133a1b;
                color: #d4edda;
            }
            
            .oauth-diag-warning {
                background-color: #fff3cd;
                color: #856404;
            }

            body.dark-mode .oauth-diag-warning {
                background-color: #533f04;
                color: #fff3cd;
            }
            
            .oauth-diag-error {
                background-color: #f8d7da;
                color: #721c24;
            }

            body.dark-mode .oauth-diag-error {
                background-color: #541319;
                color: #f8d7da;
            }
        `;
        document.head.appendChild(styleEl);

        // Créer la modale de diagnostic
        const modal = document.createElement('div');
        modal.className = 'oauth-diag-modal';
        modal.innerHTML = `
            <div class="oauth-diag-content">
                <button class="oauth-diag-close">&times;</button>
                <h3>Diagnostic OAuth</h3>
                <p>Voici les informations pour vous aider à résoudre les problèmes OAuth:</p>
                <div class="oauth-diag-results">
                    <div class="oauth-diag-result-item oauth-diag-warning">
                        <strong>URL actuelle (à ajouter aux URIs de redirection):</strong>
                        <pre>${window.location.href.split('?')[0]}</pre>
                    </div>
                    <div class="oauth-diag-result-item oauth-diag-info">
                        <strong>Configuration détectée:</strong>
                        <p>ID Client: <span id="oauth-client-id">Détection en cours...</span></p>
                    </div>
                    <div class="oauth-diag-actions">
                        <button id="oauth-check-config" class="btn">Vérifier la configuration</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Ajouter les événements pour la modale
        diagButton.addEventListener('click', () => {
            modal.classList.add('open');
            detectOAuthConfig();
        });

        modal.querySelector('.oauth-diag-close').addEventListener('click', () => {
            modal.classList.remove('open');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('open');
            }
        });

        // Ajouter l'événement pour la vérification de configuration
        document.getElementById('oauth-check-config').addEventListener('click', checkOAuthConfig);
    }

    function detectOAuthConfig() {
        // Tenter de détecter l'ID client OAuth
        const metaClientId = document.querySelector('meta[name="google-signin-client_id"]');
        const onloadClientId = document.querySelector('#g_id_onload');
        
        let clientId = 'Non détecté';
        
        if (metaClientId) {
            clientId = metaClientId.getAttribute('content');
        } else if (onloadClientId) {
            clientId = onloadClientId.getAttribute('data-client_id');
        }
        
        const clientIdEl = document.getElementById('oauth-client-id');
        if (clientIdEl) {
            if (clientId === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
                clientIdEl.textContent = 'NON CONFIGURÉ - Vous devez remplacer la valeur par défaut';
                clientIdEl.style.color = '#dc3545';
            } else if (clientId.endsWith('.apps.googleusercontent.com')) {
                clientIdEl.textContent = clientId.substring(0, 10) + '...' + clientId.substring(clientId.length - 25);
                clientIdEl.style.color = '#28a745';
            } else {
                clientIdEl.textContent = 'Format invalide: ' + clientId;
                clientIdEl.style.color = '#dc3545';
            }
        }
    }

    function checkOAuthConfig() {
        const results = document.querySelector('.oauth-diag-results');
        
        // Créer un élément pour afficher le résultat du test
        const resultItem = document.createElement('div');
        resultItem.className = 'oauth-diag-result-item';
        resultItem.innerHTML = '<strong>Test de connexion:</strong><p>Tentative d\'initialisation de Google Sign-In...</p>';
        results.appendChild(resultItem);
        
        // Tester si Google Sign-In se charge correctement
        setTimeout(() => {
            const googleButton = document.querySelector('.g_id_signin div[role="button"]');
            if (googleButton) {
                resultItem.className = 'oauth-diag-result-item oauth-diag-success';
                resultItem.innerHTML = '<strong>Chargement du bouton Google réussi:</strong><p>Le bouton Google Sign-In est correctement chargé et affiché.</p>';
            } else {
                resultItem.className = 'oauth-diag-result-item oauth-diag-error';
                resultItem.innerHTML = `
                    <strong>Problème de chargement Google Sign-In:</strong>
                    <p>Le bouton Google Sign-In n'a pas été chargé correctement. Causes possibles:</p>
                    <ul>
                        <li>ID client OAuth incorrectement configuré</li>
                        <li>Problème de connexion aux serveurs Google</li>
                        <li>JavaScript bloqué ou erreur dans le code</li>
                    </ul>
                    <p>Vérifiez la console du navigateur pour plus de détails.</p>
                `;
            }
        }, 1000);
    }
})();
