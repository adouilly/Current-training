/**
 * Script principal du dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialisation du toggle sidebar
    initSidebar();
    
    // Initialisation des graphiques
    if (typeof initializeCharts === 'function') {
        initializeCharts();
    }
});

// Gestion de la barre latérale
function initSidebar() {
    const toggleBtn = document.getElementById('toggle-sidebar');
    const dashboard = document.querySelector('.dashboard-container');
    
    if (toggleBtn && dashboard) {
        toggleBtn.addEventListener('click', () => {
            dashboard.classList.toggle('sidebar-collapsed');
            
            // Sauvegarder l'état
            const isCollapsed = dashboard.classList.contains('sidebar-collapsed');
            localStorage.setItem('sidebar_collapsed', isCollapsed);
        });
        
        // Restaurer l'état sauvegardé
        const isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
        if (isCollapsed) {
            dashboard.classList.add('sidebar-collapsed');
        }
    }
}

// Fonction pour ajouter un nouveau widget (pour utilisation future)
window.addWidget = function(config) {
    const widgetsContainer = document.getElementById('widgets-grid');
    
    if (!widgetsContainer || !config) return;
    
    // Créer un nouvel élément widget
    const widget = document.createElement('div');
    widget.className = 'widget';
    widget.setAttribute('data-widget-id', config.id || 'widget-' + Date.now());
    widget.setAttribute('data-size', config.size || 'small');
    widget.setAttribute('data-grid-position', config.position || '1,1,1,1');
    
    // Structure interne du widget
    widget.innerHTML = `
        <div class="widget-header">
            <h3>${config.title || 'Nouveau widget'}</h3>
            <div class="widget-controls">
                <button class="toggle-size" title="Redimensionner"><i class="fas fa-expand-alt"></i></button>
                <button class="toggle-view" title="Vue compacte"><i class="fas fa-compress"></i></button>
                <button class="remove-widget" title="Supprimer"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <div class="widget-content">
            ${config.content || '<p>Contenu du widget</p>'}
        </div>
    `;
    
    // Ajouter au conteneur
    widgetsContainer.appendChild(widget);
    
    // Réinitialiser le gestionnaire de widgets
    if (window.widgetManager) {
        window.widgetManager.setupWidget(widget);
        window.widgetManager.applyWidgetPositions();
        window.widgetManager.saveWidgetPositions();
    }
    
    return widget;
};
