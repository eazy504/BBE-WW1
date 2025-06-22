// Create the map with pan/zoom but no infinite wrapping
const map = L.map('map', {
  maxBounds: [[-90, -180], [90, 180]], // lock map bounds to the visible world
  maxBoundsViscosity: 1.0,            // prevents overscrolling
}).setView([20, 0], 2);                // initial center and zoom

// Use CartoDB Light (English-labeled) tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 6,
  minZoom: 2,
  noWrap: true, // prevent infinite scrolling horizontally
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
               '&copy; <a href="https://carto.com/">CARTO</a>',
}).addTo(map);
