/**
 * Données et services pour le tableau de bord
 * Ce fichier contient les données fictives et les fonctions pour les manipuler
 */

// Structure principale pour stocker les données
const DashboardData = {
    // Données pour les widgets de statistiques
    stats: {
        users: {
            total: 2845,
            change: 5.27,
            trend: 'up',
            history: [2630, 2678, 2710, 2756, 2798, 2845]
        },
        sales: {
            total: 1253,
            change: 12.8,
            trend: 'up',
            history: [1050, 1087, 1124, 1156, 1201, 1253]
        },
        visits: {
            total: 9721,
            change: 8.3,
            trend: 'up',
            history: [8780, 8920, 9124, 9320, 9510, 9721]
        },
        revenue: {
            total: 75245,
            change: 15.1,
            trend: 'up',
            history: [61200, 63450, 65800, 68750, 72100, 75245],
            currency: '€'
        }
    },

    // Données pour les graphiques
    charts: {
        sales: {
            year: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
                data: [12500, 14000, 15800, 14900, 17200, 19500, 18300, 20100, 22000, 21500, 23000, 25000]
            },
            month: {
                labels: ['1', '5', '10', '15', '20', '25', '30'],
                data: [2100, 2800, 3500, 3200, 4100, 4800, 5200]
            },
            week: {
                labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                data: [580, 620, 750, 690, 940, 1120, 980]
            }
        }
    },

    // Données des commandes récentes
    orders: [
        { id: 1842, customer: 'Jean Dupont', date: '2023-05-10', amount: 125.99, status: 'completed' },
        { id: 1841, customer: 'Marie Martin', date: '2023-05-09', amount: 89.50, status: 'in-progress' },
        { id: 1840, customer: 'Paul Bernard', date: '2023-05-09', amount: 212.75, status: 'pending' },
        { id: 1839, customer: 'Sophie Petit', date: '2023-05-08', amount: 45.20, status: 'completed' },
        { id: 1838, customer: 'Thomas Dubois', date: '2023-05-08', amount: 310.00, status: 'cancelled' }
    ],

    // Liste des clients pour le formulaire de contact
    customers: [
        { id: 1, name: 'Jean Dupont', email: 'jean.dupont@example.com' },
        { id: 2, name: 'Marie Martin', email: 'marie.martin@example.com' },
        { id: 3, name: 'Paul Bernard', email: 'paul.bernard@example.com' },
        { id: 4, name: 'Sophie Petit', email: 'sophie.petit@example.com' },
        { id: 5, name: 'Thomas Dubois', email: 'thomas.dubois@example.com' }
    ]
};

// Fonctions utilitaires pour manipuler les données
const DataUtils = {
    /**
     * Formater un nombre avec séparateur de milliers et devise
     */
    formatNumber(number, options = {}) {
        const { currency = '', decimals = 0 } = options;
        return number.toLocaleString('fr-FR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }) + (currency ? currency : '');
    },

    /**
     * Formater une date
     */
    formatDate(dateStr, format = 'DD/MM/YYYY') {
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year);
    },

    /**
     * Générer des données de tendance aléatoires
     */
    generateTrendData(baseValue, points = 10, volatility = 0.1) {
        const data = [];
        let value = baseValue;

        for (let i = 0; i < points; i++) {
            // Fluctuation aléatoire entre -volatility et +volatility
            const change = value * (Math.random() * volatility * 2 - volatility);
            value += change;
            data.push(Math.round(value));
        }

        return data;
    }
};

// Service pour simuler des appels API
const DataService = {
    /**
     * Simuler un délai réseau
     */
    delay(ms = 500) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * Récupérer les statistiques
     */
    async getStats() {
        await this.delay(800);
        return { ...DashboardData.stats };
    },

    /**
     * Récupérer les données d'un graphique
     */
    async getChartData(chartId, period = 'month') {
        await this.delay(600);
        if (chartId === 'sales') {
            return DashboardData.charts.sales[period] || DashboardData.charts.sales.month;
        }
        return null;
    },

    /**
     * Récupérer les commandes récentes
     */
    async getRecentOrders(limit = 5) {
        await this.delay(700);
        return DashboardData.orders.slice(0, limit).map(order => ({
            ...order,
            formattedDate: DataUtils.formatDate(order.date),
            formattedAmount: DataUtils.formatNumber(order.amount, { currency: '€', decimals: 2 })
        }));
    },

    /**
     * Récupérer la liste des clients
     */
    async getCustomers() {
        await this.delay(500);
        return [...DashboardData.customers];
    },

    /**
     * Simuler l'envoi d'un message
     */
    async sendMessage(message) {
        await this.delay(1500);
        // Simuler 95% de succès, 5% d'échec
        const success = Math.random() > 0.05;
        if (!success) {
            throw new Error("Erreur lors de l'envoi du message");
        }
        return { success: true, message: 'Message envoyé avec succès' };
    }
};

// Fonctions pour mettre à jour les données du dashboard en temps réel
const LiveData = {
    interval: null,
    listeners: [],

    /**
     * Démarrer les mises à jour en temps réel
     */
    startUpdates(intervalMs = 30000) {
        if (this.interval) return;
        
        this.interval = setInterval(() => {
            this.updateRandomStat();
            this.notifyListeners();
        }, intervalMs);
    },

    /**
     * Arrêter les mises à jour en temps réel
     */
    stopUpdates() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },

    /**
     * Mettre à jour une statistique aléatoire
     */
    updateRandomStat() {
        const statKeys = Object.keys(DashboardData.stats);
        const randomKey = statKeys[Math.floor(Math.random() * statKeys.length)];
        const stat = DashboardData.stats[randomKey];
        
        // Générer un changement aléatoire entre -2% et +5%
        const changePercent = (Math.random() * 7) - 2;
        const newValue = Math.round(stat.total * (1 + changePercent / 100));
        
        // Mettre à jour la valeur et le pourcentage de changement
        stat.total = newValue;
        stat.change = parseFloat(((newValue / stat.history[0] - 1) * 100).toFixed(2));
        stat.trend = changePercent >= 0 ? 'up' : 'down';
        
        // Mettre à jour l'historique
        stat.history.push(newValue);
        stat.history.shift();
        
        return { key: randomKey, stat };
    },

    /**
     * Ajouter un écouteur pour les mises à jour
     */
    addListener(callback) {
        if (typeof callback === 'function' && !this.listeners.includes(callback)) {
            this.listeners.push(callback);
        }
    },

    /**
     * Retirer un écouteur
     */
    removeListener(callback) {
        this.listeners = this.listeners.filter(listener => listener !== callback);
    },

    /**
     * Notifier tous les écouteurs d'une mise à jour
     */
    notifyListeners() {
        this.listeners.forEach(callback => {
            try {
                callback(DashboardData);
            } catch (error) {
                console.error('Erreur dans un écouteur de LiveData:', error);
            }
        });
    }
};

// Démarrer les mises à jour en temps réel au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    LiveData.startUpdates();
});

// Exporter les éléments pour une utilisation externe
window.DashboardData = DashboardData;
window.DataUtils = DataUtils;
window.DataService = DataService;
window.LiveData = LiveData;
