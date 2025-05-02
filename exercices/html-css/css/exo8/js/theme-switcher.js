/**
 * Gestion du thème sombre/clair
 */
document.addEventListener('DOMContentLoaded', function() {
    // Créer le bouton de changement de thème
    const themeSwitcher = document.createElement('button');
    themeSwitcher.className = 'theme-switcher';
    themeSwitcher.innerHTML = '🌓';
    themeSwitcher.title = 'Changer de thème';
    document.body.appendChild(themeSwitcher);
    
    // Vérifier si un thème est stocké dans localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Ajouter l'événement de clic pour changer de thème
    themeSwitcher.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
});
