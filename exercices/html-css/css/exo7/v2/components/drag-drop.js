/**
 * Système de drag-and-drop simplifié pour les widgets du dashboard
 */

class WidgetManager {
    constructor() {
        this.container = document.getElementById('widgets-grid');
        this.widgets = document.querySelectorAll('.widget');
        this.activeWidget = null;
        this.isDragging = false;
        this.mouseOffset = { x: 0, y: 0 };
        this.layoutButtons = document.querySelectorAll('.layout-toggle button');
        this.currentLayout = localStorage.getItem('dashboard_layout') || 'grid';
        this.gridSize = 20; // Taille de la grille virtuelle en pixels
        
        this.init();
    }
    
    init() {
        // Initialisation des widgets
        this.widgets.forEach(widget => this.setupWidget(widget));
        
        // Gestion du changement de layout
        this.layoutButtons.forEach(button => {
            button.addEventListener('click', () => {
                const layout = button.getAttribute('data-layout');
                this.changeLayout(layout);
                
                this.layoutButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
        
        // Appliquer le layout sauvegardé
        this.applyLayout(this.currentLayout);
        
        // Restaurer les positions sauvegardées
        this.loadWidgetPositions();
        
        // Écouteurs d'événements globaux pour le drag
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Initialiser la fonctionnalité de redimensionnement
        this.initResizing();
    }
    
    // Configurer chaque widget avec les gestionnaires d'événements
    setupWidget(widget) {
        // Créer une poignée de déplacement si elle n'existe pas déjà
        const header = widget.querySelector('.widget-header');
        if (header) {
            header.classList.add('widget-draggable');
            header.addEventListener('mousedown', (e) => this.handleWidgetMouseDown(e, widget));
        }
        
        // Gestion des boutons de contrôle
        const toggleSizeBtn = widget.querySelector('.toggle-size');
        const toggleViewBtn = widget.querySelector('.toggle-view');
        
        if (toggleSizeBtn) {
            toggleSizeBtn.addEventListener('click', () => this.toggleWidgetSize(widget));
        }
        
        if (toggleViewBtn) {
            toggleViewBtn.addEventListener('click', () => this.toggleWidgetView(widget));
        }
        
        // Ajouter attribut de position si pas déjà présent
        if (!widget.getAttribute('data-grid-position')) {
            const id = widget.getAttribute('data-widget-id');
            const defaultPosition = this.getDefaultPosition(id);
            widget.setAttribute('data-grid-position', defaultPosition);
        }
    }
    
    // Obtenir la position par défaut pour un widget basé sur son ID
    getDefaultPosition(widgetId) {
        // Structure par défaut : x,y,w,h (col, row, largeur, hauteur)
        const defaultPositions = {
            'stats-users': '1,1,1,1',
            'stats-sales': '2,1,1,1',
            'stats-visits': '3,1,1,1',
            'stats-revenue': '4,1,1,1',
            'sales-chart': '1,2,3,1',
            'recent-orders': '1,3,3,1',
            'quick-contact': '4,2,1,2'
        };
        
        return defaultPositions[widgetId] || '1,1,1,1';
    }
    
    // Gestion du début du drag
    handleWidgetMouseDown(e, widget) {
        // Ignorer si c'est un clic sur un bouton ou un élément interactif
        if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select') || 
            e.target.closest('a') || e.target.closest('textarea')) {
            return;
        }
        
        e.preventDefault();
        
        // Préparer le widget pour le drag
        this.activeWidget = widget;
        this.isDragging = true;
        
        // Calculer l'offset de la souris par rapport au widget
        const rect = widget.getBoundingClientRect();
        this.mouseOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        // Appliquer des styles pour le drag
        widget.classList.add('dragging');
        
        // Créer une image fantôme pour le drag
        this.createDragGhost(widget);
    }
    
    // Créer un élément fantôme pour représenter le widget durant le drag
    createDragGhost(widget) {
        // Supprimer le fantôme existant s'il y en a un
        const existingGhost = document.querySelector('.widget-ghost');
        if (existingGhost) existingGhost.remove();
        
        // Créer un nouveau fantôme
        const ghost = widget.cloneNode(true);
        ghost.classList.add('widget-ghost');
        ghost.style.pointerEvents = 'none';
        ghost.style.width = widget.offsetWidth + 'px';
        ghost.style.height = widget.offsetHeight + 'px';
        ghost.style.position = 'fixed';
        ghost.style.opacity = '0.8';
        ghost.style.zIndex = '1000';
        
        // Positionner le fantôme à l'emplacement initial du widget
        const rect = widget.getBoundingClientRect();
        ghost.style.top = rect.top + 'px';
        ghost.style.left = rect.left + 'px';
        
        // Ajouter au DOM
        document.body.appendChild(ghost);
        this.dragGhost = ghost;
    }
    
    // Déplacer le widget fantôme avec la souris
    handleMouseMove(e) {
        if (!this.isDragging || !this.activeWidget || !this.dragGhost) return;
        
        e.preventDefault();
        
        // Mettre à jour la position du fantôme
        this.dragGhost.style.left = (e.clientX - this.mouseOffset.x) + 'px';
        this.dragGhost.style.top = (e.clientY - this.mouseOffset.y) + 'px';
        
        // Montrer la zone cible potentielle
        this.showDropTarget(e);
    }
    
    // Afficher une indication de la zone cible
    showDropTarget(e) {
        // Trouver la cellule de la grille la plus proche
        const containerRect = this.container.getBoundingClientRect();
        let x = e.clientX - containerRect.left;
        let y = e.clientY - containerRect.top;
        
        // Vérifier si on est dans la zone du conteneur
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x > containerRect.width) x = containerRect.width;
        if (y > containerRect.height) y = containerRect.height;
        
        // Nettoyer les indicateurs précédents
        document.querySelectorAll('.drop-highlight').forEach(el => el.remove());
        
        // Trouver le widget le plus proche du point de drop
        let closestWidget = null;
        let minDistance = Infinity;
        
        this.widgets.forEach(widget => {
            if (widget === this.activeWidget) return;
            
            const rect = widget.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const distance = Math.sqrt(
                Math.pow(e.clientX - centerX, 2) + 
                Math.pow(e.clientY - centerY, 2)
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                closestWidget = widget;
            }
        });
        
        if (closestWidget) {
            // Déterminer si c'est avant, après, au-dessus ou en-dessous
            const rect = closestWidget.getBoundingClientRect();
            let position = '';
            
            const isAboveBelow = Math.abs(e.clientX - (rect.left + rect.width / 2)) < 
                                Math.abs(e.clientY - (rect.top + rect.height / 2));
            
            if (isAboveBelow) {
                position = e.clientY < rect.top + rect.height / 2 ? 'above' : 'below';
            } else {
                position = e.clientX < rect.left + rect.width / 2 ? 'before' : 'after';
            }
            
            // Créer un indicateur de drop
            const highlight = document.createElement('div');
            highlight.className = 'drop-highlight drop-' + position;
            
            switch(position) {
                case 'above':
                    highlight.style.top = (rect.top - containerRect.top - 2) + 'px';
                    highlight.style.left = rect.left - containerRect.left + 'px';
                    highlight.style.width = rect.width + 'px';
                    highlight.style.height = '4px';
                    break;
                case 'below':
                    highlight.style.top = (rect.bottom - containerRect.top - 2) + 'px';
                    highlight.style.left = rect.left - containerRect.left + 'px';
                    highlight.style.width = rect.width + 'px';
                    highlight.style.height = '4px';
                    break;
                case 'before':
                    highlight.style.top = rect.top - containerRect.top + 'px';
                    highlight.style.left = (rect.left - containerRect.left - 2) + 'px';
                    highlight.style.width = '4px';
                    highlight.style.height = rect.height + 'px';
                    break;
                case 'after':
                    highlight.style.top = rect.top - containerRect.top + 'px';
                    highlight.style.left = (rect.right - containerRect.left - 2) + 'px';
                    highlight.style.width = '4px';
                    highlight.style.height = rect.height + 'px';
                    break;
            }
            
            this.container.appendChild(highlight);
            this.dropPosition = { widget: closestWidget, position };
        }
    }
    
    // Gestion de la fin du drag
    handleMouseUp(e) {
        if (!this.isDragging || !this.activeWidget) return;
        
        // Supprimer le fantôme de drag
        if (this.dragGhost) {
            this.dragGhost.remove();
            this.dragGhost = null;
        }
        
        // Nettoyer les indicateurs de drop
        document.querySelectorAll('.drop-highlight').forEach(el => el.remove());
        
        // Placer le widget à sa nouvelle position
        if (this.dropPosition) {
            this.repositionWidget(this.activeWidget, this.dropPosition);
        }
        
        // Réinitialiser l'état du drag
        this.activeWidget.classList.remove('dragging');
        this.isDragging = false;
        this.activeWidget = null;
        this.dropPosition = null;
        
        // Sauvegarder les nouvelles positions
        this.saveWidgetPositions();
    }
    
    // Repositionner un widget en fonction de la position de drop
    repositionWidget(widget, dropPosition) {
        const { widget: targetWidget, position } = dropPosition;
        
        // Obtenir les positions de grille
        const widgetPos = this.parseGridPosition(widget.getAttribute('data-grid-position'));
        const targetPos = this.parseGridPosition(targetWidget.getAttribute('data-grid-position'));
        
        // Calculer la nouvelle position
        let newX = widgetPos.x;
        let newY = widgetPos.y;
        
        switch(position) {
            case 'above':
                newX = targetPos.x;
                newY = targetPos.y;
                // Décaler les autres widgets vers le bas
                this.shiftWidgetsDown(newY, targetPos.y + targetPos.h - 1);
                break;
            case 'below':
                newX = targetPos.x;
                newY = targetPos.y + targetPos.h;
                break;
            case 'before':
                newX = targetPos.x;
                newY = targetPos.y;
                // Décaler les autres widgets vers la droite
                this.shiftWidgetsRight(newX, targetPos.x + targetPos.w - 1, newY);
                break;
            case 'after':
                newX = targetPos.x + targetPos.w;
                newY = targetPos.y;
                break;
        }
        
        // Mettre à jour la position du widget
        widget.setAttribute('data-grid-position', `${newX},${newY},${widgetPos.w},${widgetPos.h}`);
        
        // Réorganiser tous les widgets pour refléter les changements
        this.applyWidgetPositions();
    }
    
    // Déplacer les widgets vers le bas à partir d'une certaine ligne
    shiftWidgetsDown(fromRow, toRow = null) {
        this.widgets.forEach(widget => {
            if (widget === this.activeWidget) return;
            
            const pos = this.parseGridPosition(widget.getAttribute('data-grid-position'));
            if (pos.y >= fromRow && (toRow === null || pos.y <= toRow)) {
                const newY = pos.y + 1;
                widget.setAttribute('data-grid-position', `${pos.x},${newY},${pos.w},${pos.h}`);
            }
        });
    }
    
    // Déplacer les widgets vers la droite à partir d'une certaine colonne
    shiftWidgetsRight(fromCol, toCol = null, inRow = null) {
        this.widgets.forEach(widget => {
            if (widget === this.activeWidget) return;
            
            const pos = this.parseGridPosition(widget.getAttribute('data-grid-position'));
            if (pos.x >= fromCol && (toCol === null || pos.x <= toCol) && 
                (inRow === null || pos.y === inRow)) {
                const newX = pos.x + 1;
                widget.setAttribute('data-grid-position', `${newX},${pos.y},${pos.w},${pos.h}`);
            }
        });
    }
    
    // Parser la position de grille depuis une chaîne "x,y,w,h"
    parseGridPosition(posStr) {
        const [x, y, w, h] = posStr.split(',').map(Number);
        return { x, y, w, h };
    }
    
    // Appliquer les positions de tous les widgets
    applyWidgetPositions() {
        this.widgets.forEach(widget => {
            const pos = this.parseGridPosition(widget.getAttribute('data-grid-position'));
            
            widget.style.gridColumnStart = pos.x;
            widget.style.gridColumnEnd = pos.x + pos.w;
            widget.style.gridRowStart = pos.y;
            widget.style.gridRowEnd = pos.y + pos.h;
        });
    }
    
    // Basculer la taille du widget
    toggleWidgetSize(widget) {
        const pos = this.parseGridPosition(widget.getAttribute('data-grid-position'));
        let newWidth = pos.w;
        let newHeight = pos.h;
        
        // Rotation des tailles (petit -> moyen -> grand -> petit)
        if (pos.w === 1 && pos.h === 1) {
            // Petit -> Moyen
            newWidth = 2;
            widget.setAttribute('data-size', 'medium');
        } else if (pos.w === 2 && pos.h === 1) {
            // Moyen -> Grand
            newWidth = 3;
            widget.setAttribute('data-size', 'large');
        } else if (pos.w === 3 && pos.h === 1) {
            // Grand -> Pleine largeur
            newWidth = 4;
            widget.setAttribute('data-size', 'full');
        } else {
            // Retour à petit
            newWidth = 1;
            newHeight = 1;
            widget.setAttribute('data-size', 'small');
        }
        
        // Mettre à jour la position
        widget.setAttribute('data-grid-position', `${pos.x},${pos.y},${newWidth},${newHeight}`);
        
        // Appliquer les changements
        this.applyWidgetPositions();
        this.saveWidgetPositions();
    }
    
    // Basculer la vue du widget (normale/compacte)
    toggleWidgetView(widget) {
        widget.classList.toggle('compact');
        
        const isCompact = widget.classList.contains('compact');
        const toggleViewBtn = widget.querySelector('.toggle-view');
        
        if (toggleViewBtn) {
            toggleViewBtn.innerHTML = isCompact ? 
                '<i class="fas fa-expand"></i>' : 
                '<i class="fas fa-compress"></i>';
            
            toggleViewBtn.setAttribute('title', isCompact ? 'Vue étendue' : 'Vue compacte');
        }
        
        // Sauvegarder l'état
        const id = widget.getAttribute('data-widget-id');
        localStorage.setItem(`widget_${id}_compact`, isCompact);
    }
    
    // Changer le layout de la grille
    changeLayout(layout) {
        if (!layout || layout === this.currentLayout) return;
        
        // Appliquer le nouveau layout
        this.applyLayout(layout);
        
        // Sauvegarder la préférence
        localStorage.setItem('dashboard_layout', layout);
        this.currentLayout = layout;
    }
    
    // Appliquer un layout spécifique
    applyLayout(layout) {
        this.container.setAttribute('data-layout', layout);
        this.container.className = this.container.className.replace(/layout-\w+/g, '');
        this.container.classList.add(`layout-${layout}`);
        
        if (layout === 'grid') {
            // Appliquer les positions spécifiques des widgets
            this.applyWidgetPositions();
        }
    }
    
    // Sauvegarder les positions des widgets
    saveWidgetPositions() {
        const positions = {};
        
        this.widgets.forEach(widget => {
            const id = widget.getAttribute('data-widget-id');
            const position = widget.getAttribute('data-grid-position');
            const size = widget.getAttribute('data-size');
            
            positions[id] = {
                position,
                size
            };
        });
        
        localStorage.setItem('widget_positions', JSON.stringify(positions));
    }
    
    // Charger les positions sauvegardées
    loadWidgetPositions() {
        try {
            const savedPositions = localStorage.getItem('widget_positions');
            if (!savedPositions) return;
            
            const positions = JSON.parse(savedPositions);
            
            this.widgets.forEach(widget => {
                const id = widget.getAttribute('data-widget-id');
                if (positions[id]) {
                    const { position, size } = positions[id];
                    
                    if (position) {
                        widget.setAttribute('data-grid-position', position);
                    }
                    
                    if (size) {
                        widget.setAttribute('data-size', size);
                    }
                    
                    // Restaurer le mode compact
                    const isCompact = localStorage.getItem(`widget_${id}_compact`) === 'true';
                    if (isCompact) {
                        widget.classList.add('compact');
                        const toggleViewBtn = widget.querySelector('.toggle-view');
                        if (toggleViewBtn) {
                            toggleViewBtn.innerHTML = '<i class="fas fa-expand"></i>';
                            toggleViewBtn.setAttribute('title', 'Vue étendue');
                        }
                    }
                }
            });
            
            // Appliquer les positions
            this.applyWidgetPositions();
            
        } catch (error) {
            console.error('Erreur lors du chargement des positions des widgets:', error);
        }
    }
    
    // Initialiser la fonctionnalité de redimensionnement
    initResizing() {
        this.widgets.forEach(widget => {
            // Créer ou récupérer la poignée de redimensionnement
            let resizeHandle = widget.querySelector('.resize-handle');
            
            if (!resizeHandle) {
                resizeHandle = document.createElement('div');
                resizeHandle.className = 'resize-handle';
                widget.appendChild(resizeHandle);
            }
            
            // Ajouter les gestionnaires d'événements pour le redimensionnement
            resizeHandle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = widget.offsetWidth;
                const startHeight = widget.offsetHeight;
                const position = this.parseGridPosition(widget.getAttribute('data-grid-position'));
                
                // Ajouter la classe pour le style pendant le redimensionnement
                widget.classList.add('resizing');
                
                const handleResize = (moveEvent) => {
                    const deltaX = moveEvent.clientX - startX;
                    const deltaY = moveEvent.clientY - startY;
                    
                    // Calculer la nouvelle largeur et hauteur
                    const newWidth = startWidth + deltaX;
                    const newHeight = startHeight + deltaY;
                    
                    // Calculer combien de cellules on couvre
                    const cellWidth = this.container.offsetWidth / 4; // Division par le nombre de colonnes
                    const cellHeight = 80; // Hauteur approximative d'une cellule
                    
                    let spanX = Math.max(1, Math.round(newWidth / cellWidth));
                    let spanY = Math.max(1, Math.round(newHeight / cellHeight));
                    
                    // Limiter la largeur maximale
                    spanX = Math.min(spanX, 4);
                    
                    // Mettre à jour la position
                    widget.setAttribute('data-grid-position', `${position.x},${position.y},${spanX},${spanY}`);
                    
                    // Mettre à jour l'attribut data-size
                    if (spanX === 1) widget.setAttribute('data-size', 'small');
                    else if (spanX === 2) widget.setAttribute('data-size', 'medium');
                    else if (spanX === 3) widget.setAttribute('data-size', 'large');
                    else widget.setAttribute('data-size', 'full');
                    
                    // Appliquer les changements
                    widget.style.gridColumnStart = position.x;
                    widget.style.gridColumnEnd = position.x + spanX;
                    widget.style.gridRowStart = position.y;
                    widget.style.gridRowEnd = position.y + spanY;
                };
                
                const handleResizeEnd = () => {
                    widget.classList.remove('resizing');
                    document.removeEventListener('mousemove', handleResize);
                    document.removeEventListener('mouseup', handleResizeEnd);
                    
                    // Sauvegarder les nouvelles dimensions
                    this.saveWidgetPositions();
                };
                
                document.addEventListener('mousemove', handleResize);
                document.addEventListener('mouseup', handleResizeEnd);
            });
        });
    }
}

// Initialiser le gestionnaire de widgets au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    const widgetManager = new WidgetManager();
});
