/**
 * Animations pour les éléments de la galerie
 */
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Ajouter des classes d'animation aux éléments de la galerie
    galleryItems.forEach((item, index) => {
        // Alterner entre différentes animations
        const animationClasses = ['animate-fade-in', 'animate-slide-up', 'animate-zoom-in', 'animate-slide-in'];
        const animationClass = animationClasses[index % animationClasses.length];
        
        item.classList.add(animationClass);
        
        // Initialiser l'opacité à 0 pour l'animation
        item.style.opacity = '0';
    });
    
    // Fonction pour vérifier si un élément est visible dans la fenêtre
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Fonction pour animer les éléments visibles
    function animateOnScroll() {
        galleryItems.forEach(item => {
            if (isElementInViewport(item) && !item.classList.contains('animated')) {
                item.classList.add('animated');
                item.style.opacity = '1';
            }
        });
    }
    
    // Lancement de l'animation au chargement et au défilement
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});
