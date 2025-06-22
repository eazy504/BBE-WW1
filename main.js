const map = L.map('map').setView([20, 10], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems
  },
  draw: {
    polygon: true,
    polyline: false,
    rectangle: false,
    circle: false,
    marker: false,
    circlemarker: false
  }
});
map.addControl(drawControl);

fetch('countries-1914.geojson')
  .then(res => res.json())
  .then(data => {
    const geojsonLayer = L.geoJSON(data, {
      onEachFeature: (feature, layer) => {
        const { name, owner, troops } = feature.properties;
        layer.bindPopup(`
          <b>${name}</b><br>
          Owner: ${owner}<br>
          Troops: ${troops}
        `);

        layer.on('click', () => {
          const newOwner = prompt(`Change owner of ${name}`, owner);
          if (newOwner !== null) {
            feature.properties.owner = newOwner;
