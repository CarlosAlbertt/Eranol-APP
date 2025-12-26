import { state } from '../../state.js';
import { allShops } from '../data/shops.js';
import { showToast, updateGoldDisplay, initPatronage } from './ui.js';
import { addToCart, initCart } from './cart.js';
import { drawRouletteWheel } from './games.js';
import { loadGame, addGold, addItem } from './player.js';
import { enterTavern, closeTavern } from './taverns.js';

// Expose tavern functions globally
window.enterTavern = enterTavern;
window.closeTavern = closeTavern;

// import { renderMap } from './map.js';
import { initSheetUI } from './sheet_ui.js';

let appRingTitle;
let appRingSubtitle;
let patronageArea;
let landingScreen;
let appScreen;
let navContainer;
let emptyRingMsg;
let shopTitle;
let shopDesc;
let shopIcon;
let bgIcon;
let inventoryGrid;
let appContainer;
let itemModal;
let itemModalContent;
let modalTitle;
let modalDesc;
let modalPrice;
let modalType;
let modalRarity;
let modalAddBtn;
let modalHeaderBg;
let modalIcon;

// Rarity Colors Map
const rarityColors = {
    'Común': '#9ca3af', 'Poco Común': '#22c55e', 'Rara': '#3b82f6',
    'Muy Rara': '#a855f7', 'Legendaria': '#fbbf24', 'Exótica': '#f43f5e',
    'Consumible': '#2dd4bf', 'Mágico': '#60a5fa', 'Ilegal': '#ef4444',
    'Prohibido': '#000000', 'Pacto': '#881337', 'Caos': '#7c3aed', 'Nacional': '#fbbf24'
};

// --- NAVIGATION SYSTEM ---
let cityIndexView;

export function initNavigation() {
    loadGame(); // START: Load saved state

    appRingTitle = document.getElementById('app-ring-title');
    appRingSubtitle = document.getElementById('app-ring-subtitle');
    patronageArea = document.getElementById('patronage-area');
    landingScreen = document.getElementById('landing-screen');
    appScreen = document.getElementById('app');
    navContainer = document.getElementById('shop-nav');
    emptyRingMsg = document.getElementById('empty-ring-msg');
    shopTitle = document.getElementById('shop-title');
    shopDesc = document.getElementById('shop-desc');
    shopIcon = document.getElementById('shop-icon');
    bgIcon = document.getElementById('bg-icon');
    inventoryGrid = document.getElementById('inventory-grid');
    appContainer = document.getElementById('app');
    cityIndexView = document.getElementById('city-index-view');

    // Cache Modal Elements
    itemModal = document.getElementById('item-modal');
    itemModalContent = document.getElementById('item-modal-content');
    modalTitle = document.getElementById('modal-title');
    modalDesc = document.getElementById('modal-desc');
    modalPrice = document.getElementById('modal-price');
    modalType = document.getElementById('modal-type');
    modalRarity = document.getElementById('modal-rarity');
    modalAddBtn = document.getElementById('modal-add-btn');
    modalHeaderBg = document.getElementById('modal-header-bg');
    modalIcon = document.getElementById('modal-icon');

    // Global Expose
    window.enterMarket = enterMarket;
    window.enterCityIndex = enterCityIndex; // NEW MAIN HUB
    window.enterLandingScreen = enterLandingScreen; // NEW MARKET HUB
    window.enterGlobalMap = enterCityIndex; // Legacy redirection
    window.exitMarket = exitMarket;
    window.loadShop = loadShop;
    window.closeModal = closeModal;

    // Initialize Sub-Modules
    initCart();
    initPatronage();
    initSheetUI();

    // Initial UI Sync
    updateGoldDisplay();

    // Hide sidebars initially
    if (document.getElementById('hub-sidebar')) document.getElementById('hub-sidebar').classList.add('hidden');
    if (document.getElementById('ring-sidebar')) document.getElementById('ring-sidebar').classList.add('hidden');
}

// NEW: Main Hub (City Index)
export function enterCityIndex() {
    console.log('[NAV] enterCityIndex called. currentRing:', state.currentRing);

    // RESET: If coming from Ring 0 (Black Market), reset to Ring 1
    if (state.currentRing === 0) {
        state.currentRing = 1;
        console.log('[NAV] Reset currentRing to 1');
    }

    // Hide Login/Landing/App
    if (document.getElementById('login-screen')) document.getElementById('login-screen').classList.add('hidden');

    // FORCE HIDE: Landing Screen (Ring Selection) with z-50 override
    if (landingScreen) {
        landingScreen.classList.add('hidden');
        landingScreen.classList.remove('animate-fade-in');
        landingScreen.style.display = 'none'; // FORCE
        console.log('[NAV] landingScreen hidden');
    }

    // FORCE HIDE: Casino View if open
    const casinoView = document.getElementById('casino-view');
    if (casinoView) {
        casinoView.classList.add('hidden');
        casinoView.style.display = 'none';
    }

    // Show City Index
    if (cityIndexView) {
        cityIndexView.classList.remove('hidden', 'animate-fade-out');
        cityIndexView.classList.add('animate-fade-in');
        cityIndexView.style.display = ''; // Allow to show
        console.log('[NAV] cityIndexView shown');
    }

    // Show appScreen container
    if (appScreen) {
        appScreen.classList.remove('hidden', 'opacity-0', 'scale-95');
        appScreen.classList.add('animate-fade-in');
        appScreen.style.display = ''; // Allow to show
    }

    // Hide App Specifics (Ring Sidebar, Inventory, etc.) to show clean Index
    if (document.getElementById('ring-sidebar')) document.getElementById('ring-sidebar').classList.add('hidden');

    // STRICT RESET of views
    const districtView = document.getElementById('district-selection-view');
    if (districtView) {
        districtView.classList.add('hidden');
        districtView.style.display = 'none'; // Force Reset
    }

    const invGrid = document.getElementById('inventory-grid');
    if (invGrid) {
        invGrid.classList.add('hidden');
        invGrid.style.display = 'none'; // Force Reset
    }

    if (document.getElementById('market-controls')) document.getElementById('market-controls').classList.add('hidden');

    // Show Sidebar (Profile)
    if (document.getElementById('game-area-wrapper')) document.getElementById('game-area-wrapper').classList.remove('hidden');
    if (document.getElementById('hub-sidebar')) document.getElementById('hub-sidebar').classList.remove('hidden');

    // FIX: Populate Header for Hub
    if (shopTitle) shopTitle.innerText = "Capital Eranol";
    if (shopDesc) shopDesc.innerText = "La Ciudad de los Mil Anillos. Centro de comercio y poder.";
    if (shopIcon) shopIcon.innerHTML = '<i class="fas fa-landmark"></i>';
    if (bgIcon) bgIcon.innerHTML = '<i class="fas fa-landmark"></i>';

    // RESET THEME
    if (appScreen) appScreen.className = "relative z-10 flex flex-col md:flex-row h-full transition-colors duration-500 theme-black-market"; // Default theme
}

// NEW: Market Hub (Ring Selection)
export function enterLandingScreen() {
    console.log('[NAV] enterLandingScreen called');

    if (cityIndexView) {
        cityIndexView.classList.add('hidden');
        cityIndexView.style.display = 'none';
    }

    if (appScreen) {
        appScreen.classList.add('hidden');
        appScreen.classList.remove('flex');
        appScreen.style.display = 'none';
    }

    if (landingScreen) {
        landingScreen.classList.remove('hidden', 'animate-fade-out', 'opacity-0', 'scale-95');
        landingScreen.classList.add('animate-fade-in');
        landingScreen.style.display = 'flex'; // FORCE SHOW - reset the style.display='none'
        landingScreen.style.opacity = '1';
        console.log('[NAV] landingScreen shown');
        // Reset App Theme just in case, though Landing Screen covers it usually
        if (appScreen) appScreen.className = "relative z-10 flex flex-col md:flex-row h-full transition-colors duration-500 theme-black-market hidden";
    }
}

// Legacy compat
export function enterGlobalMap() {
    enterCityIndex();
}

import { playerState } from './player.js'; // Ensure we have access to player data

export function enterMarket(ringLevel) {
    try {
        // BLACK MARKET AUTHENTICATION CHECK
        if (ringLevel === 0 && !state.blackMarketAuthenticated) {
            console.log('[NAV] Ring 0 requires authentication. Showing login modal.');
            openLoginModal();
            return;
        }

        // ULTIMATE PERMISSION CHECK (Fix for Sombra)
        const name = state.currentAdventurer || playerState.name || "";
        if (name.toLowerCase() === "sombra" || name.toLowerCase() === "asolador" || name.toLowerCase() === "admin") {
            state.currentUserMaxRing = 4;
            state.currentAdventurer = name; // Ensure state is synced
        }

        if (ringLevel !== 0 && ringLevel > state.currentUserMaxRing) {
            showToast(`⛔ Bloqueado: Nivel ${ringLevel} (Tu Rango: ${state.currentUserMaxRing})`);
            return;
        }

        // Show Sidebar (Merged, always visible if wrapper is visible)
        if (document.getElementById('game-area-wrapper')) document.getElementById('game-area-wrapper').classList.remove('hidden');

        // SHOW SIDEBARS LOGIC
        // User Request: "deberían salir las tiendas en el sidebar izquierdo, no el HUD"

        // Hide Hub Sidebar (Profile/Stats)
        if (document.getElementById('hub-sidebar')) document.getElementById('hub-sidebar').classList.add('hidden');

        // Show Ring Sidebar (Shop List)
        if (document.getElementById('ring-sidebar')) document.getElementById('ring-sidebar').classList.remove('hidden');

        // Show Back Button Container in Market Mode
        const hubNav = document.getElementById('hub-navigation');
        if (hubNav) hubNav.classList.remove('hidden');

        // CRITICAL FIX: Ensure Parent Container is Visible
        const marketControls = document.getElementById('market-controls');
        if (marketControls) marketControls.classList.remove('hidden');

        // Show Back Button in Market Mode

        // Show Back Button in Market Mode
        // Show Back Button in Market Mode
        const backBtn = document.getElementById('btn-back-to-hub');
        if (backBtn) {
            backBtn.classList.remove('hidden');
            // Force reset to "Exit Ring" behavior every time we enter market
            // Clone to remove old listeners (like from previous shop visits if any logic persisted)
            const newBackBtn = backBtn.cloneNode(true);
            backBtn.parentNode.replaceChild(newBackBtn, backBtn);

            newBackBtn.innerHTML = '<i class="fas fa-city mr-1"></i> Salir del Anillo';
            newBackBtn.onclick = () => exitMarket();
        }

        if (allShops) {
            state.activeShops = allShops.filter(s => s.ring === ringLevel);
        } else {
            console.error("allShops not defined!");
            state.activeShops = [];
        }

        state.currentRing = ringLevel; // Update State
        let ringName = "", ringSub = "";
        if (ringLevel === 1) { ringName = "El Mercado de Hierro"; ringSub = "Anillo 1 (Rangos E-D)"; }
        if (ringLevel === 2) { ringName = "La Plaza de Plata"; ringSub = "Anillo 2 (Rangos C-B)"; }
        if (ringLevel === 3) { ringName = "La Cumbre Dorada"; ringSub = "Anillo 3 (Rangos A-S)"; }
        if (ringLevel === 0) { ringName = "Mercado Negro"; ringSub = "Anillo 0 (Sin Ley)"; }

        if (appRingTitle) appRingTitle.innerText = ringName;
        if (appRingSubtitle) appRingSubtitle.innerText = ringSub;

        // Update District View Titles
        const distTitle = document.getElementById('district-title');
        const distSub = document.getElementById('district-subtitle');
        if (distTitle) distTitle.innerText = ringName;
        if (distSub) distSub.innerText = ringSub;

        if (ringLevel === 0) {
            if (patronageArea) patronageArea.classList.remove('hidden');
            if (document.getElementById('bank-area')) document.getElementById('bank-area').classList.remove('hidden');
            // Show Cursed Wheel, Hide Normal Wheel
            if (document.getElementById('roulette-area')) document.getElementById('roulette-area').classList.add('hidden');
            if (document.getElementById('cursed-roulette-area')) document.getElementById('cursed-roulette-area').classList.remove('hidden');
        } else {
            if (patronageArea) patronageArea.classList.add('hidden');
            if (document.getElementById('bank-area')) document.getElementById('bank-area').classList.add('hidden');
            // Show Normal Wheel, Hide Cursed Wheel
            if (document.getElementById('roulette-area')) document.getElementById('roulette-area').classList.remove('hidden');
            if (document.getElementById('cursed-roulette-area')) document.getElementById('cursed-roulette-area').classList.add('hidden');
        }

        // Force update of currency display (Gold -> Blood or vice versa)
        updateGoldDisplay();

        // Map Integration - REMOVED PER USER REQUEST
        // if (document.getElementById('market-controls')) document.getElementById('market-controls').classList.remove('hidden');

        // Hide Cart Button (Map/District Mode)
        const cartBtn = document.getElementById('cart-fab-btn');
        if (cartBtn) cartBtn.classList.add('hidden');

        // Map Render Removed
        // renderMap(ringLevel);

        if (landingScreen) {
            landingScreen.classList.add('animate-fade-out');
            landingScreen.style.display = 'none'; // Also hide with style
        }
        setTimeout(() => {
            if (landingScreen) {
                landingScreen.classList.add('hidden');
                landingScreen.style.display = 'none';
            }
            if (appScreen) {
                appScreen.classList.remove('hidden');
                appScreen.style.display = 'flex'; // CRITICAL: Reset style.display
                void appScreen.offsetWidth;
                appScreen.classList.remove('opacity-0', 'scale-95');
                appScreen.classList.add('animate-fade-in');
            }

            // RENDER DISTRICT GRID
            renderDistrictCards();

            // RENDER SIDEBAR NAV
            renderNav();

            // View State: Show District Grid, Hide Items
            const grid = document.getElementById('inventory-grid');
            const casino = document.getElementById('casino-view');
            const districtView = document.getElementById('district-selection-view');

            if (grid) {
                grid.innerHTML = ''; // CLEAR PREVIOUS ITEMS
                grid.classList.add('hidden');
                grid.style.display = 'none'; // Force Reset
            }
            if (casino) casino.classList.add('hidden');

            // AUTO-LOAD FIRST SHOP LOGIC
            // Instead of showing the District View, we jump straight to the first shop
            if (state.activeShops && state.activeShops.length > 0) {
                // If there are shops, load the first one immediately
                // We don't need to show districtView because loadShop will hide it
                loadShop(0);
            } else {
                // Fallback: If no shops, show the empty district view
                if (districtView) {
                    districtView.classList.remove('hidden');
                    districtView.style.display = 'block';
                }
            }

        }, 500);

    } catch (e) {
        console.error("Critical Error in enterMarket:", e);
        showToast("Error al entrar al mercado: " + e.message);
    }
}

// --- MAP MODAL SYSTEM ---
export function openMapModal() {
    console.log("Map is disabled.");
}

export function closeMapModal() {
    // No-op
}

// Global expose
window.openMapModal = openMapModal;
window.closeMapModal = closeMapModal;

export function exitMarket() {
    if (appScreen) appScreen.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
        if (appScreen) appScreen.classList.add('hidden');
        enterLandingScreen(); // Use new helper

        // RESET Views
        if (document.getElementById('district-selection-view')) document.getElementById('district-selection-view').classList.add('hidden');
        if (document.getElementById('inventory-grid')) document.getElementById('inventory-grid').classList.add('hidden');
    }, 500);
}

export function renderNav() {
    const navContainer = document.getElementById('shop-nav'); // Explicitly get element
    if (!navContainer) return;
    navContainer.innerHTML = '';
    const isRingZero = state.activeShops.length > 0 && state.activeShops[0].ring === 0;
    // Removed className overwrite to preserve Sidebar layout styles
    // if (isRingZero) navContainer.className = "flex-1 overflow-y-auto p-6 ring0-bg-pattern space-y-6 overflow-x-hidden";
    // else navContainer.className = "flex-1 overflow-y-auto p-4 space-y-4";
    // Instead, we just ensure the internal spacing is managed by the buttons or a wrapper if needed.
    // The container "shop-nav" has its own styles in index.html (max-h, scroll, etc).

    state.activeShops.forEach((shop, index) => {
        const btn = document.createElement('button');
        const isActive = index === state.currentShopIndex;
        if (isRingZero) {
            const randomRot = (index % 2 === 0 ? 1 : -1) * (2 + (index % 3));
            btn.className = `w-full h-24 ring0-card relative rounded group text-left overflow-hidden ${isActive ? 'active' : ''}`;
            btn.style.transform = isActive ? 'scale(1.1) rotate(0deg)' : `rotate(${randomRot}deg)`;
            btn.innerHTML = `<div class="absolute inset-0 bg-black/80 group-hover:bg-black/40 transition-colors duration-300"></div><div class="relative z-10 h-full p-3 flex flex-col justify-between"><div class="flex justify-between items-start"><div class="bg-black/80 backdrop-blur text-red-500 border border-red-900/50 px-2 py-1 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2"><i class="fas ${shop.icon}"></i> CLASIFICADO</div>${isActive ? '<div class="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>' : ''}</div><div class="bg-black/90 p-2 border-l-2 border-red-600 transform translate-y-2 group-hover:translate-y-0 transition-transform"><div class="font-bold text-gray-200 text-sm leading-none font-mono uppercase truncate">${shop.name}</div><div class="text-[9px] text-red-400/70 mt-1 truncate font-mono">ID: ${shop.id.toUpperCase()}</div></div></div>`;
        } else {
            btn.className = `relative w-full h-28 rounded-xl overflow-hidden text-left flex items-end p-4 transition-all duration-500 group border border-transparent ${isActive ? 'shadow-[0_0_25px_rgba(255,255,255,0.15)] scale-105 ring-1 ring-white/50 z-10' : 'hover:scale-[1.02] hover:shadow-lg opacity-80 hover:opacity-100'}`;
            btn.innerHTML = `<div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-300 ${isActive ? 'opacity-90' : 'opacity-80 group-hover:opacity-70'}"></div><div class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-all"><i class="fas ${shop.icon} text-xs text-white/80"></i></div><div class="relative z-10 w-full"><div class="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1 border-l-2 border-white/30 pl-2 group-hover:border-white/80 transition-colors">${shop.subtitle}</div><div class="font-cinzel font-bold text-lg text-white leading-none drop-shadow-md">${shop.name}</div></div>${isActive ? '<div class="absolute inset-0 border-2 border-white/20 rounded-xl pointer-events-none"></div>' : ''}`;
        }
        if (shop.image) { btn.style.backgroundImage = `url('${shop.image}')`; btn.style.backgroundSize = 'cover'; btn.style.backgroundPosition = 'center'; }
        btn.onclick = () => loadShop(index);
        navContainer.appendChild(btn);
    });
}

export function loadShop(index) {
    try {
        state.currentShopIndex = index;
        const shop = state.activeShops[index];
        if (!shop) return;

        // Special Portal Redirection
        if (shop.id === 'black-market-gate' || shop.id === 'black-market-gate-r1') {
            enterMarket(0);
            return;
        }

        // Close Map Modal when loading a shop
        // Close Map Modal when loading a shop
        if (typeof closeMapModal === 'function') closeMapModal();

        // Hide Map/District Controls if needed
        // if (document.getElementById('market-controls')) document.getElementById('market-controls').classList.remove('hidden');

        // Show Cart Button in Shop
        const cartBtn = document.getElementById('cart-fab-btn');
        if (cartBtn) cartBtn.classList.remove('hidden');

        // FORCE SHOP LIST SIDEBAR (User Preference)
        if (document.getElementById('hub-sidebar')) document.getElementById('hub-sidebar').classList.add('hidden');
        if (document.getElementById('ring-sidebar')) document.getElementById('ring-sidebar').classList.remove('hidden');

        // Ensure wrapper is visible (it holds the grid)
        if (document.getElementById('game-area-wrapper')) document.getElementById('game-area-wrapper').classList.remove('hidden');
        // Safety unhide parent of grid (Right Column)
        if (inventoryGrid && inventoryGrid.parentElement) inventoryGrid.parentElement.classList.remove('hidden');

        // Update Header UI
        if (shopTitle) shopTitle.innerText = shop.name;
        if (shopDesc) shopDesc.textContent = shop.description;
        if (shopIcon) shopIcon.innerHTML = `<i class="fas ${shop.icon}"></i>`;
        if (bgIcon) bgIcon.innerHTML = `<i class="fas ${shop.icon}"></i>`;
        if (appContainer) appContainer.className = `relative z-10 flex flex-col md:flex-row h-full transition-colors duration-500 ${shop.themeClass}`;

        // Hide District Grid, Show Inventory
        // Hide District Grid, Show Inventory
        const districtView = document.getElementById('district-selection-view');
        if (districtView) {
            districtView.classList.add('hidden');
            districtView.style.display = 'none'; // FORCE HIDE
        }

        if (inventoryGrid) {
            inventoryGrid.classList.remove('hidden');
            inventoryGrid.style.display = 'grid'; // FORCE SHOW
        }

        console.log(`Loading Shop: ${shop.name} with ${shop.items ? shop.items.length : 0} items.`);

        // CHANGE BACK BUTTON FUNCTIONALITY TO "BACK TO DISTRICT"
        // CHANGE BACK BUTTON FUNCTIONALITY - REMOVED PER USER REQUEST
        // The Sidebar is persistent, so "Back to District" is redundant.
        // We keep "Exit Ring" as the main action.

        renderNav(); // Update navigation numbering/active state

        // CASINO LOGIC
        if (shop.specialType === 'casino') {
            // ... existing casino logic ...
            if (inventoryGrid) {
                inventoryGrid.classList.add('hidden');
                inventoryGrid.style.display = 'none'; // CRITICAL FIX: Override previous 'grid' setting
            }
            if (districtView) {
                districtView.classList.add('hidden');
                districtView.style.display = 'none';
            }

            const casinoView = document.getElementById('casino-view');
            const casinoMenu = document.getElementById('casino-menu');

            if (casinoView) {
                casinoView.classList.remove('hidden');
                casinoView.style.display = 'block'; // Reset style.display
                // FORCE MENU RESET
                if (casinoMenu) casinoMenu.classList.remove('hidden');
                // HIDE ACTIVE GAMES IF ANY
                ['game-slots', 'game-blackjack', 'game-roulette'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.classList.add('hidden');
                });
            }
            if (typeof drawRouletteWheel === 'function') drawRouletteWheel();
        }
        // NORMAL SHOP LOGIC
        else {
            if (document.getElementById('casino-view')) document.getElementById('casino-view').classList.add('hidden');
            if (inventoryGrid) inventoryGrid.classList.remove('hidden');
            if (inventoryGrid) inventoryGrid.innerHTML = '';
            // ... existing render ...

            shop.items.forEach((item, i) => {
                const card = document.createElement('div');
                card.className = `glass-panel p-5 rounded-xl border-t border-white/10 relative overflow-hidden item-card group animate-fade-in`;
                card.style.animationDelay = `${i * 0.05}s`;
                const rarityColor = rarityColors[item.rarity] || rarityColors['Mágico'];
                card.style.setProperty('--rarity-color', rarityColor);
                if (item.image) { card.style.backgroundImage = `url('${item.image}')`; card.classList.add('has-image'); }

                // Currency Icon/Color Logic
                const isRing0 = state.currentRing === 0;
                const currencyIcon = isRing0 ? '<i class="fas fa-burn text-red-500 text-xs"></i>' : '<i class="fas fa-coins text-yellow-500 text-xs"></i>';
                const priceColorClass = isRing0 ? 'text-red-500' : 'text-yellow-400';

                card.innerHTML = `<div class="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity"><i class="fas fa-sparkles text-xs" style="color: ${rarityColor}"></i></div><div class="flex justify-between items-start mb-2"><span class="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-black/40 text-gray-400 border border-white/5">${item.type}</span><span class="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded shadow-lg" style="color: ${rarityColor}; background: ${rarityColor}20; border: 1px solid ${rarityColor}40">${item.rarity || 'Mágico'}</span></div><h3 class="font-cinzel text-lg font-bold text-white mb-1 group-hover:brightness-125 transition-all leading-tight drop-shadow-md">${item.name}</h3><div class="flex items-baseline gap-1 mb-3">${currencyIcon}<span class="${priceColorClass} font-mono font-bold">${item.price.toLocaleString()}</span></div><p class="text-sm text-gray-400 leading-relaxed border-t border-white/10 pt-2 group-hover:text-gray-300 line-clamp-3">${item.desc}</p><button class="item-details-btn w-full mt-4 py-2 rounded border border-white/20 hover:bg-white/10 hover:border-white/40 text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 cursor-pointer backdrop-blur-md"><i class="fas fa-scroll"></i> Detalles</button>`;
                card.querySelector('.item-details-btn').onclick = () => openItemModal(item);
                if (inventoryGrid) inventoryGrid.appendChild(card);
            });
        }
    } catch (e) {
        console.error("Critical Error in loadShop:", e);
        showToast("Error cargando la tienda: " + e.message);
    }
}

function openItemModal(item) {
    state.currentItem = item;
    const rarityColor = rarityColors[item.rarity] || rarityColors['Mágico'];
    modalTitle.textContent = item.name; modalDesc.textContent = item.desc; modalPrice.textContent = item.price.toLocaleString(); modalType.textContent = item.type; modalRarity.textContent = item.rarity || 'Mágico';
    modalRarity.style.color = rarityColor; modalRarity.style.background = `${rarityColor}20`; modalRarity.style.borderColor = `${rarityColor}40`;
    itemModalContent.style.border = `1px solid ${rarityColor}`;
    if (item.image) { modalHeaderBg.style.backgroundImage = `url('${item.image}')`; modalIcon.style.opacity = '0'; } else { modalHeaderBg.style.backgroundImage = 'none'; modalHeaderBg.style.backgroundColor = `${rarityColor}40`; modalIcon.style.opacity = '1'; }
    itemModal.classList.remove('hidden'); setTimeout(() => { itemModal.classList.remove('opacity-0'); itemModalContent.classList.add('scale-100'); }, 10);
    modalAddBtn.onclick = () => { addToCart(item); closeModal(); };
}

function closeModal() {
    itemModal.classList.add('opacity-0');
    itemModalContent.classList.remove('scale-100');
    setTimeout(() => itemModal.classList.add('hidden'), 300);
}

import { mapNodes } from '../data/locations.js';

// ... (existing imports)

// ...

function renderDistrictCards() {
    const container = document.getElementById('district-cards-container');
    if (!container) return;
    container.innerHTML = '';

    const currentRing = state.currentRing;

    // Combine Shops and Map Nodes for this Ring
    const shops = state.activeShops || [];
    const nodes = mapNodes.filter(n => n.ring === currentRing && (n.type === 'shop' || n.type === 'portal' || n.type === 'poi')); // Allow POIs too if relevant

    const allCards = [...shops.map(s => ({ ...s, _isShop: true })), ...nodes.map(n => ({ ...n, _isNode: true }))];

    if (allCards.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center text-gray-500 italic py-10">No hay servicios disponibles en este anillo.</div>';
        return;
    }

    allCards.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = "group relative h-64 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-white/10 bg-gray-900";

        // Image Handling
        const bg = document.createElement('div');
        bg.className = "absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40";
        if (item.image) bg.style.backgroundImage = `url('${item.image}')`;

        // Gradient Overlay
        const overlay = document.createElement('div');
        overlay.className = "absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent";

        // Content
        const content = document.createElement('div');
        content.className = "absolute inset-0 p-6 flex flex-col justify-end relative z-10";

        // Icons & Subtitles
        const iconClass = item.icon || item.fallbackIcon || 'fa-map-marker-alt';
        const subtitle = item.subtitle || item.label || 'Ubicación';
        const name = item.name || item.label;
        const desc = item.description || item.text || "";

        content.innerHTML = `
            <div class="mb-2">
                <span class="inline-block px-2 py-1 bg-white/10 backdrop-blur-md rounded text-[10px] uppercase font-bold tracking-widest text-white/80 border border-white/10 mb-2">
                    <i class="fas ${iconClass} mr-1"></i> ${subtitle}
                </span>
            </div>
            <h3 class="text-2xl font-cinzel font-bold text-white mb-1 group-hover:text-yellow-400 transition-colors drop-shadow-md">${name}</h3>
            <p class="text-xs text-gray-400 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100 overflow-hidden h-0 group-hover:h-auto">${desc}</p>
        `;

        // Click Logic
        card.onclick = () => {
            if (item._isShop) {
                // It's a shop, find its index in the ORIGINAL state.activeShops array
                const shopIndex = state.activeShops.indexOf(item);
                if (shopIndex > -1) loadShop(shopIndex);
            } else if (item._isNode) {
                // It's a Map Node
                if (item.actionType === 'shop' && item.target) {
                    // Special Case: Portal to Shop (like Casino)
                    // We need to find the shop by ID in allShops and load it
                    // But loadShop expects an index in state.activeShops.
                    // If the target shop is NOT in activeShops (e.g. Ring 0 shop while in Ring 2), we might need a direct load strategy.

                    // Hack: If target is 'casino-infernal', we Force Load it.
                    if (item.target === 'casino-infernal') {
                        // We need to find the casino shop in allShops
                        // Import allShops is available at top.
                        const casinoShop = allShops.find(s => s.id === 'casino-infernal');
                        if (casinoShop) {
                            // Determine if we need to switch context or just display it
                            // For now, let's push it to activeShops if not present, or handle it specially.
                            // Simpler: Just find it in allShops, set it as current, and call loadShop logic manually/mocked.
                            // OR: Switch navigation to that shop's ring? 
                            // Casino is Ring 0. If we are in Ring 2, technically we are "entering" the market.
                            // Let's rely on enterMarket(0) if we want to go fully there, OR just load the shop.

                            // Strategy: enterMarket(0) is the cleanest way to switch context to the Black Market.
                            enterMarket(0);
                        }
                    } else if (item.target === 'bazar') {
                        // Find shop index
                        const idx = state.activeShops.findIndex(s => s.id === 'bazar');
                        if (idx > -1) loadShop(idx);
                        else console.warn("Shop not found in active ring");
                    } else if (item.target === 'nebulosa') {
                        const idx = state.activeShops.findIndex(s => s.id === 'nebulosa');
                        if (idx > -1) loadShop(idx);
                    }
                } else if (item.actionType === 'modal') {
                    if (item.target === 'mission-board') openMissionBoard();
                } else if (item.actionType === 'dialog') {
                    // Show a toast or small dialog
                    showToast(item.text);
                }
            }
        };

        card.appendChild(bg);
        card.appendChild(overlay);
        card.appendChild(content);
        container.appendChild(card);
    });
}
// --- MISSION BOARD LOGIC (Moved from map.js to fix load issues) ---
const sampleMissions = [
    // RANGO E (Novato) - 4 MISIONES
    { id: 1, title: "Limpieza de Almacén", desc: "Matar 10 Ratas Gigantes en el sótano de la herrería.", reward: "50 mo + Afilado Gratis", val: 50, rarity: "Común", icon: "fa-broom", rank: 'E' },
    { id: 2, title: "El Gato del Archimago", desc: "Encontrar al gato invisible del Mago de la Torre Azul. (Se detecta con harina o magia).", reward: "100 mo + Pergamino Nv.1", val: 100, rarity: "Común", icon: "fa-cat", req: "Harina o Detectar Magia", rank: 'E' },
    { id: 14, title: "Patrulla del Mercado", desc: "Vigilar los puestos de fruta durante el turno de noche. Evitar robos menores.", reward: "75 mo", val: 75, rarity: "Común", icon: "fa-eye", rank: 'E' },
    { id: 15, title: "Plaga de Insectos", desc: "Un enjambre de escarabajos de fuego amenaza los cultivos de hierbas. Aplástalos.", reward: "60 mo", val: 60, rarity: "Común", icon: "fa-bug", rank: 'E' },

    // RANGO D (Principiante) - 4 MISIONES
    { id: 3, title: "Entrega Urgente", desc: "Llevar una carta de amor del Panadero (Anillo 1) a la Hija del Duque (Anillo 3) sin ser visto.", reward: "80 mo + Pasteles", val: 80, rarity: "Poco Común", icon: "fa-envelope", req: "Sigilo", rank: 'D' },
    { id: 4, title: "Recolección Nocturna", desc: "Recoger 5 Hongos Luminiscentes del cementerio.", reward: "60 mo", val: 60, rarity: "Poco Común", icon: "fa-moon", req: "Hongos Luminiscentes", rank: 'D' },
    { id: 16, title: "Escolta de Suministros", desc: "Proteger una carreta de víveres hasta el puesto fronterizo. Bandidos probables.", reward: "150 mo", val: 150, rarity: "Poco Común", icon: "fa-horse-head", rank: 'D' },
    { id: 17, title: "El Ladrón de Manzanas", desc: "Un goblin está robando manzanas doradas. Captúralo vivo para interrogarlo.", reward: "100 mo", val: 100, rarity: "Poco Común", icon: "fa-hand-holding", rank: 'D' },

    // RANGO C (Intermedio) - 4 MISIONES
    { id: 5, title: "La Bestia del Camino", desc: "Un Oso Lechuza está atacando caravanas al Norte. Traer el pico.", reward: "400 mo", val: 400, rarity: "Rara", icon: "fa-paw", req: "Pico de Oso Lechuza", rank: 'C' },
    { id: 6, title: "Misterio en la Mina", desc: "Los mineros han despertado a unos Ankhegs. Despejar la galería 4.", reward: "600 mo + Minerales", val: 600, rarity: "Rara", icon: "fa-hammer", rank: 'C' },
    { id: 18, title: "Ritual Interrumpido", desc: "Un grupo de cultistas novatos intenta invocar un demonio menor en el bosque. Detenlos.", reward: "500 mo", val: 500, rarity: "Rara", icon: "fa-book-dead", rank: 'C' },
    { id: 19, title: "Protección de la Taberna", desc: "El Dragón Ebrio espera una redada de orcos esta noche. Mantén la cerveza a salvo.", reward: "450 mo + Barra Libre", val: 450, rarity: "Rara", icon: "fa-beer", rank: 'C' },

    // RANGO B (Veterano) - 4 MISIONES
    { id: 7, title: "Escolta de Lujo", desc: "Escoltar a un mercader paranoico hasta la ciudad vecina (3 días de viaje).", reward: "1,000 mo", val: 1000, rarity: "Muy Rara", icon: "fa-shield-alt", rank: 'B' },
    { id: 8, title: "El Fantasma de la Ópera", desc: "Un espíritu interrumpe las obras de teatro. Exorcizarlo o negociar.", reward: "500 mo + Entrada VIP", val: 500, rarity: "Muy Rara", icon: "fa-ghost", rank: 'B' },
    { id: 9, title: "Caza de Bandidos", desc: "Traer la cabeza del líder de los 'Colmillos Rojos'.", reward: "800 mo (Vivo) / 400 (M)", val: 800, rarity: "Muy Rara", icon: "fa-skull", req: "Cabeza de Líder", rank: 'B' },
    { id: 20, title: "Caza de Grifos", desc: "Una pareja de grifos ha anidado en la torre del reloj. Reubícalos o elimínalos.", reward: "1200 mo", val: 1200, rarity: "Muy Rara", icon: "fa-feather-alt", rank: 'B' },

    // RANGO A (Elite) - 4 MISIONES
    { id: 10, title: "Eco del Abismo", desc: "Se ha detectado una fisura dimensional en las Ruinas de Néor. Posible invasión demoníaca inminente.", reward: "10,000 mo + Objeto Raro", val: 10000, rarity: "Legendaria", icon: "fa-dungeon", rank: 'A' },
    { id: 11, title: "Caza de Wyverns", desc: "Una Matriarca Wyvern ha anidado en los picos cercanos y se come el ganado. Es una bestia mutada.", reward: "8,000 mo + Huevo Wyvern", val: 8000, rarity: "Legendaria", icon: "fa-dragon", req: "Huevo de Wyvern", rank: 'A' },
    { id: 21, title: "La Torre Olvidada", desc: "Investiga la torre que apareció de la nada en el lago. Se escuchan gritos antiguos.", reward: "9,000 mo + Grimorio Perdido", val: 9000, rarity: "Legendaria", icon: "fa-chess-rook", rank: 'A' },
    { id: 22, title: "El Nigromante", desc: "Un Lord Nigromante está levantando un ejército en las criptas reales. Siléncialo.", reward: "12,000 mo", val: 12000, rarity: "Legendaria", icon: "fa-skull-crossbones", rank: 'A' },

    // RANGO S (Leyenda) - 4 MISIONES
    { id: 12, title: "El Asesino de Magos", desc: "Alguien está matando altos cargos del Gremio Cryxis. No deja rastro mágico. Se requiere investigación discreta.", reward: "15,000 mo + Favor", val: 15000, rarity: "Exótica", icon: "fa-user-secret", rank: 'S' },
    { id: 13, title: "La Grieta del Titán", desc: "Un Golem de Guerra antiguo se ha reactivado solo y marcha hacia la ciudad. Detenerlo antes de que llegue a la muralla.", reward: "Piezas Golem Legendarias", val: 0, rarity: "Exótica", icon: "fa-robot", req: "Núcleo de Golem", itemReward: { name: "Núcleo de Golem", desc: "Fuente de poder inestable. Material de crafting legendario.", type: "Material", rarity: "Legendaria" }, rank: 'S' },
    { id: 23, title: "Despertar del Dragón", desc: "El antiguo Dragón Rojo 'Ignis' ha despertado. Negocia su sueño o enfréntate al fuego eterno.", reward: "Tesoro del Dragón", val: 50000, rarity: "Exótica", icon: "fa-fire", rank: 'S' },
    { id: 24, title: "Caída de los Dioses", desc: "Un semidiós ha caído en la plaza central. Protégelo de los cultistas que quieren su esencia.", reward: "Favor Divino + Arma Sagrada", val: 25000, rarity: "Exótica", icon: "fa-star", rank: 'S' }
];

let currentRankTab = 'E';

export function openMissionBoard() {
    // Expose explicitly if called via onclick
    if (!window.openMissionBoard) window.openMissionBoard = openMissionBoard;

    const modal = document.getElementById('mission-board');
    const modalContent = modal ? modal.querySelector('.glass-modal') : null;
    const missionList = document.getElementById('mission-list');

    if (!modalContent || !missionList) return;

    // Inject Tabs UI if not present
    if (!document.getElementById('rank-tabs')) {
        const tabsContainer = document.createElement('div');
        tabsContainer.id = 'rank-tabs';
        // Container: Full width grid, situated between Header and List
        tabsContainer.className = 'grid grid-cols-6 gap-2 px-6 pt-4 pb-0 bg-[#1a100c] border-b border-[#3e2723]';

        ['E', 'D', 'C', 'B', 'A', 'S'].forEach(rank => {
            const btn = document.createElement('button');
            btn.innerHTML = `<span class="text-[10px] uppercase opacity-60 mb-1 tracking-widest">Rango</span><span class="text-3xl font-black font-cinzel leading-none">${rank}</span>`;

            btn.dataset.rank = rank;
            btn.onclick = () => switchMissionTab(rank, btn);
            tabsContainer.appendChild(btn);
        });

        // Insert before the mission list
        modalContent.insertBefore(tabsContainer, missionList);
    }

    if (!modal) return;

    // Use playerState for mission status (Persisted)
    if (!playerState.missionStatus) playerState.missionStatus = {};

    switchMissionTab('E'); // Default to E

    modal.classList.remove('hidden');
    requestAnimationFrame(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.glass-modal').classList.remove('scale-95');
    });
}

function switchMissionTab(rank) {
    currentRankTab = rank;
    const tabs = document.querySelectorAll('#rank-tabs button');
    tabs.forEach(btn => {
        const isTarget = btn.dataset.rank === rank;

        if (isTarget) {
            // ACTIVE: Parchment Pop-up
            btn.className = 'w-full h-24 -mb-[1px] bg-[#f0e6d2] text-[#2c1810] rounded-t-lg border-x-2 border-t-2 border-[#8d6e63] shadow-[0_-5px_15px_rgba(202,138,4,0.2)] flex flex-col items-center justify-center relative z-10 transform transition-all duration-300';
        } else {
            // INACTIVE: Recessed Dark Leather
            btn.className = 'w-full h-20 mt-4 bg-[#2a1b15] text-[#5d4037] rounded-t-md border border-[#3e2723] border-b-0 flex flex-col items-center justify-center transition-all duration-300 hover:bg-[#3e2723] hover:text-[#8d6e63] cursor-pointer';
        }
    });
    renderMissionList(document.getElementById('mission-list'), rank);
}

function renderMissionList(container, rankFilter) {
    container.innerHTML = '';
    // Use Grid layout for Board feel
    container.className = 'flex-1 overflow-y-auto p-6 bg-[#2a1b15] custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-6 content-start relative';

    const filtered = sampleMissions.filter(m => m.rank === rankFilter);

    if (filtered.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center text-white/30 py-10 italic">No hay contratos disponibles.</div>`;
        return;
    }

    filtered.forEach((m, index) => {
        const status = playerState.missionStatus[m.id] || 'new';

        const el = document.createElement('div');
        // Parchment Style
        const rotation = (index % 2 === 0 ? '-rotate-1' : 'rotate-1');
        el.className = `transform ${rotation} relative bg-[#f0e6d2] text-[#2c1810] p-6 rounded shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex flex-col gap-4 font-serif transition-transform hover:scale-105 hover:z-10`;

        if (status === 'completed') {
            el.classList.add('opacity-70', 'grayscale');
            el.innerHTML += '<div class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"><span class="border-4 border-red-800 text-red-800 font-black text-4xl uppercase -rotate-12 px-4 py-2 opacity-80">Completado</span></div>';
        }

        const pinColor = m.rank === 'S' || m.rank === 'A' ? 'bg-red-600' : 'bg-yellow-600';
        const pin = `<div class="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${pinColor} shadow-md border border-black/30 z-20"></div>`;

        let reqHtml = '';
        if (m.req) {
            reqHtml = `<div class="text-[10px] text-red-800 mt-1 uppercase font-bold tracking-wider border-t border-red-800/20 pt-1"><i class="fas fa-thumbtack mr-1"></i> Requisito: ${m.req}</div>`;
        }

        let actionBtn = '';
        if (status === 'new') {
            actionBtn = `<button class="w-full mt-2 bg-[#2c1810] hover:bg-black text-[#f0e6d2] text-sm font-bold py-2 px-4 rounded shadow transition-colors uppercase tracking-widest" onclick="acceptMission(${m.id})">Firmar</button>`;
        } else if (status === 'accepted') {
            actionBtn = `<button class="w-full mt-2 bg-red-700 hover:bg-red-600 text-white text-sm font-bold py-2 px-4 rounded shadow transition-colors uppercase tracking-widest animate-pulse" onclick="claimMission(${m.id})">Reclamar</button>`;
        } else {
            actionBtn = '';
        }

        el.innerHTML = `
            ${pin}
            <div class="border-b-2 border-[#2c1810]/20 pb-2 mb-1 flex justify-between items-end">
                <h3 class="font-bold text-xl leading-none">${m.title}</h3>
                <span class="text-xs font-bold font-mono opacity-50">Rango ${m.rank}</span>
            </div>
            
            <div class="flex-1">
                <p class="text-sm leading-relaxed italic opacity-90">"${m.desc}"</p>
                ${reqHtml}
            </div>

            <div class="flex items-center gap-3 mt-2 bg-[#2c1810]/5 p-2 rounded">
                <div class="text-2xl opacity-70"><i class="fas ${m.icon}"></i></div>
                <div class="flex-1 text-right">
                    <div class="text-xs uppercase tracking-wider opacity-60">Recompensa</div>
                    <div class="font-bold text-lg">${m.reward}</div>
                </div>
            </div>
            ${actionBtn}
        `;
        container.appendChild(el);
    });
}
window.acceptMission = function (id) {
    if (!playerState.missionStatus) playerState.missionStatus = {};
    playerState.missionStatus[id] = 'accepted';
    // Trigger Save
    import('./player.js').then(m => m.saveGame());
    showToast("Contrato firmado. Revisa los requisitos.");
    renderMissionList(document.getElementById('mission-list'), currentRankTab);
}

window.claimMission = function (id) {
    const mission = sampleMissions.find(m => m.id === id);
    if (!mission) return;

    if (mission.req) {
        const hasItem = playerState.inventory.find(i => i.name === mission.req);
        if (!hasItem) {
            showToast(`❌ Falta: ${mission.req}`);
            return;
        }
        const idx = playerState.inventory.indexOf(hasItem);
        if (idx > -1) playerState.inventory.splice(idx, 1);
        showToast(`Entregado: ${mission.req}`);
    }

    import('./player.js').then(m => {
        if (mission.val > 0) m.addGold(mission.val);
        if (mission.itemReward) m.addItem(mission.itemReward);
        playerState.missionStatus[id] = 'completed';
        m.saveGame();
        renderMissionList(document.getElementById('mission-list'), currentRankTab);
        showToast(`Recompensa: +${mission.val} oro`);
    });
}

window.closeMissionBoard = function () {
    const modal = document.getElementById('mission-board');
    if (!modal) return;
    modal.classList.add('opacity-0');
    modal.querySelector('.glass-modal').classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// Global hook
window.openMissionBoard = openMissionBoard;
