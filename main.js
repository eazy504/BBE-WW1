const canvas = document.getElementById('map-canvas');
const ctx = canvas.getContext('2d');
const paintColorInput = document.getElementById('paint-color');
const hexDisplay = document.getElementById('hex-display');
const zoomDisplay = document.getElementById('zoom-display');

const tileSize = 90;
const gridCols = 802;
const gridRows = 376;

const defaultColor = '#f0f0f0';
let selectedColor = paintColorInput.value;
let zoomLevel = 1;
let viewOffsetX = 0;
let viewOffsetY = 0;
let hoveredTile = null;
let lastHoveredTile = null;
let isDragging = false;
let isPainting = false;
let isErasing = false;
let dragStartX = 0;
let dragStartY = 0;
let redrawPending = false;
let currentTool = 'brush';

const savedTiles = JSON.parse(localStorage.getItem('tileColorsCanvas') || '{}');
hexDisplay.textContent = selectedColor;

document.querySelectorAll('input[name="tool"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    currentTool = e.target.value;
  });
});

function saveTileColor(x, y, color) {
  const key = `${x},${y}`;
  if (color === defaultColor || !color) {
    delete savedTiles[key];
  } else {
    savedTiles[key] = color;
  }
  localStorage.setItem('tileColorsCanvas', JSON.stringify(savedTiles));
}

function requestRedraw() {
  if (!redrawPending) {
    redrawPending = true;
    requestAnimationFrame(drawGrid);
  }
}

function clampOffsets() {
  const mapWidth = gridCols * tileSize * zoomLevel;
  const mapHeight = gridRows * tileSize * zoomLevel;
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const minX = -mapWidth + canvasWidth;
  const maxX = 0;
  const minY = -mapHeight + canvasHeight;
  const maxY = 0;

  viewOffsetX = Math.min(Math.max(viewOffsetX, minX), maxX);
  viewOffsetY = Math.min(Math.max(viewOffsetY, minY), maxY);
}

function getTileFromMouse(e) {
  const rect = canvas.getBoundingClientRect();
  const canvasX = (e.clientX - rect.left - viewOffsetX) / zoomLevel;
  const canvasY = (e.clientY - rect.top - viewOffsetY) / zoomLevel;
  return [Math.floor(canvasX / tileSize), Math.floor(canvasY / tileSize)];
}

function drawGrid() {
  redrawPending = false;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.setTransform(zoomLevel, 0, 0, zoomLevel, viewOffsetX, viewOffsetY);

  const visibleCols = Math.ceil(canvas.width / (tileSize * zoomLevel)) + 2;
  const visibleRows = Math.ceil(canvas.height / (tileSize * zoomLevel)) + 2;
  const startX = Math.floor(-viewOffsetX / (tileSize * zoomLevel)) - 1;
  const startY = Math.floor(-viewOffsetY / (tileSize * zoomLevel)) - 1;

  for (let y = startY; y < startY + visibleRows; y++) {
    if (y < 0 || y >= gridRows) continue;
    for (let x = startX; x < startX + visibleCols; x++) {
      if (x < 0 || x >= gridCols) continue;
      const key = `${x},${y}`;
      const drawX = x * tileSize;
      const drawY = y * tileSize;
      ctx.fillStyle = savedTiles[key] || defaultColor;
      ctx.fillRect(drawX, drawY, tileSize, tileSize);
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1;
      ctx.strokeRect(drawX, drawY, tileSize, tileSize);
    }
  }

  if (hoveredTile) {
    const [x, y] = hoveredTile;
    if (x >= 0 && x < gridCols && y >= 0 && y < gridRows) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  ctx.strokeStyle = '#000';
  ctx.lineWidth = 8;
  ctx.strokeRect(0, 0, gridCols * tileSize, gridRows * tileSize);

  ctx.restore();
  zoomDisplay.textContent = `Zoom: ${Math.round(zoomLevel * 100)}%`;
}

function boundedFloodFill(x, y, targetColor, replacementColor, erase = false, maxTiles = 100) {
  if (!erase && targetColor === replacementColor) return;

  const stack = [[x, y]];
  const filled = new Set();
  const boundsCheck = (cx, cy) => cx >= 0 && cx < gridCols && cy >= 0 && cy < gridRows;

  while (stack.length > 0 && filled.size < maxTiles) {
    const [cx, cy] = stack.pop();
    const key = `${cx},${cy}`;
    if (filled.has(key)) continue;

    const currentColor = savedTiles[key] || defaultColor;
    if (currentColor !== targetColor) continue;

    if (erase) {
      delete savedTiles[key];
      saveTileColor(cx, cy, defaultColor);
    } else {
      savedTiles[key] = replacementColor;
      saveTileColor(cx, cy, replacementColor);
    }

    filled.add(key);

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1],
    ];

    for (const [nx, ny] of neighbors) {
      const neighborKey = `${nx},${ny}`;
      if (!filled.has(neighborKey) && boundsCheck(nx, ny)) {
        const neighborColor = savedTiles[neighborKey] || defaultColor;
        if (neighborColor === targetColor) {
          stack.push([nx, ny]);
        }
      }
    }
  }
}

function handlePaintOrErase(e) {
  const [tx, ty] = getTileFromMouse(e);
  if (tx >= 0 && tx < gridCols && ty >= 0 && ty < gridRows) {
    const key = `${tx},${ty}`;
    const originalColor = savedTiles[key] || defaultColor;

    if (isPainting) {
      if (currentTool === 'brush') {
        savedTiles[key] = selectedColor;
        saveTileColor(tx, ty, selectedColor);
      } else if (currentTool === 'bucket') {
        boundedFloodFill(tx, ty, originalColor, selectedColor, false, 100);
      } else if (currentTool === 'bucket-eraser') {
        boundedFloodFill(tx, ty, originalColor, null, true, 100);
      }
    } else if (isErasing) {
      delete savedTiles[key];
      saveTileColor(tx, ty, defaultColor);
    }

    requestRedraw();
  }
}

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

canvas.addEventListener('mousedown', (e) => {
  if (e.button === 1) {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    canvas.style.cursor = 'grabbing';
  } else if (e.button === 0) {
    isPainting = true;
    handlePaintOrErase(e);
  } else if (e.button === 2) {
    isErasing = true;
    handlePaintOrErase(e);
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  isPainting = false;
  isErasing = false;
  canvas.style.cursor = 'default';
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    viewOffsetX += dx;
    viewOffsetY += dy;
    clampOffsets();
    requestRedraw();
  }

  const [tx, ty] = getTileFromMouse(e);
  if (!lastHoveredTile || tx !== lastHoveredTile[0] || ty !== lastHoveredTile[1]) {
    hoveredTile = [tx, ty];
    lastHoveredTile = [tx, ty];
    requestRedraw();
  }

  if (isPainting || isErasing) {
    handlePaintOrErase(e);
  }
});

canvas.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const zoomFactor = 1.05;
  if (e.deltaY < 0) {
    zoomLevel *= zoomFactor;
  } else {
    zoomLevel /= zoomFactor;
  }
  zoomLevel = Math.max(0.02, Math.min(2, zoomLevel));
  clampOffsets();
  requestRedraw();
}, { passive: false });

paintColorInput.addEventListener('input', () => {
  selectedColor = paintColorInput.value;
  hexDisplay.textContent = selectedColor;
});

window.addEventListener('resize', () => {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  requestRedraw();
});

window.addEventListener('load', requestRedraw);
