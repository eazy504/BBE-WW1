// Create the map with zoom/pan enabled but no infinite scrolling or Antarctica
const map = L.map('map', {
  maxBounds: [[-60, -180], [90, 180]], // prevent viewing Antarctica
  maxBoundsViscosity: 1.0,            // strict boundary enforcement
}).setView([20, 0], 2);                // center at equator, zoomed out

// English-labeled CartoDB Light tiles
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 6,
  minZoom: 2,
  noWrap: true, // disable horizontal tile wrapping
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
               '&copy; <a href="https://carto.com/">CARTO</a>',
}).addTo(map);
