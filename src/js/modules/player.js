// import { showToast } from './ui.js'; // Import toast
import { knownUsers } from '../data/users.js';
export const playerState = {
    name: "Viajero",
    level: 3,
    xp: 2500,
    nextLevelXp: 6000,
    rank: "F", // New: Hunter Rank
    guild: "Sin Gremio", // New: Affiliation
    class: "Aventurero",
    race: "Humano",
    stats: {
        str: 12,
        dex: 14,
        con: 13,
        int: 10,
        wis: 12,
        cha: 11
    },
    inventory: [
        { name: "Poción Curativa", desc: "Restaura 50 HP", image: "", type: "consumable", rarity: "common" },
        { name: "Pergamino Antiguo", desc: "Contiene hechizos olvidados", image: "", type: "misc", rarity: "rare" },
        { name: "Daga Oxidada", desc: "Mejor que nada", image: "", type: "weapon", rarity: "common" },
        { name: "Cristal de Maná", desc: "Brilla con luz tenue", image: "", type: "resource", rarity: "rare" },
        { name: "Amuleto de Suerte", desc: "+1 a Salvaciones", image: "", type: "accessory", rarity: "legendary" }
    ], // Array of item objects
    gold: 1000,
    bloodCoins: 0, // NEW: Persistent Blood Currency
    missionStatus: {}, // NEW: Persist mission progress
    equipment: {
        // Armor (Pieces vs Full)
        head: null,
        chest: null,
        hands: null,
        legs: null,
        fullBody: null, // If set, disables head/chest/hands/legs visuals

        // Weapons
        mainHand1: { name: "Espada Larga", image: "" },
        mainHand2: null,
        offHand: null,

        // Jewelry (4 Amulets, 6 Rings)
        amulet1: { name: "Colgante del Lobo", image: "" },
        amulet2: null, amulet3: null, amulet4: null,
        ring1: { name: "Anillo de Poder", image: "" },
        ring2: null, ring3: null, ring4: null, ring5: null, ring6: null,

        // Extras
        belt: null,
        boots: { name: "Botas de Cuero", image: "" },
        cape: null
    }
};

export function addGold(amount) {
    playerState.gold += amount;
    updateUI();
}

export function removeGold(amount) {
    if (playerState.gold >= amount) {
        playerState.gold -= amount;
        updateUI();
        return true;
    }
    return false;
}

export function addBloodCoins(amount) {
    playerState.bloodCoins = (playerState.bloodCoins || 0) + amount;
    updateUI();
}

export function removeBloodCoins(amount) {
    const current = playerState.bloodCoins || 0;
    if (current >= amount) {
        playerState.bloodCoins = current - amount;
        updateUI();
        return true;
    }
    return false;
}

export function addItem(item) {
    playerState.inventory.push(item);
    updateUI();
    // Notification logic here
}

// Placeholder for UI update function (will be linked to the view)
let updateUIParams = null;
export function setUpdateUICallback(callback) {
    updateUIParams = callback;
}

function updateUI() {
    if (updateUIParams) updateUIParams();
    saveGame();
}

// NEW: Reset state for switching users
export function resetPlayerState() {
    console.log("[PLAYER] Resetting Player State to Defaults");
    playerState.name = "Viajero";
    playerState.level = 1;
    playerState.xp = 0;
    playerState.inventory = [];
    playerState.gold = 1000;
    playerState.bloodCoins = 0;
    playerState.missionStatus = {};
    playerState.equipment = {
        head: null, chest: null, hands: null, legs: null, fullBody: null,
        mainHand1: null, mainHand2: null, offHand: null,
        amulet1: null, amulet2: null, amulet3: null, amulet4: null,
        ring1: null, ring2: null, ring3: null, ring4: null, ring5: null, ring6: null,
        belt: null, boots: null, cape: null
    };
}

// import { showToast } from './ui.js'; // REMOVED TO FIX CIRCULAR DEPENDENCY

// Helper for safe toaster
function safeToast(msg) {
    if (window.showToast) window.showToast(msg);
    else console.log(`[TOAST]: ${msg}`);
}

function updateDebugPanel() {
    const el = document.getElementById('debug-content');
    if (!el) return;

    const safeName = playerState.name ? playerState.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_') : 'viajero';
    const currentKey = `eranol_player_state_${safeName}`;
    const storedRaw = localStorage.getItem(currentKey);
    let storedGold = "N/A";
    let storedName = "N/A";

    if (storedRaw) {
        try {
            const parsed = JSON.parse(storedRaw);
            storedGold = parsed.gold;
            storedName = parsed.name;
        } catch (e) { storedGold = "CORRUPT"; }
    }

    // List all related keys and ORIGIN
    let allKeys = [];
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith('eranol_')) {
                allKeys.push(k.replace('eranol_player_state_', 'User: '));
            }
        }
    } catch (e) { allKeys.push("Error reading keys"); }

    el.innerHTML = `
        <div class="text-[10px] text-gray-500 mb-1">Origin: ${window.location.host}</div>
        <div>🧠 MEMORY:</div>
        <div class="pl-2 line-through text-gray-500 text-[10px]">Name: ${playerState.name}</div>
        <div class="pl-2 text-white font-bold">Gold: ${playerState.gold}</div>
        
        <div class="mt-2 border-t border-gray-700 pt-1">💾 DISK (Current):</div>
        <div class="pl-2 text-[10px] text-gray-400 break-all">${currentKey}</div>
        <div class="pl-2">Gold: <span class="${storedGold != playerState.gold ? 'text-red-500 blink' : 'text-green-500'}">${storedGold}</span></div>
        
        <div class="mt-2 border-t border-gray-700 pt-1">📂 ALL SAVES:</div>
        <div class="pl-2 text-[10px] max-h-20 overflow-y-auto">
            ${allKeys.length ? allKeys.join('<br>') : 'No Saves Found'}
        </div>
    `;
}

export async function saveGame() {
    if (!playerState.name) return; // Guard
    if (playerState.name === "Viajero") return; // Don't save Guest/Login state to disk

    // 1. Save to LocalStorage (Cache/Offline)
    const safeName = playerState.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
    const key = `eranol_player_state_${safeName}`;

    try {
        localStorage.setItem(key, JSON.stringify(playerState));
        if (playerState.name !== "Viajero") {
            localStorage.setItem('eranol_last_user', playerState.name);
        }
        updateDebugPanel();
    } catch (e) {
        console.error("Local Save Failed:", e);
    }

    // 2. Save to Cloud (Async/Fire & Forget)
    saveToCloud(safeName, playerState);
}

async function saveToCloud(username, state) {
    if (window.location.hostname === 'localhost' && !localStorage.getItem('debug_cloud')) {
        // Optional: Skip cloud on localhost unless forced, to save API calls? 
        // Nah, let's enable it to test Neon.
    }

    const known = knownUsers[username];
    if (!known) return; // Only save known users to cloud for now

    try {
        const res = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: known.password, // Authentication
                state: state
            })
        });
        if (!res.ok) console.warn('[CLOUD] Save Failed:', res.status);
        else console.log('[CLOUD] Saved:', username);
    } catch (e) {
        console.warn('[CLOUD] Error:', e);
    }
}

export async function loadGame(specificUser = null) {
    let targetUser = specificUser || localStorage.getItem('eranol_last_user');

    console.log(`[PLAYER] Attempting to load user: ${targetUser || 'None'}`);

    if (targetUser) {
        resetPlayerState();
        const userKey = targetUser.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
        const localKey = `eranol_player_state_${userKey}`;

        let loadedState = null;

        // 1. Try Cloud Load First
        try {
            const known = knownUsers[userKey];
            if (known) {
                console.log('[CLOUD] Fetching save...');
                const res = await fetch('/api/load', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: userKey, password: known.password })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.state) {
                        loadedState = data.state;
                        console.log('[CLOUD] Save Loaded!');
                        safeToast("☁️ Partida Sincronizada (Nube)");
                    }
                }
            }
        } catch (e) {
            console.warn('[CLOUD] Load Failed/Offline:', e);
        }

        // 2. Fallback to LocalStorage if Cloud failed or empty
        if (!loadedState) {
            const saved = localStorage.getItem(localKey);
            if (saved) {
                try {
                    loadedState = JSON.parse(saved);
                    console.log('[LOCAL] Save Loaded');
                    safeToast("💾 Partida Local (Cache)");
                } catch (e) { console.error("Local Load Corrupt"); }
            }
        }

        // 3. Apply State
        if (loadedState) {
            // Validate & Migrate
            if (!loadedState.missionStatus) loadedState.missionStatus = {};
            if (loadedState.bloodCoins === undefined) loadedState.bloodCoins = 0;

            Object.assign(playerState, loadedState);

            // Sync Name logic
            if (!playerState.name || playerState.name === 'Viajero') {
                playerState.name = targetUser;
            }

            // Sync Permissions
            syncPermissions();
        } else {
            console.log(`[PLAYER] No save found. Creating new for ${targetUser}.`);
            safeToast(`⭐ Nuevo Perfil: ${targetUser}`);
            if (specificUser) {
                resetPlayerState();
                playerState.name = specificUser;

                // Apply Starter Config
                const lower = specificUser.toLowerCase();
                if (knownUsers[lower] && knownUsers[lower].startingGold) {
                    playerState.gold = knownUsers[lower].startingGold;
                }
                saveGame();
            }
        }
    } else {
        console.log(`[PLAYER] No target user. Staying as Guest.`);
    }
    updateUI();
    updateDebugPanel();
}

function syncPermissions() {
    if (playerState.name) {
        const lowerName = playerState.name.toLowerCase();

        // Fixed Data Sync
        if (knownUsers[lowerName]) {
            const k = knownUsers[lowerName];
            if (k.stats) playerState.stats = { ...k.stats };
            if (k.race) playerState.race = k.race;
            if (k.class) playerState.class = k.class;
            if (k.level) playerState.level = k.level;
            if (k.rank) playerState.rank = k.rank;
            if (k.guild) playerState.guild = k.guild;
        }

        // Admin/God Mode
        if (lowerName === "sombra" || lowerName === "asolador" || lowerName === "admin") {
            import('../../state.js').then(m => {
                m.state.currentUserMaxRing = 4;
                m.state.currentAdventurer = playerState.name;
                if (playerState.level < 20) playerState.level = 20;
            });
        } else {
            import('../../state.js').then(m => {
                m.state.currentAdventurer = playerState.name;
            });
        }
    }
}

// DEBUG TOOL (EXPOSED GLOBALLY)
window.forceGold = function (amount) {
    playerState.gold = amount || 10000000;
    saveGame();
    console.log("FORCE GOLD APPLIED:", playerState.gold);
    alert(`💰 FORCE GOLD: ${playerState.gold}\nRecargando...`);
    location.reload();
};
