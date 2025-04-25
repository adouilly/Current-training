/**
 * Script de diagnostic pour le drag and drop
 */
document.addEventListener('DOMContentLoaded', function() {
    console.group('🔍 Test du système de drag and drop');
    
    // Vérifier que le module est chargé
    if (typeof WidgetDragDrop !== 'undefined') {
        console.log('✅ Module WidgetDragDrop chargé');
    } else {
        console.error('❌ Module WidgetDragDrop non trouvé');
    }
    
    // Vérifier que les widgets sont correctement configurés
    const widgets = document.querySelectorAll('.widget');
    console.log(`${widgets.length} widgets trouvés`);
    
    // Vérifier si les headers ont des événements mousedown
    let headersWithMouseDown = 0;
    widgets.forEach((widget, index) => {
        const header = widget.querySelector('.widget-header');
        if (header) {
            // On ne peut pas directement vérifier les événements, mais on peut vérifier le style
            if (window.getComputedStyle(header).cursor === 'grab') {
                headersWithMouseDown++;
            }
        }
        console.log(`Widget #${index+1} (${widget.id || 'sans ID'}): header cursor=${window.getComputedStyle(widget.querySelector('.widget-header') || {}).cursor}`);
    });
    
    console.log(`${headersWithMouseDown} widgets ont des en-têtes configurés pour le drag: ${headersWithMouseDown === widgets.length ? '✅ Tous configurés' : '❌ Certains non configurés'}`);
    
    // Vérifier si le conteneur est configuré
    const container = document.querySelector('.dashboard-container');
    if (container) {
        console.log('✅ Conteneur trouvé');
    } else {
        console.error('❌ Conteneur non trouvé');
    }
    
    console.log('Pour tester le drag and drop:');
    console.log('1. Cliquez sur l\'en-tête d\'un widget et maintenez le bouton enfoncé');
    console.log('2. Déplacez la souris pour faire glisser le widget');
    console.log('3. Relâchez le bouton pour déposer le widget à sa nouvelle position');
    
    // Afficher un bouton pour réinitialiser manuellement
    const btn = document.createElement('button');
    btn.textContent = 'Réinitialiser Drag & Drop';
    btn.style.position = 'fixed';
    btn.style.bottom = '10px';
    btn.style.left = '10px';
    btn.style.zIndex = '9999';
    btn.style.padding = '8px 16px';
    btn.style.backgroundColor = '#3932BB';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    
    btn.onclick = function() {
        if (typeof WidgetDragDrop !== 'undefined' && typeof WidgetDragDrop.reinitialize === 'function') {
            WidgetDragDrop.reinitialize();
            alert('Système de drag and drop réinitialisé');
        } else {
            alert('Module WidgetDragDrop non disponible');
        }
    };
    
    document.body.appendChild(btn);
    
    console.groupEnd();
});
