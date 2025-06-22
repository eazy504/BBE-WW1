// Initialize map
const map = L.map('map').setView([20, 0], 2); // Centered on the equator, zoomed out

// Add tile layer (OpenStreetMap base)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 6,
  minZoom: 2,
}).addTo(map);
