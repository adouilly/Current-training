/**
 * Script d'initialisation pour le tableau de bord
 * Initialization script for the dashboard
 * 
 * Ce fichier contient les fonctions qui s'exécutent au chargement de la page
 * This file contains functions that run when the page loads
 */

document.addEventListener('DOMContentLoaded', function() {
    console.time('dashboard-init'); // Performance tracking / Suivi des performances
    
    // Initialiser l'interface utilisateur / Initialize user interface
    initUI();
    
    // Initialiser les widgets / Initialize widgets
    initializeWidgets();
    
    // Nettoyer tout indicateur de drag résiduel / Clean any residual drag indicators
    clearDropIndicators();
    
    // Activer la détection des performances / Enable performance detection
    monitorPerformance();
    
    console.timeEnd('dashboard-init');
});

/**
 * Initialisation de l'interface utilisateur
 * User interface initialization
 */
function initUI() {
    // Appliquer le thème sauvegardé / Apply saved theme
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.title = 'Mode jour';
        }
    }
    
    // Restaurer l'état du sidebar / Restore sidebar state
    const sidebarCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
    if (sidebarCollapsed) {
        document.querySelector('.dashboard-container').classList.add('sidebar-collapsed');
    }
    
    // Ajouter une classe pour l'animation d'entrée / Add class for entrance animation
    setTimeout(() => {
        document.body.classList.add('dashboard-ready');
    }, 100);
}

/**
 * Initialisation des widgets
 * Widget initialization
 */
function initializeWidgets() {
    // S'assurer que tous les widgets ont les bonnes classes CSS
    // Ensure all widgets have the correct CSS classes
    document.querySelectorAll('.widget').forEach(widget => {
        const size = widget.getAttribute('data-size') || 'small';
        
        // Supprimer toutes les classes de taille existantes / Remove all existing size classes
        widget.classList.remove('small', 'medium', 'large', 'full');
        
        // Ajouter la classe correspondante / Add corresponding class
        widget.classList.add(size);
        
        // Appliquer les styles de grille / Apply grid styles
        const sizes = {
            'small': { cols: 1, rows: 1 },
            'medium': { cols: 2, rows: 1 },
            'large': { cols: 3, rows: 2 },
            'full': { cols: 4, rows: 2 }
        };
        
        if (sizes[size]) {
            widget.style.gridColumn = `span ${sizes[size].cols}`;
            widget.style.gridRow = `span ${sizes[size].rows}`;
        }
        
        // Générer un résumé compact si nécessaire / Generate compact summary if needed
        if (widget.classList.contains('compact')) {
            setTimeout(() => {
                if (window.WidgetManager && window.WidgetManager.generateCompactSummary) {
                    window.WidgetManager.generateCompactSummary(widget);
                } else if (typeof generateCompactSummary === 'function') {
                    generateCompactSummary(widget);
                }
            }, 100);
        }
    });
    
    // Forcer une réorganisation initiale / Force initial reorganization
    if (typeof reorganizeWidgetsAfterResize === 'function') {
        setTimeout(reorganizeWidgetsAfterResize, 200);
    }
}

/**
 * Surveillance des performances
 * Performance monitoring
 */
function monitorPerformance() {
    // Observer les interactions de l'utilisateur / Monitor user interactions
    const interactionEvents = ['click', 'touchstart', 'mousemove'];
    
    interactionEvents.forEach(event => {
        document.addEventListener(event, () => {
            // Ne mesure les performances que si l'événement est throttled
            // Only measure performance if the event is throttled
            if (window._lastPerformanceCheck && Date.now() - window._lastPerformanceCheck < 1000) {
                return;
            }
            
            window._lastPerformanceCheck = Date.now();
            
            // Vérifier la présence d'indicateurs visuels persistants
            // Check for persistent visual indicators
            const persistentIndicators = document.querySelectorAll('.drop-indicator, .drop-target, .container-drop-target');
            if (persistentIndicators.length > 0) {
                console.warn('Indicateurs visuels persistants détectés - nettoyage');
                clearDropIndicators();
            }
        }, { passive: true });
    });
    
    // Exposer la fonction globalement / Expose function globally
    window.clearAllIndicators = clearDropIndicators;
}

/**
 * Réorganiser les widgets après redimensionnement
 * Reorganize widgets after resize
 */
window.reorganizeWidgetsAfterResize = function() {
    const container = document.getElementById('widgets-grid');
    if (!container) return;
    
    const widgets = Array.from(container.querySelectorAll('.widget'));
    
    // Trier les widgets par ordre dans le DOM / Sort widgets by DOM order
    widgets.forEach((widget, index) => {
        widget.style.order = index;
        
        // Sauvegarder l'état si la fonction existe / Save state if function exists
        if (typeof saveWidgetState === 'function') {
            saveWidgetState(widget);
        }
    });
    
    console.log('Widgets réorganisés');
};

/**
 * Supprimer les événements et nettoyage à la fermeture de la page
 * Remove events and clean up when page closes
 */
window.addEventListener('beforeunload', () => {
    // Nettoyer tous les intervalles / Clean up all intervals
    for (let i = 1; i < 9999; i++) {
        window.clearInterval(i);
    }
    
    // S'assurer que les données sont sauvegardées / Ensure data is saved
    const widgets = document.querySelectorAll('.widget');
    if (window.WidgetManager && window.WidgetManager.saveWidgetState) {
        widgets.forEach(widget => window.WidgetManager.saveWidgetState(widget));
    }
});
