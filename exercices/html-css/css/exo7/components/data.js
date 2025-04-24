// Données pour les graphiques et tableaux
const dashboardData = {
    // Données pour le graphique de performance
    performance: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
        datasets: [
            {
                label: 'Ventes',
                data: [65, 59, 80, 81, 56, 55, 72],
                borderColor: '#3932BB',
                backgroundColor: 'rgba(57, 50, 187, 0.1)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Visites',
                data: [28, 48, 40, 19, 86, 27, 90],
                borderColor: '#433F91',
                backgroundColor: 'rgba(67, 63, 145, 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    },
    
    // Données pour le graphique de ventes mensuelles
    salesMonthly: {
        month: {
            labels: ['1', '5', '10', '15', '20', '25', '30'],
            datasets: [
                {
                    label: 'Ventes',
                    data: [12, 19, 13, 25, 24, 35, 32],
                    borderColor: '#3932BB',
                    backgroundColor: 'rgba(57, 50, 187, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        quarter: {
            labels: ['Jan', 'Fév', 'Mar'],
            datasets: [
                {
                    label: 'Ventes',
                    data: [125, 130, 145],
                    borderColor: '#3932BB',
                    backgroundColor: 'rgba(57, 50, 187, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        year: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
            datasets: [
                {
                    label: 'Ventes',
                    data: [65, 59, 80, 81, 56, 55, 72, 74, 83, 90, 95, 110],
                    borderColor: '#3932BB',
                    backgroundColor: 'rgba(57, 50, 187, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        }
    },
    
    // Données pour le tableau des commandes
    orders: [
        { id: 'ORD-001', customer: 'Sophie Martin', date: '2023-05-15', amount: '125.99 €', status: 'active' },
        { id: 'ORD-002', customer: 'Thomas Dubois', date: '2023-05-14', amount: '89.50 €', status: 'pending' },
        { id: 'ORD-003', customer: 'Émilie Leroy', date: '2023-05-14', amount: '246.75 €', status: 'active' },
        { id: 'ORD-004', customer: 'Lucas Moreau', date: '2023-05-13', amount: '59.99 €', status: 'inactive' },
        { id: 'ORD-005', customer: 'Chloé Lefebvre', date: '2023-05-12', amount: '199.00 €', status: 'active' },
        { id: 'ORD-006', customer: 'Hugo Bernard', date: '2023-05-11', amount: '149.99 €', status: 'pending' },
        { id: 'ORD-007', customer: 'Léa Petit', date: '2023-05-10', amount: '79.90 €', status: 'active' }
    ],
    
    // Statistiques générales
    stats: {
        users: {
            value: 1254,
            evolution: '+12.5%',
            positive: true
        },
        sales: {
            value: 854,
            evolution: '+8.2%',
            positive: true
        },
        visits: {
            value: 7842,
            evolution: '+24.6%',
            positive: true
        },
        revenue: {
            value: '9,854 €',
            evolution: '-2.4%',
            positive: false
        }
    },
    
    // Modèles de widgets
    widgetTemplates: {
        stats: {
            title: 'Statistiques',
            icon: 'chart-bar',
            size: 3,
            height: 1,
            config: {
                showUsers: true,
                showSales: true,
                showVisits: true,
                showRevenue: true
            }
        },
        chart: {
            title: 'Ventes mensuelles',
            icon: 'chart-line',
            size: 3,
            height: 2,
            config: {
                chartType: 'line',
                periods: ['month', 'quarter', 'year'],
                defaultPeriod: 'month'
            }
        },
        table: {
            title: 'Dernières commandes',
            icon: 'table',
            size: 4,
            height: 2,
            config: {
                columns: ['id', 'customer', 'date', 'amount', 'status', 'actions'],
                rowsPerPage: 5,
                showPagination: true
            }
        },
        form: {
            title: 'Contact rapide',
            icon: 'envelope',
            size: 2,
            height: 2,
            config: {
                fields: ['name', 'email', 'subject', 'message'],
                submitLabel: 'Envoyer'
            }
        }
    }
};

// Fonction pour obtenir des données aléatoires pour le graphique (simulation de données en temps réel)
function getRandomData(min, max, length = 7) {
    return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1) + min));
}

// Fonction pour mettre à jour les données du graphique
function refreshChartData(chartId = 'performance', period = 'month') {
    switch(chartId) {
        case 'performance':
            dashboardData.performance.datasets[0].data = getRandomData(50, 100);
            dashboardData.performance.datasets[1].data = getRandomData(20, 90);
            return dashboardData.performance;
        
        case 'sales':
            if (period === 'month') {
                dashboardData.salesMonthly.month.datasets[0].data = getRandomData(10, 40, 7);
                return dashboardData.salesMonthly.month;
            } else if (period === 'quarter') {
                dashboardData.salesMonthly.quarter.datasets[0].data = getRandomData(100, 200, 3);
                return dashboardData.salesMonthly.quarter;
            } else if (period === 'year') {
                dashboardData.salesMonthly.year.datasets[0].data = getRandomData(50, 120, 12);
                return dashboardData.salesMonthly.year;
            }
            break;
            
        default:
            return null;
    }
}

// Fonction pour générer des données de statistiques aléatoires
function refreshStatsData() {
    const generateRandomStat = (min, max) => {
        const value = Math.floor(Math.random() * (max - min + 1) + min);
        const evolutionValue = Math.floor(Math.random() * 30) + 1;
        const positive = Math.random() > 0.3; // 70% chance d'être positif
        const evolution = `${positive ? '+' : '-'}${evolutionValue / 10}%`;
        
        return {
            value: value,
            evolution: evolution,
            positive: positive
        };
    };
    
    dashboardData.stats.users = generateRandomStat(1000, 3000);
    dashboardData.stats.sales = generateRandomStat(500, 1500);
    dashboardData.stats.visits = generateRandomStat(5000, 15000);
    
    // Pour les revenus, nous utilisons un format monétaire
    const revenueValue = Math.floor(Math.random() * 15000) + 5000;
    const revenuePositive = Math.random() > 0.3;
    const revenueEvolution = `${revenuePositive ? '+' : '-'}${(Math.floor(Math.random() * 100) + 1) / 10}%`;
    
    dashboardData.stats.revenue = {
        value: `${revenueValue.toLocaleString()} €`,
        evolution: revenueEvolution,
        positive: revenuePositive
    };
    
    return dashboardData.stats;
}

// Fonction pour mélanger le tableau des commandes
function shuffleOrders() {
    dashboardData.orders.sort(() => Math.random() - 0.5);
    return dashboardData.orders;
}

// Fonction pour créer un nouveau widget à partir d'un template
function createWidgetFromTemplate(type, customConfig = {}) {
    const template = dashboardData.widgetTemplates[type];
    if (!template) return null;
    
    // Créer une copie profonde du template
    const widgetConfig = JSON.parse(JSON.stringify(template));
    
    // Fusionner avec la configuration personnalisée
    if (customConfig.title) widgetConfig.title = customConfig.title;
    if (customConfig.icon) widgetConfig.icon = customConfig.icon;
    if (customConfig.size) widgetConfig.size = customConfig.size;
    if (customConfig.height) widgetConfig.height = customConfig.height;
    
    // Fusionner les configurations spécifiques
    if (customConfig.config) {
        widgetConfig.config = {...widgetConfig.config, ...customConfig.config};
    }
    
    // Générer un ID unique
    widgetConfig.id = `${type}-${Date.now()}`;
    
    return widgetConfig;
}
