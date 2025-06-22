// Create the map
const map = L.map('map', {
  maxBounds: [[-60, -180], [90, 180]],
  maxBoundsViscosity: 1.0,
}).setView([20, 0], 2);

// Add CartoDB Light base map with English labels
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 6,
  minZoom: 2,
  noWrap: true,
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
               '&copy; <a href="https://carto.com/">CARTO</a>',
}).addTo(map);

// Load and display modern country borders from GeoJSON
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
