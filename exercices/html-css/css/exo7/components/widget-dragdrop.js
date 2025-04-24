/**
 * Module amélioré de Drag and Drop pour les widgets
 * Implémente les règles suivantes:
 * - Pas de superposition d'éléments
 * - Décalage automatique des éléments remplacés
 * - Maximum 3 widgets par ligne (mise en page ergonomique)
 * - Déplacement dans toutes les directions
 */
const WidgetDragDrop = (function() {
    // Variables privées pour le suivi du drag and drop
    let draggedWidget = null;        // Le widget en cours de déplacement
    let startX = 0;                  // Position initiale X du pointeur
    let startY = 0;                  // Position initiale Y du pointeur
    let offsetX = 0;                 // Décalage X entre le pointeur et le coin du widget
    let offsetY = 0;                 // Décalage Y entre le pointeur et le coin du widget
    let placeholder = null;          // Élément visuel montrant où sera placé le widget
    let container = null;            // Le conteneur de widgets
    let widgetRect = null;           // Dimensions du widget en cours de déplacement
    let isDragging = false;          // État du drag en cours
    let initialPosition = null;      // Position initiale du widget dans la grille
    let initialNextSibling = null;   // Élément suivant le widget avant déplacement
    let gridColumns = 12;            // Nombre de colonnes dans la grille
    let maxWidgetsPerRow = 3;        // Nombre maximum de widgets par ligne
    let rowHeight = 0;               // Hauteur d'une ligne (calculée dynamiquement)
    let rowMap = [];                 // Carte des widgets par ligne pour gérer le placement
    let directionIndicators = {};    // Indicateurs de direction pour le feedback visuel

    /**
     * Initialiser le système de drag and drop
     */
    function init() {
        console.log('Initialisation du système de drag and drop amélioré');
        
        // Récupérer le conteneur de widgets
        container = document.querySelector('.dashboard-container');
        if (!container) {
            console.error('Conteneur de dashboard non trouvé');
            return;
        }
        
        // Calculer la hauteur d'une ligne
        updateGridDimensions();
        
        // Initialiser tous les widgets existants
        initializeAllWidgets();
        
        // Observer les changements dans le DOM pour les nouveaux widgets
        observeDOMChanges();
        
        // Ajouter les événements au document pour suivre le déplacement
        document.addEventListener('mousemove', handleMouseMove, { passive: false });
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
        
        // Recalculer les dimensions lors du redimensionnement de la fenêtre
        window.addEventListener('resize', debounce(function() {
            updateGridDimensions();
            console.log('Dimensions de la grille mises à jour');
        }, 250));
        
        // Créer les indicateurs de direction
        createDirectionIndicators();
        
        console.log('Système de drag and drop initialisé avec succès');
    }
    
    /**
     * Mettre à jour les dimensions de la grille
     */
    function updateGridDimensions() {
        if (!container) return;
        
        const containerStyle = window.getComputedStyle(container);
        const gap = parseInt(containerStyle.gap) || 16; // Valeur par défaut si non définie
        
        // Calculer la hauteur approximative d'une ligne
        rowHeight = 100 + gap; // Hauteur minimale d'un widget + gap
        
        console.log(`Dimensions grille: ${gridColumns} colonnes, hauteur ligne ~${rowHeight}px, gap ${gap}px`);
    }
    
    /**
     * Initialiser tous les widgets pour le drag and drop
     */
    function initializeAllWidgets() {
        const widgets = document.querySelectorAll('.widget');
        console.log(`Initialisation de ${widgets.length} widgets pour le drag and drop`);
        
        widgets.forEach(widget => {
            initializeWidget(widget);
        });
        
        // Générer la carte des widgets par ligne
        generateRowMap();
    }
    
    /**
     * Configurer un widget pour le drag and drop
     * @param {HTMLElement} widget - Le widget à configurer
     */
    function initializeWidget(widget) {
        if (!widget) return;
        
        // Vérifier si le widget est déjà initialisé
        if (widget.getAttribute('data-drag-initialized') === 'true') {
            return;
        }
        
        // Trouver l'en-tête du widget (zone de drag)
        const header = widget.querySelector('.widget-header');
        if (!header) return;
        
        // Ajouter l'écouteur d'événement mousedown sur l'en-tête
        header.addEventListener('mousedown', handleWidgetMouseDown);
        header.addEventListener('touchstart', handleWidgetTouchStart, { passive: false });
        
        // Désactiver le drag depuis les boutons
        widget.querySelectorAll('button, .resize-handle').forEach(element => {
            element.addEventListener('mousedown', function(e) {
                e.stopPropagation();
            });
            
            element.addEventListener('touchstart', function(e) {
                e.stopPropagation();
            }, { passive: false });
        });
        
        // Ajouter une classe visuelle
        widget.classList.add('draggable');
        header.style.cursor = 'grab';
        
        // Marquer le widget comme initialisé
        widget.setAttribute('data-drag-initialized', 'true');
        
        // S'assurer que le widget a une classe de largeur appropriée
        ensureWidthClass(widget);
    }
    
    /**
     * S'assurer que le widget a une classe de largeur appropriée
     * @param {HTMLElement} widget - Le widget à vérifier
     */
    function ensureWidthClass(widget) {
        // Vérifier si le widget a déjà une classe widget-col-X
        const hasWidthClass = Array.from(widget.classList).some(cls => cls.startsWith('widget-col-'));
        
        if (!hasWidthClass) {
            // Par défaut, un widget occupe 4 colonnes (1/3 de la largeur)
            widget.classList.add('widget-col-4');
        }
    }
    
    /**
     * Générer une carte des widgets organisés par ligne
     * Cette fonction aide à déterminer quels widgets sont sur la même ligne
     */
    function generateRowMap() {
        if (!container) return;
        
        rowMap = [];
        const widgets = Array.from(container.querySelectorAll('.widget'));
        
        // Trier les widgets par position Y puis X
        widgets.sort((a, b) => {
            const rectA = a.getBoundingClientRect();
            const rectB = b.getBoundingClientRect();
            
            // Si la différence de Y est significative (même ligne)
            if (Math.abs(rectA.top - rectB.top) < rowHeight / 2) {
                return rectA.left - rectB.left; // Trier par position X
            }
            
            return rectA.top - rectB.top; // Sinon trier par position Y
        });
        
        // Grouper les widgets par ligne
        let currentRow = [];
        let currentRowTop = -1;
        
        widgets.forEach(widget => {
            const rect = widget.getBoundingClientRect();
            
            // Si c'est une nouvelle ligne ou la première ligne
            if (currentRowTop === -1 || Math.abs(rect.top - currentRowTop) > rowHeight / 2) {
                if (currentRow.length > 0) {
                    rowMap.push(currentRow);
                }
                currentRow = [widget];
                currentRowTop = rect.top;
            } else {
                currentRow.push(widget);
            }
        });
        
        // Ajouter la dernière ligne
        if (currentRow.length > 0) {
            rowMap.push(currentRow);
        }
        
        console.log(`Carte des lignes générée: ${rowMap.length} lignes`);
        rowMap.forEach((row, index) => {
            console.log(`Ligne ${index + 1}: ${row.length} widgets`);
        });
    }
    
    /**
     * Observer les changements dans le DOM pour initialiser de nouveaux widgets
     */
    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            let widgetsAdded = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.classList && node.classList.contains('widget')) {
                            initializeWidget(node);
                            widgetsAdded = true;
                        }
                    });
                }
            });
            
            // Si des widgets ont été ajoutés, régénérer la carte des lignes
            if (widgetsAdded) {
                generateRowMap();
            }
        });
        
        observer.observe(container, { childList: true, subtree: true });
    }
    
    /**
     * Gestionnaire d'événement mousedown pour les widgets
     * @param {MouseEvent} e - L'événement mousedown
     */
    function handleWidgetMouseDown(e) {
        // Ignorer si ce n'est pas un clic gauche ou si le clic est sur un bouton
        if (e.button !== 0 || e.target.closest('button') || e.target.closest('.resize-handle')) {
            return;
        }
        
        const widget = this.closest('.widget');
        startDrag(widget, e.clientX, e.clientY);
        
        e.preventDefault(); // Empêcher la sélection de texte
    }
    
    /**
     * Gestionnaire d'événement touchstart pour les widgets (mobile)
     * @param {TouchEvent} e - L'événement touchstart
     */
    function handleWidgetTouchStart(e) {
        if (e.target.closest('button') || e.target.closest('.resize-handle')) {
            return;
        }
        
        const touch = e.touches[0];
        const widget = this.closest('.widget');
        
        startDrag(widget, touch.clientX, touch.clientY);
        
        e.preventDefault(); // Empêcher le scroll
    }
    
    /**
     * Démarrer le drag d'un widget
     * @param {HTMLElement} widget - Le widget à déplacer
     * @param {number} clientX - Position X initiale du pointeur
     * @param {number} clientY - Position Y initiale du pointeur
     */
    function startDrag(widget, clientX, clientY) {
        if (!widget || isDragging) return;
        
        console.log(`Début du drag pour le widget ${widget.id || 'sans ID'}`);
        
        // Stocker les informations du widget et de la position
        draggedWidget = widget;
        widgetRect = widget.getBoundingClientRect();
        startX = clientX;
        startY = clientY;
        offsetX = clientX - widgetRect.left;
        offsetY = clientY - widgetRect.top;
        
        // Stocker la position initiale et le prochain élément pour pouvoir revenir en arrière
        initialPosition = { left: widgetRect.left, top: widgetRect.top };
        initialNextSibling = widget.nextElementSibling;
        
        // Créer un placeholder pour montrer où le widget sera placé
        placeholder = document.createElement('div');
        placeholder.className = 'widget-placeholder';
        placeholder.style.width = widgetRect.width + 'px';
        placeholder.style.height = widgetRect.height + 'px';
        
        // Copier les classes de largeur du widget au placeholder
        Array.from(widget.classList)
            .filter(cls => cls.startsWith('widget-col-'))
            .forEach(cls => placeholder.classList.add(cls));
        
        // Insérer le placeholder à la place du widget
        widget.parentNode.insertBefore(placeholder, widget.nextSibling);
        
        // Appliquer des styles pour le drag
        widget.style.position = 'fixed';
        widget.style.top = widgetRect.top + 'px';
        widget.style.left = widgetRect.left + 'px';
        widget.style.width = widgetRect.width + 'px';
        widget.style.height = widgetRect.height + 'px';
        widget.style.zIndex = '1000';
        widget.classList.add('dragging');
        
        // Activer l'indicateur sur le conteneur
        container.classList.add('drag-active');
        
        // Mettre à jour l'état
        isDragging = true;
        
        // Régénérer la carte des lignes
        generateRowMap();
        
        // Rendre les indicateurs de direction visibles autour du placeholder
        showDirectionIndicators(placeholder);
    }
    
    /**
     * Gérer le mouvement de la souris pendant le drag
     * @param {MouseEvent} e - L'événement mousemove
     */
    function handleMouseMove(e) {
        if (!isDragging || !draggedWidget) return;
        
        e.preventDefault();
        moveDraggedWidget(e.clientX, e.clientY);
    }
    
    /**
     * Gérer le mouvement tactile pendant le drag
     * @param {TouchEvent} e - L'événement touchmove
     */
    function handleTouchMove(e) {
        if (!isDragging || !draggedWidget) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        moveDraggedWidget(touch.clientX, touch.clientY);
    }
    
    /**
     * Déplacer le widget durant le drag et calculer la meilleure position
     * @param {number} clientX - Position X actuelle du pointeur
     * @param {number} clientY - Position Y actuelle du pointeur
     */
    function moveDraggedWidget(clientX, clientY) {
        // Mettre à jour la position du widget
        const newX = clientX - offsetX;
        const newY = clientY - offsetY;
        
        draggedWidget.style.left = newX + 'px';
        draggedWidget.style.top = newY + 'px';
        
        // Trouver la meilleure position pour le placeholder en tenant compte des règles
        const bestPosition = findBestPlaceholderPosition(clientX, clientY);
        
        // Si on a trouvé une position valide
        if (bestPosition) {
            // Nettoyer les classes d'indicateurs précédentes
            document.querySelectorAll('.drop-before, .drop-after').forEach(el => {
                el.classList.remove('drop-before', 'drop-after');
            });
            
            if (bestPosition.target) {
                // Ajouter l'indicateur visuel et positionner le placeholder
                if (bestPosition.position === 'before') {
                    bestPosition.target.classList.add('drop-before');
                    container.insertBefore(placeholder, bestPosition.target);
                } else if (bestPosition.position === 'after') {
                    bestPosition.target.classList.add('drop-after');
                    
                    // Si l'élément cible a un élément suivant, insérer avant lui
                    if (bestPosition.target.nextElementSibling) {
                        container.insertBefore(placeholder, bestPosition.target.nextElementSibling);
                    } else {
                        container.appendChild(placeholder);
                    }
                }
                
                // Mettre à jour les indicateurs de direction
                updateDirectionIndicators(placeholder);
                
                // Si l'emplacement implique un décalage, simuler ce décalage
                simulateWidgetShift(bestPosition);
            }
        }
    }
    
    /**
     * Trouver la meilleure position pour le placeholder en respectant les règles
     * @param {number} mouseX - Position X du pointeur
     * @param {number} mouseY - Position Y du pointeur
     * @returns {Object|null} - Position optimale respectant les contraintes
     */
    function findBestPlaceholderPosition(mouseX, mouseY) {
        const widgets = Array.from(container.querySelectorAll('.widget:not(.dragging)'));
        
        if (widgets.length === 0) {
            return { target: null, position: 'end' };
        }
        
        // Chercher d'abord si le pointeur est sur un widget
        for (const widget of widgets) {
            const rect = widget.getBoundingClientRect();
            
            // Si le pointeur est à l'intérieur du widget
            if (mouseX >= rect.left && mouseX <= rect.right && 
                mouseY >= rect.top && mouseY <= rect.bottom) {
                
                // Déterminer si c'est avant ou après
                const isBeforeMiddle = mouseY < (rect.top + rect.height / 2);
                return {
                    target: widget,
                    position: isBeforeMiddle ? 'before' : 'after',
                    row: findRowContainingWidget(widget)
                };
            }
        }
        
        // Si on n'est pas sur un widget, trouver la ligne la plus proche
        const containerRect = container.getBoundingClientRect();
        const relativeY = mouseY - containerRect.top;
        
        // Estimer la ligne basée sur la position Y
        const estimatedRowIndex = Math.floor(relativeY / rowHeight);
        
        // Limiter l'index à l'intervalle valide
        const rowIndex = Math.max(0, Math.min(estimatedRowIndex, rowMap.length));
        
        // Si nous sommes à la fin de toutes les lignes, ajouter à la fin
        if (rowIndex >= rowMap.length) {
            const lastWidget = widgets[widgets.length - 1];
            return {
                target: lastWidget,
                position: 'after',
                row: rowMap.length - 1
            };
        }
        
        // Pour une ligne existante, trouver le widget le plus proche horizontalement
        const rowWidgets = rowMap[rowIndex] || [];
        
        if (rowWidgets.length === 0) {
            // Si la ligne est vide mais existe, prendre le dernier widget de la ligne précédente
            if (rowIndex > 0 && rowMap[rowIndex - 1].length > 0) {
                const prevRowWidgets = rowMap[rowIndex - 1];
                const lastWidgetInPrevRow = prevRowWidgets[prevRowWidgets.length - 1];
                
                return {
                    target: lastWidgetInPrevRow,
                    position: 'after',
                    row: rowIndex - 1
                };
            }
            
            // Sinon utiliser le premier widget
            return {
                target: widgets[0],
                position: 'before',
                row: 0
            };
        }
        
        // Trouver le widget le plus proche horizontalement dans cette ligne
        let closestWidget = null;
        let minDistance = Number.MAX_VALUE;
        
        for (const widget of rowWidgets) {
            const rect = widget.getBoundingClientRect();
            const distance = Math.abs(mouseX - (rect.left + rect.width / 2));
            
            if (distance < minDistance) {
                minDistance = distance;
                closestWidget = widget;
            }
        }
        
        if (closestWidget) {
            const rect = closestWidget.getBoundingClientRect();
            const isAfter = mouseX > rect.left + rect.width / 2;
            
            // Si la ligne a déjà 3 widgets et qu'on essaie d'insérer, suggérer une nouvelle ligne
            if (rowWidgets.length >= maxWidgetsPerRow && !rowWidgets.includes(draggedWidget)) {
                // Suggérer plutôt une position au début de la ligne suivante
                return {
                    target: rowWidgets[rowWidgets.length - 1],
                    position: 'after',
                    row: rowIndex
                };
            }
            
            return {
                target: closestWidget,
                position: isAfter ? 'after' : 'before',
                row: rowIndex
            };
        }
        
        // Par défaut, placer à la fin
        return {
            target: widgets[widgets.length - 1],
            position: 'after',
            row: rowMap.length - 1
        };
    }
    
    /**
     * Trouver la ligne contenant un widget spécifique
     * @param {HTMLElement} widget - Le widget à localiser
     * @returns {number} - Index de la ligne ou -1 si non trouvé
     */
    function findRowContainingWidget(widget) {
        for (let i = 0; i < rowMap.length; i++) {
            if (rowMap[i].includes(widget)) {
                return i;
            }
        }
        return -1;
    }
    
    /**
     * Simuler le décalage des widgets selon la position cible
     * @param {Object} position - Position cible avec widget et position relative
     */
    function simulateWidgetShift(position) {
        // Cette fonction prépare visuellement les widgets pour le décalage
        // Le décalage réel se produira lors du finishDrag()
        
        // Retirer les classes de simulation précédentes
        document.querySelectorAll('.widget-shifting').forEach(w => {
            w.classList.remove('widget-shifting');
            w.style.transform = '';
        });
        
        // Si pas de position valide, ne rien faire
        if (!position || !position.target) return;
        
        const rowIndex = position.row !== undefined ? position.row : findRowContainingWidget(position.target);
        
        // Si on ne peut pas déterminer la ligne, ne rien faire
        if (rowIndex === -1) return;
        
        const currentRow = rowMap[rowIndex] || [];
        const targetIndex = currentRow.indexOf(position.target);
        
        // Si le widget n'est pas dans cette ligne, ne rien faire
        if (targetIndex === -1) return;
        
        // Si on insère avant, décaler tous les widgets à partir de la cible
        if (position.position === 'before') {
            // Vérifier si insérer ici mettrait plus de 3 widgets sur la ligne
            if (currentRow.length >= maxWidgetsPerRow && !currentRow.includes(draggedWidget)) {
                // Décaler le reste vers la ligne suivante
                for (let i = currentRow.length - 1; i >= targetIndex; i--) {
                    const widget = currentRow[i];
                    if (widget !== draggedWidget) {
                        widget.classList.add('widget-shifting');
                        widget.style.transform = `translateY(${rowHeight}px)`;
                    }
                }
            } else {
                // Sinon, simplement décaler sur la même ligne
                for (let i = targetIndex; i < currentRow.length; i++) {
                    const widget = currentRow[i];
                    if (widget !== draggedWidget) {
                        widget.classList.add('widget-shifting');
                        widget.style.transform = `translateX(${widgetRect.width + 16}px)`;
                    }
                }
            }
        }
        // Si on insère après, décaler tous les widgets après la cible
        else if (position.position === 'after') {
            // Vérifier si insérer ici mettrait plus de 3 widgets sur la ligne
            if (currentRow.length >= maxWidgetsPerRow && !currentRow.includes(draggedWidget)) {
                // Décaler le premier widget de la ligne suivante
                if (rowIndex + 1 < rowMap.length && rowMap[rowIndex + 1].length > 0) {
                    const nextRowWidget = rowMap[rowIndex + 1][0];
                    if (nextRowWidget !== draggedWidget) {
                        nextRowWidget.classList.add('widget-shifting');
                        nextRowWidget.style.transform = `translateY(-${rowHeight}px)`;
                    }
                }
            } else {
                // Sinon, décaler les widgets suivants sur la même ligne
                for (let i = targetIndex + 1; i < currentRow.length; i++) {
                    const widget = currentRow[i];
                    if (widget !== draggedWidget) {
                        widget.classList.add('widget-shifting');
                        widget.style.transform = `translateX(${widgetRect.width + 16}px)`;
                    }
                }
            }
        }
    }
    
    /**
     * Gestionnaire pour la fin du drag avec la souris
     */
    function handleMouseUp() {
        if (isDragging) {
            finishDrag();
        }
    }
    
    /**
     * Gestionnaire pour la fin du drag tactile
     */
    function handleTouchEnd() {
        if (isDragging) {
            finishDrag();
        }
    }
    
    /**
     * Terminer le drag et ajuster la disposition selon les règles
     */
    function finishDrag() {
        if (!draggedWidget || !isDragging) return;
        
        console.log(`Fin du drag pour le widget ${draggedWidget.id || 'sans ID'}`);
        
        // Masquer les indicateurs de direction
        hideDirectionIndicators();
        
        // Récupérer la position finale
        const finalRect = placeholder ? placeholder.getBoundingClientRect() : null;
        
        // Vérifier si le placeholder existe et a un parent
        if (placeholder && placeholder.parentNode) {
            // Conserver les classes de largeur
            const columnClasses = Array.from(draggedWidget.classList)
                .filter(cls => cls.startsWith('widget-col-'));
            
            // Réinitialiser les styles du widget
            draggedWidget.style.position = '';
            draggedWidget.style.top = '';
            draggedWidget.style.left = '';
            draggedWidget.style.width = '';
            draggedWidget.style.height = '';
            draggedWidget.style.zIndex = '';
            
            // Insérer le widget à la place du placeholder avec une animation
            if (finalRect) {
                // Animation de transition vers la position finale
                const currentRect = draggedWidget.getBoundingClientRect();
                const deltaX = finalRect.left - currentRect.left;
                const deltaY = finalRect.top - currentRect.top;
                
                // Appliquer une transition pour l'animation
                draggedWidget.style.transition = `transform 0.3s ease-out`;
                draggedWidget.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                
                // Placer le widget à sa nouvelle position après l'animation
                setTimeout(() => {
                    placeholder.parentNode.insertBefore(draggedWidget, placeholder);
                    
                    // Réinitialiser la transition et les styles
                    draggedWidget.style.transition = '';
                    draggedWidget.style.transform = '';
                    draggedWidget.classList.remove('dragging');
                    
                    // Supprimer le placeholder
                    placeholder.remove();
                    
                    // Réorganiser les widgets pour optimiser l'espace
                    organizeWidgets();
                    
                    // Régénérer la carte des lignes
                    generateRowMap();
                    
                    // Déclencher un événement pour signaler que les widgets ont été réorganisés
                    triggerReorderEvent();
                    
                }, 300);
            } else {
                // Insertion immédiate sans animation
                placeholder.parentNode.insertBefore(draggedWidget, placeholder);
                placeholder.remove();
                draggedWidget.classList.remove('dragging');
                
                // Réorganiser les widgets
                organizeWidgets();
                
                // Régénérer la carte des lignes
                generateRowMap();
                
                // Déclencher l'événement de réorganisation
                triggerReorderEvent();
            }
        } else {
            // En cas d'erreur, remettre le widget à sa position initiale
            if (initialNextSibling) {
                container.insertBefore(draggedWidget, initialNextSibling);
            } else {
                container.appendChild(draggedWidget);
            }
            
            // Réinitialiser les styles
            draggedWidget.style.position = '';
            draggedWidget.style.top = '';
            draggedWidget.style.left = '';
            draggedWidget.style.width = '';
            draggedWidget.style.height = '';
            draggedWidget.style.zIndex = '';
            draggedWidget.classList.remove('dragging');
            
            // Supprimer le placeholder s'il existe encore
            if (placeholder && placeholder.parentNode) {
                placeholder.remove();
            }
        }
        
        // Nettoyer les indicateurs de simulation
        document.querySelectorAll('.widget-shifting').forEach(w => {
            w.classList.remove('widget-shifting');
            w.style.transform = '';
        });
        
        // Nettoyer les classes d'indicateurs
        document.querySelectorAll('.drop-before, .drop-after').forEach(el => {
            el.classList.remove('drop-before', 'drop-after');
        });
        
        // Désactiver l'indicateur sur le conteneur
        container.classList.remove('drag-active');
        
        // Réinitialiser les variables
        isDragging = false;
        draggedWidget = null;
        placeholder = null;
        initialPosition = null;
        initialNextSibling = null;
        
        console.log('Drag and drop terminé, widgets réorganisés');
    }
    
    /**
     * Déclencher un événement personnalisé pour signaler la réorganisation
     */
    function triggerReorderEvent() {
        const event = new CustomEvent('widgets-reordered', {
            bubbles: true,
            detail: { timestamp: Date.now() }
        });
        container.dispatchEvent(event);
    }
    
    /**
     * Réorganiser les widgets pour optimiser l'espace et éviter les superpositions
     */
    function organizeWidgets() {
        // Attendre un moment pour s'assurer que le DOM est stable
        setTimeout(() => {
            console.log('Optimisation de la disposition des widgets...');
            
            // Vérifier que la largeur des colonnes est respectée
            const widgets = Array.from(container.querySelectorAll('.widget'));
            
            // Calculer le total de colonnes sur chaque ligne
            let currentRow = [];
            let currentRowTop = -1;
            let rows = [];
            
            widgets.forEach(widget => {
                const rect = widget.getBoundingClientRect();
                
                // Déterminer la largeur en colonnes
                let colSpan = 4; // Par défaut
                Array.from(widget.classList).forEach(cls => {
                    if (cls === 'widget-col-4') colSpan = 4;
                    else if (cls === 'widget-col-6') colSpan = 6;
                    else if (cls === 'widget-col-8') colSpan = 8;
                    else if (cls === 'widget-col-12') colSpan = 12;
                });
                
                // Si c'est une nouvelle ligne ou la première ligne
                if (currentRowTop === -1 || Math.abs(rect.top - currentRowTop) > rowHeight / 2) {
                    if (currentRow.length > 0) {
                        rows.push(currentRow);
                    }
                    currentRow = [{ widget, colSpan }];
                    currentRowTop = rect.top;
                } else {
                    currentRow.push({ widget, colSpan });
                }
            });
            
            // Ajouter la dernière ligne
            if (currentRow.length > 0) {
                rows.push(currentRow);
            }
            
            // Ajuster les lignes si nécessaire
            rows.forEach(row => {
                // Calculer le total de colonnes sur cette ligne
                const totalColumns = row.reduce((sum, item) => sum + item.colSpan, 0);
                
                // Si le total dépasse 12, ajuster les widgets
                if (totalColumns > gridColumns) {
                    console.log(`Ligne avec ${totalColumns} colonnes > limite de ${gridColumns}, ajustement nécessaire`);
                    
                    // Réduire progressivement la largeur des widgets si possible
                    let excessColumns = totalColumns - gridColumns;
                    let adjustmentMade = false;
                    
                    for (let i = row.length - 1; i >= 0 && excessColumns > 0; i--) {
                        const item = row[i];
                        
                        // Réduire les colonnes selon le type de widget
                        if (item.colSpan === 12 && excessColumns >= 4) {
                            // Remplacer widget-col-12 par widget-col-8
                            item.widget.classList.remove('widget-col-12');
                            item.widget.classList.add('widget-col-8');
                            excessColumns -= 4;
                            adjustmentMade = true;
                        } else if (item.colSpan === 8 && excessColumns >= 2) {
                            // Remplacer widget-col-8 par widget-col-6
                            item.widget.classList.remove('widget-col-8');
                            item.widget.classList.add('widget-col-6');
                            excessColumns -= 2;
                            adjustmentMade = true;
                        } else if (item.colSpan === 6 && excessColumns >= 2) {
                            // Remplacer widget-col-6 par widget-col-4
                            item.widget.classList.remove('widget-col-6');
                            item.widget.classList.add('widget-col-4');
                            excessColumns -= 2;
                            adjustmentMade = true;
                        }
                    }
                    
                    // Si on n'a pas pu ajuster suffisamment, déplacer des widgets à la ligne suivante
                    if (excessColumns > 0) {
                        console.log(`Besoin de déplacer des widgets à la ligne suivante (${excessColumns} colonnes en excès)`);
                        // Le déplacement se fera naturellement lors du prochain rendu
                    }
                }
            });
            
            // Régénérer la carte des lignes après optimisation
            generateRowMap();
            
        }, 350); // Attendre la fin de toutes les animations
    }
    
    /**
     * Créer les indicateurs de direction pour le feedback visuel
     */
    function createDirectionIndicators() {
        // Créer un indicateur pour chaque direction
        const directions = ['left', 'right', 'top', 'bottom'];
        
        directions.forEach(direction => {
            const indicator = document.createElement('div');
            indicator.className = `direction-indicator ${direction}`;
            indicator.style.display = 'none';
            container.appendChild(indicator);
            directionIndicators[direction] = indicator;
        });
    }
    
    /**
     * Afficher les indicateurs de direction autour d'un élément
     * @param {HTMLElement} element - L'élément autour duquel afficher les indicateurs
     */
    function showDirectionIndicators(element) {
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        
        // Positionner les indicateurs
        Object.keys(directionIndicators).forEach(direction => {
            const indicator = directionIndicators[direction];
            
            switch(direction) {
                case 'left':
                    indicator.style.left = `${rect.left}px`;
                    indicator.style.top = `${rect.top + rect.height/2 - 20}px`;
                    break;
                case 'right':
                    indicator.style.left = `${rect.right}px`;
                    indicator.style.top = `${rect.top + rect.height/2 - 20}px`;
                    break;
                case 'top':
                    indicator.style.top = `${rect.top}px`;
                    indicator.style.left = `${rect.left + rect.width/2 - 20}px`;
                    break;
                case 'bottom':
                    indicator.style.top = `${rect.bottom}px`;
                    indicator.style.left = `${rect.left + rect.width/2 - 20}px`;
                    break;
            }
            
            indicator.style.display = 'block';
        });
    }
    
    /**
     * Mettre à jour la position des indicateurs de direction
     * @param {HTMLElement} element - L'élément de référence
     */
    function updateDirectionIndicators(element) {
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        
        // Mettre à jour la position de chaque indicateur
        Object.keys(directionIndicators).forEach(direction => {
            const indicator = directionIndicators[direction];
            
            switch(direction) {
                case 'left':
                    indicator.style.left = `${rect.left}px`;
                    indicator.style.top = `${rect.top + rect.height/2 - 20}px`;
                    break;
                case 'right':
                    indicator.style.left = `${rect.right}px`;
                    indicator.style.top = `${rect.top + rect.height/2 - 20}px`;
                    break;
                case 'top':
                    indicator.style.top = `${rect.top}px`;
                    indicator.style.left = `${rect.left + rect.width/2 - 20}px`;
                    break;
                case 'bottom':
                    indicator.style.top = `${rect.bottom}px`;
                    indicator.style.left = `${rect.left + rect.width/2 - 20}px`;
                    break;
            }
        });
    }
    
    /**
     * Masquer tous les indicateurs de direction
     */
    function hideDirectionIndicators() {
        Object.values(directionIndicators).forEach(indicator => {
            indicator.style.display = 'none';
        });
    }
    
    /**
     * Utilitaire pour débouncer une fonction
     * @param {Function} func - La fonction à débouncer
     * @param {number} wait - Le délai d'attente en ms
     * @return {Function} - La fonction debouncée
     */
    function debounce(func, wait) {
        let timeout;
        
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Interface publique du module
    return {
        init,
        generateRowMap,
        initializeWidget,
        organizeWidgets,
        reinitialize: function() {
            // Réinitialiser complètement le système
            console.log('Réinitialisation complète du système de drag and drop');
            
            // Nettoyer les indicateurs de direction
            Object.values(directionIndicators).forEach(indicator => {
                if (indicator && indicator.parentNode) {
                    indicator.parentNode.removeChild(indicator);
                }
            });
            
            // Vider l'objet des indicateurs
            directionIndicators = {};
            
            // Réinitialiser les widgets
            document.querySelectorAll('.widget').forEach(widget => {
                widget.classList.remove('dragging', 'widget-shifting', 'drop-before', 'drop-after');
                widget.removeAttribute('data-drag-initialized');
                widget.style.position = '';
                widget.style.top = '';
                widget.style.left = '';
                widget.style.width = '';
                widget.style.height = '';
                widget.style.zIndex = '';
                widget.style.transform = '';
            });
            
            // Réinitialiser le conteneur
            if (container) {
                container.classList.remove('drag-active');
            }
            
            // Réinitialiser les variables
            isDragging = false;
            draggedWidget = null;
            placeholder = null;
            initialPosition = null;
            initialNextSibling = null;
            rowMap = [];
            
            // Réinitialiser complètement
            init();
            
            return "Système de drag and drop réinitialisé avec succès";
        }
    };
})();

// Initialiser le système de drag and drop au chargement du document
document.addEventListener('DOMContentLoaded', function() {
    WidgetDragDrop.init();
});

// Exposer la fonction de réinitialisation globalement
window.reinitializeDragAndDrop = function() {
    return WidgetDragDrop.reinitialize();
};

// Exposer la fonction d'organisation des widgets globalement
window.organizeWidgets = function() {
    if (typeof WidgetDragDrop !== 'undefined') {
        WidgetDragDrop.organizeWidgets();
        return "Widgets réorganisés avec succès";
    }
    return "Module WidgetDragDrop non disponible";
};
