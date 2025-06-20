// Initialisation de la carte Leaflet
let map;
let currentMarker;

// Initialiser la carte
function initMap() {
    // Créer la carte centrée sur la France
    map = L.map('map').setView([46.603354, 1.888334], 6);
    
    // Ajouter la couche de tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Ajouter un événement de clic sur la carte
    map.on('click', onMapClick);
}

// Fonction appelée lors du clic sur la carte
async function onMapClick(e) {
    const lat = e.latlng.lat;
    const lng = e.latlng.lng;
    
    console.log(`Coordonnées cliquées: ${lat}, ${lng}`);
    
    // Ajouter ou déplacer le marqueur
    if (currentMarker) {
        currentMarker.setLatLng([lat, lng]);
    } else {
        currentMarker = L.marker([lat, lng]).addTo(map);
    }
    
    // Afficher le loader
    showLoading(true);
    
    try {
        // Étape 1: Récupérer le nom de la ville via Nominatim
        const cityName = await getCityFromCoordinates(lat, lng);
        
        // Étape 2: Récupérer la météo via GoWeather
        const weatherData = await getWeatherData(cityName);
        
        // Étape 3: Afficher les données
        displayWeatherData(cityName, weatherData, lat, lng);
        
    } catch (error) {
        console.error('Erreur:', error);
        displayError(error.message);
    } finally {
        showLoading(false);
    }
}

// Fonction pour récupérer le nom de la ville via l'API Nominatim
async function getCityFromCoordinates(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extraire le nom de la ville (plusieurs fallbacks possibles)
        const address = data.address;
        const cityName = address.city || 
                        address.town || 
                        address.village || 
                        address.municipality || 
                        address.county || 
                        'Lieu inconnu';
        
        console.log('Ville trouvée:', cityName);
        return cityName;
        
    } catch (error) {
        throw new Error(`Impossible de récupérer le nom de la ville: ${error.message}`);
    }
}

// Fonction pour récupérer les données météo via l'API GoWeather
async function getWeatherData(cityName) {
    // Encoder le nom de la ville pour l'URL
    const encodedCity = encodeURIComponent(cityName);
    const url = `https://goweather.herokuapp.com/weather/${encodedCity}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Vérifier si on a des données valides
        if (!data.temperature && !data.description) {
            throw new Error('Aucune donnée météo disponible pour cette ville');
        }
        
        console.log('Données météo:', data);
        return data;
        
    } catch (error) {
        throw new Error(`Impossible de récupérer la météo: ${error.message}`);
    }
}

// Fonction pour afficher les données météo
function displayWeatherData(cityName, weatherData, lat, lng) {
    const weatherContainer = document.getElementById('weather-data');
    
    let html = `
        <div class="weather-item">
            <strong>📍 Ville:</strong> ${cityName}
        </div>
        <div class="weather-item">
            <strong>🌍 Coordonnées:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}
        </div>
    `;
    
    if (weatherData.temperature) {
        html += `
            <div class="weather-item">
                <strong>🌡️ Température:</strong> ${weatherData.temperature}
            </div>
        `;
    }
    
    if (weatherData.description) {
        html += `
            <div class="weather-item">
                <strong>☁️ Description:</strong> ${weatherData.description}
            </div>
        `;
    }
    
    if (weatherData.wind) {
        html += `
            <div class="weather-item">
                <strong>💨 Vent:</strong> ${weatherData.wind}
            </div>
        `;
    }
    
    // Afficher les prévisions si disponibles
    if (weatherData.forecast && weatherData.forecast.length > 0) {
        html += '<div class="weather-item"><strong>📅 Prévisions:</strong></div>';
        weatherData.forecast.forEach((forecast, index) => {
            html += `
                <div class="weather-item" style="margin-left: 15px;">
                    <strong>Jour ${index + 1}:</strong> ${forecast.temperature} - ${forecast.description}
                </div>
            `;
        });
    }
    
    weatherContainer.innerHTML = html;
    
    // Mettre à jour le popup du marqueur
    if (currentMarker) {
        currentMarker.bindPopup(`
            <b>${cityName}</b><br/>
            ${weatherData.temperature || 'N/A'}<br/>
            ${weatherData.description || 'N/A'}
        `).openPopup();
    }
}

// Fonction pour afficher les erreurs
function displayError(message) {
    const weatherContainer = document.getElementById('weather-data');
    weatherContainer.innerHTML = `
        <div class="error">
            ❌ Erreur: ${message}
        </div>
    `;
}

// Fonction pour afficher/masquer le loader
function showLoading(show) {
    const loader = document.getElementById('loading');
    loader.style.display = show ? 'block' : 'none';
}

// Initialiser l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    console.log('Application initialisée');
});