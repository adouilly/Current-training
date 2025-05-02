/**
 * Initialisation des fonctionnalités interactives du site Lamborghini
 * - Menu hamburger responsive
 * - Switch de thème clair/sombre
 * - Animations au scroll pour la galerie
 */
document.addEventListener('DOMContentLoaded', function() {
    // Sélection des éléments DOM principaux
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.querySelector('.menu');
    const themeToggle = document.getElementById('theme-toggle');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Gestion du menu responsive
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    /**
     * Adapte l'affichage du menu en fonction de la taille d'écran
     * - Affiche le menu hamburger sur mobile
     * - Restaure le menu standard sur desktop
     */
    function checkScreenSize() {
        const isMobile = window.innerWidth <= 992;
        
        if (menuToggle) {
            menuToggle.style.display = isMobile ? 'flex' : 'none';
            
            // Réinitialisation du menu en version desktop
            if (!isMobile) {
                menu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    }
    
    /**
     * Gestion du thème clair/sombre avec sauvegarde des préférences
     */
    function setupThemeToggle() {
        // Restauration du thème sauvegardé
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }
        
        // Switch de thème au clic
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                document.body.classList.toggle('light-theme');
                
                // Sauvegarde de la préférence
                const isLightTheme = document.body.classList.contains('light-theme');
                localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
            });
        }
    }
    
    /**
     * Configuration des animations pour les éléments de la galerie
     */
    function setupGalleryAnimations() {
        // Préparation des éléments pour l'animation
        galleryItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
        
        /**
         * Vérifie si un élément est visible dans la fenêtre
         */
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const windowWidth = window.innerWidth || document.documentElement.clientWidth;
            
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= windowHeight &&
                rect.right <= windowWidth
            );
        }
        
        /**
         * Anime les éléments de la galerie lorsqu'ils deviennent visibles
         */
        function animateOnScroll() {
            galleryItems.forEach(item => {
                if (isElementInViewport(item) && !item.classList.contains('animated')) {
                    item.classList.add('animated');
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }
            });
        }
        
        // Initialisation des animations
        animateOnScroll();
        window.addEventListener('scroll', animateOnScroll);
    }
    
    // Initialisation de toutes les fonctionnalités
    checkScreenSize();
    setupThemeToggle();
    setupGalleryAnimations();
    
    // Mise à jour du menu lors du redimensionnement
    window.addEventListener('resize', checkScreenSize);
});
