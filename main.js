const container = document.getElementById('map-container');
const wrapper = document.getElementById('map-scroll-wrapper');
const paintColorInput = document.getElementById('paint-color');
const hexDisplay = document.getElementById('hex-display');
const adminPanel = document.getElementById('admin-tools');
const menuButtons = document.querySelectorAll('.menu-button');

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

// Zoom setup
let zoomLevel = 1;
const minZoom = 0.5;
const maxZoom = 2;

// Load saved tile colors
const savedTiles = JSON.parse(localStorage.getItem('tileColors') || {});

function saveTileColor(x, y, color) {
  const key = `${x},${y}`;
  if (color === defaultColor) {
    delete savedTiles[key];
  } else {
    savedTiles[key] = color;
  }
  localStorage.setItem('tileColors', JSON.stringify(savedTiles));
}

// Create tiles
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.dataset.x = x;
    tile.dataset.y = y;

    const key = `${x},${y}`;
    if (savedTiles[key]) {
      tile.style.backgroundColor = savedTiles[key];
    }

    tile.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        isPainting = true;
        tile.style.backgroundColor = selectedColor;
        saveTileColor(x, y, selectedColor);
      }
    });

    tile.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      tile.style.backgroundColor = defaultColor;
      saveTileColor(x, y, defaultColor);
    });

    tile.addEventListener('mouseover', () => {
      if (isPainting) {
        tile.style.backgroundColor = selectedColor;
        saveTileColor(x, y, selectedColor);
      }
    });

    container.appendChild(tile);
  }
}

document.addEventListener('mouseup', () => {
  isDraggingMap = false;
  isPainting = false;
  wrapper.style.cursor = 'default';
});

// ✅ Middle mouse button pans the map
wrapper.addEventListener('mousedown', (e) => {
  if (e.button !== 1) return;
  e.preventDefault();
  isDraggingMap = true;
  wrapper.style.cursor = 'grabbing';
  startX = e.clientX;
  startY = e.clientY;
  scrollLeft = wrapper.scrollLeft;
  scrollTop = wrapper.scrollTop;
});

wrapper.addEventListener('mouseleave', () => {
  isDraggingMap = false;
  wrapper.style.cursor = 'default';
});

wrapper.addEventListener('mouseup', () => {
  isDraggingMap = false;
  wrapper.style.cursor = 'default';
});

wrapper.addEventListener('mousemove', (e) => {
  if (!isDraggingMap) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  wrapper.scrollLeft = scrollLeft - dx;
  wrapper.scrollTop = scrollTop - dy;
});

// ✅ Zoom with mouse wheel
wrapper.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = Math.sign(e.deltaY);
  zoomLevel -= delta * 0.1;
  zoomLevel = Math.min(maxZoom, Math.max(minZoom, zoomLevel));
  container.style.transform = `scale(${zoomLevel})`;
}, { passive: false });

// Toggle tabs
menuButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    adminPanel.style.display = (tab === 'admin') ? 'block' : 'none';
  });
});
