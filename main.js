// Create the map with single horizontal wrap
const map = L.map('map', {
  worldCopyJump: true,      // allows horizontal wrapping once
  continuousWorld: true,
}).setView([20, 0], 2);

// Add CartoDB Light base map (English-labeled)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 6,
  minZoom: 2,
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
               '&copy; <a href="https://carto.com/">CARTO</a>',
}).addTo(map);

// Load and display country borders with thicker lines
fetch('countries.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: "#000000",    // black border color
        weight: 2.5,         // thicker border lines
        fillOpacity: 0       // no fill inside countries
      }
    }).addTo(map);
  })
  .catch(error => console.error("Error loading GeoJSON:", error));
