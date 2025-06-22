const container = document.getElementById('map-container');
const wrapper = document.getElementById('map-scroll-wrapper');
const paintColorInput = document.getElementById('paint-color');
const hexDisplay = document.getElementById('hex-display');

let selectedColor = paintColorInput.value;
hexDisplay.textContent = selectedColor;

paintColorInput.addEventListener('input', () => {
  selectedColor = paintColorInput.value;
  hexDisplay.textContent = selectedColor;
});

const width = 802;
const height = 376;
const defaultColor = '#f0f0f0';
let isDraggingMap = false;
let isPainting = false;
let startX, startY, scrollLeft, scrollTop;

// Load saved colors
const savedTiles = JSON.parse(localStorage.getItem('tileColors') || '{}');

// Helper: save current tile color to localStorage
function saveTileColor(x, y, color) {
  const key = `${x},${y}`;
  if (color === defaultColor) {
    delete savedTiles[key]; // remove default colors to save space
  } else {
    savedTiles[key] = color;
  }
  localStorage.setItem('tileColors', JSON.stringify(savedTiles));
}

// Create and attach tiles
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.x = x;
    tile.dataset.y = y;

    // Apply saved color if it exists
    const key = `${x},${y}`;
    if (savedTiles[key]) {
      tile.style.backgroundColor = savedTiles[key];
    }

    // Left-click to paint
    tile.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        isPainting = true;
        tile.style.backgroundColor = selectedColor;
        saveTileColor(x, y, selectedColor);
      }
    });

    // Right-click to erase
    tile.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      tile.style.backgroundColor = defaultColor;
      saveTileColor(x, y, defaultColor);
    });

    // Drag-to-paint
    tile.addEventListener('mouseover', () => {
      if (isPainting) {
        tile.style.backgroundColor = selectedColor;
        saveTileColor(x, y, selectedColor);
      }
    });

    container.appendChild(tile);
  }
}

// Stop painting on mouse release
document.addEventListener('mouseup', () => {
  isDraggingMap = false;
  isPainting = false;
  wrapper.style.cursor = 'grab';
});

// Drag-to-pan
wrapper.addEventListener('mousedown', (e) => {
  if (e.button !== 0) return;
  isDraggingMap = true;
  wrapper.style.cursor = 'grabbing';
  startX = e.clientX;
  startY = e.clientY;
  scrollLeft = wrapper.scrollLeft;
  scrollTop = wrapper.scrollTop;
});

wrapper.addEventListener('mouseleave', () => {
  isDraggingMap = false;
  wrapper.style.cursor = 'grab';
});

wrapper.addEventListener('mouseup', () => {
  isDraggingMap = false;
  wrapper.style.cursor = 'grab';
});

wrapper.addEventListener('mousemove', (e) => {
  if (!isDraggingMap) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  wrapper.scrollLeft = scrollLeft - dx;
  wrapper.scrollTop = scrollTop - dy;
});
