const container = document.getElementById('map-container');
const colorPicker = document.getElementById('color-picker');

const width = 802;
const height = 376;

// Create grid tiles
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.x = x;
    tile.dataset.y = y;

    tile.addEventListener('click', (e) => {
      const rect = tile.getBoundingClientRect();

      // Position color picker where the tile is
      colorPicker.style.left = `${rect.left}px`;
      colorPicker.style.top = `${rect.top}px`;
      colorPicker.style.visibility = 'visible';

      // Set current color
      const currentColor = tile.style.backgroundColor;
      colorPicker.value = rgbToHex(currentColor || '#f0f0f0');

      // On color change
      colorPicker.oninput = () => {
        tile.style.backgroundColor = colorPicker.value;
      };

      // Auto focus to make entering hex easy
      colorPicker.focus();
    });

    container.appendChild(tile);
  }
}

// Helper to convert rgb() to hex
function rgbToHex(rgb) {
  if (!rgb.startsWith('rgb')) return rgb;
  const rgbArr = rgb.match(/\d+/g);
  return (
    '#' +
    rgbArr
      .map((val) => {
        const hex = parseInt(val).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')
  );
}
