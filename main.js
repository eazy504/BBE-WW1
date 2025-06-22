// Initialize map
const map = L.map('map').setView([20, 0], 2); // Centered on the equator, zoomed out

// Add tile layer from Stadia Maps with English labels
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, ' +
               '&copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> contributors',
}).addTo(map);
