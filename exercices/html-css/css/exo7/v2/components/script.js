/**
 * Script principal du dashboard
 * Main dashboard script
 */

// Cache des éléments fréquemment utilisés / Cache frequently used elements
const DOM = {};

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le cache DOM / Initialize DOM cache
    cacheDOM();
    
    // Initialiser les fonctionnalités de base / Initialize basic features
    initCore();
    
    // Initialiser les liens et les interactions / Initialize links and interactions
    initInteractions();
    
    // Initialiser la visibilité des éléments / Initialize element visibility
    initVisibility();

    // Initialiser la fonctionnalité d'ajout de widgets
    initAddWidgetFunctionality();
});

/**
 * Cache des éléments DOM pour éviter les requêtes répétées
 * DOM caching to avoid repeated queries
 */
function cacheDOM() {
    DOM.container = document.querySelector('.dashboard-container');
    DOM.sidebar = document.querySelector('.sidebar');
    DOM.main = document.querySelector('main');
    DOM.theme = document.getElementById('theme-toggle');
    DOM.sidebarToggle = document.getElementById('toggle-sidebar');
    DOM.widgetsGrid = document.getElementById('widgets-grid');
}

/**
 * Initialisation des fonctionnalités principales
 * Core features initialization
 */
function initCore() {
    // Initialiser le sidebar / Initialize sidebar
    initSidebar();
    
    // Initialiser le changement de thème / Initialize theme switching
    initThemeToggle();
    
    // Optimiser les images / Optimize images
    lazyLoadImages();
    
    // Supprimer l'appel à la fonction manquante ou la définir
    // initAnimations();  // Cette ligne cause l'erreur - la commenter ou la supprimer
    
    // Débuter le cycle de mise à jour des widgets / Start widget update cycle
    startWidgetUpdates();
}

/**
 * Créons la fonction manquante pour éviter l'erreur
 * Let's create the missing function to avoid the error
 */
function initAnimations() {
    // Initialisation des animations du dashboard
    console.log('Animations initialisées');
    
    // Ajouter des classes pour les animations d'entrée
    document.querySelectorAll('.widget').forEach((widget, index) => {
        setTimeout(() => {
            widget.classList.add('animated');
        }, index * 100); // Délai progressif pour un effet d'entrée en cascade
    });
}

/**
 * Initialiser les interactions utilisateur
 * Initialize user interactions
 */
function initInteractions() {
    // Désactiver les liens placeholder / Disable placeholder links
    document.querySelectorAll('a[href="#"]').forEach(link => {
        link.addEventListener('click', (e) => e.preventDefault());
    });
    
    // Ajouter le comportement responsive / Add responsive behavior
    initResponsiveBehavior();
    
    // Initialiser le drag & drop des widgets si la fonction existe
    // Initialize widget drag & drop if function exists
    if (typeof initDragDrop === 'function') {
        initDragDrop();
    }
}

/**
 * Basculement du thème clair/sombre optimisé
 * Optimized light/dark theme toggle
 */
function toggleTheme() {
    // Utiliser requestAnimationFrame pour optimiser les changements visuels
    // Use requestAnimationFrame to optimize visual changes
    requestAnimationFrame(() => {
        // Ajouter une classe pour les transitions / Add class for transitions
        document.body.classList.add('theme-transition');
        
        // Basculer le mode sombre / Toggle dark mode
        const isDarkMode = document.body.classList.toggle('dark-mode');
        
        // Changer l'icône du bouton / Change button icon
        if (DOM.theme) {
            DOM.theme.innerHTML = isDarkMode ? 
                '<i class="fas fa-moon"></i>' : 
                '<i class="fas fa-sun"></i>';
            DOM.theme.title = isDarkMode ? 'Mode jour' : 'Mode nuit';
        }
        
        // Sauvegarder le thème / Save theme
        localStorage.setItem('darkMode', isDarkMode);
        
        // Mettre à jour les graphiques / Update charts
        updateChartsForTheme(isDarkMode);
        
        // Retirer la classe de transition après un délai
        // Remove transition class after delay
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 500);
    });
}

/**
 * Fonction debounce pour limiter la fréquence d'exécution des fonctions
 * Debounce function to limit execution frequency of functions
 * 
 * @param {Function} func - Fonction à exécuter / Function to execute
 * @param {number} wait - Délai d'attente en ms / Wait delay in ms
 * @return {Function} Fonction avec debounce / Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Chargement différé des images
 * Lazy loading of images
 */
function lazyLoadImages() {
    // Utiliser l'API native de lazy loading / Use native lazy loading API
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
    
    // Ajouter un observateur d'intersection pour les navigateurs plus anciens
    // Add intersection observer for older browsers
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * Initialiser la visibilité des éléments
 * Initialize element visibility
 */
function initVisibility() {
    // Ajouter des animations de chargement pour les données
    addLoadingAnimations();
    
    // Lier les éléments du menu aux widgets correspondants
    linkMenuToWidgets();
    
    // S'assurer que les widgets sont bien positionnés (éviter les chevauchements)
    window.addEventListener('resize', debounce(validateWidgetPositions, 200));
    
    // Initialiser les graphiques
    if (typeof initializeCharts === 'function') {
        initializeCharts();
    }
    
    // Mettre à jour l'image du profil Admin
    updateAdminProfileImage();

    // Optimiser la disposition des widgets
    optimizeWidgetLayout();

    // Initialiser la gestion d'ajout de widgets
    initAddWidgetFunctionality();
}

// Gestion de la barre latérale
function initSidebar() {
    const toggleBtn = document.getElementById('toggle-sidebar');
    const dashboard = document.querySelector('.dashboard-container');
    
    if (toggleBtn && dashboard) {
        toggleBtn.addEventListener('click', () => {
            dashboard.classList.toggle('sidebar-collapsed');
            // Sauvegarder l'état
            const isCollapsed = dashboard.classList.contains('sidebar-collapsed');
            localStorage.setItem('sidebar_collapsed', isCollapsed);
        });
        
        // Restaurer l'état sauvegardé
        const isCollapsed = localStorage.getItem('sidebar_collapsed') === 'true';
        if (isCollapsed) {
            dashboard.classList.add('sidebar-collapsed');
        }
    }
}

// Initialisation du toggle de thème jour/nuit
function initThemeToggle() {
    // Ajouter le bouton toggle thème s'il n'existe pas
    if (!document.getElementById('theme-toggle')) {
        const headerRight = document.querySelector('.header-right');
        if (headerRight) {
            const themeToggle = document.createElement('div');
            themeToggle.className = 'theme-toggle';
            themeToggle.innerHTML = `
                <button id="theme-toggle" title="Changer de thème">
                    <i class="fas fa-sun"></i>
                </button>
            `;
            headerRight.insertBefore(themeToggle, headerRight.firstChild);
            
            // Évènement pour changer de thème
            document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
            
            // Appliquer le thème sauvegardé
            applyTheme();
        }
    } else {
        // Si le bouton existe déjà, mettre à jour son événement
        document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
        applyTheme();
    }
}

// Fonction de changement de thème
function toggleTheme() {
    // Utiliser requestAnimationFrame pour optimiser les changements visuels
    // Use requestAnimationFrame to optimize visual changes
    requestAnimationFrame(() => {
        // Ajouter une classe pour les transitions / Add class for transitions
        document.body.classList.add('theme-transition');
        
        // Basculer le mode sombre / Toggle dark mode
        const isDarkMode = document.body.classList.toggle('dark-mode');
        
        // Changer l'icône du bouton / Change button icon
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.innerHTML = isDarkMode ? 
                '<i class="fas fa-moon"></i>' : 
                '<i class="fas fa-sun"></i>';
            themeBtn.title = isDarkMode ? 'Mode jour' : 'Mode nuit';
        }
        
        // Sauvegarder le thème / Save theme
        localStorage.setItem('darkMode', isDarkMode);
        
        // Mettre à jour les graphiques / Update charts
        updateChartsTheme(isDarkMode);
        
        // Retirer la classe de transition après un délai
        // Remove transition class after delay
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 500);
    });
}

// Appliquer le thème sauvegardé
function applyTheme() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
            themeBtn.title = 'Mode jour';
        }
    }
    
    // Mettre à jour les graphiques
    updateChartsTheme(isDarkMode);
}

// Mise à jour des graphiques pour le thème
function updateChartsTheme(isDarkMode) {
    if (!window.chartInstances) return;
    
    // Convertir l'objet chartInstances en tableau pour .forEach
    Object.values(window.chartInstances).forEach(chart => {
        if (!chart || !chart.options) return;
        
        // Mettre à jour les couleurs de la grille
        if (chart.options.scales) {
            const scales = chart.options.scales;
            if (scales.x) {
                scales.x.grid.color = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
                scales.x.ticks.color = isDarkMode ? '#e9ecef' : '#343a40';
            }
            if (scales.y) {
                scales.y.grid.color = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
                scales.y.ticks.color = isDarkMode ? '#e9ecef' : '#343a40';
            }
        }
        
        // Mettre à jour le graphique
        chart.update();
    });
}

// Initialisation des contrôles de widgets
function initWidgetControls() {
    const widgets = document.querySelectorAll('.widget');
    
    widgets.forEach(widget => {
        const resizeBtn = widget.querySelector('.toggle-size');
        const viewBtn = widget.querySelector('.toggle-view');
        
        // Ajouter un bouton de suppression s'il n'existe pas
        if (!widget.querySelector('.remove-widget')) {
            const controls = widget.querySelector('.widget-controls');
            if (controls) {
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-widget';
                removeBtn.setAttribute('title', 'Supprimer');
                removeBtn.innerHTML = '<i class="fas fa-times"></i>';
                removeBtn.addEventListener('click', () => removeWidget(widget));
                controls.appendChild(removeBtn);
            }
        } else {
            // Si le bouton existe, mettre à jour son événement
            const removeBtn = widget.querySelector('.remove-widget');
            removeBtn.addEventListener('click', () => removeWidget(widget));
        }
        
        // Configuration du bouton de redimensionnement
        if (resizeBtn) {
            resizeBtn.addEventListener('click', () => toggleWidgetSize(widget));
        }
        
        // Configuration du bouton de vue compacte
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                toggleWidgetView(widget);
                generateCompactSummary(widget);
            });
        }
        
        // Restaurer l'état compact si nécessaire
        const widgetId = widget.getAttribute('data-widget-id');
        const isCompact = localStorage.getItem(`widget_${widgetId}_compact`) === 'true';
        if (isCompact) {
            widget.classList.add('compact');
            if (viewBtn) {
                viewBtn.innerHTML = '<i class="fas fa-expand"></i>';
                viewBtn.title = 'Vue étendue';
            }
            generateCompactSummary(widget);
        }
    });
    
    // Initialiser le bouton d'ajout de widgets
    initAddWidgetButton();
}

// Changement de taille du widget
function toggleWidgetSize(widget) {
    const currentSize = widget.getAttribute('data-size') || 'small';
    let newSize;
    
    switch (currentSize) {
        case 'small': newSize = 'medium'; break;
        case 'medium': newSize = 'large'; break;
        case 'large': newSize = 'full'; break;
        case 'full': newSize = 'small'; break;
        default: newSize = 'small';
    }
    
    // Sauvegarder la taille
    widget.setAttribute('data-size', newSize);
    const widgetId = widget.getAttribute('data-widget-id');
    localStorage.setItem(`widget_${widgetId}_size`, newSize);
}

// Basculer le mode compact du widget
function toggleWidgetView(widget) {
    widget.classList.toggle('compact');
    
    const isCompact = widget.classList.contains('compact');
    const toggleViewBtn = widget.querySelector('.toggle-view');
    if (toggleViewBtn) {
        toggleViewBtn.innerHTML = isCompact ? 
            '<i class="fas fa-expand"></i>' : 
            '<i class="fas fa-compress"></i>';
        toggleViewBtn.setAttribute('title', isCompact ? 'Vue étendue' : 'Vue compacte');
    }
    
    // Sauvegarder l'état
    const widgetId = widget.getAttribute('data-widget-id');
    localStorage.setItem(`widget_${widgetId}_compact`, isCompact);
}

// Générer un résumé pour le mode compact
function generateCompactSummary(widget) {
    const isCompact = widget.classList.contains('compact');
    if (!isCompact) return;
    
    // Trouver ou créer la zone de résumé
    let summaryEl = widget.querySelector('.compact-summary');
    if (!summaryEl) {
        summaryEl = document.createElement('div');
        summaryEl.className = 'compact-summary';
        widget.appendChild(summaryEl);
    }
    
    // Générer le contenu selon le type de widget
    const widgetId = widget.getAttribute('data-widget-id');
    let summaryContent = '';
    
    switch (widgetId) {
        case 'stats-users':
            summaryContent = '<strong>2,845</strong> utilisateurs (+5.27%)';
            break;
        case 'stats-sales':
            summaryContent = '<strong>1,253</strong> ventes (+12.8%)';
            break;
        case 'stats-visits':
            summaryContent = '<strong>9,721</strong> visites (+8.3%)';
            break;
        case 'stats-revenue':
            summaryContent = '<strong>75,245€</strong> (+15.1%)';
            break;
        case 'sales-chart':
            summaryContent = 'Ventes mensuelles: <strong>croissance de 12%</strong>';
            break;
        case 'recent-orders':
            summaryContent = '<strong>5</strong> commandes récentes | <strong>783€</strong> total';
            break;
        case 'quick-contact':
            summaryContent = 'Formulaire de contact rapide';
            break;
        default:
            summaryContent = 'Résumé du widget';
            break;
    }
    
    summaryEl.innerHTML = summaryContent;
}

// Supprimer un widget
function removeWidget(widget) {
    // Stocker les informations du widget pour pouvoir le restaurer
    const widgetId = widget.getAttribute('data-widget-id');
    const removedWidgets = JSON.parse(localStorage.getItem('removedWidgets') || '{}');
    
    removedWidgets[widgetId] = {
        title: widget.querySelector('.widget-header h3').textContent,
        size: widget.getAttribute('data-size') || 'small'
    };
    localStorage.setItem('removedWidgets', JSON.stringify(removedWidgets));
    
    // Ajouter une animation de disparition
    widget.classList.add('removing');
    
    setTimeout(() => {
        // Supprimer le widget du DOM
        widget.remove();
        
        // Mettre à jour la liste des widgets disponibles
        updateAddWidgetDialog();
    }, 300); // Durée de l'animation
}

// Initialiser le bouton d'ajout de widget
function initAddWidgetButton() {
    const addButton = document.getElementById('add-widget');
    
    if (!addButton) return;
    
    // Créer la boîte de dialogue modale si elle n'existe pas
    if (!document.getElementById('add-widget-modal')) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'add-widget-modal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Ajouter un widget</h3>
                        <button class="close-modal" title="Fermer">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="widget-list"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Fermer la modale
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('show');
        });
        
        // Fermer en cliquant à l'extérieur
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
    
    // Ouvrir la boîte de dialogue
    addButton.addEventListener('click', () => {
        const modal = document.getElementById('add-widget-modal');
        modal.classList.add('show');
        updateAddWidgetDialog();
    });
}

// Mettre à jour la boîte de dialogue d'ajout de widgets
function updateAddWidgetDialog() {
    const widgetList = document.querySelector('#add-widget-modal .widget-list');
    
    if (!widgetList) return;
    
    // Vider la liste
    widgetList.innerHTML = '';
    
    // Récupérer les widgets supprimés
    const removedWidgets = JSON.parse(localStorage.getItem('removedWidgets') || '{}');
    
    // Si aucun widget disponible
    if (Object.keys(removedWidgets).length === 0) {
        widgetList.innerHTML = '<p>Aucun widget disponible. Tous les widgets sont déjà affichés.</p>';
        return;
    }
    
    // Créer un élément pour chaque widget disponible
    for (const [id, widgetInfo] of Object.entries(removedWidgets)) {
        const widgetItem = document.createElement('div');
        widgetItem.className = 'widget-item';
        widgetItem.innerHTML = `
            <div class="widget-item-info">
                <h4>${widgetInfo.title}</h4>
                <span class="widget-item-type">${getWidgetTypeLabel(id)}</span>
            </div>
            <button class="add-widget-btn" data-widget-id="${id}">Ajouter</button>
        `;
        widgetList.appendChild(widgetItem);
        
        // Évènement pour ajouter le widget
        widgetItem.querySelector('.add-widget-btn').addEventListener('click', () => {
            addWidget(id, widgetInfo);
        });
    }
}

// Obtenir le libellé du type de widget
function getWidgetTypeLabel(id) {
    const types = {
        'stats-users': 'Statistiques - Utilisateurs',
        'stats-sales': 'Statistiques - Ventes',
        'stats-visits': 'Statistiques - Visites',
        'stats-revenue': 'Statistiques - Revenus',
        'sales-chart': 'Graphique - Ventes mensuelles',
        'recent-orders': 'Tableau - Commandes récentes',
        'quick-contact': 'Formulaire - Contact rapide'
    };
    
    return types[id] || 'Widget';
}

// Ajouter cette fonction au début du fichier pour initialiser la fonctionnalité d'ajout de widgets
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser la fonctionnalité d'ajout de widgets
    initAddWidgetFunctionality();
    
    // ... existing code ...
});

/**
 * Initialise la fonctionnalité d'ajout de widgets
 */
function initAddWidgetFunctionality() {
    console.log("Initialisation de la fonctionnalité d'ajout de widgets");
    
    const addButton = document.getElementById('add-widget');
    if (!addButton) return;
    
    // Création de la modale pour ajouter des widgets
    let modal = document.getElementById('add-widget-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'add-widget-modal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Ajouter un widget</h3>
                        <button class="close-modal" title="Fermer">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="widget-list"></div>
                        <div class="no-widgets-message" style="text-align: center; padding: 20px; display: none;">
                            <p>Aucun widget disponible à ajouter.</p>
                            <p>Pour ajouter un widget, supprimez-en un d'abord.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Événements pour la modale
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('show');
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
    
    // Ouvrir la modale d'ajout de widget
    addButton.addEventListener('click', () => {
        console.log("Bouton d'ajout de widget cliqué");
        updateAvailableWidgets();
        document.getElementById('add-widget-modal').classList.add('show');
    });
    
    // Écouter l'événement de suppression de widget pour mettre à jour la liste
    document.addEventListener('widgetRemoved', (event) => {
        console.log('Événement widgetRemoved capturé:', event.detail);
        // Mettre à jour après un court délai pour s'assurer que les changements dans le DOM sont effectués
        setTimeout(updateAvailableWidgets, 100);
    });
}

/**
 * Mettre à jour la liste des widgets disponibles à ajouter
 */
function updateAvailableWidgets() {
    console.log("Mise à jour de la liste des widgets disponibles");
    
    const widgetList = document.querySelector('#add-widget-modal .widget-list');
    const noWidgetsMessage = document.querySelector('#add-widget-modal .no-widgets-message');
    
    if (!widgetList) {
        console.error("Élément widget-list non trouvé");
        return;
    }
    
    // Vider la liste actuelle
    widgetList.innerHTML = '';
    
    // Récupérer les widgets supprimés du localStorage
    let removedWidgets = {};
    try {
        removedWidgets = JSON.parse(localStorage.getItem('removedWidgets') || '{}');
    } catch (e) {
        console.error("Erreur lors de la récupération des widgets supprimés:", e);
        localStorage.setItem('removedWidgets', '{}'); // réinitialiser si corrompu
        removedWidgets = {};
    }
    
    console.log("Widgets supprimés trouvés:", removedWidgets);
    
    // Si localStorage est vide ou n'a pas de widgets, initialiser avec des données par défaut
    if (Object.keys(removedWidgets).length === 0) {
        // Vérifier quels widgets sont déjà présents sur le tableau de bord
        const currentWidgets = Array.from(document.querySelectorAll('.widget')).map(w => w.getAttribute('data-widget-id'));
        
        // Liste complète des widgets possibles
        const allPossibleWidgets = [
            'stats-users', 'stats-sales', 'stats-visits', 'stats-revenue',
            'sales-chart', 'recent-orders', 'quick-contact'
        ];
        
        // Trouver les widgets qui ne sont pas encore sur le tableau de bord
        const missingWidgets = allPossibleWidgets.filter(id => !currentWidgets.includes(id));
        console.log("Widgets manquants identifiés:", missingWidgets);
        
        // Si des widgets sont manquants, les ajouter à removedWidgets
        missingWidgets.forEach(id => {
            removedWidgets[id] = {
                title: getWidgetTitle(id),
                size: getDefaultWidgetSize(id)
            };
        });
        
        // Sauvegarder les widgets manquants dans localStorage
        if (missingWidgets.length > 0) {
            localStorage.setItem('removedWidgets', JSON.stringify(removedWidgets));
            console.log("Widgets manquants ajoutés au localStorage:", removedWidgets);
        }
    }
    
    // Récupérer les widgets actuellement affichés
    const currentWidgetIds = Array.from(document.querySelectorAll('.widget'))
        .map(widget => widget.getAttribute('data-widget-id'));
    
    console.log("Widgets actuellement affichés:", currentWidgetIds);
    
    // Filtrer les widgets supprimés qui ne sont pas déjà affichés
    const availableWidgets = {};
    for (const [id, info] of Object.entries(removedWidgets)) {
        if (!currentWidgetIds.includes(id)) {
            availableWidgets[id] = info;
        }
    }
    
    console.log("Widgets disponibles à ajouter:", availableWidgets);
    
    // Si aucun widget n'est disponible
    if (Object.keys(availableWidgets).length === 0) {
        widgetList.style.display = 'none';
        if (noWidgetsMessage) {
            noWidgetsMessage.style.display = 'block';
        }
        return;
    }
    
    // Afficher la liste et cacher le message
    widgetList.style.display = 'block';
    if (noWidgetsMessage) {
        noWidgetsMessage.style.display = 'none';
    }
    
    // Créer un élément pour chaque widget disponible
    for (const [id, widgetInfo] of Object.entries(availableWidgets)) {
        const widgetItem = document.createElement('div');
        widgetItem.className = 'widget-item';
        widgetItem.innerHTML = `
            <div class="widget-item-info">
                <h4>${widgetInfo.title || getWidgetTitle(id)}</h4>
                <span class="widget-item-type">${getWidgetTypeLabel(id)}</span>
            </div>
            <button class="add-widget-btn" data-widget-id="${id}">Ajouter</button>
        `;
        
        widgetList.appendChild(widgetItem);
        
        // Événement pour le bouton d'ajout
        widgetItem.querySelector('.add-widget-btn').addEventListener('click', () => {
            console.log(`Ajout du widget ${id}`);
            addWidgetToBoard(id, widgetInfo);
        });
    }
}

/**
 * Obtenir le titre par défaut d'un widget
 */
function getWidgetTitle(id) {
    const titles = {
        'stats-users': 'Utilisateurs',
        'stats-sales': 'Ventes',
        'stats-visits': 'Visites',
        'stats-revenue': 'Revenus',
        'sales-chart': 'Ventes mensuelles',
        'recent-orders': 'Dernières commandes',
        'quick-contact': 'Contact rapide'
    };
    return titles[id] || 'Widget';
}

/**
 * Obtenir la taille par défaut d'un widget
 */
function getDefaultWidgetSize(id) {
    const sizes = {
        'stats-users': 'small',
        'stats-sales': 'small',
        'stats-visits': 'small',
        'stats-revenue': 'small',
        'sales-chart': 'large',
        'recent-orders': 'large',
        'quick-contact': 'medium'
    };
    return sizes[id] || 'small';
}

/**
 * Obtenir le libellé pour un type de widget
 */
function getWidgetTypeLabel(id) {
    const types = {
        'stats-users': 'Statistiques - Utilisateurs',
        'stats-sales': 'Statistiques - Ventes',
        'stats-visits': 'Statistiques - Visites',
        'stats-revenue': 'Statistiques - Revenus',
        'sales-chart': 'Graphique - Ventes mensuelles',
        'recent-orders': 'Tableau - Commandes récentes',
        'quick-contact': 'Formulaire - Contact rapide'
    };
    
    return types[id] || 'Widget';
}

// Ajouter un widget au tableau de bord
function addWidget(id, widgetInfo) {
    // Vérifier si le widget existe déjà
    if (document.querySelector(`[data-widget-id="${id}"]`)) {
        showNotification('Ce widget existe déjà sur le tableau de bord', 'warning');
        return;
    }
    
    // Créer le HTML du widget selon son type
    let widgetHTML;
    
    switch (id) {
        case 'stats-users':
            widgetHTML = createStatsWidget(id, 'Utilisateurs', 'users', '2,845', '+5.27%');
            break;
        case 'stats-sales':
            widgetHTML = createStatsWidget(id, 'Ventes', 'shopping-cart', '1,253', '+12.8%');
            break;
        case 'stats-visits':
            widgetHTML = createStatsWidget(id, 'Visites', 'eye', '9,721', '+8.3%');
            break;
        case 'stats-revenue':
            widgetHTML = createStatsWidget(id, 'Revenus', 'euro-sign', '75,245€', '+15.1%');
            break;
        case 'sales-chart':
            widgetHTML = createChartWidget(id);
            break;
        case 'recent-orders':
            widgetHTML = createOrdersWidget(id);
            break;
        case 'quick-contact':
            widgetHTML = createContactWidget(id);
            break;
        default:
            showNotification('Type de widget non reconnu', 'error');
            return;
    }
    
    // Créer l'élément
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = widgetHTML;
    const newWidget = tempDiv.firstChild;
    
    // Appliquer la taille sauvegardée
    if (widgetInfo.size) {
        newWidget.setAttribute('data-size', widgetInfo.size);
    }
    
    // Ajouter au conteneur
    const container = document.getElementById('widgets-grid');
    container.appendChild(newWidget);
    
    // Initialiser les contrôles du widget
    const resizeBtn = newWidget.querySelector('.toggle-size');
    const viewBtn = newWidget.querySelector('.toggle-view');
    const removeBtn = newWidget.querySelector('.remove-widget');
    
    if (resizeBtn) {
        resizeBtn.addEventListener('click', () => toggleWidgetSize(newWidget));
    }
    
    if (viewBtn) {
        viewBtn.addEventListener('click', () => {
            toggleWidgetView(newWidget);
            generateCompactSummary(newWidget);
        });
    }
    
    if (removeBtn) {
        removeBtn.addEventListener('click', () => removeWidget(newWidget));
    }
    
    // Effet d'apparition
    newWidget.classList.add('appearing');
    setTimeout(() => {
        newWidget.classList.remove('appearing');
    }, 500);
    
    // Supprimer des widgets supprimés
    const removedWidgets = JSON.parse(localStorage.getItem('removedWidgets') || '{}');
    delete removedWidgets[id];
    localStorage.setItem('removedWidgets', JSON.stringify(removedWidgets));
    
    // Mettre à jour la boîte de dialogue
    updateAddWidgetDialog();
    
    // Initialiser le graphique si nécessaire
    if (id === 'sales-chart' && window.initializeCharts) {
        setTimeout(() => {
            window.initializeCharts();
        }, 100);
    }
    
    // Fermer la modale
    document.getElementById('add-widget-modal').classList.remove('show');
    
    // Afficher notification
    showNotification('Widget ajouté avec succès', 'success');
}

// Créer un widget de statistiques
function createStatsWidget(id, title, icon, value, change) {
    const isPositive = !change.includes('-');
    const changeClass = isPositive ? 'positive' : 'negative';
    
    return `
        <div class="widget" data-widget-id="${id}" data-size="small">
            <div class="widget-header">
                <h3>${title}</h3>
                <div class="widget-controls">
                    <button class="toggle-size" title="Redimensionner"><i class="fas fa-expand-alt"></i></button>
                    <button class="toggle-view" title="Vue compacte"><i class="fas fa-compress"></i></button>
                    <button class="remove-widget" title="Supprimer"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="widget-content">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-${icon}"></i>
                    </div>
                    <div class="stat-info">
                        <h4>Total ${title.toLowerCase()}</h4>
                        <div class="stat-value">${value}</div>
                        <div class="stat-change ${changeClass}">${change}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Créer un widget de graphique
function createChartWidget(id) {
    return `
        <div class="widget" data-widget-id="${id}" data-size="large">
            <div class="widget-header">
                <h3>Ventes mensuelles</h3>
                <div class="widget-controls">
                    <button class="toggle-size" title="Redimensionner"><i class="fas fa-expand-alt"></i></button>
                    <button class="toggle-view" title="Vue compacte"><i class="fas fa-compress"></i></button>
                    <button class="remove-widget" title="Supprimer"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="widget-content">
                <div class="chart-period-selector">
                    <button class="btn active" data-period="month">Mois</button>
                    <button class="btn" data-period="year">Année</button>
                </div>
                <div class="chart-container">
                    <canvas id="sales-chart"></canvas>
                </div>
            </div>
        </div>
    `;
}

// Créer un widget de tableau de commandes
function createOrdersWidget(id) {
    return `
        <div class="widget" data-widget-id="${id}" data-size="large">
            <div class="widget-header">
                <h3>Dernières commandes</h3>
                <div class="widget-controls">
                    <button class="toggle-size" title="Redimensionner"><i class="fas fa-expand-alt"></i></button>
                    <button class="toggle-view" title="Vue compacte"><i class="fas fa-compress"></i></button>
                    <button class="remove-widget" title="Supprimer"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="widget-content">
                <div class="orders-table-wrapper">
                    <table class="orders-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Client</th>
                                <th>Date</th>
                                <th>Montant</th>
                                <th>Statut</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#1842</td>
                                <td>Jean Dupont</td>
                                <td>10/05/2023</td>
                                <td>125.99€</td>
                                <td><span class="status-badge completed">Livré</span></td>
                                <td><button class="btn-sm">Détails</button></td>
                            </tr>
                            <tr>
                                <td>#1841</td>
                                <td>Marie Martin</td>
                                <td>09/05/2023</td>
                                <td>89.50€</td>
                                <td><span class="status-badge in-progress">En cours</span></td>
                                <td><button class="btn-sm">Détails</button></td>
                            </tr>
                            <tr>
                                <td>#1840</td>
                                <td>Paul Bernard</td>
                                <td>09/05/2023</td>
                                <td>212.75€</td>
                                <td><span class="status-badge pending">En attente</span></td>
                                <td><button class="btn-sm">Détails</button></td>
                            </tr>
                            <tr>
                                <td>#1839</td>
                                <td>Sophie Petit</td>
                                <td>08/05/2023</td>
                                <td>45.20€</td>
                                <td><span class="status-badge completed">Livré</span></td>
                                <td><button class="btn-sm">Détails</button></td>
                            </tr>
                            <tr>
                                <td>#1838</td>
                                <td>Thomas Dubois</td>
                                <td>08/05/2023</td>
                                <td>310.00€</td>
                                <td><span class="status-badge cancelled">Annulé</span></td>
                                <td><button class="btn-sm">Détails</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Créer un widget de formulaire de contact
function createContactWidget(id) {
    return `
        <div class="widget" data-widget-id="${id}" data-size="medium">
            <div class="widget-header">
                <h3>Contact rapide</h3>
                <div class="widget-controls">
                    <button class="toggle-size" title="Redimensionner"><i class="fas fa-expand-alt"></i></button>
                    <button class="toggle-view" title="Vue compacte"><i class="fas fa-compress"></i></button>
                    <button class="remove-widget" title="Supprimer"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="widget-content">
                <form id="quick-contact-form">
                    <div class="form-group">
                        <label for="contact-client">Client</label>
                        <select id="contact-client" name="contact-client">
                            <option value="">Sélectionnez un client</option>
                            <option value="1">Jean Dupont</option>
                            <option value="2">Marie Martin</option>
                            <option value="3">Paul Bernard</option>
                            <option value="4">Sophie Petit</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="contact-subject">Sujet</label>
                        <input type="text" id="contact-subject" name="contact-subject" placeholder="Sujet du message">
                    </div>
                    <div class="form-group">
                        <label for="contact-message">Message</label>
                        <textarea id="contact-message" name="contact-message" rows="4" placeholder="Votre message"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn">Envoyer</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Afficher une notification
function showNotification(message, type = 'info') {
    // Créer l'élément de notification s'il n'existe pas
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getIconForNotificationType(type)}"></i>
            <p>${message}</p>
        </div>
        <button class="close-notification">&times;</button>
    `;
    notificationContainer.appendChild(notification);
    
    // Effet d'apparition
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Fermer la notification après un délai
    const timeout = setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Bouton de fermeture
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => {
        clearTimeout(timeout);
        closeNotification(notification);
    });
}

// Fermer une notification
function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
    }, 300);
}

// Obtenir l'icône pour le type de notification
function getIconForNotificationType(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// Ajouter des animations de chargement pour les données
function addLoadingAnimations() {
    const widgets = document.querySelectorAll('.widget');
    
    widgets.forEach(widget => {
        const widgetContent = widget.querySelector('.widget-content');
        const widgetId = widget.getAttribute('data-widget-id');
        
        // Ajouter un état de chargement
        if (widgetContent) {
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Chargement des données...</p>
            `;
            widgetContent.appendChild(loadingOverlay);
            
            // Simuler un chargement
            setTimeout(() => {
                loadingOverlay.classList.add('fade-out');
                setTimeout(() => {
                    loadingOverlay.remove();
                }, 500);
            }, Math.random() * 1000 + 500); // Temps de chargement aléatoire entre 500ms et 1500ms
        }
    });
}

// Mettre à jour l'image du profil Admin
function updateAdminProfileImage() {
    const userProfileImg = document.querySelector('.user-profile img');
    
    if (userProfileImg) {
        // Remplacer l'image de placeholder par une image réelle
        userProfileImg.src = 'https://ui-avatars.com/api/?name=Admin&background=4361ee&color=fff&size=100';
        userProfileImg.alt = 'Admin';
    }
}

// Lier les éléments du menu aux widgets correspondants
function linkMenuToWidgets() {
    const menuItems = document.querySelectorAll('.sidebar nav li a');
    
    // Définir les associations entre les éléments du menu et les widgets
    const menuToWidgetMap = {
        'dashboard': null, // Page d'accueil
        'utilisateurs': 'stats-users',
        'commandes': 'recent-orders',
        'produits': null,
        'statistiques': 'sales-chart',
        'parametres': null
    };
    
    menuItems.forEach(item => {
        const itemText = item.querySelector('span')?.textContent.toLowerCase().trim();
        const widgetId = menuToWidgetMap[itemText];
        
        if (widgetId) {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Défilement vers le widget
                const widget = document.querySelector(`[data-widget-id="${widgetId}"]`);
                if (widget) {
                    widget.classList.add('highlight-widget');
                    widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Retirer l'effet de surbrillance après un moment
                    setTimeout(() => {
                        widget.classList.remove('highlight-widget');
                    }, 2000);
                }
                
                // Si sur mobile, fermer la sidebar
                const dashboard = document.querySelector('.dashboard-container');
                if (window.innerWidth <= 768 && dashboard) {
                    dashboard.classList.remove('sidebar-active');
                }
            });
        }
    });
}

// Fonction debounce pour limiter les appels aux fonctions
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

// Fonction pour optimiser l'espace des widgets
function optimizeWidgetSpace() {
    const container = document.getElementById('widgets-grid');
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const containerHeight = containerRect.height;
    const containerWidth = containerRect.width;
    
    // Si le conteneur est trop petit, passer les widgets en mode compact
    if (containerHeight < 400) {
        document.querySelectorAll('.widget').forEach(widget => {
            if (!widget.classList.contains('compact')) {
                const viewBtn = widget.querySelector('.toggle-view');
                if (viewBtn) viewBtn.click();
            }
        });
        return;
    }
    
    const widgets = document.querySelectorAll('.widget:not(.compact)');
    const totalWidgets = widgets.length;
    const columns = containerWidth >= 992 ? 4 : (containerWidth >= 768 ? 3 : (containerWidth >= 576 ? 2 : 1));
    
    widgets.forEach(widget => {
        const widgetContent = widget.querySelector('.widget-content');
        if (!widgetContent) return;
        
        // Ajuster le contenu en fonction de l'espace
        const table = widget.querySelector('.orders-table-wrapper');
        const chart = widget.querySelector('.chart-container');
        
        // Adapter les tableaux et les graphiques
        if (table) {
            const maxHeight = Math.min(300, containerHeight * 0.5); // Max 50% de la hauteur ou 300px
            table.style.maxHeight = `${maxHeight}px`;
        }
        
        if (chart) {
            const maxHeight = Math.min(250, containerHeight * 0.4); // Max 40% de la hauteur ou 250px
            chart.style.height = `${maxHeight}px`;
        }
    });
}

// Fonction pour valider et corriger le positionnement des widgets
function validateWidgetPositions() {
    const container = document.getElementById('widgets-grid');
    const widgets = document.querySelectorAll('.widget');
    
    if (!container || widgets.length === 0) return;
    
    // Appeler la fonction de réorganisation si disponible
    if (typeof initWidgetGrid === 'function') {
        initWidgetGrid();
    }
}

// Fonction utilitaire pour limiter la fréquence d'exécution (debounce)
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

// Corriger les opérations JSON

/**
 * Sauvegarde les positions des widgets
 */
function saveWidgetPositions() {
    const widgets = document.querySelectorAll('.widget');
    const positions = {};
    
    widgets.forEach((widget, index) => {
        const id = widget.getAttribute('data-widget-id');
        if (!id) return; // Ignorer les widgets sans ID
        
        const position = widget.getAttribute('data-grid-position') || '';
        const size = widget.getAttribute('data-size') || 'small';
        const isCompact = widget.classList.contains('compact');
        
        positions[id] = {
            index: index,
            position: position,
            size: size,
            isCompact: isCompact
        };
    });
    
    try {
        localStorage.setItem('dashboardWidgetStates', JSON.stringify(positions));
    } catch (error) {
        console.error('Erreur lors de la sauvegarde des états des widgets:', error);
    }
}

/**
 * Charge les positions sauvegardées des widgets
 */
function loadSavedPositions() {
    try {
        const savedData = localStorage.getItem('dashboardWidgetStates');
        if (!savedData) return null;
        
        // Valider le JSON avant de le parser
        JSON.parse(savedData); // Cela va lever une erreur si le JSON est invalide
        
        return JSON.parse(savedData);
    } catch (error) {
        console.error('Erreur lors du chargement des positions sauvegardées:', error);
        
        // En cas d'erreur, nettoyer les données corruptions
        localStorage.removeItem('dashboardWidgetStates');
        return null;
    }
}

/**
 * Vérifie et corrige les données JSON stockées dans localStorage
 */
function validateStoredJSON() {
    // Liste des clés localStorage à vérifier
    const keysToCheck = [
        'dashboardWidgetStates',
        'removedWidgets',
        'sidebar_collapsed',
        'darkMode'
    ];
    
    keysToCheck.forEach(key => {
        try {
            const data = localStorage.getItem(key);
            if (data && (data.startsWith('{') || data.startsWith('['))) {
                // Tenter de parser pour valider
                JSON.parse(data);
            }
        } catch (error) {
            console.warn(`Données JSON invalides trouvées dans ${key}. Nettoyage...`, error);
            localStorage.removeItem(key);
        }
    });
}

/**
 * Optimiser la disposition des widgets en grille
 */
function optimizeWidgetLayout() {
    const container = document.getElementById('widgets-grid');
    
    if (!container) return;
    
    // S'assurer que le conteneur utilise le layout en grille
    container.classList.add('grid-optimized');
    
    // Répartir les widgets efficacement
    const widgets = container.querySelectorAll('.widget');
    
    // Créer une grille virtuelle pour suivre les espaces occupés
    const gridSize = 4; // 4 colonnes
    let grid = Array(20).fill().map(() => Array(gridSize).fill(false));
    
    // Placer chaque widget dans la grille
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
            
            // Appliquer la position au widget
            widget.style.gridRowStart = row + 1;
            widget.style.gridColumnStart = col + 1;
            widget.style.gridColumnEnd = col + width + 1;
        }
    });
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

/**
 * Initialise la fonctionnalité d'ajout de widgets
 * Initialize widget add functionality
 */
function initAddWidgetFunctionality() {
    const addButton = document.getElementById('add-widget');
    if (!addButton) return;
    
    // Création de la modale pour ajouter des widgets
    if (!document.getElementById('add-widget-modal')) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'add-widget-modal';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Ajouter un widget</h3>
                        <button class="close-modal" title="Fermer">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="widget-list"></div>
                        <div class="no-widgets-message" style="display: none;">
                            <p>Aucun widget disponible à ajouter.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Événements pour la modale
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.remove('show');
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
    
    // Ouvrir la modale d'ajout de widget
    addButton.addEventListener('click', () => {
        updateAvailableWidgets();
        document.getElementById('add-widget-modal').classList.add('show');
    });
    
    // Écouter l'événement de suppression de widget pour mettre à jour la liste
    document.addEventListener('widgetRemoved', (event) => {
        console.log('Événement widgetRemoved capturé:', event.detail);
        updateAvailableWidgets();
    });
    
    console.log('Fonctionnalité d\'ajout de widgets initialisée');
}

/**
 * Mettre à jour la liste des widgets disponibles à ajouter
 * Update the list of available widgets to add
 */
function updateAvailableWidgets() {
    console.log('Mise à jour de la liste des widgets disponibles');
    
    const widgetList = document.querySelector('#add-widget-modal .widget-list');
    const noWidgetsMessage = document.querySelector('#add-widget-modal .no-widgets-message');
    
    if (!widgetList) return;
    
    // Vider la liste actuelle
    widgetList.innerHTML = '';
    
    // Récupérer les widgets supprimés
    const removedWidgets = JSON.parse(localStorage.getItem('removedWidgets') || '{}');
    
    // Récupérer les widgets actuellement affichés
    const currentWidgetIds = Array.from(document.querySelectorAll('.widget'))
        .map(widget => widget.getAttribute('data-widget-id'));
    
    console.log('Widgets supprimés dans localStorage:', Object.keys(removedWidgets));
    console.log('Widgets actuellement affichés:', currentWidgetIds);
    
    // Filtrer les widgets supprimés qui ne sont pas déjà affichés
    const availableWidgets = {};
    for (const [id, info] of Object.entries(removedWidgets)) {
        if (!currentWidgetIds.includes(id)) {
            availableWidgets[id] = info;
        }
    }
    
    console.log('Widgets disponibles après filtrage:', Object.keys(availableWidgets));
    
    // Si aucun widget n'est disponible
    if (Object.keys(availableWidgets).length === 0) {
        widgetList.style.display = 'none';
        if (noWidgetsMessage) {
            noWidgetsMessage.style.display = 'block';
        }
        return;
    }
    
    // Afficher la liste et cacher le message
    widgetList.style.display = 'block';
    if (noWidgetsMessage) {
        noWidgetsMessage.style.display = 'none';
    }
    
    // Créer un élément pour chaque widget disponible
    for (const [id, widgetInfo] of Object.entries(availableWidgets)) {
        const widgetItem = document.createElement('div');
        widgetItem.className = 'widget-item';
        widgetItem.innerHTML = `
            <div class="widget-item-info">
                <h4>${widgetInfo.title || 'Widget'}</h4>
                <span class="widget-item-type">${getWidgetTypeLabel(id)}</span>
            </div>
            <button class="add-widget-btn" data-widget-id="${id}">Ajouter</button>
        `;
        
        widgetList.appendChild(widgetItem);
        
        // Événement pour le bouton d'ajout
        widgetItem.querySelector('.add-widget-btn').addEventListener('click', () => {
            console.log(`Tentative d'ajout du widget ${id}`);
            addWidgetToBoard(id, widgetInfo);
        });
    }
}

/**
 * Ajoute un widget au tableau de bord
 * Add a widget to the board
 */
function addWidgetToBoard(id, widgetInfo) {
    console.log(`Fonction addWidgetToBoard appelée pour ${id}`);
    
    // Vérifier si le widget n'existe pas déjà
    if (document.querySelector(`.widget[data-widget-id="${id}"]`)) {
        alert('Ce widget existe déjà sur le tableau de bord.');
        return;
    }
    
    // Créer le contenu HTML du widget selon son type
    let widgetHTML = '';
    
    switch(id) {
        case 'stats-users':
            widgetHTML = createStatsWidget('Utilisateurs', 'users', '2,845', '+5.27%');
            break;
        case 'stats-sales':
            widgetHTML = createStatsWidget('Ventes', 'shopping-cart', '1,253', '+12.8%');
            break;
        case 'stats-visits':
            widgetHTML = createStatsWidget('Visites', 'eye', '9,721', '+8.3%');
            break;
        case 'stats-revenue':
            widgetHTML = createStatsWidget('Revenus', 'euro-sign', '75,245€', '+15.1%');
            break;
        case 'sales-chart':
            widgetHTML = createChartWidget();
            break;
        case 'recent-orders':
            widgetHTML = createOrdersWidget();
            break;
        case 'quick-contact':
            widgetHTML = createContactWidget();
            break;
        default:
            console.error('Type de widget non reconnu:', id);
            return;
    }
    
    // Créer l'élément widget
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = widgetHTML;
    const widget = tempContainer.firstElementChild;
    
    // Définir l'ID et la taille
    widget.setAttribute('data-widget-id', id);
    widget.setAttribute('data-size', widgetInfo.size || 'small');
    
    // Ajouter au tableau de bord
    const container = document.getElementById('widgets-grid');
    container.appendChild(widget);
    
    // Supprimer des widgets supprimés
    const removedWidgets = JSON.parse(localStorage.getItem('removedWidgets') || '{}');
    delete removedWidgets[id];
    localStorage.setItem('removedWidgets', JSON.stringify(removedWidgets));
    
    // Initialiser les fonctionnalités du widget
    if (window.WidgetManager) {
        const resizeBtn = widget.querySelector('.toggle-size');
        const viewBtn = widget.querySelector('.toggle-view');
        const removeBtn = widget.querySelector('.remove-widget');
        const refreshBtn = document.createElement('button');
        
        // Ajouter un bouton de rafraîchissement s'il n'existe pas
        const controls = widget.querySelector('.widget-controls');
        if (controls && !controls.querySelector('.refresh-widget')) {
            refreshBtn.className = 'refresh-widget';
            refreshBtn.title = 'Rafraîchir';
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
            
            // Insérer en premier
            if (controls.firstChild) {
                controls.insertBefore(refreshBtn, controls.firstChild);
            } else {
                controls.appendChild(refreshBtn);
            }
        }
        
        // Attacher les événements
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                if (window.WidgetManager.refreshWidgetData) {
                    window.WidgetManager.refreshWidgetData(widget);
                } else {
                    refreshWidgetData(widget);
                }
            });
        }
        
        if (resizeBtn) {
            resizeBtn.addEventListener('click', () => {
                if (window.WidgetManager.toggleWidgetSize) {
                    window.WidgetManager.toggleWidgetSize(widget);
                } else {
                    toggleWidgetSize(widget);
                }
            });
        }
        
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                if (window.WidgetManager.toggleWidgetView) {
                    window.WidgetManager.toggleWidgetView(widget);
                } else {
                    toggleWidgetView(widget);
                }
            });
        }
        
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                if (window.WidgetManager.removeWidget) {
                    window.WidgetManager.removeWidget(widget);
                } else {
                    removeWidget(widget);
                }
            });
        }
    }
    
    // Mettre à jour la liste des widgets disponibles
    updateAvailableWidgets();
    
    // Fermer la modale
    document.getElementById('add-widget-modal').classList.remove('show');
    
    // Initialiser les graphiques si c'est un widget de graphique
    if (id === 'sales-chart' && window.ChartManager) {
        setTimeout(() => {
            window.ChartManager.initializeCharts();
        }, 100);
    }
    
    console.log(`Widget ${id} ajouté avec succès`);
}

// Fonctions pour créer le HTML des widgets
function createStatsWidget(title, icon, value, change) {
    const isPositive = !change.includes('-');
    return `
        <div class="widget" data-size="small">
            <div class="widget-header">
                <h3>${title}</h3>
                <div class="widget-controls">
                    <button class="toggle-size" title="Redimensionner"><i class="fas fa-expand-alt"></i></button>
                    <button class="toggle-view" title="Vue compacte"><i class="fas fa-compress"></i></button>
                    <button class="remove-widget" title="Supprimer"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="widget-content">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-${icon}"></i>
                    </div>
                    <div class="stat-info">
                        <h4>Total ${title.toLowerCase()}</h4>
                        <div class="stat-value">${value}</div>
                        <div class="stat-change ${isPositive ? 'positive' : 'negative'}">${change}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function createChartWidget() {
    return `
        <div class="widget" data-size="large">
            <div class="widget-header">
                <h3>Ventes mensuelles</h3>
                <div class="widget-controls">
                    <button class="toggle-size" title="Redimensionner"><i class="fas fa-expand-alt"></i></button>
                    <button class="toggle-view" title="Vue compacte"><i class="fas fa-compress"></i></button>
                    <button class="remove-widget" title="Supprimer"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="widget-content">
                <div class="chart-period-selector">
                    <button class="btn active" data-period="month">Mois</button>
                    <button class="btn" data-period="year">Année</button>
                </div>
                <div class="chart-container">
                    <canvas id="sales-chart"></canvas>
                </div>
            </div>
        </div>
    `;
}

function createOrdersWidget() {
    return `
        <div class="widget" data-size="large">
            <div class="widget-header">
                <h3>Dernières commandes</h3>
                <div class="widget-controls">
                    <button class="toggle-size" title="Redimensionner"><i class="fas fa-expand-alt"></i></button>
                    <button class="toggle-view" title="Vue compacte"><i class="fas fa-compress"></i></button>
                    <button class="remove-widget" title="Supprimer"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="widget-content">
                <div class="orders-table-wrapper">
                    <table class="orders-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Client</th>
                                <th>Date</th>
                                <th>Montant</th>
                                <th>Statut</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>#1842</td>
                                <td>Jean Dupont</td>
                                <td>10/05/2023</td>
                                <td>125.99€</td>
                                <td><span class="status-badge completed">Livré</span></td>
                                <td><button class="btn-sm">Détails</button></td>
                            </tr>
                            <tr>
                                <td>#1841</td>
                                <td>Marie Martin</td>
                                <td>09/05/2023</td>
                                <td>89.50€</td>
                                <td><span class="status-badge in-progress">En cours</span></td>
                                <td><button class="btn-sm">Détails</button></td>
                            </tr>
                            <tr>
                                <td>#1840</td>
                                <td>Paul Bernard</td>
                                <td>09/05/2023</td>
                                <td>212.75€</td>
                                <td><span class="status-badge pending">En attente</span></td>
                                <td><button class="btn-sm">Détails</button></td>
                            </tr>
                            <tr>
                                <td>#1839</td>
                                <td>Sophie Petit</td>
                                <td>08/05/2023</td>
                                <td>45.20€</td>
                                <td><span class="status-badge completed">Livré</span></td>
                                <td><button class="btn-sm">Détails</button></td>
                            </tr>
                            <tr>
                                <td>#1838</td>
                                <td>Thomas Dubois</td>
                                <td>08/05/2023</td>
                                <td>310.00€</td>
                                <td><span class="status-badge cancelled">Annulé</span></td>
                                <td><button class="btn-sm">Détails</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function createContactWidget() {
    return `
        <div class="widget" data-size="medium">
            <div class="widget-header">
                <h3>Contact rapide</h3>
                <div class="widget-controls">
                    <button class="toggle-size" title="Redimensionner"><i class="fas fa-expand-alt"></i></button>
                    <button class="toggle-view" title="Vue compacte"><i class="fas fa-compress"></i></button>
                    <button class="remove-widget" title="Supprimer"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <div class="widget-content">
                <form id="quick-contact-form">
                    <div class="form-group">
                        <label for="contact-client">Client</label>
                        <select id="contact-client" name="contact-client">
                            <option value="">Sélectionnez un client</option>
                            <option value="1">Jean Dupont</option>
                            <option value="2">Marie Martin</option>
                            <option value="3">Paul Bernard</option>
                            <option value="4">Sophie Petit</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="contact-subject">Sujet</label>
                        <input type="text" id="contact-subject" name="contact-subject" placeholder="Sujet du message">
                    </div>
                    <div class="form-group">
                        <label for="contact-message">Message</label>
                        <textarea id="contact-message" name="contact-message" rows="4" placeholder="Votre message"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn">Envoyer</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Fonction pour démarrer le cycle de mise à jour des widgets
function startWidgetUpdates() {
    console.log('Démarrage des mises à jour des widgets');
    
    // Définir les intervalles de mise à jour pour différents widgets
    const updateIntervals = {
        'stats-users': 60000,     // 1 minute
        'stats-sales': 30000,     // 30 secondes
        'stats-visits': 45000,    // 45 secondes
        'stats-revenue': 120000,  // 2 minutes
        'sales-chart': 300000,    // 5 minutes
        'recent-orders': 60000    // 1 minute
    };
    
    // Pour chaque type de widget, configurer une mise à jour périodique
        Object.entries(updateIntervals).forEach(([widgetType, interval]) => {
            setInterval(() => updateWidget(widgetType), interval);
        });
    }
