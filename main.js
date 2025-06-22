const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');
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
let viewOffsetX = 0, viewOffsetY = 0;

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
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.setTransform(zoomLevel, 0, 0, zoomLevel, viewOffsetX, viewOffsetY);

  const cols = Math.ceil(canvas.width / (tileSize * zoomLevel)) + 2;
  const rows = Math.ceil(canvas.height / (tileSize * zoomLevel)) + 2;
  const startX = Math.floor(-viewOffsetX / (tileSize * zoomLevel));
  const startY = Math.floor(-viewOffsetY / (tileSize * zoomLevel));

  for (let y = startY; y < startY + rows; y++) {
    if (y < 0 || y >= height) continue;
    for (let x = startX; x < startX + cols; x++) {
      if (x < 0 || x >= width) continue;
      const key = `${x},${y}`;
      ctx.fillStyle = savedTiles[key] || defaultColor;
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1;
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  // Draw outer map border (thicker)
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 8;
  ctx.strokeRect(0, 0, width * tileSize, height * tileSize);

  ctx.restore();
  zoomDisplay.textContent = `Zoom: ${Math.round(zoomLevel * 100)}%`;
}

function clampOffsets() {
  const mapWidth = width * tileSize * zoomLevel;
  const mapHeight = height * tileSize * zoomLevel;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const minX = -mapWidth + canvasWidth;
  const maxX = 0;
  const minY = -mapHeight + canvasHeight;
  const maxY = 0;

  viewOffsetX = Math.min(Math.max(viewOffsetX, minX), maxX);
  viewOffsetY = Math.min(Math.max(viewOffsetY, minY), maxY);
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - document.getElementById('menu-bar').offsetHeight;

canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const canvasX = (e.clientX - rect.left - viewOffsetX) / zoomLevel;
  const canvasY = (e.clientY - rect.top - viewOffsetY) / zoomLevel;
  const tx = Math.floor(canvasX / tileSize);
  const ty = Math.floor(canvasY / tileSize);

  if (e.button === 1) {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    canvas.style.cursor = 'grabbing';
    return;
  }

  if (e.button === 0) {
    if (tx >= 0 && tx < width && ty >= 0 && ty < height) {
      const key = `${tx},${ty}`;
      savedTiles[key] = selectedColor;
      saveTileColor(tx, ty, selectedColor);
      drawGrid();
    }
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  canvas.style.cursor = 'default';
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  viewOffsetX += e.clientX - dragStartX;
  viewOffsetY += e.clientY - dragStartY;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  clampOffsets();
  drawGrid();
});

canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const canvasX = (e.clientX - rect.left - viewOffsetX) / zoomLevel;
  const canvasY = (e.clientY - rect.top - viewOffsetY) / zoomLevel;
  const tx = Math.floor(canvasX / tileSize);
  const ty = Math.floor(canvasY / tileSize);
  if (tx >= 0 && tx < width && ty >= 0 && ty < height) {
    const key = `${tx},${ty}`;
    delete savedTiles[key];
    saveTileColor(tx, ty, defaultColor);
    drawGrid();
  }
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomFactor = 0.1;
  zoomLevel -= Math.sign(e.deltaY) * zoomFactor;
  zoomLevel = Math.max(0.05, Math.min(2, zoomLevel));
  clampOffsets();
  drawGrid();
}, { passive: false });

paintColorInput.addEventListener('input', () => {
  selectedColor = paintColorInput.value;
  hexDisplay.textContent = selectedColor;
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - document.getElementById('menu-bar').offsetHeight;
  drawGrid();
});

window.addEventListener('load', drawGrid);
