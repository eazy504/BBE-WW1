# BBE-WW1

📜 Nation Sim Map Editor
Welcome to the Nation Sim Map Editor – a custom map interface built for a long-term roleplaying simulation inspired by Hearts of Iron IV and historical nation management games. This tool is designed to be the first step in creating a web-based interactive game where users can view, color, and later manage geopolitical territories in a persistent world environment.

🎯 Project Goal
The goal of this project is to build the frontend interface for a tile-based map system that will serve as the foundation for a multiplayer nation simulation game. Each player will control a historical nation and manage warfare, diplomacy, production, and territory over time.

This map editor provides administrative tools for creating and editing territory ownership visually, with plans for backend integration in the future.

✅ Features
🔳 Grid-Based Tile Map: 802 × 376 grid (301,552 total tiles), scalable and centered in a framed view.

🖌️ Map Painter Tool: Admins can select any color via hex code or color picker and click to paint individual tiles.

🧭 Zoom and Pan:

Zoom via mouse wheel with visual zoom percentage

Pan with middle mouse drag

💾 Persistent Colors: All painted tile colors are saved in localStorage

🗺️ Auto-Fit Map: Automatically scales and centers the map on page load

🎛️ Admin Menu Bar: Toggle tools and settings from a clean top menu

🛠️ Tech Stack
HTML5 + CSS3 (no frameworks)

Vanilla JavaScript

⚙️ Self-contained – no external libraries or dependencies

🚧 Planned Future Features
🧩 Editable borders and tile properties (e.g. terrain, ownership, name)

🌍 Historical overlays and toggles (1914 borders, alliances, etc.)

📡 Backend integration for multiplayer synchronization and persistence

🔐 User roles (Admin, Player, Viewer)

📊 Stats display, troop movement, and resource overlays

🧪 How to Use
Clone the repository

bash
Copy
Edit
git clone https://github.com/your-username/nation-sim-map-editor.git
cd nation-sim-map-editor
Open index.html in a browser
This project is static and requires no build tools.

📁 Project Structure
bash
Copy
Edit
├── index.html          # Main webpage
├── styles.css          # All UI and map styles
├── main.js             # Core logic for tile rendering, zoom, painting, and menu
└── README.md           # Project overview and documentation
🙌 Contributions
This project is under active development. Collaboration and pull requests are welcome, especially for:

GeoJSON border integration

Save/load map data to files or a server

UI/UX improvements

📬 Contact
Developed by Ethan B.
For questions or contributions, open an issue or reach out directly.
