// Create the map with single horizontal wrap
const map = L.map('map', {
  worldCopyJump: true,       // wrap horizontally once
  continuousWorld: true
}).setView([20, 0], 2);       // center map on equator

// Add CartoDB Light base tiles with English labels
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 6,
  minZoom: 2,
  noWrap: true, // wrap horizontally just once
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
               '&copy; <a href="https://carto.com/">CARTO</a>',
}).addTo(map);
