import { mapNodes } from '../data/locations.js';
import { loadShop } from './navigation.js';
import { showToast } from './ui.js';
import { state } from '../../state.js';
import { addGold, addItem, playerState, saveGame } from './player.js';

export function initMap() {
    // Initial render or listeners if needed
}

export function renderMap(ringLevel) {
    const wrapper = document.getElementById('game-area-wrapper');
    const nodesContainer = document.getElementById('map-nodes');

    // Clear previous nodes
    nodesContainer.innerHTML = '';

    let activeNodes;
    if (ringLevel === 'HUB') {
        // Show everything on the main map
        activeNodes = mapNodes;
    } else {
        // Fallback for specific ring contexts if we keep them
        activeNodes = mapNodes.filter(n => n.ring === ringLevel);
    }

    if (activeNodes.length === 0) {
        if (wrapper) wrapper.classList.add('hidden');
        return; // No map for this ring
    }

    if (wrapper) wrapper.classList.remove('hidden');
    // Hide list view if map is active? 
    // document.getElementById('shop-list').classList.add('hidden'); // Optional: Toggle views

    activeNodes.forEach(node => {
        const el = document.createElement('div');
        el.className = 'absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-transform hover:scale-110 z-10';
        el.style.left = `${node.x}%`;
        el.style.top = `${node.y}%`;

        // Image/Icon Container
        const container = document.createElement('div');
        container.className = 'relative flex items-center justify-center';

        // Primary Image
        const img = document.createElement('img');
        img.src = node.image;
        img.className = 'w-16 h-16 object-contain drop-shadow-lg filter hover:brightness-125 transition-all';
        img.alt = node.label;

        // Fallback Icon (Hidden by default, shown on error)
        const iconFallback = document.createElement('div');
        iconFallback.className = 'hidden w-12 h-12 bg-black/50 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-lg';
        iconFallback.innerHTML = `<i class="fas ${node.fallbackIcon || 'fa-map-marker-alt'} text-2xl ${node.color || 'text-white'}"></i>`;

        img.onerror = () => {
            img.style.display = 'none';
            iconFallback.classList.remove('hidden');
        };

        container.appendChild(img);
        container.appendChild(iconFallback);
        el.appendChild(container);

        // Tooltip (Name Only, No Description, Only on Hover)
        const tooltip = document.createElement('div');
        tooltip.className = 'absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs font-bold px-3 py-1 rounded border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-lg';
        tooltip.innerText = node.label;

        el.appendChild(tooltip);

        // Click Action
        el.onclick = () => handleNodeClick(node);

        nodesContainer.appendChild(el);
    });
}

function handleNodeClick(node) {
    if (node.target === 'ring_hub') {
        // Return to Ring Selection (Landing Screen)
        const app = document.getElementById('app');
        const landing = document.getElementById('landing-screen');

        app.classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            app.classList.add('hidden');
            landing.classList.remove('hidden');
            landing.classList.remove('animate-fade-out');
            landing.classList.add('animate-fade-in');
        }, 500);
        return;
    }

    // Special Case: Black Market Entrance -> Layout Login Modal
    if (node.id === 'casino_entrance' || node.target === 'casino') {
        if (window.openLoginModal) {
            window.openLoginModal();
        } else {
            console.error("Login Modal function not found");
        }
        return;
    }

    if (node.actionType === 'shop') {
        loadShop(node.target);
    } else if (node.actionType === 'dialog') {
        showToast(node.text);
    } else if (node.actionType === 'modal' && node.target === 'mission-board') {
        openMissionBoard();
    } else if (node.actionType === 'modal') {
        alert("Tablón de misiones: ¡Próximamente!");
    }
}

// --- MISSION BOARD LOGIC ---
const sampleMissions = [
    // RANGO E (Novato)
    {
        id: 4,
        title: "Limpieza de Cloacas Profunda",
        desc: "Una fuga alquímica ha mutado a las ratas del Sector Sur, volviéndolas agresivas y peligrosas para los cimientos.",
        reward: "500 mo",
        val: 500,
        rarity: "Común",
        icon: "fa-skull",
        req: "Cola de Rata",
        rank: 'E'
    },
    {
        id: 7,
        title: "Recolección: Raíz de Sangre",
        desc: "Los boticarios necesitan 'Raíz de Sangre' fresca del Bosque de Hongos. Cuidado, su olor atrae depredadores.",
        reward: "300 mo",
        val: 300,
        rarity: "Común",
        icon: "fa-leaf",
        req: "Raíz de Sangre",
        rank: 'E'
    },

    // RANGO D (Principiante)
    {
        id: 2,
        title: "Entrega Silenciosa al Anillo 0",
        desc: "Transporta un paquete sellado al Mercado Negro sin ser escaneado. Si el sello se rompe, el contrato se anula.",
        reward: "1500 mo",
        val: 1500,
        rarity: "Poco Común",
        icon: "fa-box",
        req: "Paquete Sellado",
        rank: 'D'
    },
    {
        id: 8,
        title: "Caza de Bestias: Manada de Lobos",
        desc: "Lobos de Fase atacan las caravanas comerciales teletransportándose. Trae la piel del Alfa para dispersarlos.",
        reward: "1200 mo",
        val: 1200,
        rarity: "Poco Común",
        icon: "fa-paw",
        req: "Piel de Lobo",
        rank: 'D'
    },

    // RANGO C (Intermedio)
    {
        id: 3,
        title: "Cobro de Deudas: Lord Valhen",
        desc: "Lord Valhen lleva tres meses sin pagar protección. Entra en su mansión y recuérdale sus obligaciones.",
        reward: "2500 mo",
        val: 2500,
        rarity: "Rara",
        icon: "fa-hand-holding-usd",
        req: "Pago de Valhen",
        rank: 'C'
    },
    {
        id: 9,
        title: "El Terror de la Colina",
        desc: "Un Oso Lechuza infectado por el Velo destroza las granjas. Elimínalo antes de que llegue a la ciudad.",
        reward: "3000 mo",
        val: 3000,
        rarity: "Rara",
        icon: "fa-feather",
        req: "Pico de Oso Lechuza",
        rank: 'C'
    },

    // RANGO B (Veterano)
    {
        id: 5,
        title: "Escolta Diplomática de Alto Riesgo",
        desc: "El Embajador de Ignis debe llegar al Palacio para una votación crítica. Evita que los separatistas lo asesinen.",
        reward: "Item: Amuleto Real",
        val: 0,
        rarity: "Muy Rara",
        icon: "fa-user-shield",
        itemReward: { name: "Amuleto Real", desc: "Símbolo de la corte. Inmunidad a Miedo.", type: "Accesorio", rarity: "Muy Rara" },
        rank: 'B'
    },
    {
        id: 10,
        title: "Purga: Nido de la Reina Araña",
        desc: "Una Reina Araña de Cristal ha despertado en el subsuelo. Destrúyela junto a sus huevos para detener los secuestros.",
        reward: "4000 mo",
        val: 4000,
        rarity: "Muy Rara",
        icon: "fa-spider",
        req: "Veneno Reina",
        rank: 'B'
    },

    // RANGO A (Elite)
    {
        id: 1,
        title: "Caza Mayor: Wyvern Corrupto",
        desc: "Un Wyvern expuesto a radiación pura del Velo se ha asentado en las Agujas del Norte. Trae su cabeza.",
        reward: "5000 mo",
        val: 5000,
        rarity: "Legendaria",
        icon: "fa-dragon",
        req: "Cabeza de Wyvern",
        rank: 'A'
    },
    {
        id: 11,
        title: "Duelo: El Caballero Negro",
        desc: "Un guerrero inmortal bloquea el Puente de los Suspiros buscando un duelo honorable. Concédele su deseo final.",
        reward: "6000 mo",
        val: 6000,
        rarity: "Legendaria",
        icon: "fa-chess-knight",
        req: "Yelmo Negro",
        rank: 'A'
    },

    // RANGO S (Leyenda)
    {
        id: 6,
        title: "Recuperación: La Hoja de Sombras",
        desc: "La legendaria 'Devoradora de Luz' ha sido robada por el Culto del Vacío. Recupérala antes de que abran una grieta.",
        reward: "Arma: Hoja de Sombras",
        val: 0,
        rarity: "Legendaria",
        icon: "fa-mask",
        itemReward: { name: "Hoja de Sombras", desc: "Espada legendaria. Golpea a través de armadura y drena vida.", type: "Arma", rarity: "Legendaria" },
        req: "Ubicación Ladrones",
        rank: 'S'
    },
    {
        id: 12,
        title: "Amenaza Existencial: Avatar Oscuro",
        desc: "Un Avatar de un Dios Olvidado ha roto el Velo. La realidad se deshace. Lucha por la existencia de Eranol.",
        reward: "100.000 mo",
        val: 100000,
        rarity: "Nacional",
        icon: "fa-skull-crossbones",
        req: "Esencia Divina",
        rank: 'S'
    }
];

let currentRankTab = 'E';

function openMissionBoard() {
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
            // Uses w-full to fill grid cell, h-24 to stand tall
            btn.className = 'w-full h-24 -mb-[1px] bg-[#f0e6d2] text-[#2c1810] rounded-t-lg border-x-2 border-t-2 border-[#8d6e63] shadow-[0_-5px_15px_rgba(202,138,4,0.2)] flex flex-col items-center justify-center relative z-10 transform transition-all duration-300';
            // Inner glow or texture hint could be added here
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

    // Add "Wood" texture hint (optional via CSS, but bg color is fine for now)

    const filtered = sampleMissions.filter(m => m.rank === rankFilter);

    if (filtered.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center text-white/30 py-10 italic">No hay contratos disponibles.</div>`;
        return;
    }

    filtered.forEach((m, index) => {
        const status = playerState.missionStatus[m.id] || 'new'; // changed to playerState

        const el = document.createElement('div');
        // Parchment Style
        const rotation = (index % 2 === 0 ? '-rotate-1' : 'rotate-1');
        el.className = `transform ${rotation} relative bg-[#f0e6d2] text-[#2c1810] p-6 rounded shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex flex-col gap-4 font-serif transition-transform hover:scale-105 hover:z-10`;

        if (status === 'completed') {
            el.classList.add('opacity-70', 'grayscale');
            el.innerHTML += '<div class="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"><span class="border-4 border-red-800 text-red-800 font-black text-4xl uppercase -rotate-12 px-4 py-2 opacity-80">Completado</span></div>';
        }

        // Pin (Chincheta)
        const pinColor = m.rank === 'S' || m.rank === 'A' ? 'bg-red-600' : 'bg-yellow-600';
        const pin = `<div class="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${pinColor} shadow-md border border-black/30 z-20"></div>`;

        // Requirement Label
        let reqHtml = '';
        if (m.req) {
            reqHtml = `<div class="text-[10px] text-red-800 mt-1 uppercase font-bold tracking-wider border-t border-red-800/20 pt-1"><i class="fas fa-thumbtack mr-1"></i> Requisito: ${m.req}</div>`;
        }

        // Action Button Logic
        let actionBtn = '';
        if (status === 'new') {
            actionBtn = `<button class="w-full mt-2 bg-[#2c1810] hover:bg-black text-[#f0e6d2] text-sm font-bold py-2 px-4 rounded shadow transition-colors uppercase tracking-widest" onclick="acceptMission(${m.id})">Firmar</button>`;
        } else if (status === 'accepted') {
            actionBtn = `<button class="w-full mt-2 bg-red-700 hover:bg-red-600 text-white text-sm font-bold py-2 px-4 rounded shadow transition-colors uppercase tracking-widest animate-pulse" onclick="claimMission(${m.id})">Reclamar</button>`;
        } else {
            // No button needed for completed, watermark handles it
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
    saveGame();
    showToast("Contrato firmado. Revisa los requisitos.");
    renderMissionList(document.getElementById('mission-list'), currentRankTab);
}

window.claimMission = function (id) {
    const mission = sampleMissions.find(m => m.id === id);
    if (!mission) return;

    // CHECK REQUIREMENT
    if (mission.req) {
        // Look for item in simple inventory array
        const hasItem = playerState.inventory.find(i => i.name === mission.req);

        if (!hasItem) {
            showToast(`❌ Falta: ${mission.req}`);
            return;
        }

        // Remove item (Consume proof)
        const idx = playerState.inventory.indexOf(hasItem);
        if (idx > -1) playerState.inventory.splice(idx, 1);
        showToast(`Entregado: ${mission.req}`);
    }

    if (mission.val > 0) {
        addGold(mission.val);
        showToast(`Recompensa: +${mission.val} oro`);
    }

    if (mission.itemReward) {
        addItem(mission.itemReward);
        showToast(`Obtenido: ${mission.itemReward.name}`);
    }

    playerState.missionStatus[id] = 'completed';
    // Trigger Save (Assuming addItem/addGold already save, but explicit doesn't hurt)
    saveGame();
    renderMissionList(document.getElementById('mission-list'), currentRankTab);
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
