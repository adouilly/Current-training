/**
 * Configuration initiale de l'application
 * Ce fichier contient le code d'initialisation générale
 */

// Vérifier si l'utilisateur est connecté / Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    checkUserAuthentication();
    initializeTheme();
});

/**
 * Vérifie si l'utilisateur est authentifié, sinon redirige vers login
 */
function checkUserAuthentication() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        // Rediriger vers la page de connexion / Redirect to login page
        window.location.href = 'login.html';
    } else {
        // Mettre à jour l'interface utilisateur avec les informations de l'utilisateur
        updateUserInterface();
    }
}

/**
 * Met à jour l'interface utilisateur avec les informations de l'utilisateur connecté
 */
function updateUserInterface() {
    const userName = localStorage.getItem('userName') || 'Admin';
    const userAvatar = document.querySelector('.user-avatar');
    const userNameElement = document.querySelector('.user-name');
    
    if (userNameElement) {
        userNameElement.textContent = userName;
    }
    
    if (userAvatar) {
        const userPicture = localStorage.getItem('userPicture');
        if (userPicture) {
            // Si l'utilisateur s'est connecté avec Google, afficher sa photo
            // If user logged in with Google, display profile picture
            userAvatar.innerHTML = `<img src="${userPicture}" alt="${userName}" />`;
        } else {
            // Sinon, afficher les initiales / Otherwise, display initials
            const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
            userAvatar.textContent = initials;
        }
    }
}

/**
 * Initialise le thème préféré de l'utilisateur au chargement
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('theme-loading');
        document.body.classList.add('dark-theme');
        
        // Mise à jour du bouton de thème dans le menu
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        if (themeToggleBtn) {
            const icon = themeToggleBtn.querySelector('i');
            const text = themeToggleBtn.querySelector('.menu-text');
            
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
            
            if (text) {
                text.textContent = 'Thème clair';
            }
        }
        
        setTimeout(() => document.documentElement.classList.remove('theme-loading'), 100);
    }
}

// Activer les styles du bouton d'ajout de widgets lors du chargement complet
window.addEventListener('load', function() {
    const addWidgetBtn = document.getElementById('add-widget-btn');
    if (addWidgetBtn) {
        addWidgetBtn.style.display = 'flex';
        console.log("Bouton d'ajout de widget visible");
    } else {
        console.warn("Bouton d'ajout de widget non trouvé");
    }
    
    // S'assurer que la modal est bien configurée
    const modal = document.getElementById('add-widget-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    if (modal && modalOverlay) {
        console.log("Modale d'ajout de widget configurée");
    } else {
        console.warn("Éléments de la modale manquants");
    }
});
