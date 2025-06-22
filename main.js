// Create the map with single horizontal wrap
const map = L.map('map', {
  worldCopyJump: true,
  continuousWorld: true,
}).setView([20, 0], 2);

// Add CartoDB Light base map
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  maxZoom: 6,
  minZoom: 2,
  noWrap: true, // restrict to one world wrap
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
               '&copy; <a href="https://carto.com/">CARTO</a>',
}).addTo(map);

// Function to shift coordinates for world duplication
function shiftGeoJSON(data, offset) {
  const shifted = JSON.parse(JSON.stringify(data)); // deep copy
  shifted.features.forEach(feature => {
    const coords = feature.geometry.coordinates;

    // Handle different geometry types
    if (feature.geometry.type === "Polygon") {
      feature.geometry.coordinates = coords.map(ring =>
        ring.map(([lng, lat]) => [lng + offset, lat])
      );
    } else if (feature.geometry.type === "MultiPolygon") {
      feature.geometry.coordinates = coords.map(polygon =>
        polygon.map(ring =>
          ring.map(([lng, lat]) => [lng + offset, lat])
        )
      );
    }
  });
  return shifted;
}

// Load and display country borders + shifted copy
fetch('countries.geojson')
  .then(response => response.json())
  .then(data => {
    const original = L.geoJSON(data, {
      style: {
        color: "#000000",
        weight: 2.5,
        fillOpacity: 0
      }
    }).addTo(map);

    const duplicate = L.geoJSON(shiftGeoJSON(data, 360), {
      style: {
        color: "#000000",
        weight: 2.5,
        fillOpacity: 0
      }
    }).addTo(map);
  })
  .catch(error => console.error("Error loading GeoJSON:", error));
