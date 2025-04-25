/**
 * Gestion des graphiques pour le dashboard
 */

// Initialisation de tous les graphiques
function initializeCharts() {
  // Initialise le graphique de ventes
  initializeSalesChart('sales-chart');
}

// Initialisation d'un graphique de ventes
function initializeSalesChart(chartId) {
  const canvas = document.getElementById(chartId);
  
  if (!canvas) return;
  
  // Contexte du canvas pour Chart.js
  const ctx = canvas.getContext('2d');
  
  // Configuration du graphique
  const salesChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
      datasets: [{
        label: 'Ventes',
        data: [12500, 14000, 15800, 14900, 17200, 19500, 18300, 20100, 22000, 21500, 23000, 25000],
        borderColor: '#4a6cf7',
        backgroundColor: 'rgba(74, 108, 247, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#4a6cf7',
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(52, 58, 64, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 1,
          padding: 10,
          bodyFont: {
            size: 14
          },
          titleFont: {
            size: 14,
            weight: 'bold'
          },
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('fr-FR', { 
                  style: 'currency', 
                  currency: 'EUR' 
                }).format(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            drawOnChartArea: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value.toLocaleString('fr-FR') + ' €';
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
  
  // Sauvegarde l'instance du graphique pour pouvoir y accéder plus tard
  canvas.chart = salesChart;
  
  // Gestion des boutons de période
  const periodButtons = document.querySelectorAll('.chart-period-selector .btn');
  periodButtons.forEach(button => {
    button.addEventListener('click', e => {
      // Supprime la classe active de tous les boutons
      periodButtons.forEach(btn => btn.classList.remove('active'));
      
      // Ajoute la classe active au bouton cliqué
      button.classList.add('active');
      
      // Met à jour les données du graphique en fonction de la période
      const period = button.getAttribute('data-period');
      updateChartData(chartId, period);
    });
  });
}

// Mise à jour des données du graphique en fonction de la période
function updateChartData(chartId, period) {
  const canvas = document.getElementById(chartId);
  
  if (!canvas || !canvas.chart) return;
  
  const chart = canvas.chart;
  
  // Différentes données selon la période
  let newData, newLabels;
  
  if (period === 'month') {
    newLabels = ['1', '5', '10', '15', '20', '25', '30'];
    newData = [2100, 2800, 3500, 3200, 4100, 4800, 5200];
  } else if (period === 'year') {
    newLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    newData = [12500, 14000, 15800, 14900, 17200, 19500, 18300, 20100, 22000, 21500, 23000, 25000];
  } else if (period === 'week') {
    newLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    newData = [580, 620, 750, 690, 940, 1120, 980];
  }
  
  // Animation de transition des données
  chart.data.labels = newLabels;
  chart.data.datasets[0].data = newData;
  chart.update();
}

// Initialise un nouveau graphique pour un widget dynamique
function initializeNewChart(chartId, type = 'line') {
  const canvas = document.getElementById(chartId);
  
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  let chartConfig;
  
  // Configurations différentes selon le type de graphique
  switch(type) {
    case 'bar':
      chartConfig = {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [{
            label: 'Données',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: 'rgba(74, 108, 247, 0.5)',
            borderColor: '#4a6cf7',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      };
      break;
      
    case 'pie':
      chartConfig = {
        type: 'pie',
        data: {
          labels: ['Rouge', 'Bleu', 'Jaune', 'Vert', 'Violet'],
          datasets: [{
            data: [12, 19, 3, 5, 2],
            backgroundColor: [
              '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      };
      break;
      
    default: // line
      chartConfig = {
        type: 'line',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [{
            label: 'Données',
            data: [12, 19, 3, 5, 2, 3],
            fill: false,
            borderColor: '#4a6cf7',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      };
  }
  
  // Crée le graphique
  const newChart = new Chart(ctx, chartConfig);
  
  // Sauvegarde l'instance
  canvas.chart = newChart;
  
  return newChart;
}
