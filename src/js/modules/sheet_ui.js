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
        if (!els.val) continue;

        const val = playerState.stats[key];
        const mod = calculateMod(val);

        // Update Text
        els.val.textContent = val;
        els.mod.textContent = mod;

        // Inject Controls if not present (Lazy Injection)
        const parent = els.val.parentElement;
        if (!parent.querySelector('.stat-btn')) {
            // Apply relative positioning to parent for absolute buttons
            parent.style.position = 'relative';

            // Minus Button
            const btnMinus = document.createElement('button');
            btnMinus.className = "stat-btn minus absolute top-1/2 left-0 transform -translate-x-8 -translate-y-1/2 text-red-400 hover:text-white hover:scale-125 transition-all opacity-0 group-hover:opacity-100 z-50";
            btnMinus.innerHTML = '<i class="fas fa-minus-circle text-xl shadow-black drop-shadow-md"></i>';
            btnMinus.onclick = (e) => { e.stopPropagation(); updateStat(key, -1); };

            // Plus Button
            const btnPlus = document.createElement('button');
            btnPlus.className = "stat-btn plus absolute top-1/2 right-0 transform translate-x-8 -translate-y-1/2 text-green-400 hover:text-white hover:scale-125 transition-all opacity-0 group-hover:opacity-100 z-50";
            btnPlus.innerHTML = '<i class="fas fa-plus-circle text-xl shadow-black drop-shadow-md"></i>';
            btnPlus.onclick = (e) => { e.stopPropagation(); updateStat(key, 1); };

            parent.appendChild(btnMinus);
            parent.appendChild(btnPlus);
            parent.classList.add('group'); // Enable hover visibility
        }
    }

    // Dynamic Equipment
    renderEquipment();

    // Inventory
    renderInventory();
}

function updateStat(statKey, change) {
    if (!playerState.stats[statKey]) return;

    // Bounds (e.g. 1 to 20 or 30)
    const newVal = playerState.stats[statKey] + change;
    if (newVal < 1 || newVal > 30) return;

    playerState.stats[statKey] = newVal;
    saveGame();
    renderSheet(); // Re-render to update mods and values
    // showToast(`${statKey.toUpperCase()} actualizado a ${newVal}`);
}

function renderEquipment() {
    // DISABLED: Equipment slots are now static HTML in index.html
    // The new equipment grid uses data-slot attributes for JS interaction
    // This function was generating duplicate dynamic slots
    return;

    /* OLD DYNAMIC SLOTS CODE - DISABLED
    const colInventory = document.querySelector('.col-inventory');
    if (!colInventory) return;

    let equipContainer = document.getElementById('dynamic-equipment-grid');

    if (!equipContainer) {
        const oldRow = colInventory.querySelector('.equipment-row');
        if (oldRow) oldRow.remove();

        equipContainer = document.createElement('div');
        equipContainer.id = 'dynamic-equipment-grid';
        equipContainer.className = 'equipment-layout';
        colInventory.insertBefore(equipContainer, colInventory.firstChild);
    }

    if (equipContainer) equipContainer.innerHTML = '<h3 class="font-bold border-b border-[#5d4037] mb-4 font-cinzel text-lg text-[#ffb74d] tracking-widest pl-2 drop-shadow-sm">EQUIPAMIENTO</h3>';

    const slotsConfig = [
        { id: 'head', label: 'Cabeza' },
        { id: 'chest', label: 'Torso' },
        { id: 'hands', label: 'Manos' },
        { id: 'legs', label: 'Piernas' },
        { id: 'boots', label: 'Botas' },
        { id: 'mainHand1', label: 'Arma Principal' },
        { id: 'offHand', label: 'Mano Torpe' },
        { id: 'amulet1', label: 'Cuello' },
        { id: 'ring1', label: 'Anillo 1' },
        { id: 'ring2', label: 'Anillo 2' }
    ];

    // GRIMOIRE CARD style rendering
    const createSlot = (config) => {
        const item = playerState.equipment[config.id];
        const slotDiv = document.createElement('div');
        slotDiv.className = 'equip-slot-dynamic group';

        slotDiv.innerHTML = `
            <div class="flex flex-col w-full">
                <span class="font-bold text-[10px] text-[#a1887f] uppercase tracking-widest mb-1 font-serif">${config.label}</span>
                <span class="${item ? 'text-[#ffcc80] font-bold font-cinzel text-base shadow-black drop-shadow-md' : 'text-[#5d4037] italic text-sm'} truncate">
                    ${item ? item.name : 'Vacío'}
                </span>
            </div>
            ${item ? '<div class="w-8 h-8 flex items-center justify-center rounded-full bg-[#3e2723] text-[#ef9a9a] opacity-0 group-hover:opacity-100 transition-all border border-[#5d4037] hover:bg-[#5d4037]"><i class="fas fa-times"></i></div>' : '<i class="fas fa-plus text-[#3e2723] opacity-50"></i>'}
        `;

        if (item) {
            slotDiv.style.cursor = "pointer";
            slotDiv.onclick = () => {
                unequipItem(config.id);
                showToast(`Desequipado: ${item.name}`);
            }
        }

        return slotDiv;
    };

    slotsConfig.forEach(config => {
        equipContainer.appendChild(createSlot(config));
    });
    */
}


// HELPER: Get fallback image based on type
function getTypeImage(type, rarity) {
    const t = type.toLowerCase();
    if (t.includes('poc') || t.includes('potion') || t.includes('cons')) return 'img/items/default_potion.png';
    if (t.includes('arma') || t.includes('weapon') || t.includes('espada') || t.includes('hacha')) return 'img/items/default_weapon.png';
    if (t.includes('pergamino') || t.includes('scroll') || t.includes('libro')) return 'img/items/default_scroll.png';
    if (t.includes('armadura') || t.includes('armor') || t.includes('escudo') || t.includes('capa')) return 'img/items/default_armor.png';
    if (t.includes('anillo') || t.includes('collar') || t.includes('amulet') || t.includes('joy')) return 'img/items/default_jewelry.png';

    return 'img/items/default_misc.png';
}

function renderInventory() {
    // Get element directly to avoid initialization issues
    const grid = document.getElementById('sheet-inventory');
    if (!grid) {
        console.error('[SHEET] sheet-inventory element not found!');
        return;
    }

    grid.innerHTML = '';
    grid.className = "inventory-grid";

    // Filter Items
    let displayItems = playerState.inventory;
    if (currentFilter !== 'all') {
        displayItems = playerState.inventory.filter(item => item.type === currentFilter);
    }

    // If no items, show empty slots
    if (displayItems.length === 0) {
        for (let i = 0; i < 6; i++) {
            const emptySlot = document.createElement('div');
            emptySlot.className = 'inv-row opacity-50';
            emptySlot.innerHTML = `
                <div class="flex items-center gap-3 w-full">
                    <div class="w-10 h-10 rounded-md bg-[#1a0f0a] border border-[#3e2723] flex items-center justify-center">
                        <i class="fas fa-box-open text-[#3e2723]"></i>
                    </div>
                    <span class="text-[#5d4037] italic text-sm">Slot vacío</span>
                </div>
            `;
            grid.appendChild(emptySlot);
        }
        return;
    }

    displayItems.forEach((item, index) => {
        const slot = document.createElement('div');
        slot.className = 'inv-row group cursor-pointer';

        // Icon Logic
        let iconClass = 'fa-box';
        const t = (item.type || '').toLowerCase();
        if (t.includes('weapon') || t.includes('arma')) iconClass = 'fa-sword';
        if (t.includes('armor') || t.includes('armadura')) iconClass = 'fa-shield-alt';
        if (t.includes('potion') || t.includes('consumable') || t.includes('poción')) iconClass = 'fa-flask';
        if (t.includes('ring') || t.includes('anillo') || t.includes('accessory')) iconClass = 'fa-ring';
        if (t.includes('scroll') || t.includes('pergamino')) iconClass = 'fa-scroll';
        if (t.includes('key') || t.includes('llave')) iconClass = 'fa-key';
        if (t.includes('misc')) iconClass = 'fa-gem';

        const rarityColor = {
            'common': '#bcaaa4',
            'uncommon': '#66bb6a',
            'rare': '#42a5f5',
            'epic': '#ab47bc',
            'legendary': '#ffa726',
            'exotic': '#ef5350',
            'prohibido': '#ab47bc'
        }[item.rarity?.toLowerCase()] || '#bcaaa4';

        slot.innerHTML = `
            <div class="flex items-center gap-3 w-full overflow-hidden">
                <div class="w-12 h-12 min-w-[48px] rounded-md bg-[#1a0f0a] border-2 border-[#5d4037] flex items-center justify-center shadow-inner group-hover:border-[#ffb74d] transition-colors relative">
                    <i class="fas ${iconClass} text-xl relative z-10" style="color: ${rarityColor}"></i>
                    <div class="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)]"></div>
                </div>
                <div class="flex flex-col overflow-hidden">
                    <span class="inv-row-name group-hover:text-[#ffe0b2] transition-colors truncate font-cinzel text-[#d7ccc8] font-semibold">${item.name}</span>
                    <span class="text-[10px] uppercase tracking-widest font-bold" style="color: ${rarityColor}">${item.rarity || 'común'}</span>
                </div>
            </div>
            <div class="flex items-center gap-2 shrink-0 ml-2">
                <span class="inv-row-qty text-[#ffcc80] font-mono bg-[#1a0f0a] px-2 py-0.5 rounded border border-[#3e2723]">x${item.qty || 1}</span>
            </div>
        `;

        slot.addEventListener('click', () => {
            showItemDetailsModal(item);
        });

        grid.appendChild(slot);
    });

    // Fill remaining slots up to 30 total
    const TOTAL_SLOTS = 30;
    const emptySlots = TOTAL_SLOTS - displayItems.length;
    for (let i = 0; i < emptySlots; i++) {
        const emptySlot = document.createElement('div');
        emptySlot.className = 'inv-row opacity-40 cursor-default';
        emptySlot.innerHTML = `
            <div class="flex items-center gap-3 w-full">
                <div class="w-12 h-12 min-w-[48px] rounded-md bg-[#0f0a08] border-2 border-dashed border-[#3e2723] flex items-center justify-center">
                    <i class="fas fa-plus text-[#3e2723] text-sm"></i>
                </div>
                <span class="text-[#5d4037] italic text-xs">Vacío</span>
            </div>
        `;
        grid.appendChild(emptySlot);
    }

    console.log(`[SHEET] Rendered ${displayItems.length} items + ${emptySlots} empty slots`);
}

// Item Details Modal
function showItemDetailsModal(item) {
    // Remove existing modal if any
    const existing = document.getElementById('item-details-modal');
    if (existing) existing.remove();

    const rarityColors = {
        'common': { bg: '#3e2723', border: '#5d4037', text: '#bcaaa4' },
        'uncommon': { bg: '#1a3a1a', border: '#2e7d32', text: '#81c784' },
        'rare': { bg: '#1a237e', border: '#3949ab', text: '#7986cb' },
        'epic': { bg: '#4a148c', border: '#7b1fa2', text: '#ba68c8' },
        'legendary': { bg: '#4a2c00', border: '#ff8f00', text: '#ffb74d' },
        'exotic': { bg: '#4a0000', border: '#c62828', text: '#ef9a9a' }
    };

    const colors = rarityColors[item.rarity?.toLowerCase()] || rarityColors.common;

    // Icon based on type
    let iconClass = 'fa-box';
    const t = (item.type || '').toLowerCase();
    if (t.includes('weapon') || t.includes('arma')) iconClass = 'fa-sword';
    if (t.includes('armor') || t.includes('armadura')) iconClass = 'fa-shield-alt';
    if (t.includes('potion') || t.includes('consumable')) iconClass = 'fa-flask';
    if (t.includes('ring') || t.includes('accessory')) iconClass = 'fa-ring';
    if (t.includes('scroll') || t.includes('pergamino')) iconClass = 'fa-scroll';
    if (t.includes('key') || t.includes('llave')) iconClass = 'fa-key';

    const modal = document.createElement('div');
    modal.id = 'item-details-modal';
    modal.className = 'fixed inset-0 z-[10000] flex items-center justify-center';
    modal.innerHTML = `
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" onclick="this.parentElement.remove()"></div>
        <div class="relative max-w-md w-full mx-4 animate-fade-in" style="animation: fadeInUp 0.2s ease-out">
            <div class="rounded-xl overflow-hidden shadow-2xl" style="background: ${colors.bg}; border: 2px solid ${colors.border}">
                <!-- Header -->
                <div class="p-6 border-b" style="border-color: ${colors.border}30">
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 rounded-lg flex items-center justify-center" style="background: rgba(0,0,0,0.3); border: 2px solid ${colors.border}">
                            <i class="fas ${iconClass} text-3xl" style="color: ${colors.text}"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="font-cinzel text-xl font-bold" style="color: ${colors.text}">${item.name}</h3>
                            <p class="text-xs uppercase tracking-widest opacity-70" style="color: ${colors.text}">${item.rarity || 'Común'} · ${item.type || 'Objeto'}</p>
                        </div>
                        <span class="text-lg font-mono font-bold px-3 py-1 rounded" style="background: rgba(0,0,0,0.3); color: ${colors.text}">x${item.qty || 1}</span>
                    </div>
                </div>
                
                <!-- Description -->
                <div class="p-6">
                    <p class="text-sm italic leading-relaxed opacity-90" style="color: ${colors.text}">"${item.desc || 'Sin descripción disponible.'}"</p>
                </div>
                
                <!-- Actions -->
                <div class="p-4 flex gap-3 border-t" style="border-color: ${colors.border}30; background: rgba(0,0,0,0.2)">
                    ${item.type === 'consumable' || t.includes('potion') ? `
                        <button onclick="useItem('${item.name}'); this.closest('#item-details-modal').remove();" 
                            class="flex-1 py-3 rounded-lg font-bold uppercase tracking-widest text-sm transition-all hover:scale-[1.02]"
                            style="background: linear-gradient(135deg, #2e7d32, #1b5e20); color: white; border: 1px solid #4caf50">
                            <i class="fas fa-flask mr-2"></i>Usar
                        </button>
                    ` : ''}
                    <button onclick="this.closest('#item-details-modal').remove();" 
                        class="flex-1 py-3 rounded-lg font-bold uppercase tracking-widest text-sm transition-all hover:scale-[1.02]"
                        style="background: rgba(255,255,255,0.1); color: ${colors.text}; border: 1px solid ${colors.border}50">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// Use item function
function useItem(itemName) {
    const index = playerState.inventory.findIndex(i => i.name === itemName);
    if (index === -1) return;

    const item = playerState.inventory[index];

    // Reduce quantity or remove
    if (item.qty && item.qty > 1) {
        item.qty--;
    } else {
        playerState.inventory.splice(index, 1);
    }

    saveGame();
    renderInventory();
    showToast(`Usaste: ${itemName}`);
}

// Global expose
window.useItem = useItem;

