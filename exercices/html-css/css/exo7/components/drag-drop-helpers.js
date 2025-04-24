/**
 * Fonctionnalités d'aide pour le drag-and-drop des widgets
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser la fonctionnalité de drag and drop
    initDragAndDrop();
    
    // Diagnostiquer le système de drag and drop
    runDragDropDiagnostics();
    
    // Ajouter le bouton d'organisation
    addOrganizeWidgetsButton();
});

/**
 * Initialise le drag and drop pour tous les widgets
 */
function initDragAndDrop() {
    console.log('Initialisation du drag and drop des widgets...');
    
    // Rendre tous les widgets draggable
    document.querySelectorAll('.widget').forEach(widget => {
        widget.setAttribute('draggable', 'true');
        
        // Empêcher le drag à partir des boutons
        widget.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('mousedown', function(e) {
                e.stopPropagation();
            });
        });
    });
    
    console.log('Attributs draggable initialisés');
}

/**
 * Exécute un diagnostic du système de drag and drop
 */
function runDragDropDiagnostics() {
    console.group("Diagnostic du système de Drag and Drop");
    
    // 1. Vérifier que les widgets ont l'attribut draggable
    const widgets = document.querySelectorAll('.widget');
    let draggableIssues = 0;
    
    widgets.forEach(widget => {
        if (widget.getAttribute('draggable') !== "true") {
            console.warn(`Widget ${widget.id || 'sans ID'} n'a pas l'attribut draggable="true"`);
            widget.setAttribute('draggable', 'true');
            draggableIssues++;
        }
    });
    
    if (draggableIssues > 0) {
        console.log(`Correction: ${draggableIssues} widgets ont été rendus draggable`);
    } else {
        console.log("✅ Tous les widgets sont correctement marqués comme draggable");
    }
    
    // 2. Vérifier les problèmes de pointer-events
    const handlePointerEvents = document.querySelectorAll('.resize-handle, .widget button, .widget-header-actions button');
    let pointerEventIssues = 0;
    
    handlePointerEvents.forEach(element => {
        const style = window.getComputedStyle(element);
        if (style.pointerEvents === 'none') {
            console.warn(`Élément ${element.className} a pointer-events: none, ce qui peut bloquer les interactions`);
            element.style.pointerEvents = 'auto';
            pointerEventIssues++;
        }
    });
    
    if (pointerEventIssues > 0) {
        console.log(`Correction: ${pointerEventIssues} éléments ont eu leurs pointer-events corrigés`);
    } else {
        console.log("✅ Les pointer-events sont correctement configurés");
    }
    
    // 3. Test des événements fondamentaux
    const container = document.querySelector('.dashboard-container');
    if (container) {
        // Tester dragover
        const dragoverWorks = container.ondragover === null || typeof container.ondragover === 'function';
        console.log(`Test dragover: ${dragoverWorks ? '✅' : '❌'}`);
        
        // Tester drop
        const dropWorks = container.ondrop === null || typeof container.ondrop === 'function';
        console.log(`Test drop: ${dropWorks ? '✅' : '❌'}`);
    }
    
    console.log("Pour tester le drag and drop, essayez de déplacer un widget en le saisissant par son en-tête.");
    console.groupEnd();
}

/**
 * Ajoute un bouton pour réorganiser les widgets
 */
function addOrganizeWidgetsButton() {
    const organizeButton = document.createElement('button');
    organizeButton.textContent = "🧩 Organiser les widgets";
    organizeButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px;
        background-color: var(--primary);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 9999;
        font-weight: bold;
        box-shadow: var(--shadow-md);
    `;
    
    organizeButton.onclick = function() {
        if (typeof organizeWidgets === 'function') {
            const result = organizeWidgets();
            alert(result);
        }
    };
    
    document.body.appendChild(organizeButton);
}

/**
 * Fonction pour organiser automatiquement les widgets
 * (Cette fonction est appelée par le bouton d'organisation)
 */
function organizeWidgets() {
    const container = document.querySelector('.dashboard-container');
    if (!container) return "Conteneur de dashboard non trouvé";
    
    const widgets = Array.from(container.querySelectorAll('.widget'));
    if (widgets.length === 0) return "Aucun widget à organiser";
    
    // Trier les widgets par taille (plus grands en premier)
    widgets.sort((a, b) => {
        const aSize = getComputedStyle(a).getPropertyValue('--grid-column') || 'span 12';
        const bSize = getComputedStyle(b).getPropertyValue('--grid-column') || 'span 12';
        
        // Convertir "span X" en nombre
        const aSpan = parseInt(aSize.replace('span ', '')) || 12;
        const bSpan = parseInt(bSize.replace('span ', '')) || 12;
        
        return bSpan - aSpan; // Plus grand au plus petit
    });
    
    // Réorganiser les widgets en les ajoutant dans l'ordre de taille
    widgets.forEach(widget => container.appendChild(widget));
    
    // Émettre un événement pour signaler que les widgets ont été réorganisés
    container.dispatchEvent(new CustomEvent('widgets-reordered'));
    
    return `${widgets.length} widgets ont été organisés par taille`;
}

// Exposer la fonction globalement pour le bouton
window.organizeWidgets = organizeWidgets;
