// PARTIE 1: Initialisation de la carte Leaflet et gestion des clics

// Variables globales pour stocker la carte et le marqueur
var map;
var marker;

/**
 * Initialise la carte Leaflet avec une vue centrée sur la France
 * Configure la couche de tuiles OpenStreetMap et ajoute l'événement de clic
 */
function initMap() {
    // Création de la carte avec vue centrée sur la France (latitude: 46.603354, longitude: 1.888334, zoom: 6)
    map = L.map('map').setView([46.603354, 1.888334], 6);
    
    // Ajout de la couche de tuiles OpenStreetMap avec attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Écoute des clics sur la carte pour placer un marqueur et récupérer les données météo
    map.on('click', onMapClick);
}

/**
 * Gestionnaire d'événement pour les clics sur la carte
 * Place un marqueur et lance la récupération des données météo
 * @param {Object} e - Événement de clic contenant les coordonnées
 */
function onMapClick(e) {
    // Extraction des coordonnées latitude/longitude du clic
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;
    
    // Gestion du marqueur : déplacement s'il existe déjà, création sinon
    if (marker) {
        // Déplace le marqueur existant vers les nouvelles coordonnées
        marker.setLatLng([lat, lng]);
    } else {
        // Crée un nouveau marqueur aux coordonnées cliquées
        marker = L.marker([lat, lng]).addTo(map);
    }
    
    // Affiche l'indicateur de chargement pendant les requêtes API
    showLoading(true);
    
    var cityName;
    
    // Chaînage de promesses : géocodage inverse puis récupération météo
    getCityName(lat, lng)
        .then(function(name) {
            cityName = name;
            // Une fois le nom de ville obtenu, récupère les données météo
            return getWeather(cityName);
        })
        .then(function(weather) {
            // Affiche les résultats quand toutes les données sont disponibles
            displayResults(cityName, weather, lat, lng);
            showLoading(false);
        })
        .catch(function(error) {
            // Gestion des erreurs de toute la chaîne de promesses
            displayError(error.message);
            showLoading(false);
        });
}


// PARTIE 2: Fonctions de géocodage inverse et récupération des données météo

/**
 * Effectue un géocodage inverse pour obtenir le nom de la ville
 * à partir des coordonnées latitude/longitude
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} Promesse qui résout avec le nom de la ville
 */
function getCityName(lat, lng) {
    // Construction de l'URL pour l'API Nominatim d'OpenStreetMap
    var url = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + 
              lat + '&lon=' + lng + '&zoom=10&addressdetails=1';
    
    return fetch(url)
        .then(function(response) {
            // Vérification du statut de la réponse HTTP
            if (!response.ok) throw new Error('Erreur lors de la recherche de ville');
            return response.json();
        })
        .then(function(data) {
            var address = data.address;
            // Recherche du nom de ville dans l'ordre de priorité décroissant
            return address.city || address.town || address.village || 
                   address.municipality || address.county || 'Lieu inconnu';
        });
}

/**
 * Récupère les données météorologiques pour une ville donnée
 * @param {string} cityName - Nom de la ville
 * @returns {Promise<Object>} Promesse qui résout avec les données météo
 */
function getWeather(cityName) {
    // Construction de l'URL pour l'API GoWeather avec encodage du nom de ville
    var url = 'https://goweather.herokuapp.com/weather/' + encodeURIComponent(cityName);
    
    return fetch(url)
        .then(function(response) {
            // Vérification du statut de la réponse HTTP
            if (!response.ok) throw new Error('Erreur lors de la récupération météo');
            return response.json();
        })
        .then(function(data) {
            // Vérification que des données météo sont disponibles
            if (!data.temperature && !data.description) {
                throw new Error('Aucune donnée météo disponible');
            }
            return data;
        });
}

// PARTIE 3: Affichage des résultats et gestion des erreurs

/**
 * Affiche les résultats de géolocalisation et météo dans l'interface
 * @param {string} cityName - Nom de la ville
 * @param {Object} weather - Données météorologiques
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 */
function displayResults(cityName, weather, lat, lng) {
    var container = document.getElementById('weather-data');
    
    // Construction du HTML avec les informations de base
    var html = '<div class="weather-item"><strong>📍 Ville:</strong> ' + cityName + '</div>' +
               '<div class="weather-item"><strong>🌍 Coordonnées:</strong> ' + lat.toFixed(4) + ', ' + lng.toFixed(4) + '</div>';
    
    // Ajout conditionnel des données météo disponibles
    if (weather.temperature) {
        html += '<div class="weather-item"><strong>🌡️ Température:</strong> ' + weather.temperature + '</div>';
    }
    if (weather.description) {
        html += '<div class="weather-item"><strong>☁️ Description:</strong> ' + weather.description + '</div>';
    }
    if (weather.wind) {
        html += '<div class="weather-item"><strong>💨 Vent:</strong> ' + weather.wind + '</div>';
    }
    
    // Ajout des prévisions si disponibles
    if (weather.forecast && weather.forecast.length > 0) {
        html += '<div class="weather-item"><strong>📅 Prévisions:</strong></div>';
        for (var i = 0; i < weather.forecast.length; i++) {
            var forecast = weather.forecast[i];
            html += '<div class="weather-item" style="margin-left: 15px;"><strong>Jour ' + (i + 1) + ':</strong> ' + 
                    forecast.temperature + ' - ' + forecast.description + '</div>';
        }
    }
    
    // Injection du HTML dans le conteneur
    container.innerHTML = html;
    
    // Mise à jour du popup du marqueur avec un résumé des informations
    if (marker) {
        marker.bindPopup('<b>' + cityName + '</b><br/>' +
                        (weather.temperature || 'N/A') + '<br/>' +
                        (weather.description || 'N/A')).openPopup();
    }
}

/**
 * Affiche un message d'erreur dans l'interface utilisateur
 * @param {string} message - Message d'erreur à afficher
 */
function displayError(message) {
    document.getElementById('weather-data').innerHTML = '<div class="error">❌ Erreur: ' + message + '</div>';
}

/**
 * Contrôle l'affichage de l'indicateur de chargement
 * @param {boolean} show - true pour afficher, false pour masquer
 */
function showLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

// Initialisation de l'application quand le DOM est entièrement chargé
document.addEventListener('DOMContentLoaded', initMap);
