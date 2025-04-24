// Module pour la fonctionnalité de glisser-déposer des widgets utilisant l'API HTML5 Drag & Drop

const WidgetDragDrop = {
    // Élément en cours de déplacement
    draggedElement: null,
    
    // État du déplacement
    dragState: {
        source: null,
        target: null,
        placeholder: null
    },
    
    // Initialiser la fonctionnalité de glisser-déposer
    init: function() {
        console.log("Initialisation du système de Drag & Drop HTML5");
        
        // Sélectionner tous les widgets
        const widgets = document.querySelectorAll('.widget');
        
        widgets.forEach(widget => {
            // Rendre chaque widget glissable
            widget.setAttribute('draggable', 'true');
            
            // Événement de début de glisser
            widget.addEventListener('dragstart', this.handleDragStart.bind(this));
            
            // Événement de fin de glisser
            widget.addEventListener('dragend', this.handleDragEnd.bind(this));
        });
        
        // Sélectionner le conteneur du tableau de bord
        const container = document.querySelector('.dashboard-container');
        if (container) {
            // Autoriser le drop sur le conteneur
            container.addEventListener('dragover', this.handleDragOver.bind(this));
            container.addEventListener('dragenter', this.handleDragEnter.bind(this));
            container.addEventListener('dragleave', this.handleDragLeave.bind(this));
            container.addEventListener('drop', this.handleDrop.bind(this));
            
            console.log("Événements de conteneur configurés");
        } else {
            console.error("Conteneur de tableau de bord non trouvé!");
        }
        
        // Empêcher les clics pendant le drag pour les boutons
        document.addEventListener('dragstart', () => {
            document.querySelectorAll('.widget-header-actions button').forEach(btn => {
                btn.style.pointerEvents = 'none';
            });
        });
        
        document.addEventListener('dragend', () => {
            document.querySelectorAll('.widget-header-actions button').forEach(btn => {
                btn.style.pointerEvents = '';
            });
        });
    },
    
    // Gérer le début du glisser
    handleDragStart: function(e) {
        // Éviter de glisser si on clique sur un bouton
        if (e.target.closest('button')) {
            e.preventDefault();
            return false;
        }
        
        // Empêcher le drag à partir des boutons
        if (e.target.closest('.widget-header-actions')) {
            e.preventDefault();
            return false;
        }
        
        const widget = e.target.closest('.widget');
        if (!widget) return;
        
        console.log("Début du glissement:", widget.id);
        
        // Stocker la référence à l'élément en cours de déplacement
        this.draggedElement = widget;
        this.dragState.source = widget;
        
        // Ajouter une classe pour le style
        widget.classList.add('dragging');
        
        // Créer un placeholder transparent pour visualiser
        const placeholder = widget.cloneNode(true);
        placeholder.id = 'widget-placeholder';
        placeholder.classList.add('widget-placeholder');
        placeholder.classList.remove('dragging');
        placeholder.style.opacity = '0.4';
        
        // Cacher le placeholder jusqu'à ce qu'on en ait besoin
        placeholder.style.display = 'none';
        widget.parentNode.insertBefore(placeholder, widget.nextSibling);
        this.dragState.placeholder = placeholder;
        
        // Stocker les données nécessaires pour le transfert
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', widget.id);
        
        // Pour Firefox - sinon l'image de drag est invisible
        try {
            // Créer une image de drag personnalisée
            const rect = widget.getBoundingClientRect();
            const dragImage = widget.cloneNode(true);
            dragImage.style.width = rect.width + 'px';
            dragImage.style.opacity = '0.7';
            dragImage.style.position = 'absolute';
            dragImage.style.top = '-1000px';
            document.body.appendChild(dragImage);
            
            e.dataTransfer.setDragImage(dragImage, 10, 10);
            
            // Nettoyer l'image après le drag
            setTimeout(() => {
                document.body.removeChild(dragImage);
            }, 0);
        } catch (err) {
            console.warn("Erreur lors de la définition de l'image de drag:", err);
        }
        
        // Petit délai pour que le style soit appliqué
        setTimeout(() => {
            widget.classList.add('hidden-source');
        }, 0);
    },
    
    // Gérer le glisser au-dessus
    handleDragOver: function(e) {
        // TRÈS IMPORTANT: Sans cette ligne, le drop est impossible
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const targetContainer = e.currentTarget;
        if (!targetContainer || !this.draggedElement) return;
        
        // Trouver l'élément cible le plus proche
        const widget = e.target.closest('.widget:not(.dragging):not(.widget-placeholder)');
        
        // Si on trouve un widget cible
        if (widget) {
            // Calculer si on doit placer le placeholder avant ou après
            const rect = widget.getBoundingClientRect();
            const middleY = rect.top + rect.height / 2;
            const insertBefore = e.clientY < middleY;
            
            // Afficher le placeholder au bon endroit
            const placeholder = this.dragState.placeholder;
            if (placeholder) {
                placeholder.style.display = 'block';
                const reference = insertBefore ? widget : widget.nextSibling;
                
                // Déplacer le placeholder seulement si la position change
                if (placeholder.nextSibling !== reference && placeholder !== reference) {
                    targetContainer.insertBefore(placeholder, reference);
                }
            }
            
            // Mettre à jour l'état
            this.dragState.target = widget;
            
            // Indiquer visuellement la position potentielle
            document.querySelectorAll('.widget').forEach(w => {
                w.classList.remove('drop-target', 'drop-before', 'drop-after');
            });
            
            widget.classList.add('drop-target');
            widget.classList.add(insertBefore ? 'drop-before' : 'drop-after');
        }
    },
    
    // Entrée dans une zone de drop
    handleDragEnter: function(e) {
        e.preventDefault();
        const container = e.currentTarget;
        container.classList.add('drag-active');
    },
    
    // Sortie d'une zone de drop
    handleDragLeave: function(e) {
        const container = e.currentTarget;
        
        // Vérifier si on quitte vraiment le conteneur (pas un enfant)
        const rect = container.getBoundingClientRect();
        if (
            e.clientX < rect.left ||
            e.clientX >= rect.right ||
            e.clientY < rect.top ||
            e.clientY >= rect.bottom
        ) {
            container.classList.remove('drag-active');
        }
    },
    
    // Gestion du drop
    handleDrop: function(e) {
        // TRÈS IMPORTANT: Empêcher le comportement par défaut du navigateur
        e.preventDefault();
        e.stopPropagation();
        
        const container = e.currentTarget;
        container.classList.remove('drag-active');
        
        if (!this.draggedElement) return;
        
        const draggedId = e.dataTransfer.getData('text/plain');
        const draggedWidget = document.getElementById(draggedId);
        
        if (!draggedWidget) {
            console.error("Widget glissé non trouvé:", draggedId);
            return;
        }
        
        console.log("Drop du widget:", draggedId);
        
        // Placer le widget à sa nouvelle position
        const placeholder = this.dragState.placeholder;
        if (placeholder && placeholder.parentNode) {
            // Remplacer le placeholder par le widget
            placeholder.parentNode.insertBefore(draggedWidget, placeholder);
            placeholder.remove();
        }
        
        // Nettoyer les classes utilisées pendant le drag
        document.querySelectorAll('.widget').forEach(w => {
            w.classList.remove('drop-target', 'drop-before', 'drop-after', 'hidden-source');
        });
        
        // Réinitialiser l'état
        this.resetDragState();
        
        // Déclencher un événement pour signaler le réarrangement
        const event = new CustomEvent('widgets-reordered', {
            detail: { widget: draggedWidget }
        });
        container.dispatchEvent(event);
        
        console.log("Drop effectué avec succès");
    },
    
    // Fin du glisser
    handleDragEnd: function(e) {
        if (!this.draggedElement) return;
        
        const widget = e.target.closest('.widget');
        if (!widget) return;
        
        console.log("Fin du glissement:", widget.id);
        
        // Enlever les classes de style
        widget.classList.remove('dragging', 'hidden-source');
        
        // Nettoyer les classes sur les autres widgets
        document.querySelectorAll('.widget').forEach(w => {
            w.classList.remove('drop-target', 'drop-before', 'drop-after');
        });
        
        // Supprimer le placeholder si besoin
        const placeholder = this.dragState.placeholder;
        if (placeholder && placeholder.parentNode) {
            placeholder.remove();
        }
        
        // Réinitialiser l'état
        this.resetDragState();
        
        // Restaurer le conteneur
        const container = document.querySelector('.dashboard-container');
        if (container) {
            container.classList.remove('drag-active');
        }
    },
    
    // Réinitialiser l'état de drag and drop
    resetDragState: function() {
        this.draggedElement = null;
        this.dragState = {
            source: null,
            target: null,
            placeholder: null
        };
    }
};

// Automatiquement initialiser si le document est déjà chargé
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => WidgetDragDrop.init(), 1);
}
