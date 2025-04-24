// Module pour la gestion des widgets (ajout, suppression)

const WidgetManager = {
    // Initialiser le système d'ajout/suppression de widgets
    init: function() {
        console.log("Initialisation du module de gestion des widgets");
        
        // Ajouter des boutons de suppression à TOUS les widgets existants
        document.querySelectorAll('.widget').forEach(this.addDeleteButton);
        
        // Configuration du bouton d'ajout et de la modale
        this.setupAddWidgetModal();
    },
    
    // Configurer la modale d'ajout de widget
    setupAddWidgetModal: function() {
        const addWidgetBtn = document.getElementById('add-widget-btn');
        const modal = document.getElementById('add-widget-modal');
        const modalOverlay = document.getElementById('modal-overlay');
        const closeModalBtn = document.querySelector('.close-modal-btn');
        
        // Ouvrir la modale
        if (addWidgetBtn && modal && modalOverlay) {
            addWidgetBtn.addEventListener('click', function() {
                modal.classList.add('show');
                modalOverlay.classList.add('show');
            });
            
            console.log("Bouton d'ajout de widget configuré");
        } else {
            console.warn("Éléments manquants pour l'ajout de widgets");
        }
        
        // Fermer la modale
        if (closeModalBtn && modal && modalOverlay) {
            closeModalBtn.addEventListener('click', function() {
                modal.classList.remove('show');
                modalOverlay.classList.remove('show');
            });
            
            modalOverlay.addEventListener('click', function() {
                modal.classList.remove('show');
                modalOverlay.classList.remove('show');
            });
        }
        
        // Sélectionner un type de widget
        const widgetTypeCards = document.querySelectorAll('.widget-type-card');
        if (widgetTypeCards && modal && modalOverlay) {
            widgetTypeCards.forEach(card => {
                card.addEventListener('click', function() {
                    const widgetType = this.getAttribute('data-widget-type');
                    console.log(`Tentative d'ajout d'un widget de type: ${widgetType}`);
                    
                    // Vérifier si ce type de widget existe déjà
                    const existingWidget = WidgetManager.checkIfWidgetTypeExists(widgetType);
                    
                    if (existingWidget) {
                        console.log(`Widget de type ${widgetType} déjà présent - mise en évidence`);
                        // Fermer la modale
                        modal.classList.remove('show');
                        modalOverlay.classList.remove('show');
                        
                        // Afficher la notification
                        WidgetManager.showWidgetExistsNotification(widgetType);
                        
                        // Animation pour montrer que le widget existe déjà
                        existingWidget.classList.add('widget-exists');
                        setTimeout(() => {
                            existingWidget.classList.remove('widget-exists');
                        }, 3000);
                        
                        // Faire défiler vers le widget
                        existingWidget.scrollIntoView({behavior: 'smooth', block: 'center'});
                    } else {
                        // Si le widget n'existe pas, l'ajouter
                        console.log(`Ajout d'un nouveau widget de type: ${widgetType}`);
                        WidgetManager.addNewWidget(widgetType);
                        modal.classList.remove('show');
                        modalOverlay.classList.remove('show');
                    }
                });
            });
        }
    },
    
    // Vérifier si un widget du type spécifié existe déjà
    checkIfWidgetTypeExists: function(widgetType) {
        const dashboardContainer = document.querySelector('.dashboard-container');
        if (!dashboardContainer) return false;
        
        // Correspondance entre les types et les sélecteurs
        const typeSelectors = {
            'stats': '.stats-widget',
            'chart': '.chart-widget',
            'table': '.table-widget',
            'form': '.form-widget',
            'kpi': '.kpi-widget',
            'notifications': '.notifications-widget'
        };
        
        // Si le type existe dans nos mappings, vérifier s'il est présent
        if (typeSelectors[widgetType]) {
            const existing = dashboardContainer.querySelector(typeSelectors[widgetType]);
            return existing; // Renvoie l'élément s'il existe, sinon null
        }
        
        return null; // Type non reconnu
    },
    
    // Ajouter un bouton de suppression à un widget
    addDeleteButton: function(widget) {
        // Vérifier si un bouton de suppression existe déjà
        if (widget.querySelector('.delete-widget-btn')) {
            return;
        }
        
        const widgetHeaderActions = widget.querySelector('.widget-header-actions');
        
        if (widgetHeaderActions) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-widget-btn';
            deleteBtn.title = 'Supprimer ce widget';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (confirm('Voulez-vous vraiment supprimer ce widget ?')) {
                    widget.remove();
                    console.log(`Widget ${widget.id} supprimé`);
                }
            });
            
            // Insérer en première position
            widgetHeaderActions.insertBefore(deleteBtn, widgetHeaderActions.firstChild);
            console.log(`Bouton de suppression ajouté au widget: ${widget.id}`);
        } else {
            console.warn(`Widget ${widget.id || 'inconnu'} n'a pas d'en-tête pour les actions`);
        }
    },
    
    // Ajouter un nouveau widget
    addNewWidget: function(widgetType) {
        const dashboardContainer = document.querySelector('.dashboard-container');
        if (!dashboardContainer) {
            console.error("Container du dashboard non trouvé");
            return;
        }
        
        // Vérifier que ce type de widget n'existe pas déjà
        if (this.checkIfWidgetTypeExists(widgetType)) {
            console.warn(`Widget de type ${widgetType} déjà présent - ajout annulé`);
            return;
        }
        
        const widgetId = `${widgetType}-widget-${Date.now()}`;
        
        let widgetHTML = '';
        
        switch(widgetType) {
            case 'stats':
                widgetHTML = `
                    <div class="widget stats-widget" id="${widgetId}">
                        <div class="widget-header">
                            <h2><i class="fas fa-chart-bar"></i> Statistiques</h2>
                            <div class="widget-header-actions">
                                <button class="delete-widget-btn" title="Supprimer ce widget"><i class="fas fa-trash-alt"></i></button>
                                <button class="toggle-compact-btn" title="Mode compact"><i class="fas fa-compress-alt"></i></button>
                                <button class="refresh-btn" title="Rafraîchir"><i class="fas fa-sync-alt"></i></button>
                            </div>
                        </div>
                        <div class="widget-summary">
                            <div class="widget-summary-item">
                                <i class="fas fa-users"></i>
                                <span class="widget-summary-value">1,254</span>
                            </div>
                            <div class="widget-summary-item">
                                <i class="fas fa-shopping-bag"></i>
                                <span class="widget-summary-value">854</span>
                            </div>
                            <div class="widget-summary-item">
                                <i class="fas fa-chart-line"></i>
                                <span class="widget-summary-value">7,842</span>
                            </div>
                            <div class="widget-summary-item">
                                <i class="fas fa-money-bill-wave"></i>
                                <span class="widget-summary-value">9,854 €</span>
                            </div>
                        </div>
                        <div class="widget-body">
                            <div class="stats-grid">
                                <div class="stat-card">
                                    <div class="stat-card-header">
                                        <div class="stat-icon" style="background-color: rgba(33, 150, 243, 0.1); color: var(--info);">
                                            <i class="fas fa-users"></i>
                                        </div>
                                        <div class="stat-title">Utilisateurs</div>
                                    </div>
                                    <div class="stat-value">1,254</div>
                                    <div class="stat-evolution positive">
                                        <i class="fas fa-arrow-up"></i> +12.5%
                                    </div>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-card-header">
                                        <div class="stat-icon" style="background-color: rgba(76, 175, 80, 0.1); color: var(--success);">
                                            <i class="fas fa-shopping-bag"></i>
                                        </div>
                                        <div class="stat-title">Ventes</div>
                                    </div>
                                    <div class="stat-value">854</div>
                                    <div class="stat-evolution positive">
                                        <i class="fas fa-arrow-up"></i> +8.2%
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="resize-handle"></div>
                    </div>
                `;
                break;
            case 'chart':
                widgetHTML = `
                    <div class="widget chart-widget" id="${widgetId}">
                        <div class="widget-header">
                            <h2><i class="fas fa-chart-line"></i> Ventes mensuelles</h2>
                            <div class="widget-header-actions">
                                <button class="delete-widget-btn" title="Supprimer ce widget"><i class="fas fa-trash-alt"></i></button>
                                <button class="toggle-compact-btn" title="Mode compact"><i class="fas fa-compress-alt"></i></button>
                                <button class="refresh-btn" title="Rafraîchir"><i class="fas fa-sync-alt"></i></button>
                            </div>
                        </div>
                        <div class="widget-summary">
                            <div class="widget-summary-item">
                                <span>Tendance:</span>
                                <span class="widget-summary-value"><i class="fas fa-arrow-up"></i> +15.3%</span>
                            </div>
                            <div class="widget-summary-item">
                                <span>Moyenne:</span>
                                <span class="widget-summary-value">62.4</span>
                            </div>
                        </div>
                        <div class="widget-body">
                            <div class="chart-controls">
                                <div class="chart-period-selector">
                                    <button class="chart-period-option active" data-period="month">Mois</button>
                                    <button class="chart-period-option" data-period="quarter">Trimestre</button>
                                    <button class="chart-period-option" data-period="year">Année</button>
                                </div>
                            </div>
                            <div class="chart-container">
                                <canvas id="chart-${Date.now()}"></canvas>
                            </div>
                        </div>
                        <div class="resize-handle"></div>
                    </div>
                `;
                break;
            case 'table':
                widgetHTML = `
                    <div class="widget table-widget" id="${widgetId}">
                        <div class="widget-header">
                            <h2><i class="fas fa-table"></i> Dernières commandes</h2>
                            <div class="widget-header-actions">
                                <button class="delete-widget-btn" title="Supprimer ce widget"><i class="fas fa-trash-alt"></i></button>
                                <button class="toggle-compact-btn" title="Mode compact"><i class="fas fa-compress-alt"></i></button>
                                <button class="refresh-btn" title="Rafraîchir"><i class="fas fa-sync-alt"></i></button>
                            </div>
                        </div>
                        <div class="widget-summary">
                            <span>5 commandes récentes</span>
                        </div>
                        <div class="widget-body">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Client</th>
                                        <th>Date</th>
                                        <th>Montant</th>
                                        <th>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- Les données seront ajoutées par JS -->
                                </tbody>
                            </table>
                        </div>
                        <div class="resize-handle"></div>
                    </div>
                `;
                break;
            case 'form':
                widgetHTML = `
                    <div class="widget form-widget" id="${widgetId}">
                        <div class="widget-header">
                            <h2><i class="fas fa-envelope"></i> Contact rapide</h2>
                            <div class="widget-header-actions">
                                <button class="delete-widget-btn" title="Supprimer ce widget"><i class="fas fa-trash-alt"></i></button>
                                <button class="toggle-compact-btn" title="Mode compact"><i class="fas fa-compress-alt"></i></button>
                                <button class="refresh-btn" title="Rafraîchir"><i class="fas fa-sync-alt"></i></button>
                            </div>
                        </div>
                        <div class="widget-summary">
                            <span>Formulaire de contact - 0 messages reçus aujourd'hui</span>
                        </div>
                        <div class="widget-body">
                            <form class="contact-form">
                                <div class="form-group">
                                    <label for="name-${Date.now()}">Nom</label>
                                    <input type="text" id="name-${Date.now()}" required>
                                </div>
                                <div class="form-group">
                                    <label for="email-${Date.now()}">Email</label>
                                    <input type="email" id="email-${Date.now()}" required>
                                </div>
                                <div class="form-group">
                                    <label for="message-${Date.now()}">Message</label>
                                    <textarea id="message-${Date.now()}" rows="3" required></textarea>
                                </div>
                                <button type="submit">Envoyer</button>
                            </form>
                        </div>
                        <div class="resize-handle"></div>
                    </div>
                `;
                break;
            case 'kpi':
                widgetHTML = `
                    <div class="widget kpi-widget" id="${widgetId}">
                        <div class="widget-header">
                            <h2><i class="fas fa-tachometer-alt"></i> KPI</h2>
                            <div class="widget-header-actions">
                                <button class="delete-widget-btn" title="Supprimer ce widget"><i class="fas fa-trash-alt"></i></button>
                                <button class="toggle-compact-btn" title="Mode compact"><i class="fas fa-compress-alt"></i></button>
                                <button class="refresh-btn" title="Rafraîchir"><i class="fas fa-sync-alt"></i></button>
                            </div>
                        </div>
                        <div class="widget-summary">
                            <div class="widget-summary-item">
                                <span>Satisfaction:</span>
                                <span class="widget-summary-value">98%</span>
                            </div>
                            <div class="widget-summary-item">
                                <span>Temps moyen:</span>
                                <span class="widget-summary-value">24min</span>
                            </div>
                            <div class="widget-summary-item">
                                <span>Utilisateurs:</span>
                                <span class="widget-summary-value">14.2K</span>
                            </div>
                        </div>
                        <div class="widget-body">
                            <div class="kpi-grid">
                                <div class="kpi-card">
                                    <div class="kpi-value">98%</div>
                                    <div class="kpi-title">Satisfaction</div>
                                </div>
                                <div class="kpi-card">
                                    <div class="kpi-value">24min</div>
                                    <div class="kpi-title">Temps moyen</div>
                                </div>
                                <div class="kpi-card">
                                    <div class="kpi-value">14.2K</div>
                                    <div class="kpi-title">Utilisateurs actifs</div>
                                </div>
                            </div>
                        </div>
                        <div class="resize-handle"></div>
                    </div>
                `;
                break;
            case 'notifications':
                widgetHTML = `
                    <div class="widget notifications-widget" id="${widgetId}">
                        <div class="widget-header">
                            <h2><i class="fas fa-bell"></i> Notifications</h2>
                            <div class="widget-header-actions">
                                <button class="delete-widget-btn" title="Supprimer ce widget"><i class="fas fa-trash-alt"></i></button>
                                <button class="toggle-compact-btn" title="Mode compact"><i class="fas fa-compress-alt"></i></button>
                                <button class="refresh-btn" title="Rafraîchir"><i class="fas fa-sync-alt"></i></button>
                            </div>
                        </div>
                        <div class="widget-summary">
                            <span>2 nouvelles notifications non lues</span>
                        </div>
                        <div class="widget-body">
                            <ul class="notification-list">
                                <li class="notification-item">
                                    <span class="notification-icon"><i class="fas fa-user"></i></span>
                                    <div class="notification-content">
                                        <div class="notification-text">Nouvel utilisateur inscrit</div>
                                        <div class="notification-time">Il y a 5 minutes</div>
                                    </div>
                                </li>
                                <li class="notification-item">
                                    <span class="notification-icon"><i class="fas fa-shopping-cart"></i></span>
                                    <div class="notification-content">
                                        <div class="notification-text">Nouvelle commande reçue</div>
                                        <div class="notification-time">Il y a 20 minutes</div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="resize-handle"></div>
                    </div>
                `;
                break;
            default:
                widgetHTML = `
                    <div class="widget" id="${widgetId}">
                        <div class="widget-header">
                            <h2><i class="fas fa-cube"></i> Nouveau Widget</h2>
                            <div class="widget-header-actions">
                                <button class="delete-widget-btn" title="Supprimer ce widget"><i class="fas fa-trash-alt"></i></button>
                                <button class="toggle-compact-btn" title="Mode compact"><i class="fas fa-compress-alt"></i></button>
                                <button class="refresh-btn" title="Rafraîchir"><i class="fas fa-sync-alt"></i></button>
                            </div>
                        </div>
                        <div class="widget-summary">
                            <span>Widget créé à ${new Date().toLocaleTimeString()}</span>
                        </div>
                        <div class="widget-body">
                            <p>Contenu du widget...</p>
                        </div>
                        <div class="resize-handle"></div>
                    </div>
                `;
        }
        
        // Ajouter le widget au DOM
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = widgetHTML;
        const newWidget = tempContainer.firstElementChild;
        dashboardContainer.appendChild(newWidget);
        
        // Initialiser les fonctionnalités pour ce widget
        this.initNewWidgetFunctions(newWidget, widgetType);
        
        return newWidget;
    },
    
    // Initialise les fonctionnalités du nouveau widget
    initNewWidgetFunctions: function(widget, widgetType) {
        // Initialiser les boutons
        const refreshBtn = widget.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function() {
                if (typeof WidgetRefresh !== 'undefined') {
                    WidgetRefresh.refreshWidget(widget);
                }
            });
        }
        
        const toggleBtn = widget.querySelector('.toggle-compact-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                widget.classList.toggle('compact');
                
                // Mettre à jour l'icône
                const icon = this.querySelector('i');
                if (widget.classList.contains('compact')) {
                    icon.classList.remove('fa-compress-alt');
                    icon.classList.add('fa-expand-alt');
                    this.title = "Mode étendu";
                } else {
                    icon.classList.remove('fa-expand-alt');
                    icon.classList.add('fa-compress-alt');
                    this.title = "Mode compact";
                }
                
                // Redimensionner le graphique si nécessaire
                if (widgetType === 'chart') {
                    const chartCanvas = widget.querySelector('canvas');
                    if (chartCanvas && window.Chart) {
                        const chart = Chart.getChart(chartCanvas);
                        if (chart) {
                            setTimeout(() => chart.resize(), 300);
                        }
                    }
                }
            });
        }
        
        // Si c'est un graphique, l'initialiser
        if (widgetType === 'chart') {
            const chartId = widget.querySelector('canvas')?.id;
            if (chartId && window.Chart) {
                setTimeout(() => {
                    const ctx = document.getElementById(chartId).getContext('2d');
                    new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
                            datasets: [{
                                label: 'Ventes',
                                data: [12, 19, 3, 5, 2, 3],
                                borderColor: '#3932BB',
                                backgroundColor: 'rgba(57, 50, 187, 0.1)',
                                tension: 0.4,
                                fill: true
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });
                }, 100);
            }
        }
        
        // Si c'est un tableau, le remplir
        if (widgetType === 'table') {
            setTimeout(() => {
                const tableBody = widget.querySelector('tbody');
                if (tableBody && typeof populateOrdersTable === 'function') {
                    populateOrdersTable();
                }
            }, 100);
        }
    },
    
    // Ajouter cette fonction à l'objet WidgetManager

    showWidgetExistsNotification: function(widgetType) {
        // Types de widgets traduits en français
        const widgetNames = {
            'stats': 'Statistiques',
            'chart': 'Graphique',
            'table': 'Tableau',
            'form': 'Formulaire',
            'kpi': 'KPI',
            'notifications': 'Notifications'
        };
        
        const widgetName = widgetNames[widgetType] || widgetType;
        
        // Créer une notification temporaire
        const notification = document.createElement('div');
        notification.className = 'widget-exists-notification';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>Le widget "${widgetName}" existe déjà</span>
        `;
        
        // Ajouter au DOM
        document.body.appendChild(notification);
        
        // Afficher avec animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Supprimer après un délai
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
        
        // Jouer un son d'alerte (optionnel)
        try {
            const audio = new Audio('data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAAGhgBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr///////////////////////////////////////////8AAAA5TEFNRTMuOTlyAc0AAAAAAAAAABSAJAJAQgAAgAAAAYaD1HQnAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQxAADwAABpAAAACAAADSAAAAETEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV');
            audio.volume = 0.3;
            audio.play().catch(e => console.log("Audio notification non autorisée"));
        } catch (e) {
            console.log("Notification sonore non supportée");
        }
    }
};
