/**
 * Script de diagnostic OAuth
 * Aide à identifier et résoudre les problèmes d'authentification Google
 */

// Exécuter au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Ne faire apparaître les diagnostics que sur la page de login
    if (!window.location.pathname.includes('login.html')) return;
    
    // Attendre un peu pour s'assurer que tous les scripts sont chargés
    setTimeout(function() {
        console.log('=========== INFORMATIONS DE DIAGNOSTIC OAUTH ===========');
        console.log('URL actuelle (ajoutez-la aux URIs de redirection autorisées) :');
        console.log(window.location.href.split('?')[0]); // URL sans paramètres
        console.log('=========================================================');
        
        // Vérifier si le bouton Google est correctement chargé
        const googleButton = document.querySelector('.g_id_signin div[role="button"]');
        const g_id_onload = document.getElementById('g_id_onload');
        
        if (!googleButton) {
            console.warn('Diagnostic: Le bouton Google Sign-In n\'a pas été correctement rendu');
        }
        
        if (!g_id_onload) {
            console.error('Diagnostic: L\'élément g_id_onload est introuvable dans le DOM');
            
            // Correction automatique: tenter de le créer s'il est manquant
            if (!document.getElementById('g_id_onload')) {
                const container = document.querySelector('.social-login');
                if (container) {
                    const element = document.createElement('div');
                    element.id = 'g_id_onload';
                    element.setAttribute('data-client_id', '610070679331-jro330mqcc5ciqrgegg9stgih8208spq.apps.googleusercontent.com');
                    element.setAttribute('data-context', 'signin');
                    element.setAttribute('data-callback', 'handleGoogleSignIn');
                    element.setAttribute('data-ux_mode', 'popup');
                    element.setAttribute('data-auto_prompt', 'false');
                    
                    // Insérer au début du conteneur
                    if (container.firstChild) {
                        container.insertBefore(element, container.firstChild);
                    } else {
                        container.appendChild(element);
                    }
                    
                    console.log('Diagnostic: Élément g_id_onload créé automatiquement');
                }
            }
        }
    }, 1000);
});
