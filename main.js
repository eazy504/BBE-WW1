// Create the map
const map = L.map('map', {
  maxBounds: [[-90, -180], [90, 180]], // keeps the view within world bounds
  maxBoundsViscosity: 1.0,            // makes the boundary strict
}).setView([20, 0], 2);

// Add default OpenStreetMap tiles (in English by default)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 6,
  minZoom: 2,
  noWrap: true, // prevents horizontal tile wrapping
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
