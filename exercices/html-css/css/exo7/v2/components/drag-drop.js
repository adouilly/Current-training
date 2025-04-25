/**
 * Système de drag-and-drop avec placement dynamique
 */

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

function initDashboard() {
    // Initialiser le système de drag & drop
    initDragDrop();
}

function initDragDrop() {
    const widgets = document.querySelectorAll('.widget');
    const container = document.getElementById('widgets-grid');
    
    if (!container || widgets.length === 0) return;
    
    widgets.forEach(widget => {
        const header = widget.querySelector('.widget-header');
        if (!header) return;
        
        // Rendre le header draggable
        header.addEventListener('mousedown', (e) => {
            // Ignorer si on clique sur un bouton
            if (e.target.closest('button')) return;
            
            e.preventDefault();
            const rect = widget.getBoundingClientRect();
            
            // Position initiale du pointeur
            const startX = e.clientX;
            const startY = e.clientY;
            
            // Position initiale du widget
            const startLeft = rect.left;
            const startTop = rect.top;
            
            // Créer un clone pour le drag
            const clone = widget.cloneNode(true);
            clone.classList.add('widget-ghost');
            clone.style.width = rect.width + 'px';
            clone.style.height = rect.height + 'px';
            clone.style.position = 'fixed';
            clone.style.top = startTop + 'px';
            clone.style.left = startLeft + 'px';
            clone.style.zIndex = '9999';
            clone.style.pointerEvents = 'none';
            document.body.appendChild(clone);
            
            // Ajouter une classe pendant le déplacement
            widget.classList.add('dragging');
            
            // Gestionnaire pour le déplacement
            const handleMouseMove = (moveEvent) => {
                const deltaX = moveEvent.clientX - startX;
                const deltaY = moveEvent.clientY - startY;
                
                // Déplacer le clone
                clone.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                
                // Déterminer la position cible
                const target = getTargetPosition(moveEvent, widget, container);
                
                // Afficher un indicateur visuel
                showDropIndicator(target, container);
            };
            
            // Gestionnaire pour la fin du déplacement
            const handleMouseUp = (upEvent) => {
                // Nettoyer les événements
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                
                // Supprimer le clone
                clone.remove();
                
                // Supprimer la classe de déplacement
                widget.classList.remove('dragging');
                
                // Nettoyer les indicateurs
                clearDropIndicators();
                
                // Déplacer le widget à sa nouvelle position
                const target = getTargetPosition(upEvent, widget, container);
                if (target) {
                    moveWidgetToTarget(widget, target, container);
                }
                
                // Réorganiser la grille pour éviter les espaces vides
                optimizeWidgetPlacement(container);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });
    });
}

/**
 * Détermine la position cible pour le déplacement
 */
function getTargetPosition(event, sourceWidget, container) {
    // Obtenir les éléments sous le pointeur
    const elementsAtPoint = document.elementsFromPoint(event.clientX, event.clientY);
    
    // Trouver le premier widget qui n'est pas la source
    for (const element of elementsAtPoint) {
        const targetWidget = element.closest('.widget:not(.dragging)');
        if (targetWidget) {
            const rect = targetWidget.getBoundingClientRect();
            const isTop = event.clientY < rect.top + rect.height / 2;
            
            return {
                type: 'widget',
                widget: targetWidget,
                position: isTop ? 'before' : 'after'
            };
        }
    }
    
    // Si on est sur le conteneur mais pas sur un widget
    if (elementsAtPoint.includes(container)) {
        return {
            type: 'container',
            position: 'end'
        };
    }
    
    return null;
}

/**
 * Affiche un indicateur visuel pour la zone de dépôt
 */
function showDropIndicator(target, container) {
    // Supprimer les indicateurs précédents
    clearDropIndicators();
    
    if (!target) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'drop-indicator';
    
    if (target.type === 'widget') {
        const rect = target.widget.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        // Positionner l'indicateur selon la position cible
        if (target.position === 'before') {
            indicator.style.top = (rect.top - containerRect.top - 2) + 'px';
            indicator.style.left = (rect.left - containerRect.left) + 'px';
            indicator.style.width = rect.width + 'px';
            indicator.style.height = '4px';
        } else {
            indicator.style.top = (rect.bottom - containerRect.top - 2) + 'px';
            indicator.style.left = (rect.left - containerRect.left) + 'px';
            indicator.style.width = rect.width + 'px';
            indicator.style.height = '4px';
        }
    } else {
        // Indicateur pour un dépôt à la fin du conteneur
        indicator.style.top = (container.scrollHeight - 4) + 'px';
        indicator.style.left = '0';
        indicator.style.width = '100%';
        indicator.style.height = '4px';
    }
    
    container.appendChild(indicator);
}

/**
 * Supprime tous les indicateurs de dépôt
 */
function clearDropIndicators() {
    document.querySelectorAll('.drop-indicator').forEach(el => el.remove());
}

/**
 * Déplace un widget vers sa position cible
 */
function moveWidgetToTarget(widget, target, container) {
    if (target.type === 'widget') {
        // Déplacer avant ou après le widget cible
        if (target.position === 'before') {
            container.insertBefore(widget, target.widget);
        } else {
            container.insertBefore(widget, target.widget.nextSibling);
        }
    } else {
        // Ajouter à la fin du conteneur
        container.appendChild(widget);
    }
    
    // Sauvegarder les positions
    saveWidgetPositions(container);
}

/**
 * Optimiser le placement des widgets pour éviter les espaces vides
 */
function optimizeWidgetPlacement(container) {
    const widgets = container.querySelectorAll('.widget');
    
    // Créer une grille virtuelle
    const gridSize = 4; // 4 colonnes
    let grid = Array(20).fill().map(() => Array(gridSize).fill(false));
    
    // Placer chaque widget dans une position optimale
    widgets.forEach(widget => {
        const size = widget.getAttribute('data-size') || 'small';
        let width = 1;
        
        // Déterminer la largeur en fonction de la taille
        switch(size) {
            case 'medium': width = 2; break;
            case 'large': width = 3; break;
            case 'full': width = 4; break;
        }
        
        // Trouver une position disponible
        let position = findAvailablePosition(grid, width);
        
        if (position) {
            const { row, col } = position;
            // Marquer les cellules comme occupées
            markGridCells(grid, row, col, width, true);
            
            // Ajouter une classe pour l'animation de transition
            widget.classList.add('repositioning');
            
            // Appliquer la position au widget
            widget.style.gridRowStart = row + 1;
            widget.style.gridColumnStart = col + 1;
            widget.style.gridColumnEnd = col + width + 1;
            
            // Sauvegarder la position dans l'attribut data-grid-position
            widget.setAttribute('data-grid-position', `${col},${row},${width},1`);
            
            // Retirer la classe d'animation après la transition
            setTimeout(() => {
                widget.classList.remove('repositioning');
            }, 500);
        }
    });
}

/**
 * Sauvegarder les positions des widgets
 */
function saveWidgetPositions(container) {
    const widgets = container.querySelectorAll('.widget');
    const positions = {};
    
    widgets.forEach((widget, index) => {
        const id = widget.getAttribute('data-widget-id');
        if (!id) return;
        
        positions[id] = {
            index,
            size: widget.getAttribute('data-size') || 'small',
            position: widget.getAttribute('data-grid-position') || '',
            isCompact: widget.classList.contains('compact')
        };
    });
    
    try {
        localStorage.setItem('dashboardWidgetStates', JSON.stringify(positions));
    } catch (e) {
        console.error('Erreur lors de la sauvegarde des positions:', e);
    }
}

/**
 * Trouver une position disponible dans la grille
 */
function findAvailablePosition(grid, width) {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col <= grid[0].length - width; col++) {
            // Vérifier si les cellules sont disponibles
            let available = true;
            for (let i = 0; i < width; i++) {
                if (grid[row][col + i]) {
                    available = false;
                    break;
                }
            }
            
            if (available) {
                return { row, col };
            }
        }
    }
    
    // Si aucun espace n'est trouvé, ajouter à la fin
    return { row: grid.length, col: 0 };
}

/**
 * Marquer les cellules de la grille comme occupées
 */
function markGridCells(grid, row, col, width, value) {
    // S'assurer que nous avons assez de lignes
    while (grid.length <= row) {
        grid.push(Array(grid[0].length).fill(false));
    }
    
    for (let i = 0; i < width; i++) {
        grid[row][col + i] = value;
    }
}

// Je vais ajouter cette accolade fermante qui manquait
