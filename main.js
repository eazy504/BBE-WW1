const container = document.getElementById('map-container');
const paintColorInput = document.getElementById('paint-color');
const hexDisplay = document.getElementById('hex-display');

let selectedColor = paintColorInput.value;
hexDisplay.textContent = selectedColor;

// Update selected color and hex display
paintColorInput.addEventListener('input', () => {
  selectedColor = paintColorInput.value;
  hexDisplay.textContent = selectedColor;
});

const width = 802;
const height = 376;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.x = x;
    tile.dataset.y = y;

    tile.addEventListener('click', () => {
      tile.style.backgroundColor = selectedColor;
    });

    container.appendChild(tile);
  }
}
