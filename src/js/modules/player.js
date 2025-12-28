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
        // Consumibles
        { name: "Poción de Curación", desc: "Restaura 2d4+2 puntos de golpe.", type: "consumable", rarity: "common", qty: 5 },
        { name: "Poción de Curación Mayor", desc: "Restaura 4d4+4 puntos de golpe.", type: "consumable", rarity: "uncommon", qty: 2 },
        { name: "Poción de Fuerza de Gigante", desc: "Tu Fuerza es 21 durante 1 hora.", type: "consumable", rarity: "rare", qty: 1 },
        { name: "Antídoto", desc: "Neutraliza un veneno en tu sistema.", type: "consumable", rarity: "common", qty: 3 },

        // Items de Misión / Llaves
        { name: "Moneda del Cuervo", desc: "Una moneda negra con un cuervo grabado. Silas la reconocerá.", type: "key", rarity: "rare", qty: 1 },
        { name: "Llave Oxidada", desc: "Abre algo... en algún lugar.", type: "key", rarity: "common", qty: 1 },

        // Miscelanea
        { name: "Pergamino Antiguo", desc: "Contiene hechizos olvidados de una era pasada.", type: "misc", rarity: "rare", qty: 1 },
        { name: "Cristal de Maná", desc: "Brilla con luz arcana tenue. Útil para rituales.", type: "resource", rarity: "rare", qty: 3 },
        { name: "Gema de Sangre", desc: "Una gema roja que pulsa como un corazón.", type: "resource", rarity: "epic", qty: 1 },

        // Equipo
        { name: "Daga Oxidada", desc: "Mejor que nada. +1 al daño.", type: "weapon", rarity: "common", qty: 1 },
        { name: "Amuleto de Suerte", desc: "+1 a tiradas de salvación.", type: "accessory", rarity: "legendary", qty: 1 },
        { name: "Anillo de Protección", desc: "+1 a CA y tiradas de salvación.", type: "accessory", rarity: "rare", qty: 1 }
    ], // Array of item objects
    gold: 1000,
    bloodCoins: 0, // NEW: Persistent Blood Currency
    lastWheelSpinTime: null, // NEW: Timestamp of last daily wheel spin
    missionStatus: {}, // NEW: Persist mission progress
    npcStatus: {}, // { npcId: { trust: 50, encountered: true } }
    arenaStats: {
        wins: 50,
        losses: 5,
        draws: 2,
        totalFights: 57,
        currentStreak: 10,
        bestStreak: 15,
        honor: 100,           // Máximo honor
        respect: 2500,        // Máximo respeto para ver todos los oponentes
        rank: 'Matadioses',   // Rango máximo
        totalEarnings: 50000,
        kills: 30,
        knockouts: 20
    },
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
    playerState.inventory = [
        // Consumibles de inicio
        { name: "Poción de Curación", desc: "Restaura 2d4+2 puntos de golpe.", type: "consumable", rarity: "common", qty: 5 },
        { name: "Poción de Curación Mayor", desc: "Restaura 4d4+4 puntos de golpe.", type: "consumable", rarity: "uncommon", qty: 2 },
        { name: "Poción de Fuerza de Gigante", desc: "Tu Fuerza es 21 durante 1 hora.", type: "consumable", rarity: "rare", qty: 1 },
        { name: "Antídoto", desc: "Neutraliza un veneno en tu sistema.", type: "consumable", rarity: "common", qty: 3 },
        // Items de Misión
        { name: "Moneda del Cuervo", desc: "Una moneda negra con un cuervo grabado. Silas la reconocerá.", type: "key", rarity: "rare", qty: 1 },
        { name: "Llave Oxidada", desc: "Abre algo... en algún lugar.", type: "key", rarity: "common", qty: 1 },
        // Miscelánea
        { name: "Pergamino Antiguo", desc: "Contiene hechizos olvidados de una era pasada.", type: "misc", rarity: "rare", qty: 1 },
        { name: "Cristal de Maná", desc: "Brilla con luz arcana tenue. Útil para rituales.", type: "resource", rarity: "rare", qty: 3 },
        { name: "Gema de Sangre", desc: "Una gema roja que pulsa como un corazón.", type: "resource", rarity: "epic", qty: 1 },
        // Equipo
        { name: "Daga Oxidada", desc: "Mejor que nada. +1 al daño.", type: "weapon", rarity: "common", qty: 1 },
        { name: "Amuleto de Suerte", desc: "+1 a tiradas de salvación.", type: "accessory", rarity: "legendary", qty: 1 },
        { name: "Anillo de Protección", desc: "+1 a CA y tiradas de salvación.", type: "accessory", rarity: "rare", qty: 1 }
    ];
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
    // Force Cloud Save (Removed Localhost Check)
    // if (window.location.hostname === 'localhost' && !localStorage.getItem('debug_cloud')) ...

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
                        safeToast("☁️ Partida Sincronizada (Neon DB)");
                    }
                } else {
                    console.warn('[CLOUD] Not Found or Error:', res.status);
                }
            }
        } catch (e) {
            console.warn('[CLOUD] Load Failed/Offline:', e);
            safeToast("⚠️ Error Conexión DB");
        }

        // 2. Fallback to LocalStorage if Cloud failed or empty
        if (!loadedState) {
            const storedRaw = localStorage.getItem(localKey);
            if (storedRaw) {
                try {
                    loadedState = JSON.parse(storedRaw);
                    console.log('[PLAYER] Loaded from Local Storage (Fallback)');
                    // safeToast("⚠️ MODO SIN CONEXIÓN (Cache Local)");
                } catch (e) { console.error("Save Corrupt"); }
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

export function resetToKaiser() {
    console.log("🔥 INITIATING KAISER PROTOCOL: WIPING ALL DATA 🔥");
    localStorage.clear();

    // Force Override State
    const kaiserState = {
        name: "Kaiser",
        level: 100,
        xp: 999999,
        nextLevelXp: 1000000,
        rank: "S+",
        guild: "Líder Supremo",
        class: "Dios de la Guerra",
        race: "Primordial",
        stats: { str: 20, dex: 20, con: 20, int: 20, wis: 20, cha: 20 },
        inventory: [
            { name: "Moneda del Cuervo", desc: "Símbolo de poder.", type: "key", rarity: "epic", qty: 10 },
            { name: "Llave Maestra", desc: "Abre todo.", type: "key", rarity: "legendary", qty: 1 }
        ],
        gold: 9999999,
        bloodCoins: 50000,
        blackMarketIdentity: "Kaiser", // Auto-auth
        arenaStats: {
            wins: 999,
            losses: 0,
            rank: 'Leyenda Viviente'
        }
    };

    localStorage.setItem('eranol_player_state_v1', JSON.stringify(kaiserState));
    location.reload(); // Reload to apply fresh state
}


window.resetToKaiser = resetToKaiser;

// HELPER: Reset specifically the Black Market Identity
window.resetBlackMarketID = function () {
    console.log("🕵️‍♂️ Clearing Black Market Identity...");
    playerState.blackMarketIdentity = null;
    playerState.blackMarketUser = null;
    playerState.blackMarketPass = null;
    saveGame();
    alert("✅ Identidad del Mercado Negro BORRADA.\nAhora puedes volver a intentar el proceso con El Mudo.");
    location.reload();
};
