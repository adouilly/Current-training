/**
 * Gestion du menu responsive
 */
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.querySelector('.menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Vérifier la taille de l'écran au chargement
    checkScreenSize();
    
    // Vérifier au redimensionnement
    window.addEventListener('resize', checkScreenSize);
    
    function checkScreenSize() {
        if (window.innerWidth <= 992) {
            // S'assurer que le menu toggle est visible sur les petits écrans
            if (menuToggle) {
                menuToggle.style.display = 'flex';
            }
        } else {
            // Masquer le menu toggle sur les grands écrans
            if (menuToggle) {
                menuToggle.style.display = 'none';
                // Réinitialiser le menu en version desktop
                menu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    }
});
