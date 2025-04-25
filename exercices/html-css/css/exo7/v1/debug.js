// Script de débogage pour aider à identifier les problèmes

console.log("--- Débogage du système de widgets ---");

// Vérifier que tous les scripts sont chargés
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM chargé, vérification des modules...");
    
    // Liste des modules à vérifier
    const modules = [
        { name: "Chart.js", check: () => typeof Chart !== 'undefined' },
        { name: "WidgetRefresh", check: () => typeof WidgetRefresh !== 'undefined' },
        { name: "WidgetResize", check: () => typeof WidgetResize !== 'undefined' },
        { name: "WidgetDragDrop", check: () => typeof WidgetDragDrop !== 'undefined' },
        { name: "WidgetManager", check: () => typeof WidgetManager !== 'undefined' }
    ];
    
    // Vérifier chaque module
    modules.forEach(module => {
        const isLoaded = module.check();
        console.log(`${module.name}: ${isLoaded ? "✅ Chargé" : "❌ Non chargé"}`);
    });
    
    // Vérifier les widgets et leurs contrôles
    console.log("\nVérification des widgets et contrôles...");
    const widgets = document.querySelectorAll(".widget");
    console.log(`Nombre de widgets trouvés: ${widgets.length}`);
    
    widgets.forEach((widget, index) => {
        const id = widget.id || `widget-${index}`;
        
        // Vérifier les boutons essentiels
        const hasDeleteBtn = !!widget.querySelector(".delete-widget-btn");
        const hasToggleBtn = !!widget.querySelector(".toggle-compact-btn");
        const hasRefreshBtn = !!widget.querySelector(".refresh-btn");
        const hasResizeHandle = !!widget.querySelector(".resize-handle");
        
        console.log(`\nWidget #${index + 1} (${id}):`);
        console.log(`- Bouton de suppression: ${hasDeleteBtn ? "✅" : "❌"}`);
        console.log(`- Bouton de mode compact: ${hasToggleBtn ? "✅" : "❌"}`);
        console.log(`- Bouton de rafraîchissement: ${hasRefreshBtn ? "✅" : "❌"}`);
        console.log(`- Poignée de redimensionnement: ${hasResizeHandle ? "✅" : "❌"}`);
    });
    
    // Vérifier le bouton d'ajout de widget
    const addWidgetBtn = document.getElementById("add-widget-btn");
    console.log(`\nBouton d'ajout de widget: ${addWidgetBtn ? "✅" : "❌"}`);
    if (addWidgetBtn) {
        const computedStyle = window.getComputedStyle(addWidgetBtn);
        const isVisible = computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden';
        console.log(`- Visible: ${isVisible ? "✅" : "❌"}`);
    }
    
    // Vérifier la modale
    const modal = document.getElementById("add-widget-modal");
    console.log(`Modale d'ajout de widget: ${modal ? "✅" : "❌"}`);
    
    // Vérifier si des éléments CSS importants sont chargés
    const importantSelectors = [
        ".widget-summary", ".widget.compact", ".resize-handle", ".widget.dragging", ".drop-indicator"
    ];
    
    console.log("\nVérification des règles CSS importantes:");
    importantSelectors.forEach(selector => {
        try {
            const testEl = document.querySelector(selector);
            const hasSelector = getComputedStyle(testEl || document.body).getPropertyValue("--test-selector") === "";
            
            console.log(`${selector}: ${testEl ? "✅" : "❓"}`);
        } catch (e) {
            console.log(`${selector}: ❓ (impossible à vérifier)`);
        }
    });
});

// Surveiller les erreurs JavaScript
window.addEventListener('error', function(e) {
    console.error('Erreur détectée:', e.message);
    console.error('Fichier:', e.filename);
    console.error('Ligne:', e.lineno, 'Colonne:', e.colno);
});

// Helper pour tester les fonctionnalités directement dans la console
window.testWidgets = {
    addStat: function() {
        if (typeof WidgetManager !== 'undefined') {
            const widget = WidgetManager.addNewWidget('stats');
            console.log('Widget de statistiques ajouté:', widget);
            return widget;
        }
        console.error('WidgetManager non disponible!');
    },
    
    addChart: function() {
        if (typeof WidgetManager !== 'undefined') {
            const widget = WidgetManager.addNewWidget('chart');
            console.log('Widget de graphique ajouté:', widget);
            return widget;
        }
        console.error('WidgetManager non disponible!');
    },
    
    toggleCompact: function(widgetId) {
        const widget = document.getElementById(widgetId || 'stats-widget');
        if (widget) {
            const btn = widget.querySelector('.toggle-compact-btn');
            if (btn) btn.click();
            else console.warn('Bouton toggle non trouvé');
        } else {
            console.warn('Widget non trouvé');
        }
    },
    
    deleteWidget: function(widgetId) {
        const widget = document.getElementById(widgetId || 'notifications-widget');
        if (widget) {
            const btn = widget.querySelector('.delete-widget-btn');
            if (btn) {
                console.log('Suppression du widget', widgetId);
                btn.click();
            }
            else console.warn('Bouton suppression non trouvé');
        } else {
            console.warn('Widget non trouvé');
        }
    }
};

console.log("--- Fin du chargement des outils de débogage ---");
console.log("Utilisez window.testWidgets pour tester les fonctionnalités");
