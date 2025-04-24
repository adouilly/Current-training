// Fichier script.js principal - contient uniquement l'initialisation de l'application

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les fonctionnalités du tableau de bord
    initDashboard();
    
    // Remplir le tableau avec des données
    populateOrdersTable();
    
    // Initialiser les liens de navigation vers les widgets
    initWidgetLinks();
    
    // Initialiser les graphiques
    initCharts();
    
    // Initialiser la fonctionnalité de redimensionnement
    if (typeof WidgetResize !== 'undefined') {
        console.log("Initialisation du module de redimensionnement...");
        WidgetResize.init();
    } else {
        console.error("Module WidgetResize non disponible !");
    }
    
    // Initialiser la fonctionnalité de glisser-déposer
    if (typeof WidgetDragDrop !== 'undefined') {
        console.log("Initialisation du module de drag & drop...");
        WidgetDragDrop.init();
    } else {
        console.error("Module WidgetDragDrop non disponible !");
    }
    
    // Initialiser le système d'ajout/suppression de widgets
    if (typeof WidgetManager !== 'undefined') {
        console.log("Initialisation du module de gestion des widgets...");
        WidgetManager.init();
    } else {
        console.error("Module WidgetManager non disponible !");
    }
    
    // Vérifier que les modules sont correctement chargés
    console.log("État des modules:");
    console.log("- WidgetRefresh:", typeof WidgetRefresh !== 'undefined' ? "Chargé" : "Non chargé");
    console.log("- WidgetResize:", typeof WidgetResize !== 'undefined' ? "Chargé" : "Non chargé");
    console.log("- WidgetDragDrop:", typeof WidgetDragDrop !== 'undefined' ? "Chargé" : "Non chargé");
    console.log("- WidgetManager:", typeof WidgetManager !== 'undefined' ? "Chargé" : "Non chargé");
    
    // S'assurer que tous les widgets ont un bouton de suppression
    if (typeof WidgetManager !== 'undefined') {
        document.querySelectorAll('.widget').forEach(widget => {
            if (!widget.querySelector('.delete-widget-btn')) {
                console.log(`Ajout d'un bouton de suppression au widget ${widget.id}`);
                WidgetManager.addDeleteButton(widget);
            }
        });
    }
    
    // Assurer que tous les boutons des widgets sont fonctionnels
    initAllWidgetButtons();
    
    // Écouter les événements pour les nouveaux widgets
    document.querySelector('.dashboard-container')?.addEventListener('widgets-reordered', function() {
        console.log("Widgets réorganisés - réinitialisation des boutons");
        initAllWidgetButtons();
    });
});

// Initialisation des fonctionnalités principales du tableau de bord
function initDashboard() {
    // Déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    const logoutMenuBtn = document.getElementById('logout-menu-btn');
    
    [logoutBtn, logoutMenuBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                // Supprimer les informations de connexion
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userPicture');
                
                // Rediriger vers la page de connexion
                window.location.href = 'login.html';
            });
        }
    });
    
    // Gestion du menu utilisateur
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.addEventListener('click', function() {
            this.querySelector('.user-dropdown').classList.toggle('show');
        });
        
        // Fermer le menu déroulant en cliquant ailleurs
        document.addEventListener('click', function(e) {
            if (!userMenu.contains(e.target)) {
                userMenu.querySelector('.user-dropdown')?.classList.remove('show');
            }
        });
    }
    
    // Initialiser les boutons de rafraîchissement des widgets
    document.querySelectorAll('.refresh-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (typeof WidgetRefresh !== 'undefined') {
                const widget = this.closest('.widget');
                WidgetRefresh.refreshWidget(widget);
            } else {
                console.error("Module WidgetRefresh non disponible !");
            }
        });
    });
    
    // Initialiser le toggle du mode compact
    initCompactToggle();
}

// Initialiser les graphiques
function initCharts() {
    const salesChartCanvas = document.getElementById('salesChart');
    
    if (salesChartCanvas && window.Chart) {
        try {
            console.log("Initialisation du graphique des ventes...");
            
            // Données pour le graphique
            const data = {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
                datasets: [{
                    label: 'Ventes',
                    data: [65, 59, 80, 81, 56, 55, 72],
                    borderColor: '#3932BB',
                    backgroundColor: 'rgba(57, 50, 187, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            };
            
            // Options du graphique
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
            
            // Créer le graphique
            const salesChart = new Chart(salesChartCanvas, {
                type: 'line',
                data: data,
                options: options
            });
            
            console.log("Graphique des ventes initialisé avec succès");
            
            // Gérer le changement de période
            const periodButtons = document.querySelectorAll('.chart-period-option');
            periodButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Mettre à jour l'UI
                    periodButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Mettre à jour les données (simulation)
                    const period = this.getAttribute('data-period');
                    updateChartData(salesChart, period);
                });
            });
        } catch (error) {
            console.error("Erreur lors de l'initialisation du graphique des ventes:", error);
        }
    } else {
        console.warn("Canvas du graphique des ventes non trouvé ou Chart.js non chargé");
    }
}

// Mettre à jour les données du graphique
function updateChartData(chart, period) {
    // Simuler des données différentes pour chaque période
    let labels, data;
    
    switch(period) {
        case 'month':
            labels = ['1', '5', '10', '15', '20', '25', '30'];
            data = [12, 19, 13, 25, 24, 35, 32];
            break;
        case 'quarter':
            labels = ['Jan', 'Fév', 'Mar'];
            data = [125, 130, 145];
            break;
        case 'year':
            labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
            data = [65, 59, 80, 81, 56, 55, 72, 74, 83, 90, 95, 110];
            break;
        default:
            labels = ['1', '5', '10', '15', '20', '25', '30'];
            data = [12, 19, 13, 25, 24, 35, 32];
    }
    
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

// Initialiser la navigation vers les widgets
function initWidgetLinks() {
    const widgetLinks = document.querySelectorAll('.widget-link');
    
    widgetLinks.forEach(link => {
        link.addEventListener('click', function() {
            const widgetId = this.getAttribute('data-widget-id');
            const widget = document.getElementById(widgetId);
            
            if (widget) {
                // Mettre en évidence le widget sélectionné
                highlightWidget(widget);
                
                // Faire défiler jusqu'au widget
                widget.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
        });
    });
}

// Mettre en évidence un widget - rendu accessible globalement
function highlightWidget(widget) {
    if (!widget) return;
    
    // Ajouter une classe pour l'animation
    widget.classList.add('widget-highlighted');
    
    // S'assurer que le widget n'est pas en mode compact lors de la mise en évidence
    if (widget.classList.contains('compact')) {
        const toggleBtn = widget.querySelector('.toggle-compact-btn');
        if (toggleBtn) {
            toggleBtn.click();
        }
    }
    
    // Supprimer la classe après l'animation
    setTimeout(() => {
        widget.classList.remove('widget-highlighted');
    }, 2000);
}

// Rendre la fonction accessible globalement
window.highlightWidget = highlightWidget;

// Remplir le tableau des commandes
function populateOrdersTable() {
    const tableBody = document.querySelector('.data-table tbody');
    
    if (!tableBody) return;
    
    // Vider le tableau
    tableBody.innerHTML = '';
    
    // Données simulées
    const orders = [
        { id: 'ORD-001', customer: 'Sophie Martin', date: '2023-05-15', amount: '125.99 €', status: 'Actif' },
        { id: 'ORD-002', customer: 'Thomas Dubois', date: '2023-05-14', amount: '89.50 €', status: 'En attente' },
        { id: 'ORD-003', customer: 'Émilie Leroy', date: '2023-05-14', amount: '246.75 €', status: 'Actif' },
        { id: 'ORD-004', customer: 'Lucas Moreau', date: '2023-05-13', amount: '59.99 €', status: 'Inactif' },
        { id: 'ORD-005', customer: 'Chloé Lefebvre', date: '2023-05-12', amount: '199.00 €', status: 'Actif' }
    ];
    
    // Ajouter les données
    orders.forEach(order => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>${order.amount}</td>
            <td>${order.status}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Mettre à jour le résumé du widget
    const tableWidget = document.getElementById('table-widget');
    if (tableWidget && typeof WidgetRefresh !== 'undefined') {
        WidgetRefresh.updateTableWidgetSummary(tableWidget);
    }
}

// Initialiser le toggle du mode compact
function initCompactToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-compact-btn');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const widget = this.closest('.widget');
            widget.classList.toggle('compact');
            
            // Changer l'icône du bouton
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
            
            // Si un graphique est présent, le redimensionner
            const chartCanvas = widget.querySelector('canvas');
            if (chartCanvas && window.Chart) {
                const chart = Chart.getChart(chartCanvas);
                if (chart) {
                    setTimeout(() => {
                        chart.resize();
                    }, 300);
                }
            }
        });
    });
}

// Activer les styles du bouton d'ajout de widgets
window.addEventListener('load', function() {
    const addWidgetBtn = document.getElementById('add-widget-btn');
    if (addWidgetBtn) {
        addWidgetBtn.style.display = 'flex';
        console.log("Bouton d'ajout de widget visible");
    } else {
        console.warn("Bouton d'ajout de widget non trouvé");
    }
    
    // S'assurer que la modal est bien configurée
    const modal = document.getElementById('add-widget-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    if (modal && modalOverlay) {
        console.log("Modale d'ajout de widget configurée");
    } else {
        console.warn("Éléments de la modale manquants");
    }
});

function initAllWidgetButtons() {
    console.log("Initialisation de tous les boutons des widgets");
    
    // Initialiser les boutons de suppression
    document.querySelectorAll('.delete-widget-btn').forEach(button => {
        // Supprimer les anciens écouteurs pour éviter les doublons
        const newBtn = button.cloneNode(true);
        button.parentNode.replaceChild(newBtn, button);
        
        newBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const widget = this.closest('.widget');
            if (widget && confirm('Voulez-vous vraiment supprimer ce widget ?')) {
                widget.remove();
                console.log(`Widget ${widget.id} supprimé`);
            }
        });
    });
    
    // Initialiser les boutons de mode compact
    document.querySelectorAll('.toggle-compact-btn').forEach(button => {
        // Supprimer les anciens écouteurs pour éviter les doublons
        const newBtn = button.cloneNode(true);
        button.parentNode.replaceChild(newBtn, button);
        
        newBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const widget = this.closest('.widget');
            widget.classList.toggle('compact');
            
            // Changer l'icône du bouton
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
            
            // Si un graphique est présent, le redimensionner
            const chartCanvas = widget.querySelector('canvas');
            if (chartCanvas && window.Chart) {
                const chart = Chart.getChart(chartCanvas);
                if (chart) {
                    setTimeout(() => {
                        chart.resize();
                    }, 300);
                }
            }
        });
    });
    
    // Initialiser les boutons de rafraîchissement
    document.querySelectorAll('.refresh-btn').forEach(button => {
        // Supprimer les anciens écouteurs pour éviter les doublons
        const newBtn = button.cloneNode(true);
        button.parentNode.replaceChild(newBtn, button);
        
        newBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const widget = this.closest('.widget');
            
            // Animation de rotation pour l'icône
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.add('fa-spin');
                
                setTimeout(() => {
                    icon.classList.remove('fa-spin');
                }, 1000);
            }
            
            // Utiliser WidgetRefresh si disponible
            if (typeof WidgetRefresh !== 'undefined') {
                WidgetRefresh.refreshWidget(widget);
            } else {
                console.log(`Rafraîchissement du widget ${widget.id}`);
            }
        });
    });
}
