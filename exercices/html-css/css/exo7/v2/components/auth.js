/**
 * Gestion de l'authentification
 * Authentication management
 */

document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si l'utilisateur est connecté
    checkAuthStatus();
    
    // Initialiser les fonctions d'authentification
    initAuthFunctions();
});

/**
 * Vérifier le statut d'authentification
 * Check authentication status
 */
function checkAuthStatus() {
    const token = localStorage.getItem('auth_token');
    
    // Rediriger vers la page de connexion si non authentifié
    if (!token && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Mettre à jour l'interface utilisateur avec les infos utilisateur
    if (token) {
        updateUserInterface();
    }
}

/**
 * Mettre à jour l'interface avec les informations utilisateur
 * Update user interface with user information
 */
function updateUserInterface() {
    const username = localStorage.getItem('auth_user') || 'Admin';
    const avatar = localStorage.getItem('auth_avatar') || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(username) + '&background=4361ee&color=fff&size=100';
    const role = localStorage.getItem('auth_role') || 'user';
    const provider = localStorage.getItem('auth_provider') || 'local';
    
    // Mettre à jour le nom d'utilisateur
    const userSpan = document.querySelector('.user-profile span');
    if (userSpan) {
        userSpan.textContent = username;
    }
    
    // Mettre à jour l'avatar
    const userImg = document.querySelector('.user-profile img');
    if (userImg) {
        userImg.src = avatar;
        userImg.alt = username;
    }
    
    // Ajouter les attributs de données pour les fonctionnalités avancées
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.setAttribute('data-role', role);
        userProfile.setAttribute('data-provider', provider);
        
        // Ajouter une icône de badge pour Google si c'est le fournisseur
        if (provider === 'google') {
            const badge = document.createElement('div');
            badge.className = 'provider-badge google';
            badge.innerHTML = '<i class="fab fa-google"></i>';
            userProfile.appendChild(badge);
        }
    }
}

/**
 * Initialiser les fonctions d'authentification
 * Initialize authentication functions
 */
function initAuthFunctions() {
    // Gérer le bouton de déconnexion
    const logoutBtn = document.querySelector('.sidebar-footer a');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    // Gérer le menu déroulant du profil utilisateur
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Vérifier si le menu existe déjà
            let menu = document.querySelector('.user-dropdown');
            
            if (menu) {
                // Basculer la visibilité
                menu.classList.toggle('show');
                return;
            }
            
            // Créer le menu déroulant s'il n'existe pas
            menu = document.createElement('div');
            menu.className = 'user-dropdown';
            
            // Récupérer les données utilisateur
            const username = localStorage.getItem('auth_user') || 'Admin';
            const email = localStorage.getItem('auth_email') || 'admin@example.com';
            const role = localStorage.getItem('auth_role') || 'user';
            const provider = localStorage.getItem('auth_provider') || 'local';
            
            menu.innerHTML = `
                <div class="dropdown-header">
                    <p class="user-name">${username}</p>
                    <p class="user-email">${email}</p>
                    <div class="user-role ${role}">${role === 'administrator' ? 'Administrateur' : 'Utilisateur'}</div>
                </div>
                <div class="dropdown-divider"></div>
                <ul class="dropdown-menu">
                    <li><a href="#"><i class="fas fa-user-circle"></i> Mon profil</a></li>
                    <li><a href="#"><i class="fas fa-cog"></i> Paramètres</a></li>
                    <li><a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Déconnexion</a></li>
                </ul>
                ${provider === 'google' ? `
                <div class="dropdown-footer">
                    <p>Connecté avec <i class="fab fa-google"></i> Google</p>
                </div>` : ''}
            `;
            
            document.body.appendChild(menu);
            
            // Positionner le menu
            const rect = userProfile.getBoundingClientRect();
            menu.style.top = rect.bottom + 'px';
            menu.style.right = (window.innerWidth - rect.right) + 'px';
            
            // Afficher le menu
            setTimeout(() => menu.classList.add('show'), 10);
            
            // Gérer le clic sur le bouton de déconnexion
            const logoutBtnInMenu = menu.querySelector('#logout-btn');
            if (logoutBtnInMenu) {
                logoutBtnInMenu.addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            }
            
            // Fermer le menu au clic en dehors
            document.addEventListener('click', function closeDropdown(e) {
                if (!menu.contains(e.target) && !userProfile.contains(e.target)) {
                    menu.classList.remove('show');
                    
                    // Supprimer le menu après l'animation
                    setTimeout(() => {
                        menu.remove();
                    }, 300);
                    
                    // Supprimer cet écouteur d'événement
                    document.removeEventListener('click', closeDropdown);
                }
            });
        });
    }
}

/**
 * Déconnecter l'utilisateur
 * Log out user
 */
function logout() {
    // Créer et afficher un loader de déconnexion
    const logoutLoader = document.createElement('div');
    logoutLoader.className = 'logout-loader';
    logoutLoader.innerHTML = `
        <div class="spinner-container">
            <div class="spinner"></div>
        </div>
        <p>Déconnexion en cours...</p>
    `;
    
    // Ajouter les styles
    const style = document.createElement('style');
    style.textContent = `
        .logout-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--bg-light, #f5f7fb);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            animation: fadeIn 0.3s ease forwards;
        }
        
        body.dark-mode .logout-loader {
            background-color: var(--dark-bg-primary, #111827);
        }
        
        .logout-loader .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-left-color: var(--primary-color, #4361ee);
            animation: spin 1s linear infinite;
        }
        
        body.dark-mode .logout-loader .spinner {
            border-color: rgba(255, 255, 255, 0.1);
            border-left-color: var(--primary-color, #4361ee);
        }
        
        .logout-loader p {
            font-size: 1rem;
            color: var(--text-dark, #333);
            margin-top: 1rem;
        }
        
        body.dark-mode .logout-loader p {
            color: #ffffff;
        }
        
        @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(logoutLoader);

    // Vérifier le fournisseur d'authentification
    const provider = localStorage.getItem('auth_provider');
    
    // Si c'est Google, déconnecter du compte Google
    if (provider === 'google') {
        // S'il existe des cookies de session Google, les supprimer
        const googleSignOutUrl = "https://accounts.google.com/logout";
        
        // Ouvrir une fenêtre invisible pour déconnexion Google
        const signOutWindow = window.open(googleSignOutUrl, "_blank", "width=1,height=1,top=-500,left=-500");
        
        // Fermer la fenêtre après une déconnexion complète
        setTimeout(() => {
            if (signOutWindow) {
                signOutWindow.close();
            }
            
            // Poursuivre avec la déconnexion locale
            completeLogout();
        }, 1000);
    } else {
        // Déconnexion standard
        completeLogout();
    }
}

/**
 * Terminer le processus de déconnexion
 */
function completeLogout() {
    // Afficher un message de déconnexion
    const notification = document.createElement('div');
    notification.className = 'logout-notification';
    notification.innerHTML = '<i class="fas fa-check-circle"></i> Déconnexion réussie';
    document.body.appendChild(notification);
    
    // Animer le message
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Supprimer toutes les informations d'authentification
    setTimeout(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_email');
        localStorage.removeItem('auth_avatar');
        localStorage.removeItem('auth_role');
        localStorage.removeItem('auth_provider');
        
        // Rediriger vers la page de connexion
        window.location.href = 'login.html?logout=success';
    }, 1000);
}

// Exporter les fonctions pour une utilisation externe
window.AuthManager = {
    checkAuthStatus,
    logout,
    updateUserInterface
};
