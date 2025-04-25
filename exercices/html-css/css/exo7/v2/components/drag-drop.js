/**
 * Gestion du glisser-déposer des widgets
 */

// Initialisation du glisser-déposer
function initializeDragAndDrop() {
  const widgets = document.querySelectorAll('.widget');
  const widgetsContainer = document.getElementById('widgets-grid');
  
  if (!widgets || !widgetsContainer) return;
  
  widgets.forEach(widget => {
    // Ajout des événements pour le drag
    widget.addEventListener('dragstart', handleDragStart);
    widget.addEventListener('dragend', handleDragEnd);
    
    // Pour le handle de déplacement
    const moveBtn = widget.querySelector('.move-widget');
    if (moveBtn) {
      moveBtn.addEventListener('mousedown', function(e) {
        // Permet de démarrer le drag depuis le bouton de déplacement
        widget.setAttribute('draggable', 'true');
        
        // Sauvegarde de la position initiale pour animation du retour si besoin
        widget.dataset.initialX = widget.getBoundingClientRect().left;
        widget.dataset.initialY = widget.getBoundingClientRect().top;
      });
      
      moveBtn.addEventListener('mouseup', function() {
        // Désactive le drag après relâchement
        setTimeout(() => {
          widget.setAttribute('draggable', 'false');
        }, 50);
      });
    }
  });
  
  // Événements pour la zone de dépôt
  widgetsContainer.addEventListener('dragover', handleDragOver);
  widgetsContainer.addEventListener('dragenter', handleDragEnter);
  widgetsContainer.addEventListener('dragleave', handleDragLeave);
  widgetsContainer.addEventListener('drop', handleDrop);
}

// Gestion du début du drag
function handleDragStart(e) {
  this.classList.add('dragging');
  
  // Sauvegarde de l'ID du widget pour l'utiliser lors du drop
  e.dataTransfer.setData('text/plain', this.getAttribute('data-widget-id'));
  
  // Définit l'effet de déplacement
  e.dataTransfer.effectAllowed = 'move';
  
  // Ajoute une image fantôme personnalisée pendant le déplacement
  const dragImage = this.cloneNode(true);
  dragImage.style.width = this.offsetWidth + 'px';
  dragImage.style.height = this.offsetHeight + 'px';
  dragImage.style.opacity = '0.8';
  dragImage.style.position = 'absolute';
  dragImage.style.top = '-1000px';
  document.body.appendChild(dragImage);
  
  e.dataTransfer.setDragImage(dragImage, 20, 20);
  
  // Supprime l'image fantôme après un court délai
  setTimeout(() => {
    document.body.removeChild(dragImage);
  }, 0);
}

// Gestion de la fin du drag
function handleDragEnd(e) {
  this.classList.remove('dragging');
  
  // Réinitialise toutes les zones de drop potentielles
  document.querySelectorAll('.drop-zone').forEach(dropzone => {
    dropzone.classList.remove('drop-zone');
  });
}

// Gestion du survol pendant le drag
function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  
  // Trouve l'élément cible le plus proche
  const targetWidget = getTargetWidget(e);
  if (targetWidget && !targetWidget.classList.contains('dragging')) {
    // Calcule si on est plus proche de la partie haute ou basse du widget
    const rect = targetWidget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const midX = rect.left + rect.width / 2;
    
    // Supprime les précédentes zones de drop
    document.querySelectorAll('.drop-zone-before, .drop-zone-after').forEach(el => {
      el.classList.remove('drop-zone-before', 'drop-zone-after');
    });
    
    // Détermine où placer la zone de drop (avant ou après)
    if (e.clientY < midY) {
      targetWidget.classList.add('drop-zone-before');
    } else {
      targetWidget.classList.add('drop-zone-after');
    }
  }
}

// Gestion de l'entrée dans une zone de drop potentielle
function handleDragEnter(e) {
  e.preventDefault();
  
  const targetWidget = getTargetWidget(e);
  if (targetWidget && !targetWidget.classList.contains('dragging')) {
    targetWidget.classList.add('drop-zone');
  }
}

// Gestion de la sortie d'une zone de drop
function handleDragLeave(e) {
  const targetWidget = getTargetWidget(e);
  if (targetWidget) {
    // Vérifie que la sortie ne se fait pas vers un enfant de l'élément
    const relatedTarget = e.relatedTarget;
    if (!targetWidget.contains(relatedTarget)) {
      targetWidget.classList.remove('drop-zone');
    }
  }
}

// Gestion du dépôt d'un widget
function handleDrop(e) {
  e.preventDefault();
  
  // Récupère l'ID du widget déplacé
  const draggedWidgetId = e.dataTransfer.getData('text/plain');
  const draggedWidget = document.querySelector(`[data-widget-id="${draggedWidgetId}"]`);
  
  if (!draggedWidget) return;
  
  // Trouve le widget cible
  const targetWidget = getTargetWidget(e);
  
  // Supprime toutes les classes de zone de drop
  document.querySelectorAll('.drop-zone, .drop-zone-before, .drop-zone-after').forEach(el => {
    el.classList.remove('drop-zone', 'drop-zone-before', 'drop-zone-after');
  });
  
  // Insère le widget déplacé avant ou après la cible
  if (targetWidget && targetWidget !== draggedWidget) {
    const rect = targetWidget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    
    if (e.clientY < midY) {
      // Insère avant
      targetWidget.parentNode.insertBefore(draggedWidget, targetWidget);
    } else {
      // Insère après
      targetWidget.parentNode.insertBefore(draggedWidget, targetWidget.nextSibling);
    }
    
    // Animation de positionnement
    draggedWidget.classList.add('repositioning');
    setTimeout(() => {
      draggedWidget.classList.remove('repositioning');
    }, 300);
    
    // Met à jour les positions des widgets dans le stockage
    updateWidgetsPositions();
  }
}

// Fonction utilitaire pour obtenir le widget cible
function getTargetWidget(e) {
  let target = e.target;
  
  // Remonte dans le DOM pour trouver le widget parent
  while (target && !target.classList.contains('widget')) {
    target = target.parentNode;
    if (!target || target === document.body) return null;
  }
  
  return target;
}

// Mise à jour des positions des widgets
function updateWidgetsPositions() {
  const widgets = document.querySelectorAll('.widget');
  const positions = {};
  
  widgets.forEach((widget, index) => {
    const id = widget.getAttribute('data-widget-id');
    positions[id] = index;
  });
  
  // Sauvegarde des positions dans le localStorage
  localStorage.setItem('dashboardWidgetsPositions', JSON.stringify(positions));
  
  // Déclenche un événement pour informer d'autres composants
  const event = new CustomEvent('widgetsPositionsUpdated', {
    detail: { positions }
  });
  document.dispatchEvent(event);
}

// Restaure les positions des widgets au chargement
function restoreWidgetsPositions() {
  const savedPositions = localStorage.getItem('dashboardWidgetsPositions');
  
  if (savedPositions) {
    try {
      const positions = JSON.parse(savedPositions);
      const widgetsContainer = document.getElementById('widgets-grid');
      const widgetsArray = Array.from(document.querySelectorAll('.widget'));
      
      // Trie les widgets selon les positions sauvegardées
      widgetsArray.sort((a, b) => {
        const aId = a.getAttribute('data-widget-id');
        const bId = b.getAttribute('data-widget-id');
        return positions[aId] - positions[bId];
      });
      
      // Réinsère les widgets dans l'ordre
      widgetsArray.forEach(widget => {
        widgetsContainer.appendChild(widget);
      });
    } catch (error) {
      console.error('Erreur lors de la restauration des positions des widgets:', error);
    }
  }
}

// Initialise le système quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
  initializeDragAndDrop();
  restoreWidgetsPositions();
});
