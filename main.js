const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color-picker');
const zoomDisplay = document.getElementById('zoom-display');

const tileSize = 30;
const gridCols = 802;
const gridRows = 376;
const defaultColor = '#ffffff';

let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isPanning = false;
let startPan = {};
let isPainting = false;
let isErasing = false;
let currentTool = 'brush';
let selectedColor = '#000000';
let savedTiles = {};
let showTileBorders = true; // <== Toggle flag for borders

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 40;

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  for (let y = 0; y < gridRows; y++) {
    for (let x = 0; x < gridCols; x++) {
      const key = `${x},${y}`;
      const tileColor = savedTiles[key] || defaultColor;

      ctx.fillStyle = tileColor;
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

      if (showTileBorders) {
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }

  ctx.restore();
  zoomDisplay.textContent = `Zoom: ${Math.round(scale * 100)}%`;
}

function getTileFromMouse(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left - offsetX) / scale;
  const y = (e.clientY - rect.top - offsetY) / scale;
  return [Math.floor(x / tileSize), Math.floor(y / tileSize)];
}

function saveTileColor(x, y, color) {
  const key = `${x},${y}`;
  if (color === defaultColor) {
    delete savedTiles[key];
  } else {
    savedTiles[key] = color;
  }
}

function setTool(tool) {
  currentTool = tool;
}

function toggleBorders() {
  showTileBorders = !showTileBorders;
  drawGrid();
}

function handlePaintOrErase(e) {
  const [tx, ty] = getTileFromMouse(e);
  if (tx >= 0 && tx < gridCols && ty >= 0 && ty < gridRows) {
    const key = `${tx},${ty}`;
    const originalColor = savedTiles[key] || defaultColor;

    if (isPainting) {
      if (currentTool === 'brush') {
        saveTileColor(tx, ty, selectedColor);
      } else if (currentTool === 'bucket') {
        floodFillWithinRadius(tx, ty, originalColor, selectedColor, false, 10);
      } else if (currentTool === 'bucket-eraser') {
        floodFillWithinRadius(tx, ty, originalColor, null, true, 10);
      }
    } else if (isErasing) {
      saveTileColor(tx, ty, defaultColor);
    }

    drawGrid();
  }
}

function floodFillWithinRadius(x, y, targetColor, replacementColor, erase = false, radius = 10) {
  if (!erase && targetColor === replacementColor) return;

  const stack = [[x, y]];
  const filled = new Set();
  const maxTiles = 441; // 21x21 limit

  const inBounds = (cx, cy) =>
    cx >= 0 && cx < gridCols && cy >= 0 && cy < gridRows &&
    Math.abs(cx - x) <= radius && Math.abs(cy - y) <= radius;

  while (stack.length > 0 && filled.size < maxTiles) {
    const [cx, cy] = stack.pop();
    const key = `${cx},${cy}`;
    if (filled.has(key) || !inBounds(cx, cy)) continue;

    const currentColor = savedTiles[key] || defaultColor;
    if (currentColor !== targetColor) continue;

    if (erase) {
      saveTileColor(cx, cy, defaultColor);
    } else {
      saveTileColor(cx, cy, replacementColor);
    }

    filled.add(key);
    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
  }
}

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY < 0 ? 1.1 : 0.9;
  const newScale = scale * delta;
  if (newScale < 0.2 || newScale > 4) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  offsetX -= (mouseX - offsetX) * (1 - delta);
  offsetY -= (mouseY - offsetY) * (1 - delta);
  scale = newScale;

  drawGrid();
});

canvas.addEventListener('mousedown', (e) => {
  if (e.button === 1) {
    isPanning = true;
    startPan = { x: e.clientX, y: e.clientY };
  } else if (e.button === 0) {
    isPainting = true;
    selectedColor = colorPicker.value;
    handlePaintOrErase(e);
  } else if (e.button === 2) {
    isErasing = true;
    handlePaintOrErase(e);
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isPanning) {
    offsetX += e.clientX - startPan.x;
    offsetY += e.clientY - startPan.y;
    startPan = { x: e.clientX, y: e.clientY };
    drawGrid();
  } else if (isPainting || isErasing) {
    handlePaintOrErase(e);
  }
});

canvas.addEventListener('mouseup', () => {
  isPanning = false;
  isPainting = false;
  isErasing = false;
});

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

drawGrid();
