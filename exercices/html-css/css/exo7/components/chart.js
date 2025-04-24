// Gestionnaire des graphiques pour le tableau de bord
class DashboardCharts {
    constructor() {
        this.charts = {};
        this.initCharts();
    }
    
    // Initialiser tous les graphiques
    initCharts() {
        this.initPerformanceChart();
        this.initSalesChart();
    }
    
    // Initialiser le graphique de performance
    initPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;
        
        this.charts.performance = new Chart(ctx, {
            type: 'line',
            data: dashboardData.performance,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false,
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }
    
    // Initialiser le graphique des ventes
    initSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;
        
        this.charts.sales = new Chart(ctx, {
            type: 'line',
            data: dashboardData.salesMonthly.month,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false,
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
        
        // Ajouter les écouteurs pour le changement de période
        document.querySelectorAll('.chart-period-option').forEach(option => {
            option.addEventListener('click', e => {
                // Mettre à jour l'UI
                document.querySelectorAll('.chart-period-option').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                
                // Mettre à jour les données
                const period = e.target.getAttribute('data-period');
                this.updateSalesChart(period);
            });
        });
    }
    
    // Mettre à jour le graphique de ventes avec la période sélectionnée
    updateSalesChart(period) {
        if (!this.charts.sales) return;
        
        let chartData;
        switch(period) {
            case 'month':
                chartData = dashboardData.salesMonthly.month;
                break;
            case 'quarter':
                chartData = dashboardData.salesMonthly.quarter;
                break;
            case 'year':
                chartData = dashboardData.salesMonthly.year;
                break;
            default:
                chartData = dashboardData.salesMonthly.month;
        }
        
        this.charts.sales.data = chartData;
        this.charts.sales.update();
    }
    
    // Mettre à jour les données du graphique de performance
    updatePerformanceChart(newData) {
        if (!this.charts.performance) return;
        
        this.charts.performance.data = newData;
        this.charts.performance.update();
    }
    
    // Créer un nouveau graphique
    createChart(canvasId, type, data, options = {}) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return null;
        
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false,
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        };
        
        // Fusionner les options par défaut avec les options personnalisées
        const chartOptions = {...defaultOptions, ...options};
        
        // Créer et stocker le graphique
        const chartId = canvasId.replace('Chart', '');
        this.charts[chartId] = new Chart(ctx, {
            type: type,
            data: data,
            options: chartOptions
        });
        
        return this.charts[chartId];
    }
    
    // Détruire un graphique
    destroyChart(chartId) {
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
            delete this.charts[chartId];
            return true;
        }
        return false;
    }
    
    // Mettre à jour tous les graphiques avec des données aléatoires
    refreshAllCharts() {
        // Mettre à jour le graphique de performance
        if (this.charts.performance) {
            const newPerformanceData = refreshChartData('performance');
            this.updatePerformanceChart(newPerformanceData);
        }
        
        // Mettre à jour le graphique des ventes
        if (this.charts.sales) {
            const activePeriod = document.querySelector('.chart-period-option.active');
            const period = activePeriod ? activePeriod.getAttribute('data-period') : 'month';
            const newSalesData = refreshChartData('sales', period);
            
            this.charts.sales.data = newSalesData;
            this.charts.sales.update();
        }
    }

    // Initialiser un seul graphique
    initSingleChart(canvasId, chartType = 'line', data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return null;
        
        const ctx = canvas.getContext('2d');
        
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false,
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        };
        
        const chart = new Chart(ctx, {
            type: chartType,
            data: data,
            options: options
        });
        
        const chartName = canvasId.replace('chart-', '');
        this.charts[chartName] = chart;
        
        return chart;
    }
}
