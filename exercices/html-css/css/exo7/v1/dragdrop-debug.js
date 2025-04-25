/**
 * Script de diagnostic pour le système de drag and drop
 */
document.addEventListener('DOMContentLoaded', function() {
    console.group("🔍 Diagnostic du système de Drag & Drop");
    
    // Vérifier si les widgets sont correctement configurés
    const widgets = document.querySelectorAll('.widget');
    console.log(`${widgets.length} widgets trouvés`);
    
    let allWidgetsDraggable = true;
    widgets.forEach((widget, index) => {
        const isDraggable = widget.getAttribute('draggable') === 'true';
        console.log(`Widget #${index+1} (${widget.id}): draggable=${isDraggable}`);
        
        if (!isDraggable) {
            allWidgetsDraggable = false;
        }
        
        // Ajouter des écouteurs temporaires pour surveiller les événements
        widget.addEventListener('dragstart', () => console.log(`🟢 dragstart sur ${widget.id}`));
        widget.addEventListener('dragend', () => console.log(`🟠 dragend sur ${widget.id}`));
    });
    
    console.log(`Tous les widgets sont draggable: ${allWidgetsDraggable ? '✅ Oui' : '❌ Non'}`);
    
    // Vérifier si le conteneur est correctement configuré
    const container = document.querySelector('.dashboard-container');
    if (container) {
        console.log('✅ Container trouvé');
        
        container.addEventListener('dragover', e => {
            // Cette ligne est cruciale pour autoriser le drop
            e.preventDefault();
            console.log('dragover sur container (debug)');
        });
        
        container.addEventListener('drop', e => {
            e.preventDefault();
            console.log('DROP sur container (debug)');
        });
    } else {
        console.error('❌ Container non trouvé!');
    }
    
    // Vérifier la présence du module de drag & drop
    console.log(`Module WidgetDragDrop: ${typeof WidgetDragDrop !== 'undefined' ? '✅ Présent' : '❌ Manquant'}`);
    
    console.groupEnd();
    
    // Afficher les instructions
    console.log('Instruction: Pour tester le drag and drop, essayez de déplacer un widget en cliquant sur son en-tête et en maintenant le bouton enfoncé tout en le déplaçant vers une autre position.');
});

/**
 * Ajoute des attributs draggable à tous les widgets s'ils ne sont pas déjà présents
 */
function fixWidgetDraggableAttributes() {
    const widgets = document.querySelectorAll('.widget:not([draggable="true"])');
    
    if (widgets.length > 0) {
        console.log(`Correction des attributs draggable pour ${widgets.length} widgets`);
        
        widgets.forEach(widget => {
            widget.setAttribute('draggable', 'true');
            console.log(`Widget ${widget.id} rendu draggable`);
        });
        
        return true;
    }
    
    return false;
}

// Exposer la fonction de correction globalement pour qu'elle puisse être appelée depuis la console
window.fixWidgetDraggableAttributes = fixWidgetDraggableAttributes;
