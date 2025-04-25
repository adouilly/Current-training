/**
 * Implémentation simplifiée du système de Drag and Drop pour les widgets
 * Cette version corrige les problèmes courants qui peuvent bloquer la fonctionnalité
 */

// Utilisation d'un IIFE pour éviter la pollution du scope global
(function() {
    // État global pour suivre l'élément en cours de déplacement et la cible
    let draggedWidget = null;
    let dropTarget = null;
    
    // Attendre que le DOM soit prêt
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Initialisation du système de Drag and Drop...');
        init();
    });
    
    // Fonction d'initialisation principale
    function init() {
        // Récupérer le conteneur et tous les widgets
        const container = document.querySelector('.dashboard-container');
        const widgets = document.querySelectorAll('.widget');
        
        if (!container) {
            console.error('Conteneur de dashboard introuvable');
            return;
        }
        
        if (!widgets || widgets.length === 0) {
            console.warn('Aucun widget trouvé pour le drag & drop');
            return;
        }
        
        // Configurer les écouteurs sur le conteneur
        setupContainerListeners(container);
        
        // Configurer tous les widgets pour le drag & drop
        widgets.forEach(widget => setupWidget(widget));
        
        console.log(`${widgets.length} widgets initialisés pour drag & drop`);
        
        // Surveiller les nouveaux widgets ajoutés
        observeDOMChanges(container);
    }
    
    // Configurer les écouteurs d'événements pour le conteneur
    function setupContainerListeners(container) {
        // Supprimer les écouteurs existants pour éviter les doublons
        container.removeEventListener('dragover', handleContainerDragOver);
        container.removeEventListener('drop', handleContainerDrop);
        
        // Ajouter les nouveaux écouteurs
        container.addEventListener('dragover', handleContainerDragOver);
        container.addEventListener('drop', handleContainerDrop);
    }
    
    // Configurer un widget pour le drag & drop
    function setupWidget(widget) {
        if (!widget) return;
        
        // Nettoyer d'abord les écouteurs existants pour éviter les doublons
        cleanupWidgetListeners(widget);
        
        // S'assurer que l'attribut draggable est présent
        widget.setAttribute('draggable', 'true');
        
        // Appliquer un style pour indiquer que l'élément est draggable
        widget.style.cursor = 'grab';
        
        // Ajouter les écouteurs pour le drag & drop
        widget.addEventListener('dragstart', handleDragStart);
        widget.addEventListener('dragend', handleDragEnd);
        widget.addEventListener('dragenter', handleDragEnter);
        widget.addEventListener('dragover', handleDragOver);
        widget.addEventListener('dragleave', handleDragLeave);
        
        // Désactiver le drag depuis les boutons et les poignées de redimensionnement
        widget.querySelectorAll('button, .resize-handle').forEach(el => {
            el.addEventListener('mousedown', function(e) {
                e.stopPropagation();
            });
            
            // S'assurer que les événements de pointeur sont activés
            el.style.pointerEvents = 'auto';
        });
    }
    
    // Supprimer les écouteurs existants d'un widget
    function cleanupWidgetListeners(widget) {
        widget.removeEventListener('dragstart', handleDragStart);
        widget.removeEventListener('dragend', handleDragEnd);
        widget.removeEventListener('dragenter', handleDragEnter);
        widget.removeEventListener('dragover', handleDragOver);
        widget.removeEventListener('dragleave', handleDragLeave);
    }
    
    // Observer les changements dans le DOM pour détecter de nouveaux widgets
    function observeDOMChanges(container) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // Vérifier s'il y a de nouveaux widgets ajoutés
                mutation.addedNodes.forEach(node => {
                    if (node.classList && node.classList.contains('widget')) {
                        setupWidget(node);
                        console.log(`Nouveau widget détecté et configuré: ${node.id || 'sans ID'}`);
                    } else if (node.querySelectorAll) {
                        // Rechercher des widgets dans des éléments plus profonds
                        node.querySelectorAll('.widget').forEach(widget => {
                            setupWidget(widget);
                        });
                    }
                });
            });
        });
        
        observer.observe(container, { 
            childList: true, 
            subtree: true 
        });
        
        console.log('Observation des changements du DOM activée');
    }
    
    // Gestionnaire pour l'événement dragstart
    function handleDragStart(e) {
        // Vérifier si l'événement provient d'un bouton ou d'une poignée de redimensionnement
        if (e.target.closest('button') || e.target.closest('.resize-handle') || 
            e.target.closest('.widget-header-actions')) {
            e.preventDefault();
            return false;
        }
        
        // Stocker une référence au widget en cours de déplacement
        draggedWidget = this;
        
        // Stocker l'identifiant du widget pour le transfert de données
        e.dataTransfer.setData('text/plain', this.id);
        e.dataTransfer.effectAllowed = 'move';
        
        // Ajouter une classe pour le style pendant le drag
        this.classList.add('dragging');
        
        // S'assurer que les poignées de redimensionnement sont désactivées pendant le drag
        this.querySelectorAll('.resize-handle').forEach(handle => {
            handle.style.pointerEvents = 'none';
        });
        
        console.log(`Début du drag pour ${this.id || 'widget sans ID'}`);
        return true;
    }
    
    // Gestionnaire pour l'événement dragend
    function handleDragEnd(e) {
        // Supprimer la classe de style
        this.classList.remove('dragging');
        
        // Réactiver les poignées de redimensionnement
        this.querySelectorAll('.resize-handle').forEach(handle => {
            handle.style.pointerEvents = 'auto';
        });
        
        // Réinitialiser la référence
        draggedWidget = null;
        
        // Nettoyer les styles de tous les widgets
        document.querySelectorAll('.widget').forEach(widget => {
            widget.classList.remove('drop-target', 'drop-before', 'drop-after');
        });
        
        console.log(`Fin du drag pour ${this.id || 'widget sans ID'}`);
    }
    
    // Gestionnaire pour l'événement dragenter
    function handleDragEnter(e) {
        // Ne rien faire si c'est le widget en cours de déplacement
        if (this === draggedWidget) return;
        
        // Marquer ce widget comme cible potentielle
        this.classList.add('drop-target');
        dropTarget = this;
    }
    
    // Gestionnaire pour l'événement dragover
    function handleDragOver(e) {
        // CRUCIAL: Empêcher le comportement par défaut pour permettre le drop
        e.preventDefault();
        
        // Ne rien faire si c'est le widget en cours de déplacement
        if (this === draggedWidget) return;
        
        // Indiquer que l'effet est un déplacement
        e.dataTransfer.dropEffect = 'move';
        
        // Déterminer si le curseur est dans la moitié supérieure ou inférieure
        const rect = this.getBoundingClientRect();
        const y = e.clientY - rect.top;
        const isInUpperHalf = y < rect.height / 2;
        
        // Mettre à jour les classes en fonction de la position
        this.classList.remove('drop-before', 'drop-after');
        this.classList.add(isInUpperHalf ? 'drop-before' : 'drop-after');
    }
    
    // Gestionnaire pour l'événement dragleave
    function handleDragLeave(e) {
        // Supprimer les classes quand on quitte l'élément
        this.classList.remove('drop-target', 'drop-before', 'drop-after');
        
        if (dropTarget === this) {
            dropTarget = null;
        }
    }
    
    // Gestionnaire pour l'événement dragover sur le conteneur
    function handleContainerDragOver(e) {
        // CRUCIAL: Empêcher le comportement par défaut pour permettre le drop
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        // Ajouter une classe au conteneur pendant le drag
        this.classList.add('drag-active');
    }
    
    // Gestionnaire pour l'événement drop
    function handleContainerDrop(e) {
        // CRUCIAL: Empêcher le comportement par défaut
        e.preventDefault();
        e.stopPropagation();
        
        // Supprimer la classe du conteneur
        this.classList.remove('drag-active');
        
        // Récupérer l'ID du widget déplacé
        const widgetId = e.dataTransfer.getData('text/plain');
        if (!widgetId) {
            console.error("Aucun ID trouvé dans les données transférées");
            return;
        }
        
        // Récupérer le widget déplacé
        const draggedWidget = document.getElementById(widgetId);
        if (!draggedWidget) {
            console.error(`Widget avec ID ${widgetId} introuvable`);
            return;
        }
        
        // Si on a un widget cible, insérer le widget déplacé avant ou après
        if (dropTarget && dropTarget !== draggedWidget) {
            const insertBefore = dropTarget.classList.contains('drop-before');
            
            if (insertBefore) {
                this.insertBefore(draggedWidget, dropTarget);
                console.log(`Widget ${widgetId} inséré avant ${dropTarget.id || 'widget sans ID'}`);
            } else {
                this.insertBefore(draggedWidget, dropTarget.nextSibling);
                console.log(`Widget ${widgetId} inséré après ${dropTarget.id || 'widget sans ID'}`);
            }
            
            // Émettre un événement pour signaler le réarrangement
            const event = new CustomEvent('widgets-reordered', {
                detail: { movedWidget: draggedWidget }
            });
            this.dispatchEvent(event);
        }
        
        // Nettoyer les styles
        document.querySelectorAll('.widget').forEach(widget => {
            widget.classList.remove('drop-target', 'drop-before', 'drop-after');
        });
        
        // Réinitialiser la référence
        dropTarget = null;
    }
    
    // Fonction publique pour réinitialiser le système manuellement
    window.reinitializeDragAndDrop = function() {
        console.log('Réinitialisation manuelle du système de drag and drop');
        init();
    };
})();
