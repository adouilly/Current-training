/**
 * Module de rafraîchissement des widgets
 * Permet de mettre à jour les données des widgets
 */
const WidgetRefresh = (function() {
    /**
     * Rafraîchir un widget spécifique
     * @param {HTMLElement} widget - Le widget à rafraîchir
     */
    function refreshWidget(widget) {
        if (!widget) return;
        
        // Ajouter une classe pour indiquer le chargement
        widget.classList.add('loading');
        
        console.log(`Rafraîchissement du widget ${widget.id}`);
        
        // Simuler un chargement asynchrone
        setTimeout(() => {
            // Identifier le type de widget
            if (widget.classList.contains('stats-widget')) {
                refreshStatsWidget(widget);
            } else if (widget.classList.contains('chart-widget')) {
                refreshChartWidget(widget);
            } else if (widget.classList.contains('table-widget')) {
                refreshTableWidget(widget);
            } else if (widget.classList.contains('kpi-widget')) {
                refreshKpiWidget(widget);
            } else if (widget.classList.contains('notifications-widget')) {
                refreshNotificationsWidget(widget);
            } else if (widget.classList.contains('form-widget')) {
                refreshFormWidget(widget);
            }
            
            // Mettre à jour le résumé du widget
            updateWidgetSummary(widget);
            
            // Enlever la classe de chargement
            widget.classList.remove('loading');
            
            console.log(`Widget ${widget.id} rafraîchi`);
        }, 1500); // Simule un délai de chargement de 1.5 secondes
    }
    
    /**
     * Rafraîchir un widget de statistiques
     * @param {HTMLElement} widget - Le widget de statistiques
     */
    function refreshStatsWidget(widget) {
        const stats = refreshStatsData();
        
        // Mettre à jour les valeurs dans les cartes de statistiques
        updateStatCard(widget, 'Utilisateurs', stats.users.value, stats.users.evolution, stats.users.positive);
        updateStatCard(widget, 'Ventes', stats.sales.value, stats.sales.evolution, stats.sales.positive);
        updateStatCard(widget, 'Visites', stats.visits.value, stats.visits.evolution, stats.visits.positive);
        updateStatCard(widget, 'Revenus', stats.revenue.value, stats.revenue.evolution, stats.revenue.positive);
        
        // Mettre à jour le résumé du widget
        updateStatsWidgetSummary(widget, stats);
    }
    
    /**
     * Mettre à jour une carte de statistique
     */
    function updateStatCard(widget, title, value, evolution, positive) {
        const card = widget.querySelector(`.stat-card:has(.stat-title:contains('${title}'))`);
        if (!card) return;
        
        // Mettre à jour la valeur
        const valueElem = card.querySelector('.stat-value');
        if (valueElem) valueElem.textContent = value;
        
        // Mettre à jour l'évolution
        const evolutionElem = card.querySelector('.stat-evolution');
        if (evolutionElem) {
            evolutionElem.textContent = evolution;
            evolutionElem.classList.toggle('positive', positive);
            evolutionElem.classList.toggle('negative', !positive);
            
            const icon = evolutionElem.querySelector('i');
            if (icon) {
                icon.className = positive ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
            }
        }
    }
    
    /**
     * Rafraîchir un widget de graphique
     * @param {HTMLElement} widget - Le widget de graphique
     */
    function refreshChartWidget(widget) {
        const chartCanvas = widget.querySelector('canvas');
        if (!chartCanvas || !window.Chart) return;
        
        const chart = Chart.getChart(chartCanvas);
        if (!chart) return;
        
        // Déterminer la période active
        const activePeriodBtn = widget.querySelector('.chart-period-option.active');
        const period = activePeriodBtn ? activePeriodBtn.getAttribute('data-period') : 'month';
        
        // Obtenir de nouvelles données
        const newData = refreshChartData('sales', period);
        
        // Mettre à jour le graphique
        chart.data = newData;
        chart.update();
    }
    
    /**
     * Rafraîchir un widget de tableau
     * @param {HTMLElement} widget - Le widget de tableau
     */
    function refreshTableWidget(widget) {
        // Mélanger les commandes existantes (simulation)
        const orders = shuffleOrders();
        
        // Mettre à jour le tableau
        const tableBody = widget.querySelector('tbody');
        if (!tableBody) return;
        
        // Vider le tableau
        tableBody.innerHTML = '';
        
        // Remplir avec les nouvelles données
        orders.slice(0, 5).forEach(order => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>${order.amount}</td>
                <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Mettre à jour le résumé
        updateTableWidgetSummary(widget);
    }
    
    /**
     * Rafraîchir un widget de KPIs
     * @param {HTMLElement} widget - Le widget de KPIs
     */
    function refreshKpiWidget(widget) {
        // Générer des valeurs aléatoires
        const satisfaction = Math.floor(Math.random() * 10) + 90; // Entre 90 et 99
        const avgTime = Math.floor(Math.random() * 30) + 10; // Entre 10 et 39
        const users = (Math.floor(Math.random() * 20) + 5).toFixed(1); // Entre 5.0 et 24.9
        
        // Mettre à jour les valeurs
        updateKpiValue(widget, 'Satisfaction', `${satisfaction}%`);
        updateKpiValue(widget, 'Temps moyen', `${avgTime}min`);
        updateKpiValue(widget, 'Utilisateurs actifs', `${users}K`);
    }
    
    /**
     * Mettre à jour une valeur KPI
     */
    function updateKpiValue(widget, title, value) {
        const card = widget.querySelector(`.kpi-card:has(.kpi-title:contains('${title}'))`);
        if (!card) return;
        
        const valueElem = card.querySelector('.kpi-value');
        if (valueElem) valueElem.textContent = value;
    }
    
    /**
     * Rafraîchir le widget de notifications
     * @param {HTMLElement} widget - Le widget de notifications
     */
    function refreshNotificationsWidget(widget) {
        const notificationsList = widget.querySelector('.notification-list');
        if (!notificationsList) return;
        
        // Vider la liste
        notificationsList.innerHTML = '';
        
        // Générer de nouvelles notifications
        const notifications = [
            { icon: 'user', text: 'Nouvel utilisateur inscrit', time: 'Il y a 2 minutes' },
            { icon: 'shopping-cart', text: 'Nouvelle commande reçue', time: 'Il y a 10 minutes' },
            { icon: 'bell', text: 'Rappel de réunion', time: 'Dans 30 minutes' }
        ];
        
        // Ajouter les notifications
        notifications.forEach(notif => {
            const item = document.createElement('li');
            item.className = 'notification-item';
            
            item.innerHTML = `
                <span class="notification-icon"><i class="fas fa-${notif.icon}"></i></span>
                <div class="notification-content">
                    <div class="notification-text">${notif.text}</div>
                    <div class="notification-time">${notif.time}</div>
                </div>
            `;
            
            notificationsList.appendChild(item);
        });
    }
    
    /**
     * Rafraîchir le widget de formulaire
     * @param {HTMLElement} widget - Le widget de formulaire
     */
    function refreshFormWidget(widget) {
        // Pour le formulaire, on vide simplement les champs
        const form = widget.querySelector('form');
        if (form) form.reset();
    }
    
    /**
     * Mettre à jour le résumé du widget
     * @param {HTMLElement} widget - Le widget à mettre à jour
     */
    function updateWidgetSummary(widget) {
        if (widget.classList.contains('stats-widget')) {
            updateStatsWidgetSummary(widget);
        } else if (widget.classList.contains('chart-widget')) {
            updateChartWidgetSummary(widget);
        } else if (widget.classList.contains('table-widget')) {
            updateTableWidgetSummary(widget);
        } else if (widget.classList.contains('kpi-widget')) {
            updateKpiWidgetSummary(widget);
        } else if (widget.classList.contains('notifications-widget')) {
            updateNotificationsWidgetSummary(widget);
        } else if (widget.classList.contains('form-widget')) {
            updateFormWidgetSummary(widget);
        }
    }
    
    /**
     * Mettre à jour le résumé du widget de statistiques
     */
    function updateStatsWidgetSummary(widget, stats) {
        const summary = widget.querySelector('.widget-summary');
        if (!summary) return;
        
        // Si des statistiques ne sont pas fournies, les extraire du widget
        if (!stats) {
            stats = {
                users: {
                    value: widget.querySelector('.stat-card:nth-child(1) .stat-value').textContent,
                    evolution: widget.querySelector('.stat-card:nth-child(1) .stat-evolution').textContent
                },
                sales: {
                    value: widget.querySelector('.stat-card:nth-child(2) .stat-value').textContent,
                    evolution: widget.querySelector('.stat-card:nth-child(2) .stat-evolution').textContent
                },
                visits: {
                    value: widget.querySelector('.stat-card:nth-child(3) .stat-value').textContent,
                    evolution: widget.querySelector('.stat-card:nth-child(3) .stat-evolution').textContent
                },
                revenue: {
                    value: widget.querySelector('.stat-card:nth-child(4) .stat-value').textContent,
                    evolution: widget.querySelector('.stat-card:nth-child(4) .stat-evolution').textContent
                }
            };
        }
        
        // Mettre à jour les éléments du résumé
        const items = summary.querySelectorAll('.widget-summary-item');
        if (items.length >= 4) {
            items[0].querySelector('.widget-summary-value').textContent = stats.users.value;
            items[1].querySelector('.widget-summary-value').textContent = stats.sales.value;
            items[2].querySelector('.widget-summary-value').textContent = stats.visits.value;
            items[3].querySelector('.widget-summary-value').textContent = stats.revenue.value;
        }
    }
    
    /**
     * Mettre à jour le résumé du widget de graphique
     */
    function updateChartWidgetSummary(widget) {
        const summary = widget.querySelector('.widget-summary');
        if (!summary) return;
        
        // Générer des statistiques aléatoires
        const trend = ((Math.random() * 30) - 5).toFixed(1);
        const average = (Math.random() * 100).toFixed(1);
        
        // Mettre à jour le résumé
        const items = summary.querySelectorAll('.widget-summary-item');
        if (items.length >= 2) {
            const trendValue = items[0].querySelector('.widget-summary-value');
            trendValue.innerHTML = `<i class="fas fa-${trend > 0 ? 'arrow-up' : 'arrow-down'}"></i> ${trend > 0 ? '+' : ''}${trend}%`;
            
            items[1].querySelector('.widget-summary-value').textContent = average;
        }
    }
    
    /**
     * Mettre à jour le résumé du widget de tableau
     */
    function updateTableWidgetSummary(widget) {
        const summary = widget.querySelector('.widget-summary');
        if (!summary) return;
        
        // Récupérer les données de la première ligne
        const firstRow = widget.querySelector('tbody tr:first-child');
        if (!firstRow) return;
        
        const cells = firstRow.querySelectorAll('td');
        if (cells.length < 5) return;
        
        const customer = cells[1].textContent;
        const amount = cells[3].textContent;
        const status = cells[4].textContent;
        
        // Compter les lignes
        const rowCount = widget.querySelectorAll('tbody tr').length;
        
        // Mettre à jour le résumé
        summary.innerHTML = `<span>${rowCount} commandes récentes, dernière: ${customer} (${amount}) - Statut: ${status}</span>`;
    }
    
    /**
     * Mettre à jour le résumé du widget de KPIs
     */
    function updateKpiWidgetSummary(widget) {
        const summary = widget.querySelector('.widget-summary');
        if (!summary) return;
        
        // Récupérer les valeurs des KPIs
        const kpiValues = widget.querySelectorAll('.kpi-value');
        if (kpiValues.length < 3) return;
        
        // Mettre à jour les éléments du résumé
        const items = summary.querySelectorAll('.widget-summary-item');
        if (items.length >= 3) {
            items[0].querySelector('.widget-summary-value').textContent = kpiValues[0].textContent;
            items[1].querySelector('.widget-summary-value').textContent = kpiValues[1].textContent;
            items[2].querySelector('.widget-summary-value').textContent = kpiValues[2].textContent;
        }
    }
    
    /**
     * Mettre à jour le résumé du widget de notifications
     */
    function updateNotificationsWidgetSummary(widget) {
        const summary = widget.querySelector('.widget-summary');
        if (!summary) return;
        
        // Compter les notifications
        const notifCount = widget.querySelectorAll('.notification-item').length;
        
        // Récupérer les temps des deux premières notifications
        const notifTimes = widget.querySelectorAll('.notification-time');
        const times = [];
        for (let i = 0; i < Math.min(notifTimes.length, 2); i++) {
            const text = notifTimes[i].textContent;
            times.push(text.replace('Il y a ', '').replace('Dans ', ''));
        }
        
        // Mettre à jour le résumé
        summary.innerHTML = `<span>${notifCount} nouvelles notifications ${times.length ? `(${times.join(', ')})` : ''}</span>`;
    }
    
    /**
     * Mettre à jour le résumé du widget de formulaire
     */
    function updateFormWidgetSummary(widget) {
        const summary = widget.querySelector('.widget-summary');
        if (!summary) return;
        
        // Générer un nombre aléatoire de messages
        const messageCount = Math.floor(Math.random() * 10);
        
        // Mettre à jour le résumé
        summary.innerHTML = `<span>Formulaire de contact rapide - ${messageCount} messages reçus aujourd'hui</span>`;
    }
    
    // Exposer l'API publique
    return {
        refreshWidget: refreshWidget,
        updateStatsWidgetSummary: updateStatsWidgetSummary,
        updateTableWidgetSummary: updateTableWidgetSummary
    };
})();

// Assurer que l'objet est disponible globalement
window.WidgetRefresh = WidgetRefresh;
