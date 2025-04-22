// Script pour le menu hamburger et la navigation responsive
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const dropdowns = document.querySelectorAll('.dropdown');
    const overlay = document.getElementById('menu-overlay');
    const menuCheckbox = document.getElementById('menu-toggle-checkbox');
    
    // Fonctions d'accessibilité
    function updateAriaAttributes(isOpen) {
        // Si on utilise encore le bouton hamburger (pendant la transition)
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', isOpen);
        }
        
        document.querySelectorAll('.dropdown a[aria-haspopup]').forEach(item => {
            item.setAttribute('aria-expanded', 'false');
        });
    }
    
    // Fonction pour ouvrir le menu
    function openMenu() {
        if (menuToggle) {
            menuToggle.classList.add('open');
        }
        mainNav.classList.add('open');
        document.body.classList.add('menu-open');
        overlay.classList.add('active');
        updateAriaAttributes(true);
    }
    
    // Fonction pour fermer le menu
    function closeMenu() {
        if (menuToggle) {
            menuToggle.classList.remove('open');
        }
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
    
    // Si on utilise encore le bouton hamburger
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            if (mainNav.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
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
});
