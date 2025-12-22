
import { state } from '../../state.js';
import { updateGoldDisplay, showToast } from './ui.js';
import { playerState, saveGame } from './player.js';

/*
    DICE GAME MODULE (Dados de Cráneo)
    - Modal UI for the game table
    - Participant management (add player, add random NPCs)
    - Betting system
    - 3D Dice physics/animation mock
*/

let gameState = {
    participants: [],
    pot: 0,
    isRolling: false
};

// -- DOM ELEMENTS --
let diceModal;
let tableContainer;
let debtModal;
let debtAmountDisplay;
let debtCreditorNameDisplay;
let debtCreditorImg;
let debtQuoteDisplay;

export function initDiceGame() {
    if (!document.getElementById('dice-modal')) {
        const html = `
            <div id="dice-modal" class="hidden fixed inset-0 z-[80] bg-black/95 backdrop-blur-md flex items-center justify-center animate-fade-in">
                <style>
                    /* 3D Dice Styles Enhanced */
                    .scene { width: 80px; height: 80px; perspective: 600px; display: inline-block; margin: 10px; }
                    .cube { width: 100%; height: 100%; position: relative; transform-style: preserve-3d; transform: translateZ(-40px); transition: transform 2.5s cubic-bezier(0.1, 0.9, 0.2, 1.0); }
                    .cube__face { position: absolute; width: 80px; height: 80px; border: 1px solid rgba(255,255,255,0.5); line-height: 80px; font-size: 32px; font-weight: bold; color: white; text-align: center; background: radial-gradient(circle, rgba(60,60,60,1) 0%, rgba(20,20,20,1) 100%); border-radius: 12px; box-shadow: inset 0 0 10px rgba(0,0,0,0.8); }
                    .cube__face--1  { transform: rotateY(  0deg) translateZ(40px); }
                    .cube__face--2  { transform: rotateY( 90deg) translateZ(40px); }
                    .cube__face--3  { transform: rotateY(180deg) translateZ(40px); }
                    .cube__face--4  { transform: rotateY(-90deg) translateZ(40px); }
                    .cube__face--5  { transform: rotateX( 90deg) translateZ(40px); }
                    .cube__face--6  { transform: rotateX(-90deg) translateZ(40px); }
                    
                    /* Felt Table Texture */
                    .bg-felt {
                        background-color: #0d2e1a;
                        background-image: 
                            radial-gradient(transparent 0%, rgba(0,0,0,0.6) 100%),
                            url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23194a2b' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
                    }
                </style>

                <div class="w-full max-w-6xl h-[95vh] flex flex-col relative bg-gray-900 border-2 border-amber-700 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                    <!-- HEADER -->
                    <div class="p-6 border-b border-amber-900/50 flex justify-between items-center bg-gradient-to-r from-gray-900 to-black relative z-10">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full bg-amber-900/30 flex items-center justify-center border border-amber-500/30">
                                <i class="fas fa-skull text-amber-500 text-2xl"></i>
                            </div>
                            <div>
                                <h2 class="text-3xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">Dados de Cráneo</h2>
                                <p class="text-gray-400 text-xs uppercase tracking-widest">Objetivo: <span class="text-white font-bold">7</span> o <span class="text-white font-bold">12</span></p>
                            </div>
                        </div>
                        <div class="flex items-center gap-6">
                            <div class="bg-black/40 px-6 py-2 rounded-full border border-amber-500/20">
                                <span class="text-gray-400 text-xs uppercase mr-2">Bote Actual</span>
                                <span class="text-amber-400 font-mono text-xl font-bold" id="game-pot-display">0</span> <span class="text-amber-600 text-xs">mo</span>
                            </div>
                            <button onclick="closeDiceGame()" class="text-gray-500 hover:text-white transition-colors hover:rotate-90 transform duration-300"><i class="fas fa-times text-2xl"></i></button>
                        </div>
                    </div>

                    <!-- TABLE AREA -->
                    <div id="game-table" class="flex-1 p-8 overflow-y-auto bg-felt relative shadow-inner">
                        <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
                        
                        <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="participants-grid">
                            <!-- Players Cards Go Here -->
                        </div>
                    </div>

                    <!-- CONTROLS -->
                    <div class="p-6 bg-gray-950 border-t border-amber-900/30 flex justify-between items-center gap-4 relative z-20">
                        <div class="flex gap-4">
                            <button onclick="openNPCSelector()" class="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-200 font-bold border border-white/10 transition-all shadow-lg flex items-center gap-2 group">
                                <i class="fas fa-user-plus text-amber-500 group-hover:scale-110 transition-transform"></i> Añadir Oponente
                            </button>
                            <button onclick="resetGame()" class="px-5 py-2.5 bg-red-900/20 hover:bg-red-900/40 rounded-lg text-red-300 font-bold border border-red-500/10 transition-all">
                                <i class="fas fa-trash-alt mr-2"></i>Reset
                            </button>
                        </div>
                        
                        <div class="flex-1 flex justify-center">
                             <!-- Spacer or Status Msg -->
                        </div>

                        <button id="btn-roll" onclick="rollAllDice()" class="relative group overflow-hidden px-10 py-4 bg-amber-600 text-white font-black text-xl rounded-xl shadow-[0_5px_0_rgb(180,83,9)] hover:shadow-[0_2px_0_rgb(180,83,9)] hover:translate-y-[3px] transition-all border border-amber-400/20">
                            <span class="relative z-10 flex items-center gap-3 uppercase tracking-widest">
                                <i class="fas fa-dice text-2xl group-hover:rotate-180 transition-transform duration-700"></i> ¡LANZAR!
                            </span>
                            <div class="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-700 opacity-100 group-hover:opacity-90 transition-opacity"></div>
                        </button>
                    </div>
                </div>
                
                <!-- Debt Warning Modal (Hidden by default) -->
                <div id="debt-modal" class="hidden absolute inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in">
                    <div class="bg-gray-900 border-2 border-red-600 rounded-2xl p-8 max-w-md text-center shadow-[0_0_50px_rgba(220,38,38,0.4)] relative overflow-hidden">
                        <div class="absolute -top-10 -right-10 w-32 h-32 bg-red-600 blur-[60px] opacity-20"></div>
                        
                        <div class="w-20 h-20 rounded-full border-4 border-red-600 mx-auto mb-6 bg-cover bg-center shadow-lg" id="debt-creditor-img"></div>
                        
                        <h3 class="text-3xl font-black text-white mb-2 uppercase italic tracking-tighter">¡ESTÁS EN DEUDA!</h3>
                        <p class="text-red-400 font-bold mb-6 text-lg">Debes <span id="debt-amount" class="text-white text-2xl">0</span> monedas a <span id="debt-creditor-name">Alguien</span>.</p>
                        
                        <div class="bg-black/50 p-4 rounded-lg border border-red-900/50 mb-6 text-left">
                            <p class="text-gray-300 italic text-sm">"<span id="debt-quote">Si no pagas en 3 días, me cobraré en carne. O en dedos. Tú eliges.</span>"</p>
                        </div>
                        
                        <button onclick="document.getElementById('debt-modal').classList.add('hidden')" class="w-full py-3 bg-red-700 hover:bg-red-600 text-white font-bold rounded uppercase tracking-widest transition-colors shadow-lg">
                            Entendido (Aceptar Destino)
                        </button>
                    </div>
                </div>

                <!-- NPC Selector Modal -->
                <div id="npc-selector-modal" class="hidden absolute inset-0 z-[85] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div class="bg-gray-900 border border-amber-600/50 rounded-xl p-6 w-full max-w-lg shadow-2xl">
                        <h3 class="text-2xl font-cinzel text-amber-500 mb-4 border-b border-white/10 pb-2">Elige tu Oponente</h3>
                        <div class="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar" id="npc-list-container">
                            <!-- JS populates this -->
                        </div>
                        <button onclick="document.getElementById('npc-selector-modal').classList.add('hidden')" class="mt-4 w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded font-bold uppercase tracking-wider transition-colors">
                            Cancelar
                        </button>
                    </div>
                </div>

            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    }
    diceModal = document.getElementById('dice-modal');
    tableContainer = document.getElementById('participants-grid');
    debtModal = document.getElementById('debt-modal');
    debtAmountDisplay = document.getElementById('debt-amount');
    debtCreditorNameDisplay = document.getElementById('debt-creditor-name');
    debtCreditorImg = document.getElementById('debt-creditor-img');
    debtQuoteDisplay = document.getElementById('debt-quote');

    // Check if player is already added?
    resetGame();

    // Expose
    window.closeDiceGame = closeDiceGame;
    window.addParticipant = addParticipant;
    window.rollAllDice = rollAllDice;
    window.resetGame = resetGame;
    window.resetGame = resetGame;
    window.updatePlayerBet = updatePlayerBet;
    window.openNPCSelector = openNPCSelector;
    window.selectNPC = selectNPC;
}

export function openDiceGame() {
    initDiceGame();
    diceModal.classList.remove('hidden');
    // Ensure player is at table
    if (gameState.participants.length === 0) {
        addParticipant('player');
        // Initial Opponents? Maybe none, let user choose. Or 1 random.
        // Let's force user to add opponents for interaction.
    }
    updateUI();
}

function closeDiceGame() {
    diceModal.classList.add('hidden');
}

function resetGame() {
    gameState.participants = [];
    gameState.pot = 0;
    gameState.isRolling = false;
    // Add default player
    addParticipant('player');
    updateUI();
}

function addParticipant(type, npcData = null) {
    if (gameState.isRolling) return;

    let newParticipant;

    if (type === 'player') {
        // Prevent duplicate player
        if (gameState.participants.find(p => p.isPlayer)) return;

        let formattedName = playerState.name || 'Tú';
        // Capitalize First Letter
        formattedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);

        newParticipant = {
            id: 'player',
            name: formattedName,
            isPlayer: true,
            bet: 10, // Default bet
            dice: [1, 1], // Initial dice state
            result: null
        };
    } else {
        // NPC
        if (!npcData) return; // Must come from selector

        const bet = Math.floor(Math.random() * 91) + 10; // 10 to 100

        newParticipant = {
            id: `npc_${Date.now()}_${Math.random()}`,
            name: npcData.name,
            avatar: npcData.avatar, // Optional usage
            isPlayer: false,
            bet: bet,
            dice: [1, 1],
            result: null
        };
    }

    gameState.participants.push(newParticipant);
    updatePot();
    updateUI();
}

function openNPCSelector() {
    const selector = document.getElementById('npc-selector-modal');
    const container = document.getElementById('npc-list-container');

    // Pool of NPCs
    const npcPool = [
        { name: "Ratko", avatar: "img/npcs/ratko.png", desc: "Goblin Tramposo" },
        { name: "Brutus", avatar: "img/npcs/brutus.png", desc: "Orco Gorila" },
        { name: "Sombra", avatar: "img/npcs/sombra.png", desc: "Ladrón Silencioso" },
        { name: "Gix", avatar: "img/npcs/gix.png", desc: "Kobold Nervioso" },
        { name: "Vora", avatar: "img/npcs/vora.png", desc: "Bruja de Pantano" },
        { name: "Krunk", avatar: "img/npcs/krunk.png", desc: "Gigante Tonto" },
        { name: "Dagger", avatar: "img/npcs/dagger.png", desc: "Asesino" },
        { name: "Seda", avatar: "img/npcs/seda.png", desc: "Cortesana Espía" },
        { name: "Borg", avatar: "img/npcs/borg.png", desc: "Dueño del Bar" },
        { name: "Zora", avatar: "img/npcs/zora.png", desc: "Mercenaria" },
        { name: "Dedos Vance", avatar: "img/npcs/vance.png", desc: "Informante" }
    ];

    container.innerHTML = '';

    npcPool.forEach(npc => {
        // Check if already in game? Allow duplicates? Maybe not.
        // Let's allow duplicates for chaos or unique IDs handle it.
        const btn = document.createElement('div');
        btn.className = "flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-white/5 hover:bg-amber-900/40 hover:border-amber-500/50 cursor-pointer transition-all group";
        btn.onclick = () => selectNPC(npc);

        btn.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-gray-700 bg-cover bg-center border border-white/20 group-hover:border-amber-400" style="background-image: url('${npc.avatar}')"></div>
            <div>
                <p class="font-bold text-gray-200 group-hover:text-amber-400 text-sm">${npc.name}</p>
                <p class="text-xs text-gray-500">${npc.desc}</p>
            </div>
        `;
        container.appendChild(btn);
    });

    selector.classList.remove('hidden');
}

function selectNPC(npc) {
    addParticipant('npc', npc);
    document.getElementById('npc-selector-modal').classList.add('hidden');
}

function updatePlayerBet(val) {
    const p = gameState.participants.find(p => p.isPlayer);
    if (p) {
        // Allow over-betting (Resulting in debt)
        p.bet = parseInt(val) || 0;
        updatePot();
        // Update display on card if needed, but input handles it
    }
}

function updatePot() {
    gameState.pot = gameState.participants.reduce((sum, p) => sum + p.bet, 0);
    const potDisplay = document.getElementById('game-pot-display');
    if (potDisplay) potDisplay.innerText = gameState.pot;
}

function updateUI() {
    if (!tableContainer) return;
    tableContainer.innerHTML = '';

    gameState.participants.forEach((p, idx) => {
        const isPlayer = p.isPlayer;
        const betControl = isPlayer
            // Removed Max constraint to allow Debt mechanics
            ? `<input type="number" min="1" value="${p.bet}" onchange="updatePlayerBet(this.value)" class="bg-black/50 border border-white/20 text-center w-24 rounded text-amber-400 font-bold focus:outline-none focus:border-amber-500 py-1">`
            : `<span class="text-amber-500 font-mono font-bold">${p.bet} mo</span>`;

        const card = document.createElement('div');
        card.className = `p-6 rounded-xl border relative overflow-hidden transition-all shadow-lg backdrop-blur-sm ${isPlayer ? 'bg-gradient-to-br from-amber-900/30 to-black/60 border-amber-500/50' : 'bg-gradient-to-br from-gray-800/40 to-black/60 border-white/5'}`;

        // 3D Dice HTML
        const diceHtml = p.dice.map((val, dieIdx) => `
            <div class="scene" id="scene-${idx}-${dieIdx}">
                <div class="cube show-${val}">
                    <div class="cube__face cube__face--1">1</div>
                    <div class="cube__face cube__face--2">2</div>
                    <div class="cube__face cube__face--3">3</div>
                    <div class="cube__face cube__face--4">4</div>
                    <div class="cube__face cube__face--5">5</div>
                    <div class="cube__face cube__face--6">6</div>
                </div>
            </div>
        `).join('');

        card.innerHTML = `
            <div class="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                <h3 class="font-bold text-white text-lg ${isPlayer ? 'text-amber-400 drop-shadow' : ''}">${p.name}</h3>
                <div class="flex items-center gap-2 text-sm text-gray-400">
                    <i class="fas fa-coins text-amber-600"></i>
                    ${betControl}
                </div>
            </div>
            
            <div class="flex justify-center gap-4 py-4 perspective-container min-h-[100px]">
                ${diceHtml}
            </div>

            ${p.result ? `
                <div class="mt-4 text-center animate-countdown">
                    <span class="text-2xl font-black ${p.result.win ? 'text-green-500 border-green-500 bg-green-900/20' : 'text-red-500 border-red-500 bg-red-900/20'} uppercase tracking-widest border-2 px-6 py-2 rounded-lg transform -rotate-2 inline-block shadow-2xl backdrop-blur-md">
                        ${p.result.total}
                    </span>
                    <p class="text-xs ${p.result.win ? 'text-green-300' : 'text-red-300'} mt-2 font-bold uppercase">${p.result.msg}</p>
                </div>
            ` : ''}
        `;
        tableContainer.appendChild(card);
    });
}

function rollAllDice() {
    if (gameState.isRolling) return;
    gameState.isRolling = true;
    const btnRoll = document.getElementById('btn-roll');
    btnRoll.disabled = true;
    btnRoll.classList.add('opacity-50', 'grayscale');

    // 1. Trigger Animation
    const cubes = document.querySelectorAll('.cube');
    cubes.forEach(cube => {
        // Random spin rotations (x3 to x5 full spins)
        const xRot = 1080 + Math.random() * 720;
        const yRot = 1080 + Math.random() * 720;

        // Temporarily override transition for a spin effect or just set a new transform?
        // Since we are moving TO a final state, we need to know the destination NOW to animate TO it.
        // So we calculate results immediately but "reveal" them by animating to the specific rotation + spin.

        // Wait, to calculate destination we need the numbers.
    });

    // Strategy Update: 
    // Calculate results immediately.
    // Animate each cube to: (FaceRotation + N * 360) + wobble?
    // We'll use simple Face Rotation + extra 1440deg spins.

    // Face Rotations Map (matching CSS classes logic)
    // 1: rotateY(0)
    // 2: rotateY(90deg) -> CSS says rotateY(90) translateZ... wait. 
    // To SHOW face 2 (which is on Right), we need to rotate Cube -90 deg Y.
    // CSS .show-2 { transform: translateZ(-40px) rotateY(-90deg); }

    const faceRotations = {
        1: { x: 0, y: 0 },
        2: { x: 0, y: -90 },
        3: { x: 0, y: -180 },
        4: { x: 0, y: 90 },
        5: { x: -90, y: 0 },
        6: { x: 90, y: 0 }
    };

    gameState.participants.forEach((p, idx) => {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        p.dice = [d1, d2];
        const total = d1 + d2;
        const isWin = (total === 7 || total === 12);

        p.result = {
            total: total,
            win: isWin,
            msg: isWin ? '¡VICTORIA!' : 'DERROTA'
        };

        // ANIMATE DICE
        const extraSpins = 4; // Full rotations

        const cube1 = document.querySelector(`#scene-${idx}-0 .cube`);
        const cube2 = document.querySelector(`#scene-${idx}-1 .cube`);

        if (cube1) {
            const dest1 = faceRotations[d1];
            cube1.style.transform = `translateZ(-40px) rotateX(${dest1.x + (extraSpins * 360)}deg) rotateY(${dest1.y + (extraSpins * 360)}deg)`;
        }
        if (cube2) {
            const dest2 = faceRotations[d2];
            cube2.style.transform = `translateZ(-40px) rotateX(${dest2.x - (extraSpins * 360)}deg) rotateY(${dest2.y + (extraSpins * 360)}deg)`; // Spin opposite X for variation
        }
    });

    // 2. Resolve logic after animation finishes (2.5s)
    setTimeout(() => {
        // Handle Money & Debt
        gameState.participants.forEach(p => {
            if (p.isPlayer) {
                if (p.result.win) {
                    const winAmount = p.bet * 2;
                    playerState.gold += winAmount;
                    showToast(`¡GANAS! +${winAmount} MO`);
                } else {
                    // Check if Player HAS money to pay
                    if (playerState.gold >= p.bet) {
                        playerState.gold -= p.bet;
                        showToast(`PIERDES -${p.bet} MO`);
                    } else {
                        // DEBT SCENARIO
                        const debt = p.bet - playerState.gold;
                        playerState.gold = 0; // Bankrupt

                        // Find Creditor: Prefer a Winner, otherwise any NPC at table
                        let creditor = gameState.participants.find(part => !part.isPlayer && part.result && part.result.win);
                        if (!creditor) {
                            creditor = gameState.participants.find(part => !part.isPlayer);
                        }

                        triggerDebtEvent(debt, creditor);
                    }
                }
                saveGame();
                updateGoldDisplay();
            }
        });

        // Update UI to show text results
        updateUI();

        // Reset Dice transforms to "clean" rotations (removing extra spins) so next roll works from 0? 
        // No, keep them providing continuity.

        gameState.isRolling = false;
        btnRoll.disabled = false;
        btnRoll.classList.remove('opacity-50', 'grayscale');

    }, 2500); // Match CSS transition time
}

function triggerDebtEvent(debtAmount, specificCreditor) {
    const debtModal = document.getElementById('debt-modal');
    if (debtModal) {
        let creditorName = "El Sindicato";
        let creditorAvatar = "img/npcs/borg.png"; // Default House

        if (specificCreditor) {
            creditorName = specificCreditor.name;
            creditorAvatar = specificCreditor.avatar || "img/npcs/borg.png";
        } else {
            // Fallback for Solitaire play
            const creditors = ["Borg", "Zora 'La Cicatriz'", "Dedos Vance"];
            creditorName = creditors[Math.floor(Math.random() * creditors.length)];
            if (creditorName.includes("Zora")) creditorAvatar = "img/npcs/zora.png";
            if (creditorName.includes("Dedos")) creditorAvatar = "img/npcs/vance.png";
        }

        const deadline = Math.floor(Math.random() * 5) + 2; // 2-7 days

        document.getElementById('debt-amount').innerText = debtAmount;
        document.getElementById('debt-creditor-name').innerText = creditorName;
        document.getElementById('debt-quote').innerText = `Te doy ${deadline} días. Si no pagas ${debtAmount} monedas, me cobraré en carne.`;

        document.getElementById('debt-creditor-img').style.backgroundImage = `url('${creditorAvatar}')`;

        debtModal.classList.remove('hidden');
    }
}

