import { playerState, saveGame } from './player.js';
import { allShops } from '../data/shops.js';
import { showToast } from './ui.js';

const modal = document.getElementById('character-sheet-modal');
const openBtn = document.getElementById('btn-character-sheet-hud');
const closeBtn = document.getElementById('close-char-sheet');


// Cache DOM elements
const elName = document.getElementById('char-name');
const elRace = document.getElementById('char-race');
const elClass = document.getElementById('char-class');
const elLevel = document.getElementById('char-level');
const elXp = document.getElementById('char-xp');
const elNextXp = document.getElementById('char-next-xp');
const elXpBar = document.getElementById('xp-bar');
const elGold = document.getElementById('char-gold');

// Stats
const statEls = {
    str: { val: document.getElementById('stat-str'), mod: document.getElementById('mod-str') },
    dex: { val: document.getElementById('stat-dex'), mod: document.getElementById('mod-dex') },
    con: { val: document.getElementById('stat-con'), mod: document.getElementById('mod-con') },
    int: { val: document.getElementById('stat-int'), mod: document.getElementById('mod-int') },
    wis: { val: document.getElementById('stat-wis'), mod: document.getElementById('mod-wis') },
    cha: { val: document.getElementById('stat-cha'), mod: document.getElementById('mod-cha') }
};

const inventoryGrid = document.getElementById('sheet-inventory');

// Inventory State
let currentFilter = 'all';

export function initSheetUI() {
    if (openBtn) openBtn.addEventListener('click', openSheet);
    if (closeBtn) closeBtn.addEventListener('click', closeSheet);

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeSheet();
    });

    // Inventory Tabs
    const tabs = document.querySelectorAll('.inv-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update UI
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update Filter
            currentFilter = tab.getAttribute('data-filter') || 'all';
            renderInventory();
        });
    });

    renderSheet();
}

// Global Expose for HTML onclick handlers
window.openCharSheet = openSheet;
window.openSheet = openSheet;

function openSheet() {
    renderSheet(); // Re-render to ensure data is fresh
    modal.classList.add('active');
}

function closeSheet() {
    modal.classList.remove('active');
}

function calculateMod(score) {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function renderSheet() {
    // Header
    elName.textContent = playerState.name;
    elRace.textContent = playerState.race;
    elClass.textContent = playerState.class;
    elLevel.textContent = playerState.level;

    // XP
    elXp.textContent = playerState.xp;
    elNextXp.textContent = playerState.nextLevelXp;
    const progress = Math.min(100, (playerState.xp / playerState.nextLevelXp) * 100);
    elXpBar.style.width = `${progress}%`;

    // Gold
    elGold.textContent = playerState.gold.toLocaleString();

    // Stats
    for (const [key, els] of Object.entries(statEls)) {
        const val = playerState.stats[key];
        els.val.textContent = val;
        els.mod.textContent = calculateMod(val);
    }

    // Dynamic Equipment
    renderEquipment();

    // Inventory
    renderInventory();
}

function renderEquipment() {
    // We'll target the container by class since we didn't ID it properly in previous HTML
    // Best practice: Add ID in HTML, but for now we look for .equipment-row's parent or similar
    // Actually, let's look for .col-inventory and find the equipment container area
    // The previous XML showed .col-inventory -> .equipment-row
    // The "Arcane Modern" CSS has .equipment-row used for minimal slots.
    // We will Replace that HTML content entirely.

    const colInventory = document.querySelector('.col-inventory');
    if (!colInventory) return;

    // Check if we already have the complex grid container, if not create/reset it
    let equipContainer = document.getElementById('dynamic-equipment-grid');

    if (!equipContainer) {
        // Remove old equipment row if exists
        const oldRow = colInventory.querySelector('.equipment-row');
        if (oldRow) oldRow.remove();

        equipContainer = document.createElement('div');
        equipContainer.id = 'dynamic-equipment-grid';
        equipContainer.className = 'equipment-layout';
        // Insert at top of inventory col
        colInventory.insertBefore(equipContainer, colInventory.firstChild);
    }

    if (equipContainer) equipContainer.innerHTML = ''; // Clear for draw

    // Define Layout Config
    // Slots: Head, Chest, Hands, Legs | FullBody
    // Weapons: Main1, Main2, Off | Potion Slots (Limit)
    // Jewelry: Amulet1-4, Ring1-6
    // Extras: Belt, Boots, Cape

    const slotsConfig = [
        { id: 'head', icon: 'fa-helmet-safety', label: 'Cabeza' },
        { id: 'amulet1', icon: 'fa-gem', label: 'Amuleto 1' },
        { id: 'amulet2', icon: 'fa-gem', label: 'Amuleto 2' },
        { id: 'amulet3', icon: 'fa-gem', label: 'Amuleto 3' },
        { id: 'amulet4', icon: 'fa-gem', label: 'Amuleto 4' },

        { id: 'chest', icon: 'fa-shirt', label: 'Torso' },
        { id: 'hands', icon: 'fa-hand-fist', label: 'Manos' },
        { id: 'legs', icon: 'fa-person-walking', label: 'Piernas' }, // Better than socks

        { id: 'mainHand1', icon: 'fa-khanda', label: 'Arma P.' },
        { id: 'offHand', icon: 'fa-shield-halved', label: 'Secundaria' },
        { id: 'mainHand2', icon: 'fa-khanda', label: 'Arma P. 2' },

        { id: 'belt', icon: 'fa-minus', label: 'Cinturon' }, // simplified icon
        { id: 'boots', icon: 'fa-shoe-prints', label: 'Botas' },
        { id: 'cape', icon: 'fa-user-secret', label: 'Capa' },
    ];

    // Helper to create slot
    const createSlot = (config, type = 'standard') => {
        const div = document.createElement('div');
        div.className = `equip-slot-dynamic slot-${type} slot-${config.id}`;

        // CHECK LEVEL UNLOCK
        const level = playerState.level || 1;
        let unlockLevel = 1;

        // Unlocking Rules
        switch (config.id) {
            case 'mainHand2': unlockLevel = 3; break;
            case 'offHand': unlockLevel = 3; break;

            case 'amulet2': unlockLevel = 5; break;
            case 'amulet3': unlockLevel = 15; break;
            case 'amulet4': unlockLevel = 20; break;

            case 'ring2': unlockLevel = 3; break;
            case 'ring3': unlockLevel = 5; break;
            case 'ring4': unlockLevel = 10; break;
            case 'ring5': unlockLevel = 15; break;
            case 'ring6': unlockLevel = 20; break;

            case 'boots': unlockLevel = 5; break;
            case 'belt': unlockLevel = 10; break;
            case 'cape': unlockLevel = 15; break;

            default: unlockLevel = 1;
        }

        if (level < unlockLevel) {
            div.classList.add('locked');
            div.title = `Bloqueado - Nivel ${unlockLevel}`;

            // Visual Style for Locked
            div.style.background = "rgba(0,0,0,0.5)";
            div.style.border = "1px dashed #4a3b2a";
            div.style.cursor = "not-allowed";

            // Lock Icon
            div.innerHTML = `<i class="fas fa-lock slot-icon-bg" style="font-size: 18px; color: #64748b; opacity: 0.8;"></i>`;

            // Click Handler
            div.addEventListener('click', () => {
                showToast(`🔒 Bloqueado: Nivel ${unlockLevel} requerido`);
            });

            return div;
        }

        div.innerHTML = `<i class="fas ${config.icon} slot-icon-bg"></i>`;
        div.title = config.label;

        // If item equipped
        const item = playerState.equipment[config.id];
        if (item) {
            div.classList.add('equipped');
            // Add image or content
            if (item.image) {
                div.innerHTML = `<img src="${item.image}" class="w-full h-full object-cover rounded" alt="${item.name}">`;
            } else {
                div.innerHTML += `<div class="item-overlay"></div>`;
            }
        }
        return div;
    };

    // --- RENDER LAYOUT GROUPS ---

    // 1. Jewelry Row (Top)
    const jewelryRow = document.createElement('div');
    jewelryRow.className = 'equip-row jewelry-row';
    ['amulet1', 'amulet2', 'amulet3', 'amulet4'].forEach(id => {
        jewelryRow.appendChild(createSlot({ id, icon: 'fa-gem', label: 'Amuleto' }, 'jewelry'));
    });
    equipContainer.appendChild(jewelryRow);

    // 2. Main Armor & Weapons (Middle Grid)
    const mainGrid = document.createElement('div');
    mainGrid.className = 'equip-main-grid';

    // Left: Weapons 1
    const leftWeapons = document.createElement('div');
    leftWeapons.className = 'weapon-col';
    leftWeapons.appendChild(createSlot({ id: 'mainHand1', icon: 'fa-khanda', label: 'Mano D.' }, 'weapon'));
    leftWeapons.appendChild(createSlot({ id: 'mainHand2', icon: 'fa-khanda', label: 'Dual' }, 'weapon'));

    // Center: Body
    const bodyCol = document.createElement('div');
    bodyCol.className = 'body-col';
    bodyCol.appendChild(createSlot({ id: 'head', icon: 'fa-helmet-safety', label: 'Cabeza' }, 'armor'));
    bodyCol.appendChild(createSlot({ id: 'chest', icon: 'fa-shirt', label: 'Torso' }, 'armor'));
    bodyCol.appendChild(createSlot({ id: 'legs', icon: 'fa-socks', label: 'Piernas' }, 'armor'));
    bodyCol.appendChild(createSlot({ id: 'boots', icon: 'fa-shoe-prints', label: 'Botas' }, 'armor'));

    // Right: Offhand & Gloves
    const rightCol = document.createElement('div');
    rightCol.className = 'right-col';
    rightCol.appendChild(createSlot({ id: 'offHand', icon: 'fa-shield-halved', label: 'Escudo' }, 'weapon'));
    rightCol.appendChild(createSlot({ id: 'hands', icon: 'fa-hand-fist', label: 'Guantes' }, 'armor'));
    rightCol.appendChild(createSlot({ id: 'belt', icon: 'fa-grip-lines', label: 'Cinturon' }, 'armor'));
    rightCol.appendChild(createSlot({ id: 'cape', icon: 'fa-user-secret', label: 'Capa' }, 'armor'));

    mainGrid.appendChild(leftWeapons);
    mainGrid.appendChild(bodyCol);
    mainGrid.appendChild(rightCol);
    equipContainer.appendChild(mainGrid);

    // 3. Rings (Bottom Grid 6x)
    const ringRow = document.createElement('div');
    ringRow.className = 'equip-row ring-row';
    for (let i = 1; i <= 6; i++) {
        ringRow.appendChild(createSlot({ id: `ring${i}`, icon: 'fa-ring', label: `Anillo ${i}` }, 'ring'));
    }
    equipContainer.appendChild(ringRow);
}

function renderInventory() {
    // FORCE DEBUG ITEMS IF EMPTY (Emergency Fix)
    if (!playerState.inventory || playerState.inventory.length === 0) {
        playerState.inventory = [
            { name: "Poción (Debug)", desc: "Fixing UI", image: "", type: "consumable", rarity: "common" },
            { name: "Espada (Debug)", desc: "Fixing UI", image: "", type: "weapon", rarity: "common" },
            { name: "Mapa (Debug)", desc: "Fixing UI", image: "", type: "misc", rarity: "rare" }
        ];
    }
    if (!inventoryGrid) return;
    inventoryGrid.innerHTML = '';

    // Filter Items
    let displayItems = playerState.inventory;
    if (currentFilter !== 'all') {
        displayItems = playerState.inventory.filter(item => item.type === currentFilter);
    }

    displayItems.forEach((item, index) => {
        const slot = document.createElement('div');
        slot.className = `inv-slot rarity-${item.rarity || 'common'}`;
        slot.title = item.name + '\n' + item.desc; // Simple tooltip

        // If item has image
        if (item.image) {
            const img = document.createElement('img');
            img.src = item.image;
            slot.appendChild(img);
        } else {
            // Text fallback
            slot.textContent = item.name.substring(0, 2);
        }

        slot.addEventListener('click', () => {
            console.log('Clicked item:', item);
            // Future: Show detailed card
        });

        inventoryGrid.appendChild(slot);
    });

    // Fill empty slots for grid look (optional, e.g. up to 30)
    const totalSlots = 30;
    const itemsToShow = displayItems.length;
    const emptySlots = Math.max(0, totalSlots - itemsToShow);
    for (let i = 0; i < emptySlots; i++) {
        const slot = document.createElement('div');
        slot.className = 'inv-slot empty-slot'; // New class for empty slots if needed
        // Removed inline opacity to let CSS handle it
        inventoryGrid.appendChild(slot);
    }
}

