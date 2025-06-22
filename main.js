const container = document.getElementById('map-container');

const width = 1064;
const height = 540;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.x = x;
    tile.dataset.y = y;
    container.appendChild(tile);
  }
}
