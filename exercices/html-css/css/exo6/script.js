// Script pour le menu hamburger et la navigation responsive
document.addEventListener('DOMContentLoaded', function() {
    // Obtenir les éléments du DOM
    // Supprimer la référence à l'ancien bouton hamburger
    // const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const dropdowns = document.querySelectorAll('.dropdown');
    const overlay = document.getElementById('menu-overlay');
    const menuCheckbox = document.getElementById('menu-toggle-checkbox');
    const hamburgerLabel = document.querySelector('.hamburger-menu-label');
    
    // Ajouter un événement de clic pour le label du hamburger - LOGIQUE CORRIGÉE
    if (hamburgerLabel) {
        hamburgerLabel.addEventListener('click', function(e) {
            // Prévenir le comportement par défaut pour contrôler manuellement
            e.preventDefault();
            
            // Vérifier l'état actuel du menu plutôt que la checkbox
            if (mainNav.classList.contains('open')) {
                closeMenu();
                menuCheckbox.checked = false; // Synchroniser l'état de la checkbox
            } else {
                openMenu();
                menuCheckbox.checked = true; // Synchroniser l'état de la checkbox
            }
        });
    }
    
    // Fonctions d'accessibilité
    function updateAriaAttributes(isOpen) {
        // Supprimer la référence à l'ancien bouton hamburger
        // if (menuToggle) {
        //     menuToggle.setAttribute('aria-expanded', isOpen);
        // }
        
        document.querySelectorAll('.dropdown a[aria-haspopup]').forEach(item => {
            item.setAttribute('aria-expanded', 'false');
        });
    }
    
    // Fonction pour ouvrir le menu
    function openMenu() {
        // Supprimer la référence à l'ancien bouton hamburger
        // if (menuToggle) {
        //     menuToggle.classList.add('open');
        // }
        mainNav.classList.add('open');
        document.body.classList.add('menu-open');
        overlay.classList.add('active');
        updateAriaAttributes(true);
    }
    
    // Fonction pour fermer le menu
    function closeMenu() {
        // Supprimer la référence à l'ancien bouton hamburger
        // if (menuToggle) {
        //     menuToggle.classList.remove('open');
        // }
        mainNav.classList.remove('open');
        document.body.classList.remove('menu-open');
        overlay.classList.remove('active');
        
        // Si on utilise la checkbox pour le menu
        if (menuCheckbox) {
            menuCheckbox.checked = false;
        }
        
        updateAriaAttributes(false);
        
        // Fermer aussi tous les sous-menus
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
    
    // Surveiller les changements de taille d'écran
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Réinitialiser l'état du menu si on passe au desktop
            closeMenu();
        }
    });
    
    // Supprimer le gestionnaire d'événement pour l'ancien bouton hamburger
    // if (menuToggle) {
    //     menuToggle.addEventListener('click', function() {
    //         if (mainNav.classList.contains('open')) {
    //             closeMenu();
    //         } else {
    //             openMenu();
    //         }
    //     });
    // }

    // Vérifier l'état initial de la checkbox au chargement
    if (menuCheckbox && menuCheckbox.checked) {
        openMenu();
    }
    
    // Fermer le menu quand on clique sur l'overlay
    overlay.addEventListener('click', closeMenu);
    
    // Gérer les dropdowns
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                this.setAttribute('aria-expanded', dropdown.classList.contains('active'));
                
                // Fermer les autres dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                        otherDropdown.querySelector('a').setAttribute('aria-expanded', 'false');
                    }
                });
            }
        });
    });
    
    // Fermer le menu quand on clique sur un lien non-dropdown
    const navLinks = document.querySelectorAll('.nav-list a:not(.dropdown > a)');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });

    // Fonctionnalités de scroll top
    const backToTopButton = document.getElementById('back-to-top');
    const logoLink = document.querySelector('.logo-link');
    
    // Fonction pour scroller en haut de la page
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Ajouter un écouteur d'événements pour le bouton retour en haut
    if (backToTopButton) {
        backToTopButton.addEventListener('click', scrollToTop);
    }
    
    // Ajouter un écouteur d'événements pour le logo (uniquement en desktop)
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            // Vérifier si on est en desktop (largeur > 768px)
            if (window.innerWidth >= 769) {
                e.preventDefault();
                scrollToTop();
            }
        });
    }
    
    // Afficher/masquer le bouton back-to-top selon le défilement
    window.addEventListener('scroll', function() {
        if (window.innerWidth >= 769) { // Uniquement en desktop
            if (window.pageYOffset > 200) {
                backToTopButton.style.display = 'flex';
            } else {
                backToTopButton.style.display = 'none';
            }
        }
    });
});
