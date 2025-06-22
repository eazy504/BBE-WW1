// Create the map
const map = L.map('map', {
  maxBounds: [[-90, -180], [90, 180]], // limit panning to world
  maxBoundsViscosity: 1.0,             // lock to those bounds completely
}).setView([20, 0], 2);

// Add tile layer with English labels
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
  maxZoom: 6,
  minZoom: 2,
  noWrap: true,  // disables horizontal wrapping of tiles
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, ' +
               '&copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> contributors',
}).addTo(map);
