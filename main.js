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

// Generate tiles
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

// Drag-to-pan logic
let isDragging = false;
let startX, startY, scrollLeft, scrollTop;

wrapper.addEventListener('mousedown', (e) => {
  isDragging = true;
  wrapper.style.cursor = 'grabbing';
  startX = e.clientX;
  startY = e.clientY;
  scrollLeft = wrapper.scrollLeft;
  scrollTop = wrapper.scrollTop;
});

wrapper.addEventListener('mouseleave', () => {
  isDragging = false;
  wrapper.style.cursor = 'grab';
});

wrapper.addEventListener('mouseup', () => {
  isDragging = false;
  wrapper.style.cursor = 'grab';
});

wrapper.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  wrapper.scrollLeft = scrollLeft - dx;
  wrapper.scrollTop = scrollTop - dy;
});
