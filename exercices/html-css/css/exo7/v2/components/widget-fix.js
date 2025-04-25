/**
 * Script pour corriger les problèmes visuels des widgets en mode compact
 */
(function() {
    // Exécuter une fois le DOM chargé
    document.addEventListener('DOMContentLoaded', function() {
        // Corriger les widgets au chargement
        setTimeout(fixCompactWidgets, 500);
        
        // Observer les changements dans les widgets pour les corriger en temps réel
        const widgetsGrid = document.getElementById('widgets-grid');
        if (widgetsGrid) {
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'class') {
                        // Si un widget change de classe (compact/normal), corriger les widgets
                        if (mutation.target.classList.contains('widget')) {
                            setTimeout(fixCompactWidgets, 50);
                        }
                    }
                });
            });
            
            // Observer tous les widgets existants
            document.querySelectorAll('.widget').forEach(widget => {
                observer.observe(widget, { attributes: true });
            });
        }
        
        // Ajouter des écouteurs d'événements pour les boutons de basculement compact
        document.querySelectorAll('.toggle-view').forEach(button => {
            button.addEventListener('click', function() {
                // Laisser le temps au DOM de se mettre à jour
                setTimeout(fixCompactWidgets, 100);
            });
        });
    });
    
    /**
     * Corrige les problèmes visuels des widgets en mode compact
     */
    function fixCompactWidgets() {
        // Corriger la taille de tous les widgets compacts
        document.querySelectorAll('.widget.compact').forEach(widget => {
            // Forcer une hauteur basée uniquement sur l'en-tête et le résumé
            const header = widget.querySelector('.widget-header');
            const summary = widget.querySelector('.compact-summary');
            
            if (header && summary) {
                // Calculer la hauteur nécessaire
                const headerHeight = header.offsetHeight;
                const summaryHeight = summary.offsetHeight;
                const totalHeight = headerHeight + summaryHeight;
                
                // Appliquer la hauteur exacte
                widget.style.height = `${totalHeight}px`;
                widget.style.minHeight = `${totalHeight}px`;
                widget.style.maxHeight = `${totalHeight}px`;
                
                // S'assurer que le contenu principal est bien masqué
                const content = widget.querySelector('.widget-content');
                if (content) {
                    content.style.display = 'none';
                    content.style.height = '0';
                    content.style.overflow = 'hidden';
                }
                
                // Supprimer les effets de surbrillance
                summary.style.boxShadow = 'none';
                summary.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--bg-light');
                
                if (document.body.classList.contains('dark-mode')) {
                    summary.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--dark-bg-light');
                }
            }
        });
        
        // Corriger la taille de tous les widgets non compacts
        document.querySelectorAll('.widget:not(.compact)').forEach(widget => {
            // Réinitialiser les styles pour les widgets non compacts
            widget.style.height = '';
            widget.style.minHeight = '';
            widget.style.maxHeight = '';
            
            // S'assurer que le contenu est visible
            const content = widget.querySelector('.widget-content');
            if (content) {
                content.style.display = '';
                content.style.height = '';
                content.style.overflow = '';
            }
        });
    }
})();
