/**
 * Module pour la fonctionnalité de redimensionnement des widgets
 */
const WidgetResize = {
    activeWidget: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    minWidth: 250,
    minHeight: 150,
    
    /**
     * Initialiser les gestionnaires d'événements pour le redimensionnement
     */
    init: function() {
        console.log('Initialisation du module de redimensionnement des widgets');
        
        // Sélectionner toutes les poignées de redimensionnement
        document.querySelectorAll('.resize-handle').forEach(handle => {
            handle.addEventListener('mousedown', this.startResize.bind(this));
        });
        
        // Attacher les gestionnaires d'événements pour le redimensionnement
        document.addEventListener('mousemove', this.resize.bind(this));
        document.addEventListener('mouseup', this.stopResize.bind(this));
        
        // Ajouter des observateurs pour les nouveaux widgets
        this.observeDOMChanges();
    },
    
    /**
     * Observer les changements du DOM pour ajouter des gestionnaires aux nouveaux widgets
     */
    observeDOMChanges: function() {
        // Créer un MutationObserver pour détecter les nouveaux widgets
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        // Vérifier si le nœud ajouté est un widget ou contient des widgets
                        if (node.querySelector) {
                            const handles = node.querySelectorAll('.resize-handle');
                            if (handles.length) {
                                handles.forEach(handle => {
                                    handle.addEventListener('mousedown', this.startResize.bind(this));
                                });
                                console.log(`Gestionnaires de redimensionnement ajoutés à ${handles.length} nouveaux widgets`);
                            }
                        }
                    });
                }
            });
        });
        
        // Observer le conteneur du dashboard pour détecter les nouveaux widgets
        const dashboardContainer = document.querySelector('.dashboard-container');
        if (dashboardContainer) {
            observer.observe(dashboardContainer, { childList: true, subtree: true });
            console.log('Observateur DOM configuré pour les widgets');
        }
    },
    
    /**
     * Démarrer le redimensionnement lorsque la poignée est cliquée
     */
    startResize: function(e) {
        // Empêcher le comportement par défaut
        e.preventDefault();
        e.stopPropagation();
        
        // Trouver le widget associé à la poignée
        const widget = e.target.closest('.widget');
        if (!widget) return;
        
        // Mémoriser le widget actif et les positions initiales
        this.activeWidget = widget;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startWidth = widget.offsetWidth;
        this.startHeight = widget.offsetHeight;
        
        // Ajouter une classe pour le style pendant le redimensionnement
        widget.classList.add('resizing');
        
        console.log(`Début du redimensionnement pour ${widget.id || 'widget'}: ${this.startWidth}x${this.startHeight}`);
    },
    
    /**
     * Mettre à jour les dimensions pendant le déplacement de la souris
     */
    resize: function(e) {
        // Ne rien faire s'il n'y a pas de widget actif
        if (!this.activeWidget) return;
        
        // Calculer les nouvelles dimensions
        const width = Math.max(this.startWidth + (e.clientX - this.startX), this.minWidth);
        const height = Math.max(this.startHeight + (e.clientY - this.startY), this.minHeight);
        
        // Appliquer les nouvelles dimensions
        this.activeWidget.style.width = width + 'px';
        this.activeWidget.style.height = height + 'px';
        
        // Redimensionner les graphiques si nécessaires
        this.resizeWidgetCharts(this.activeWidget);
    },
    
    /**
     * Terminer le redimensionnement lorsque le bouton de la souris est relâché
     */
    stopResize: function(e) {
        // Ne rien faire s'il n'y a pas de widget actif
        if (!this.activeWidget) return;
        
        // Enlever la classe de style
        this.activeWidget.classList.remove('resizing');
        
        const finalWidth = this.activeWidget.style.width;
        const finalHeight = this.activeWidget.style.height;
        
        console.log(`Fin du redimensionnement: ${finalWidth}x${finalHeight}`);
        
        // Redimensionner les graphiques maintenant que le widget a sa taille finale
        this.resizeWidgetCharts(this.activeWidget);
        
        // Réinitialiser l'état
        this.activeWidget = null;
    },
    
    /**
     * Redimensionner les graphiques dans un widget si nécessaire
     */
    resizeWidgetCharts: function(widget) {
        if (!widget) return;
        
        // Vérifier s'il y a des graphiques dans ce widget
        const chartCanvas = widget.querySelector('canvas');
        if (chartCanvas && window.Chart) {
            const chart = Chart.getChart(chartCanvas);
            if (chart) {
                // Redimensionner le graphique
                chart.resize();
                console.log(`Graphique redimensionné dans ${widget.id || 'widget'}`);
            }
        }
    },
    
    /**
     * Ajouter une poignée de redimensionnement à un widget
     */
    addResizeHandle: function(widget) {
        if (!widget) return;
        
        // Vérifier si le widget a déjà une poignée
        if (widget.querySelector('.resize-handle')) {
            return;
        }
        
        // Créer une poignée de redimensionnement
        const handle = document.createElement('div');
        handle.className = 'resize-handle';
        widget.appendChild(handle);
        
        // Ajouter le gestionnaire d'événements
        handle.addEventListener('mousedown', this.startResize.bind(this));
        
        console.log(`Poignée de redimensionnement ajoutée au widget ${widget.id || ''}`);
    }
};

// Si le document est déjà chargé, initialiser immédiatement
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => WidgetResize.init(), 1);
} else {
    document.addEventListener('DOMContentLoaded', function() {
        WidgetResize.init();
    });
}
