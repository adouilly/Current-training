let map = document.getElementById('map');
let popup = L.popup();
let city;
/*chargement d'une position génèrique propre à l'API*/
map = L.map('map', {
  center: [51.505, -0.09],
  zoom: 13
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

/**
 * @param{}onMapClick
 * au clic sur la carte
 */

function onMapClick() {
  map.addEventListener('click', (e) => {
    // longitude et lattitude des points cliqués sur la carte

    let lat = e.latlng.lat.toFixed(6); //6décimales
    let lng = e.latlng.lng.toFixed(6); //6décimales
    popup.setLatLng(e.latlng);
    popup.setContent(`latitude ${lat} et longitude ${lng}`);
    popup.openOn(map);

    /**
     * @param(string) fetch
     */

    //coordonnées des villes ou municipalité avec une concaténation dans l'adresse API qui reprend les valeurs lat et lng

    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    )
      .then((response) => response.json())
      .then((data) => {
        // Extraction du nom de la ville
        let ville = data.address.city || data.address.municipality;
        console.log(ville);

        //  Pour récupérer la météo selon la ville

        fetch(`https://goweather.xyz/weather/${ville}`)
          .then((response) => response.json())
          .then((weatherData) => {
            console.log(weatherData);
            let weather = {
              temperature: weatherData.temperature,
              vent: weatherData.wind,
              meteo: weatherData.description
            };
            const container = document.querySelector('.container_data'); //div dans le html
            const meteoData = document.createElement('div'); //creation de div dont le parent est le container
            meteoData.classList.add('description');
            container.appendChild(meteoData);
            //nom de la ville
            const paragrapherCity = document.createElement('p');
            paragrapherCity.textContent = ville ? ville.toUpperCase() : '';
            meteoData.appendChild(paragrapherCity);

            //paragraphe pour la température
            const paragrapherTemperature = document.createElement('p');
            meteoData.appendChild(paragrapherTemperature);
            paragrapherTemperature.textContent = weather.temperature;
            //paragraphe pour le vent
            const paragrapherWind = document.createElement('p');
            meteoData.appendChild(paragrapherWind);
            paragrapherWind.textContent = weather.vent;
            //paragraphe pour la météo
            const paragrapherMeteo = document.createElement('p');
            meteoData.appendChild(paragrapherMeteo);
            paragrapherMeteo.textContent = weather.meteo;
          });
      })
      .catch((error) => {
        console.error('Erreur Nominatim :', error);
      });
  });
}

onMapClick();
