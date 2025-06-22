const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');
const wrapper = document.getElementById('map-scroll-wrapper');
const paintColorInput = document.getElementById('paint-color');
const hexDisplay = document.getElementById('hex-display');
const zoomDisplay = document.getElementById('zoom-display');

const tileSize = 90;
const width = 802;
const height = 376;
const defaultColor = '#f0f0f0';
let selectedColor = paintColorInput.value;
let zoomLevel = 1;
let isDragging = false;
let dragStartX, dragStartY;
let offsetX = 0, offsetY = 0;

hexDisplay.textContent = selectedColor;

const savedTiles = JSON.parse(localStorage.getItem('tileColorsCanvas') || '{}');

function saveTileColor(x, y, color) {
  const key = `${x},${y}`;
  if (color === defaultColor) {
    delete savedTiles[key];
  } else {
    savedTiles[key] = color;
  }
  localStorage.setItem('tileColorsCanvas', JSON.stringify(savedTiles));
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.setTransform(zoomLevel, 0, 0, zoomLevel, offsetX, offsetY);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const key = `${x},${y}`;
      ctx.fillStyle = savedTiles[key] || defaultColor;
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      ctx.strokeStyle = '#999';
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
  ctx.restore();
  zoomDisplay.textContent = `Zoom: ${Math.round(zoomLevel * 100)}%`;
}

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left - offsetX) / zoomLevel;
  const y = (e.clientY - rect.top - offsetY) / zoomLevel;
  const tx = Math.floor(x / tileSize);
  const ty = Math.floor(y / tileSize);

  if (e.button === 1) {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    canvas.style.cursor = 'grabbing';
    return;
  }

  if (e.button === 0) {
    const key = `${tx},${ty}`;
    savedTiles[key] = selectedColor;
    saveTileColor(tx, ty, selectedColor);
    drawGrid();
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  canvas.style.cursor = 'default';
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  offsetX += e.clientX - dragStartX;
  offsetY += e.clientY - dragStartY;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  drawGrid();
});

canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left - offsetX) / zoomLevel;
  const y = (e.clientY - rect.top - offsetY) / zoomLevel;
  const tx = Math.floor(x / tileSize);
  const ty = Math.floor(y / tileSize);
  const key = `${tx},${ty}`;
  delete savedTiles[key];
  saveTileColor(tx, ty, defaultColor);
  drawGrid();
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomFactor = 0.1;
  zoomLevel -= Math.sign(e.deltaY) * zoomFactor;
  zoomLevel = Math.max(0.01, Math.min(2, zoomLevel));
  drawGrid();
}, { passive: false });

paintColorInput.addEventListener('input', () => {
  selectedColor = paintColorInput.value;
  hexDisplay.textContent = selectedColor;
});

window.addEventListener('load', drawGrid);
