// Canvas and drawing context
const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

// UI elements
const colorPicker = document.getElementById('color-picker');
const zoomDisplay = document.getElementById('zoom-display');

// Grid configuration
const tileSize = 30;                // Size of each tile in pixels
const gridCols = 802;              // Number of columns
const gridRows = 376;              // Number of rows
const defaultColor = '#ffffff';    // Default tile color

// State variables
let scale = 1;             // Zoom level
let offsetX = 0;           // Horizontal pan offset
let offsetY = 0;           // Vertical pan offset
let isPanning = false;     // Flag for panning mode
let startPan = {};         // Mouse start position during pan
let isPainting = false;    // Flag for painting
let isErasing = false;     // Flag for erasing
let currentTool = 'brush'; // Current selected tool
let selectedColor = '#000000';  // Current selected paint color
let savedTiles = {};            // Object storing tile colors by key

// Set initial canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 40;

// Function to draw the entire tile grid
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  for (let y = 0; y < gridRows; y++) {
    for (let x = 0; x < gridCols; x++) {
      const key = `${x},${y}`;
      const tileColor = savedTiles[key] || defaultColor;

      // Draw tile
      ctx.fillStyle = tileColor;
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

      // Draw tile border
      ctx.strokeStyle = '#ccc';
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  ctx.restore();

  // Display zoom percentage
  zoomDisplay.textContent = `Zoom: ${Math.round(scale * 100)}%`;
}

// Helper to get tile coordinates from mouse event
function getTileFromMouse(e) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left - offsetX) / scale;
  const y = (e.clientY - rect.top - offsetY) / scale;
  return [Math.floor(x / tileSize), Math.floor(y / tileSize)];
}

// Save color of tile into the map
function saveTileColor(x, y, color) {
  const key = `${x},${y}`;
  if (color === defaultColor) {
    delete savedTiles[key];
  } else {
    savedTiles[key] = color;
  }
}

// Tool switch function
function setTool(tool) {
  currentTool = tool;
}

// Painting or erasing function
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

// Flood fill function with radius and tile cap
function floodFillWithinRadius(x, y, targetColor, replacementColor, erase = false, radius = 10) {
  if (!erase && targetColor === replacementColor) return;

  const stack = [[x, y]];
  const filled = new Set();

  const maxTiles = 200; // Tile limit
  const inBounds = (cx, cy) =>
    cx >= 0 && cx < gridCols && cy >= 0 && cy < gridRows &&
    Math.abs(cx - x) <= radius && Math.abs(cy - y) <= radius;

  while (stack.length > 0 && filled.size < maxTiles) {
    const [cx, cy] = stack.pop();
    const key = `${cx},${cy}`;

    if (filled.has(key) || !inBounds(cx, cy)) continue;

    const currentColor = savedTiles[key] || defaultColor;
    if (currentColor !== targetColor) continue;

    // Apply color or erase
    if (erase) {
      saveTileColor(cx, cy, defaultColor);
    } else {
      saveTileColor(cx, cy, replacementColor);
    }

    filled.add(key);

    // Add neighboring tiles
    stack.push([cx + 1, cy]);
    stack.push([cx - 1, cy]);
    stack.push([cx, cy + 1]);
    stack.push([cx, cy - 1]);
  }
}

// Handle mouse wheel zoom
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY < 0 ? 1.1 : 0.9;
  const newScale = scale * delta;

  // Set zoom limits
  if (newScale < 0.2 || newScale > 4) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  offsetX -= (mouseX - offsetX) * (1 - delta);
  offsetY -= (mouseY - offsetY) * (1 - delta);
  scale = newScale;

  drawGrid();
});

// Mouse press event
canvas.addEventListener('mousedown', (e) => {
  if (e.button === 1) {
    // Middle mouse button starts panning
    isPanning = true;
    startPan = { x: e.clientX, y: e.clientY };
  } else if (e.button === 0) {
    // Left click starts painting
    isPainting = true;
    selectedColor = colorPicker.value;
    handlePaintOrErase(e);
  } else if (e.button === 2) {
    // Right click starts erasing
    isErasing = true;
    handlePaintOrErase(e);
  }
});

// Mouse move event
canvas.addEventListener('mousemove', (e) => {
  if (isPanning) {
    // Update offset by mouse drag
    offsetX += e.clientX - startPan.x;
    offsetY += e.clientY - startPan.y;
    startPan = { x: e.clientX, y: e.clientY };
    drawGrid();
  } else if (isPainting || isErasing) {
    handlePaintOrErase(e);
  }
});

// End mouse actions
canvas.addEventListener('mouseup', () => {
  isPanning = false;
  isPainting = false;
  isErasing = false;
});

// Disable right-click context menu
canvas.addEventListener('contextmenu', (e) => e.preventDefault());

// Initial render
drawGrid();
