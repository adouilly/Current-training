// Module pour les fonctionnalités de rafraîchissement des widgets

const WidgetRefresh = {
    // Rafraîchir un widget
    refreshWidget: function(widget) {
        // Animation de rotation pour l'icône de rafraîchissement
        const refreshIcon = widget.querySelector('.fa-sync-alt');
        if (refreshIcon) {
            refreshIcon.classList.add('fa-spin');
        }
        
        // Simuler un délai pour le rafraîchissement
        setTimeout(() => {
            const widgetId = widget.id;
            
            switch(widgetId) {
                case 'stats-widget':
                    this.refreshStatsWidget(widget);
                    break;
                    
                case 'chart-widget':
                    this.refreshChartWidget(widget);
                    break;
                    
                case 'table-widget':
                    // Utiliser la fonction du script principal
                    populateOrdersTable();
                    this.updateTableWidgetSummary(widget);
                    break;
                    
                case 'form-widget':
                    widget.querySelector('form')?.reset();
                    // Mettre à jour le message du résumé compact avec un nombre aléatoire
                    const messagesCount = Math.floor(Math.random() * 10);
                    widget.querySelector('.widget-summary span').textContent = 
                        `Formulaire de contact rapide - ${messagesCount} messages reçus aujourd'hui`;
                    break;
                    
                case 'kpi-widget':
                    this.refreshKPIWidget(widget);
                    break;
                    
                case 'notifications-widget':
                    this.refreshNotificationsWidget(widget);
                    // Mettre à jour le résumé des notifications
                    this.updateNotificationsSummary(widget);
                    break;
            }
            
            // Arrêter l'animation de rotation
            if (refreshIcon) {
                setTimeout(() => {
                    refreshIcon.classList.remove('fa-spin');
                }, 500);
            }
        }, 600);
    },
    
    // Fonctions de rafraîchissement des widgets
    refreshStatsWidget: function(widget) {
        // Générer les nouvelles valeurs
        const statValues = {
            users: Math.floor(Math.random() * 2000) + 500,
            sales: Math.floor(Math.random() * 1000) + 300, 
            visits: Math.floor(Math.random() * 8000) + 2000,
            revenue: Math.floor(Math.random() * 15000) + 5000
        };
        
        // Mettre à jour les valeurs dans le corps du widget
        const statValueElements = widget.querySelectorAll('.stat-value');
        if (statValueElements.length >= 4) {
            statValueElements[0].textContent = statValues.users.toLocaleString();
            statValueElements[1].textContent = statValues.sales.toLocaleString();
            statValueElements[2].textContent = statValues.visits.toLocaleString();
            statValueElements[3].textContent = statValues.revenue.toLocaleString() + ' €';
        }
        
        // Mettre à jour les valeurs dans le résumé compact
        const summaryValues = widget.querySelectorAll('.widget-summary .widget-summary-value');
        if (summaryValues.length >= 4) {
            summaryValues[0].textContent = statValues.users.toLocaleString();
            summaryValues[1].textContent = statValues.sales.toLocaleString();
            summaryValues[2].textContent = statValues.visits.toLocaleString();
            summaryValues[3].textContent = statValues.revenue.toLocaleString() + ' €';
        }
    },
    
    refreshChartWidget: function(widget) {
        const chartCanvas = widget.querySelector('canvas');
        if (chartCanvas && window.Chart) {
            const chart = Chart.getChart(chartCanvas);
            if (chart) {
                // Générer de nouvelles données aléatoires
                const newData = chart.data.datasets[0].data.map(() => 
                    Math.floor(Math.random() * 100) + 10
                );
                chart.data.datasets[0].data = newData;
                chart.update();
                
                // Calculer la moyenne et la tendance pour le résumé
                const average = newData.reduce((sum, val) => sum + val, 0) / newData.length;
                const trend = (newData[newData.length-1] - newData[0]) / newData[0] * 100;
                
                // Mettre à jour le résumé compact
                const summaryValues = widget.querySelectorAll('.widget-summary-value');
                if (summaryValues.length >= 2) {
                    const trendElement = summaryValues[0];
                    const averageElement = summaryValues[1];
                    
                    trendElement.innerHTML = trend >= 0 ? 
                        `<i class="fas fa-arrow-up"></i> +${trend.toFixed(1)}%` : 
                        `<i class="fas fa-arrow-down"></i> ${trend.toFixed(1)}%`;
                    
                    averageElement.textContent = average.toFixed(1);
                }
            }
        }
    },
    
    refreshKPIWidget: function(widget) {
        // Générer des valeurs aléatoires
        const newValues = {
            satisfaction: Math.floor(Math.random() * 30) + 70,
            time: Math.floor(Math.random() * 45) + 10,
            users: (Math.floor(Math.random() * 20) + 5).toFixed(1)
        };
        
        // Mettre à jour les valeurs dans le corps du widget
        const kpiValues = widget.querySelectorAll('.kpi-value');
        if (kpiValues.length >= 3) {
            kpiValues[0].textContent = `${newValues.satisfaction}%`;
            kpiValues[1].textContent = `${newValues.time}min`;
            kpiValues[2].textContent = `${newValues.users}K`;
        }
        
        // Mettre à jour les valeurs dans le résumé compact
        const summaryValues = widget.querySelectorAll('.widget-summary .widget-summary-value');
        if (summaryValues.length >= 3) {
            summaryValues[0].textContent = `${newValues.satisfaction}%`;
            summaryValues[1].textContent = `${newValues.time}min`;
            summaryValues[2].textContent = `${newValues.users}K`;
        }
    },
    
    refreshNotificationsWidget: function(widget) {
        const notificationTimes = widget.querySelectorAll('.notification-time');
        const times = [];
        
        if (notificationTimes.length) {
            notificationTimes.forEach(time => {
                const minutes = Math.floor(Math.random() * 60);
                times.push(minutes);
                time.textContent = `Il y a ${minutes} minutes`;
            });
        }
        
        // Mettre à jour le résumé compact
        this.updateNotificationsSummary(widget, times);
    },
    
    updateNotificationsSummary: function(widget, times = null) {
        if (!widget) return;
        
        if (!times) {
            times = [];
            const notificationTimes = widget.querySelectorAll('.notification-time');
            notificationTimes.forEach(el => {
                const text = el.textContent;
                const match = text.match(/\d+/);
                if (match) times.push(parseInt(match[0]));
            });
        }
        
        const count = times.length || 0;
        let summaryText;
        
        if (count === 0) {
            summaryText = "Aucune notification";
        } else {
            const timeStr = times.slice(0, 2).join('min, ') + 'min';
            summaryText = `${count} nouvelles notifications non lues (${timeStr})`;
        }
        
        const summaryEl = widget.querySelector('.widget-summary span');
        if (summaryEl) summaryEl.textContent = summaryText;
    },
    
    updateTableWidgetSummary: function(widget) {
        const tableRows = widget.querySelectorAll('.data-table tbody tr');
        let summaryText = "Aucune commande récente";
        
        if (tableRows.length > 0) {
            const firstRow = tableRows[0];
            const cells = firstRow.querySelectorAll('td');
            if (cells.length >= 5) {
                const customer = cells[1].textContent;
                const amount = cells[3].textContent;
                const status = cells[4].textContent;
                summaryText = `${tableRows.length} commandes récentes, dernière: ${customer} (${amount}) - Statut: ${status}`;
            }
        }
        
        const summaryEl = widget.querySelector('.widget-summary span');
        if (summaryEl) summaryEl.textContent = summaryText;
    }
};
