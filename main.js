// Create the map with single horizontal wrap
const map = L.map('map', {
  worldCopyJump: true,      // keeps user centered after wrapping
  continuousWorld: true,    // allows horizontal wrapping
}).setView([20, 0], 2);      // center the map on the equator

// Add CartoDB Light base map (English-labeled)
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 6,
  minZoom: 2,
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
               '&copy; <a href="https://carto.com/">CARTO</a>',
}).addTo(map);

// Load and display country borders from GeoJSON
fetch('countries.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: "#000000",    // black border color
        weight: 1,           // line thickness
        fillOpacity: 0       // no fill
      }
    }).addTo(map);
  })
  .catch(error => console.error("Error loading GeoJSON:", error));
