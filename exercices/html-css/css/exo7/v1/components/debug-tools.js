/**
 * Outils de débogage pour le tableau de bord
 * Ces fonctions aident à diagnostiquer les problèmes potentiels
 */

const DebugTools = {
    // Vérifier que les modules essentiels sont chargés
    checkModules: function() {
        const modules = [
            { name: 'Chart.js', check: () => typeof Chart !== 'undefined' },
            { name: 'WidgetRefresh', check: () => typeof WidgetRefresh !== 'undefined' },
            { name: 'WidgetResize', check: () => typeof WidgetResize !== 'undefined' },
            { name: 'WidgetDragDrop', check: () => typeof WidgetDragDrop !== 'undefined' },
            { name: 'WidgetManager', check: () => typeof WidgetManager !== 'undefined' }
        ];
        
        console.group('Vérification des modules:');
        let allModulesLoaded = true;
        
        modules.forEach(module => {
            const isLoaded = module.check();
            console.log(`${module.name}: ${isLoaded ? '✓ Chargé' : '✗ Non chargé'}`);
            
            if (!isLoaded) {
                allModulesLoaded = false;
            }
        });
        
        console.log(`Tous les modules sont ${allModulesLoaded ? 'chargés ✓' : 'NON chargés ✗'}`);
        console.groupEnd();
        
        return allModulesLoaded;
    },
    
    // Vérifier l'état des widgets et de leurs boutons
    checkWidgetButtons: function() {
        const widgets = document.querySelectorAll('.widget');
        
        console.group(`Vérification de ${widgets.length} widgets:`);
        
        widgets.forEach((widget, index) => {
            const id = widget.id || `widget-${index}`;
            console.group(`Widget #${index + 1} (${id}):`);
            
            // Vérifier les attributs draggable
            console.log(`Attribut draggable: ${widget.getAttribute('draggable') === 'true' ? '✓' : '✗'}`);
            
            // Vérifier les boutons
            const deleteBtn = widget.querySelector('.delete-widget-btn');
            const compactBtn = widget.querySelector('.toggle-compact-btn');
            const refreshBtn = widget.querySelector('.refresh-btn');
            
            console.log(`Bouton suppression: ${deleteBtn ? '✓' : '✗'}`);
            console.log(`Bouton compact: ${compactBtn ? '✓' : '✗'}`);
            console.log(`Bouton rafraîchir: ${refreshBtn ? '✓' : '✗'}`);
            
            // Vérifier si les gestionnaires d'événements sont attachés (approximatif)
            if (deleteBtn) {
                console.log(`Gestionnaire suppression: ${deleteBtn.onclick !== null || deleteBtn._hasEventListener ? '✓' : '?'}`);
            }
            
            if (compactBtn) {
                console.log(`Gestionnaire compact: ${compactBtn.onclick !== null || compactBtn._hasEventListener ? '✓' : '?'}`);
            }
            
            if (refreshBtn) {
                console.log(`Gestionnaire rafraîchir: ${refreshBtn.onclick !== null || refreshBtn._hasEventListener ? '✓' : '?'}`);
            }
            
            console.groupEnd();
        });
        
        console.groupEnd();
        
        return widgets.length > 0;
    },
    
    // Activer le débogage des événements Drag & Drop
    enableDragDropDebugging: function() {
        const events = ['dragstart', 'dragend', 'dragenter', 'dragleave', 'dragover', 'drop'];
        const container = document.querySelector('.dashboard-container');
        
        if (!container) {
            console.warn('Container de dashboard non trouvé pour le débogage');
            return false;
        }
        
        events.forEach(eventName => {
            container.addEventListener(eventName, function(e) {
                console.log(`Événement ${eventName} sur ${e.target.id || e.target.className}`);
            });
        });
        
        document.querySelectorAll('.widget').forEach(widget => {
            widget.addEventListener('dragstart', function(e) {
                console.log(`Widget ${this.id} commence à être glissé`);
            });
            
            widget.addEventListener('dragend', function(e) {
                console.log(`Widget ${this.id} termine d'être glissé`);
            });
        });
        
        console.log('Débogage des événements drag & drop activé');
        return true;
    },
    
    // Tester les fonctionnalités drag & drop
    testDragDrop: function() {
        const widgets = document.querySelectorAll('.widget');
        
        if (widgets.length < 2) {
            console.warn('Au moins 2 widgets sont nécessaires pour tester le drag & drop');
            return false;
        }
        
        console.log('Pour tester le drag & drop:');
        console.log('1. Cliquez sur un en-tête de widget et maintenez');
        console.log('2. Faites glisser vers un autre widget');
        console.log('3. Relâchez pour déposer');
        
        return true;
    },
    
    // Initialiser les outils de débogage
    init: function() {
        console.log('Outils de débogage initialisés');
        
        // Ajouter des méthodes au scope global pour faciliter le débogage dans la console
        window.debugDashboard = {
            checkModules: this.checkModules,
            checkWidgets: this.checkWidgetButtons,
            enableDragDropDebug: this.enableDragDropDebugging,
            testDragDrop: this.testDragDrop
        };
        
        console.log('Utilisez window.debugDashboard pour accéder aux outils de débogage');
        
        // Vérifier automatiquement au démarrage
        this.checkModules();
        
        return true;
    }
};

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => DebugTools.init());
