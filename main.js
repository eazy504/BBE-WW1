const map = L.map('map').setView([20, 10], 2);

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>'
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
            layer.setPopupContent(`
              <b>${name}</b><br>
              Owner: ${newOwner}<br>
              Troops: ${troops}
            `);
          }
        });
      },
      style: {
        color: '#3388ff',
        weight: 2,
        fillOpacity: 0.2
      }
    });

    geojsonLayer.addTo(drawnItems);
  });

map.on(L.Draw.Event.CREATED, function (e) {
  const layer = e.layer;
  drawnItems.addLayer(layer);
});
