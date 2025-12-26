import { playerState, addGold, removeGold, addItem, saveGame } from './player.js';
import {
    duelOpponents,
    beastOpponents,
    gauntletWaves,
    arenaLeaderboard,
    ARENA_RANKS,
    BETTING_CONFIG,
    HONOR_CHANGES
} from '../data/arenaOpponents.js';

/* 
    ARENA MODULE: "EL FOSO DE SANGRE"
    Complete Arena System with Betting, Ranking, Honor & Respect
*/

// --- STATE ---
let currentArenaMode = null;
let currentOpponent = null;
let currentBetAmount = 0;
let currentWave = 0;

// --- DOM ELEMENTS ---
let arenaViewContainer;
let arenaContent;

// --- INIT ---
export function initArena() {
    arenaViewContainer = document.getElementById('arena-view');
    arenaContent = document.getElementById('arena-content');

    // Ensure arenaStats exist
    if (!playerState.arenaStats) {
        playerState.arenaStats = {
            wins: 0, losses: 0, draws: 0, totalFights: 0,
            currentStreak: 0, bestStreak: 0, honor: 0, respect: 0,
            rank: 'Carne Fresca', totalEarnings: 0, kills: 0, knockouts: 0
        };
    }

    // Global Expose
    window.startArenaMode = startArenaMode;
    window.signUpForArena = signUpForArena;
    window.exitArena = exitArena;
    window.renderArenaMenu = renderArenaMenu;
    window.selectOpponent = selectOpponent;
    window.adjustBet = adjustBet;
    window.confirmFight = confirmFight;
    window.reportResult = reportResult;
    window.showLeaderboard = showLeaderboard;
    window.showArenaStats = showArenaStats;
}

// --- ENTER/EXIT ---
export function enterArena() {
    console.log('[ARENA] Entering arena as full page view');

    // TESTING: Force max stats
    playerState.arenaStats = {
        wins: 50, losses: 5, draws: 2, totalFights: 57,
        currentStreak: 10, bestStreak: 15, honor: 100,
        respect: 2500, rank: 'Matadioses', totalEarnings: 50000,
        kills: 30, knockouts: 20
    };

    // Get elements directly (avoid initialization issues)
    const arenaView = document.getElementById('arena-view');
    const arenaContentEl = document.getElementById('arena-content');

    if (!arenaView) {
        console.error('[ARENA] arena-view element not found!');
        return;
    }

    // Hide tavern MODAL (important - tavern is a modal, not a view!)
    const tavernModal = document.getElementById('tavern-modal');
    if (tavernModal) {
        tavernModal.classList.add('hidden');
        tavernModal.style.display = 'none';
        tavernModal.style.opacity = '0';
    }

    // Hide other views
    document.getElementById('city-index-view')?.classList.add('hidden');
    document.getElementById('casino-view')?.classList.add('hidden');
    document.getElementById('district-selection-view')?.classList.add('hidden');
    document.getElementById('shop-detail-view')?.classList.add('hidden');

    // Show Arena as FULL PAGE
    arenaView.classList.remove('hidden');
    arenaView.style.display = 'flex';
    arenaView.style.position = 'fixed';
    arenaView.style.inset = '0';
    arenaView.style.zIndex = '100';
    arenaView.style.backgroundColor = 'rgba(0,0,0,0.95)';

    // Update references
    arenaViewContainer = arenaView;
    arenaContent = arenaContentEl;

    // Make sure all arena functions are globally available
    window.exitArena = exitArena;
    window.renderArenaMenu = renderArenaMenu;
    window.startArenaMode = startArenaMode;
    window.selectOpponent = selectOpponent;
    window.adjustBet = adjustBet;
    window.confirmFight = confirmFight;
    window.reportResult = reportResult;
    window.showLeaderboard = showLeaderboard;
    window.showArenaStats = showArenaStats;

    updateArenaHeader();
    renderArenaMenu();
}

export function exitArena() {
    console.log('[ARENA] Exiting arena');

    // Get element directly
    const arenaView = document.getElementById('arena-view');

    if (arenaView) {
        arenaView.classList.add('hidden');
        arenaView.style.display = 'none';
    }

    // Go back to city index (not tavern modal which may be empty)
    if (window.enterCityIndex) {
        window.enterCityIndex();
    }
}

// --- UPDATE HEADER ---
function updateArenaHeader() {
    const stats = playerState.arenaStats || {};

    document.getElementById('arena-streak').textContent = stats.currentStreak || 0;
    document.getElementById('arena-honor').textContent = stats.honor || 0;
    document.getElementById('arena-rank').textContent = stats.rank || 'Novato';
    document.getElementById('arena-gold').textContent = playerState.gold || 0;

    // Color honor based on value
    const honorEl = document.getElementById('arena-honor');
    if (stats.honor < 0) honorEl.className = 'text-lg font-bold text-red-500';
    else if (stats.honor > 50) honorEl.className = 'text-lg font-bold text-green-500';
    else honorEl.className = 'text-lg font-bold text-amber-500';
}

// --- MAIN MENU ---
function renderArenaMenu() {
    // Get element directly to avoid initialization issues
    const contentEl = document.getElementById('arena-content');
    if (!contentEl) {
        console.error('[ARENA] arena-content element not found!');
        return;
    }
    arenaContent = contentEl;

    const stats = playerState.arenaStats || {};
    const record = `${stats.wins || 0}V - ${stats.losses || 0}D`;

    contentEl.innerHTML = `
        <div class="w-full max-w-7xl mx-auto animate-fade-in py-8">
            
            <!-- Title -->
            <div class="text-center mb-10">
                <h2 class="font-cinzel text-5xl md:text-6xl font-bold text-red-600 mb-4 drop-shadow-lg">EL FOSO DE SANGRE</h2>
                <p class="text-gray-400 text-lg max-w-2xl mx-auto">
                    Bienvenido al espectáculo más sangriento del Anillo 2. Elige tu categoría, 
                    apuesta tu oro, y demuestra tu valía en la arena.
                </p>
            </div>

            <!-- Stats Bar -->
            <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                <div class="glass-panel p-6 rounded-xl text-center border border-white/10">
                    <p class="text-sm text-gray-500 uppercase mb-2">Récord</p>
                    <p class="text-3xl font-bold text-white">${record}</p>
                </div>
                <div class="glass-panel p-6 rounded-xl text-center border border-white/10">
                    <p class="text-sm text-gray-500 uppercase mb-2">Mejor Racha</p>
                    <p class="text-3xl font-bold text-amber-500">${stats.bestStreak || 0}</p>
                </div>
                <div class="glass-panel p-6 rounded-xl text-center border border-white/10">
                    <p class="text-sm text-gray-500 uppercase mb-2">Respeto</p>
                    <p class="text-3xl font-bold text-purple-400">${stats.respect || 0}</p>
                </div>
                <div class="glass-panel p-6 rounded-xl text-center border border-white/10">
                    <p class="text-sm text-gray-500 uppercase mb-2">Ganancias</p>
                    <p class="text-3xl font-bold text-yellow-400">${stats.totalEarnings || 0}</p>
                </div>
                <div class="glass-panel p-6 rounded-xl text-center border border-white/10 col-span-2 md:col-span-1">
                    <p class="text-sm text-gray-500 uppercase mb-2">Combates</p>
                    <p class="text-3xl font-bold text-white">${stats.totalFights || 0}</p>
                </div>
            </div>

            <!-- Mode Selection - VERTICAL LARGE CARDS -->
            <div class="flex flex-col gap-6 mb-12 max-w-4xl mx-auto">
                <!-- DUEL -->
                <button onclick="startArenaMode('duel')" 
                    class="group relative bg-gradient-to-r from-red-950/60 via-red-900/20 to-black border-2 border-red-900/50 p-8 rounded-2xl hover:border-red-500 transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(220,38,38,0.4)] text-left flex items-center gap-8">
                    <div class="absolute -top-3 left-8 bg-red-700 text-white px-5 py-2 text-sm font-bold uppercase tracking-widest rounded-full shadow-lg">1 vs 1</div>
                    <i class="fas fa-skull-crossbones text-8xl text-red-600 group-hover:text-red-400 transition-colors flex-shrink-0"></i>
                    <div class="flex-1">
                        <h3 class="font-cinzel text-4xl font-bold text-white mb-3">Duelo de Honor</h3>
                        <p class="text-gray-300 text-lg mb-4">Enfréntate a un oponente. Apuesta tu oro y dobla tu fortuna.</p>
                        <div class="text-lg text-red-400 font-bold uppercase tracking-widest">→ ${duelOpponents.length} Oponentes Disponibles</div>
                    </div>
                </button>

                <!-- BEAST -->
                <button onclick="startArenaMode('beast')" 
                    class="group relative bg-gradient-to-r from-amber-950/60 via-amber-900/20 to-black border-2 border-amber-900/50 p-8 rounded-2xl hover:border-amber-500 transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(217,119,6,0.4)] text-left flex items-center gap-8">
                    <div class="absolute -top-3 left-8 bg-amber-700 text-white px-5 py-2 text-sm font-bold uppercase tracking-widest rounded-full shadow-lg">Grupo</div>
                    <i class="fas fa-dragon text-8xl text-amber-600 group-hover:text-amber-400 transition-colors flex-shrink-0"></i>
                    <div class="flex-1">
                        <h3 class="font-cinzel text-4xl font-bold text-white mb-3">Jaula de la Bestia</h3>
                        <p class="text-gray-300 text-lg mb-4">Grupo vs Monstruo. Consigue materiales raros y gloria eterna.</p>
                        <div class="text-lg text-amber-400 font-bold uppercase tracking-widest">→ ${beastOpponents.length} Bestias Disponibles</div>
                    </div>
                </button>

                <!-- GAUNTLET -->
                <button onclick="startArenaMode('gauntlet')" 
                    class="group relative bg-gradient-to-r from-purple-950/60 via-purple-900/20 to-black border-2 border-purple-900/50 p-8 rounded-2xl hover:border-purple-500 transition-all hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(147,51,234,0.4)] text-left flex items-center gap-8">
                    <div class="absolute -top-3 left-8 bg-purple-700 text-white px-5 py-2 text-sm font-bold uppercase tracking-widest rounded-full shadow-lg">Hardcore</div>
                    <i class="fas fa-fist-raised text-8xl text-purple-600 group-hover:text-purple-400 transition-colors flex-shrink-0"></i>
                    <div class="flex-1">
                        <h3 class="font-cinzel text-4xl font-bold text-white mb-3">Guantelete Ciego</h3>
                        <p class="text-gray-300 text-lg mb-4">5 oleadas sin descanso. Solo los más fuertes sobreviven.</p>
                        <div class="text-lg text-purple-400 font-bold uppercase tracking-widest">→ ${gauntletWaves.length} Oleadas de Muerte</div>
                    </div>
                </button>
            </div>

            <!-- Secondary Actions -->
            <div class="flex flex-wrap justify-center gap-6">
                <button onclick="showLeaderboard()" 
                    class="px-8 py-4 bg-white/5 border-2 border-yellow-900/30 rounded-xl hover:bg-yellow-900/20 hover:border-yellow-500/50 transition-all text-lg">
                    <i class="fas fa-trophy text-yellow-500 mr-3"></i> Clasificación
                </button>
                <button onclick="showArenaStats()" 
                    class="px-8 py-4 bg-white/5 border-2 border-blue-900/30 rounded-xl hover:bg-blue-900/20 hover:border-blue-500/50 transition-all text-lg">
                    <i class="fas fa-chart-bar text-blue-400 mr-3"></i> Mis Estadísticas
                </button>
            </div>
        </div>
    `;
}

// --- MODE SELECTION ---
function startArenaMode(mode) {
    currentArenaMode = mode;

    if (mode === 'duel') {
        renderOpponentList(duelOpponents.filter(o => o.minRespeto <= (playerState.arenaStats?.respect || 0)));
    } else if (mode === 'beast') {
        renderOpponentList(beastOpponents.filter(o => o.minRespeto <= (playerState.arenaStats?.respect || 0)));
    } else if (mode === 'gauntlet') {
        renderGauntletInfo();
    }
}

// --- OPPONENT LIST ---
function renderOpponentList(opponents) {
    const contentEl = document.getElementById('arena-content');
    if (!contentEl) return;

    const modeTitle = currentArenaMode === 'duel' ? 'DUELO DE HONOR' : 'JAULA DE LA BESTIA';
    const modeColor = currentArenaMode === 'duel' ? 'red' : 'amber';

    contentEl.innerHTML = `
        <div class="max-w-6xl mx-auto animate-fade-in">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="font-cinzel text-3xl font-bold text-${modeColor}-500">${modeTitle}</h2>
                    <p class="text-gray-500 text-sm">Elige a tu oponente según tu nivel de Respeto</p>
                </div>
                <button onclick="renderArenaMenu()" class="text-gray-500 hover:text-white transition-colors">
                    <i class="fas fa-arrow-left mr-2"></i> Volver
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                ${opponents.map(opp => renderOpponentCard(opp)).join('')}
            </div>

            ${opponents.length === 0 ? `
                <div class="text-center py-16">
                    <i class="fas fa-lock text-4xl text-gray-600 mb-4"></i>
                    <p class="text-gray-400">Necesitas más Respeto para desbloquear oponentes.</p>
                    <p class="text-sm text-gray-600 mt-2">Gana combates para aumentar tu Respeto.</p>
                </div>
            ` : ''}
        </div>
    `;
}

function renderOpponentCard(opp) {
    const difficultyColors = {
        facil: 'green', media: 'amber', dificil: 'red', mortal: 'purple', legendario: 'yellow'
    };
    const color = difficultyColors[opp.dificultad] || 'gray';

    return `
        <div onclick="selectOpponent('${opp.id}')" 
            class="glass-panel p-5 rounded-xl border border-${color}-900/30 hover:border-${color}-500/50 
                   cursor-pointer transition-all hover:-translate-y-1 group relative overflow-hidden">
            
            <div class="absolute top-2 right-2 text-xs bg-${color}-900/50 text-${color}-400 px-2 py-1 rounded uppercase tracking-widest">
                ND ${opp.nd}
            </div>

            <div class="flex items-start gap-4">
                <div class="w-16 h-16 rounded-full bg-cover bg-center border-2 border-${color}-500/30 flex-shrink-0"
                     style="background-image: url('${opp.avatar || '/img/npcs/borg.png'}')"></div>
                <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-white text-lg truncate">${opp.nombre}</h3>
                    ${opp.titulo ? `<p class="text-xs text-${color}-400 uppercase tracking-widest">${opp.titulo}</p>` : ''}
                </div>
            </div>

            <p class="text-sm text-gray-400 italic mt-3 line-clamp-2">"${opp.frase || opp.descripcion}"</p>

            <div class="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                <div class="text-xs">
                    <span class="text-gray-500">Cuota:</span>
                    <span class="text-${color}-400 font-bold ml-1">x${opp.probabilidad || BETTING_CONFIG.multiplicadores[opp.dificultad]}</span>
                </div>
                <div class="text-xs">
                    <span class="text-gray-500">Premio:</span>
                    <span class="text-yellow-400 font-mono ml-1">${opp.recompensa?.oro || 0} MO</span>
                </div>
            </div>
        </div>
    `;
}

// --- SELECT OPPONENT ---
function selectOpponent(oppId) {
    const allOpponents = [...duelOpponents, ...beastOpponents];
    currentOpponent = allOpponents.find(o => o.id === oppId);
    currentBetAmount = BETTING_CONFIG.apuestaMinima;

    if (!currentOpponent) {
        console.error('Opponent not found:', oppId);
        return;
    }

    renderFightSetup();
}

// --- FIGHT SETUP (Betting Screen) ---
function renderFightSetup() {
    const opp = currentOpponent;
    const cuota = opp.probabilidad || BETTING_CONFIG.multiplicadores[opp.dificultad];
    const maxBet = Math.floor(playerState.gold * BETTING_CONFIG.multiplicadorMaximo);
    const potentialWin = Math.floor(currentBetAmount * cuota);

    const diffColors = { facil: 'green', media: 'amber', dificil: 'red', mortal: 'purple', legendario: 'yellow' };
    const color = diffColors[opp.dificultad] || 'gray';

    arenaContent.innerHTML = `
        <div class="max-w-3xl mx-auto animate-fade-in">
            <div class="glass-panel p-8 rounded-2xl border border-${color}-900/30 relative overflow-hidden">
                
                <!-- Background -->
                <div class="absolute inset-0 bg-gradient-to-br from-${color}-900/10 to-transparent pointer-events-none"></div>

                <!-- Header -->
                <div class="text-center mb-8 relative z-10">
                    <p class="text-xs uppercase tracking-widest text-${color}-500 mb-2">CARTEL DEL COMBATE</p>
                    <h2 class="font-cinzel text-4xl font-bold text-white">${currentArenaMode === 'duel' ? 'DUELO' : 'CACERÍA'}</h2>
                </div>

                <!-- VS Display -->
                <div class="flex items-center justify-center gap-8 mb-8 relative z-10">
                    <div class="text-center">
                        <div class="w-24 h-24 mx-auto rounded-full bg-green-900/30 border-2 border-green-500 flex items-center justify-center mb-2">
                            <i class="fas fa-user text-3xl text-green-400"></i>
                        </div>
                        <p class="font-bold text-white">${playerState.name || 'TÚ'}</p>
                        <p class="text-xs text-gray-500">${playerState.arenaStats?.rank || 'Novato'}</p>
                    </div>

                    <div class="text-4xl font-black text-red-600 animate-pulse">VS</div>

                    <div class="text-center">
                        <div class="w-24 h-24 mx-auto rounded-full bg-cover bg-center border-2 border-${color}-500 mb-2"
                             style="background-image: url('${opp.avatar || '/img/npcs/borg.png'}')"></div>
                        <p class="font-bold text-white">${opp.nombre}</p>
                        <p class="text-xs text-${color}-400">${opp.titulo || `ND ${opp.nd}`}</p>
                    </div>
                </div>

                <!-- Opponent Info -->
                <div class="bg-black/40 p-4 rounded-lg border border-white/10 mb-6 relative z-10">
                    <p class="text-gray-300 italic text-center">"${opp.frase || opp.descripcion}"</p>
                </div>

                <!-- Betting Section -->
                <div class="bg-black/60 p-6 rounded-xl border border-amber-900/30 mb-6 relative z-10">
                    <h3 class="text-center text-amber-500 font-bold uppercase tracking-widest mb-4">
                        <i class="fas fa-coins mr-2"></i> APUESTAS
                    </h3>

                    <div class="flex items-center justify-center gap-4 mb-4">
                        <button onclick="adjustBet(-100)" class="w-10 h-10 bg-red-900/50 hover:bg-red-800 rounded-lg text-white font-bold">-100</button>
                        <button onclick="adjustBet(-10)" class="w-10 h-10 bg-red-900/30 hover:bg-red-800 rounded-lg text-white font-bold">-10</button>
                        
                        <div class="px-6 py-3 bg-black rounded-lg border border-amber-500/30 min-w-[140px] text-center">
                            <span id="bet-amount" class="text-2xl font-mono font-bold text-amber-400">${currentBetAmount}</span>
                            <span class="text-amber-600 text-sm ml-1">MO</span>
                        </div>

                        <button onclick="adjustBet(10)" class="w-10 h-10 bg-green-900/30 hover:bg-green-800 rounded-lg text-white font-bold">+10</button>
                        <button onclick="adjustBet(100)" class="w-10 h-10 bg-green-900/50 hover:bg-green-800 rounded-lg text-white font-bold">+100</button>
                    </div>

                    <div class="flex justify-between text-sm text-gray-500 px-4">
                        <span>Mín: ${BETTING_CONFIG.apuestaMinima} MO</span>
                        <span>Máx: ${maxBet} MO</span>
                    </div>

                    <div class="mt-4 text-center">
                        <p class="text-sm text-gray-400">Si ganas:</p>
                        <p class="text-3xl font-bold text-green-400">
                            <i class="fas fa-arrow-up mr-2"></i>
                            <span id="potential-win">${potentialWin}</span> MO
                        </p>
                        <p class="text-xs text-gray-600 mt-1">Cuota: x${cuota}</p>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-4 relative z-10">
                    <button onclick="startArenaMode('${currentArenaMode}')" 
                        class="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-bold uppercase tracking-widest transition-colors">
                        <i class="fas fa-arrow-left mr-2"></i> Cambiar Rival
                    </button>
                    <button onclick="confirmFight()" 
                        class="flex-1 py-3 bg-red-700 hover:bg-red-600 text-white rounded-lg font-bold uppercase tracking-widest shadow-lg shadow-red-900/30 transition-all hover:scale-105">
                        <i class="fas fa-fist-raised mr-2"></i> ¡A LA ARENA!
                    </button>
                </div>
            </div>
        </div>
    `;
}

// --- ADJUST BET ---
function adjustBet(amount) {
    const maxBet = Math.floor(playerState.gold * BETTING_CONFIG.multiplicadorMaximo);
    currentBetAmount = Math.max(BETTING_CONFIG.apuestaMinima, Math.min(maxBet, currentBetAmount + amount));

    document.getElementById('bet-amount').textContent = currentBetAmount;

    const cuota = currentOpponent.probabilidad || BETTING_CONFIG.multiplicadores[currentOpponent.dificultad];
    document.getElementById('potential-win').textContent = Math.floor(currentBetAmount * cuota);
}

// --- CONFIRM FIGHT ---
function confirmFight() {
    if (playerState.gold < currentBetAmount) {
        alert('¡No tienes suficiente oro para esa apuesta!');
        return;
    }

    // Deduct bet
    removeGold(currentBetAmount);
    updateArenaHeader();

    // Show fight active screen
    renderFightActive();
}

// --- FIGHT ACTIVE (Waiting for result) ---
function renderFightActive() {
    const opp = currentOpponent;

    arenaContent.innerHTML = `
        <div class="max-w-2xl mx-auto text-center animate-fade-in">
            <div class="glass-panel p-10 rounded-2xl border border-red-900/50 relative overflow-hidden">
                <div class="absolute inset-0 bg-red-900/5 animate-pulse"></div>

                <i class="fas fa-swords text-6xl text-red-600 mb-6 animate-bounce relative z-10"></i>
                
                <h2 class="font-cinzel text-4xl font-bold text-white mb-4 relative z-10">COMBATE EN CURSO</h2>
                
                <p class="text-gray-400 mb-8 relative z-10">
                    Luchando contra <span class="text-red-400 font-bold">${opp.nombre}</span><br>
                    <span class="text-xs text-gray-600">Apuesta: ${currentBetAmount} MO</span>
                </p>

                <div class="bg-black/60 p-6 rounded-xl mb-8 relative z-10">
                    <p class="text-white mb-4">¿Cuál fue el resultado del combate?</p>
                    <p class="text-xs text-gray-500 mb-6">Resuelve el combate en tu mesa y registra el resultado.</p>

                    <div class="grid grid-cols-3 gap-4">
                        <button onclick="reportResult('victory')" 
                            class="py-4 bg-green-900/50 hover:bg-green-700 border-2 border-green-600 rounded-xl text-white font-bold uppercase transition-all hover:scale-105">
                            <i class="fas fa-trophy text-2xl mb-2 block text-green-400"></i>
                            Victoria
                        </button>
                        <button onclick="reportResult('defeat')" 
                            class="py-4 bg-red-900/50 hover:bg-red-700 border-2 border-red-600 rounded-xl text-white font-bold uppercase transition-all hover:scale-105">
                            <i class="fas fa-skull text-2xl mb-2 block text-red-400"></i>
                            Derrota
                        </button>
                        <button onclick="reportResult('draw')" 
                            class="py-4 bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 rounded-xl text-white font-bold uppercase transition-all hover:scale-105">
                            <i class="fas fa-handshake text-2xl mb-2 block text-gray-400"></i>
                            Empate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// --- REPORT RESULT ---
function reportResult(result) {
    const stats = playerState.arenaStats;
    const opp = currentOpponent;
    const cuota = opp.probabilidad || BETTING_CONFIG.multiplicadores[opp.dificultad];

    let goldChange = 0;
    let respectChange = 0;
    let honorChange = 0;
    let message = '';
    let resultClass = '';

    if (result === 'victory') {
        // Calculate winnings
        goldChange = Math.floor(currentBetAmount * cuota) + (opp.recompensa?.oro || 0);
        respectChange = opp.recompensa?.respeto || 10;
        honorChange = (opp.recompensa?.honor || 0) + HONOR_CHANGES.victoriaLimpia;

        // Update stats
        stats.wins++;
        stats.currentStreak++;
        if (stats.currentStreak > stats.bestStreak) stats.bestStreak = stats.currentStreak;
        stats.totalEarnings += goldChange;

        // Give gold
        addGold(goldChange);

        // Give drops (botin)
        if (opp.botin && opp.botin.length > 0) {
            const drop = opp.botin[Math.floor(Math.random() * opp.botin.length)];
            addItem({ name: drop, type: 'material', rarity: 'uncommon', desc: `Obtenido de ${opp.nombre}` });
        }

        message = `¡VICTORIA! Has derrotado a ${opp.nombre}`;
        resultClass = 'green';

    } else if (result === 'defeat') {
        goldChange = -currentBetAmount; // Already deducted
        respectChange = -5;
        honorChange = -2;

        stats.losses++;
        stats.currentStreak = 0;

        message = `Derrota... ${opp.nombre} te ha vencido`;
        resultClass = 'red';

    } else {
        // Draw - return half bet
        goldChange = Math.floor(currentBetAmount / 2);
        addGold(goldChange);

        stats.draws++;
        respectChange = 2;

        message = 'Empate. Se devuelve la mitad de la apuesta.';
        resultClass = 'amber';
    }

    // Apply respect and honor
    stats.respect = Math.max(0, (stats.respect || 0) + respectChange);
    stats.honor = Math.max(-100, Math.min(100, (stats.honor || 0) + honorChange));
    stats.totalFights++;

    // Update rank
    stats.rank = calculateRank(stats.respect);

    saveGame();
    updateArenaHeader();

    // Show result screen
    renderResultScreen(result, goldChange, respectChange, honorChange, message, resultClass);
}

// --- RESULT SCREEN ---
function renderResultScreen(result, goldChange, respectChange, honorChange, message, color) {
    const opp = currentOpponent;

    arenaContent.innerHTML = `
        <div class="max-w-2xl mx-auto text-center animate-fade-in">
            <div class="glass-panel p-10 rounded-2xl border border-${color}-500/50 relative overflow-hidden">
                <div class="absolute inset-0 bg-${color}-900/10"></div>

                <i class="fas fa-${result === 'victory' ? 'trophy' : result === 'defeat' ? 'skull' : 'handshake'} 
                   text-7xl text-${color}-500 mb-6 relative z-10 ${result === 'victory' ? 'animate-bounce' : ''}"></i>
                
                <h2 class="font-cinzel text-5xl font-bold text-${color}-400 mb-4 relative z-10 uppercase">
                    ${result === 'victory' ? '¡VICTORIA!' : result === 'defeat' ? 'DERROTA' : 'EMPATE'}
                </h2>
                
                <p class="text-gray-300 mb-8 text-lg relative z-10">${message}</p>

                <!-- Stats Changes -->
                <div class="grid grid-cols-3 gap-4 mb-8 relative z-10">
                    <div class="bg-black/40 p-4 rounded-lg">
                        <p class="text-xs text-gray-500 uppercase mb-1">Oro</p>
                        <p class="text-2xl font-bold ${goldChange >= 0 ? 'text-green-400' : 'text-red-400'}">
                            ${goldChange >= 0 ? '+' : ''}${goldChange}
                        </p>
                    </div>
                    <div class="bg-black/40 p-4 rounded-lg">
                        <p class="text-xs text-gray-500 uppercase mb-1">Respeto</p>
                        <p class="text-2xl font-bold ${respectChange >= 0 ? 'text-purple-400' : 'text-red-400'}">
                            ${respectChange >= 0 ? '+' : ''}${respectChange}
                        </p>
                    </div>
                    <div class="bg-black/40 p-4 rounded-lg">
                        <p class="text-xs text-gray-500 uppercase mb-1">Honor</p>
                        <p class="text-2xl font-bold ${honorChange >= 0 ? 'text-green-400' : 'text-red-400'}">
                            ${honorChange >= 0 ? '+' : ''}${honorChange}
                        </p>
                    </div>
                </div>

                <!-- Botin -->
                ${result === 'victory' && opp.botin ? `
                    <div class="bg-amber-900/20 border border-amber-500/30 p-4 rounded-lg mb-8 relative z-10">
                        <p class="text-amber-400 font-bold mb-2"><i class="fas fa-gift mr-2"></i>Botín Obtenido</p>
                        <p class="text-white">${opp.botin[Math.floor(Math.random() * opp.botin.length)]}</p>
                    </div>
                ` : ''}

                <button onclick="renderArenaMenu()" 
                    class="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-bold uppercase tracking-widest transition-all relative z-10">
                    <i class="fas fa-arrow-left mr-2"></i> Volver al Menú
                </button>
            </div>
        </div>
    `;
}

// --- GAUNTLET MODE ---
function renderGauntletInfo() {
    currentWave = 0;

    arenaContent.innerHTML = `
        <div class="max-w-4xl mx-auto animate-fade-in">
            <div class="flex items-center justify-between mb-6">
                <div>
                    <h2 class="font-cinzel text-3xl font-bold text-purple-500">GUANTELETE CIEGO</h2>
                    <p class="text-gray-500 text-sm">5 oleadas sin descanso. Solo los fuertes sobreviven.</p>
                </div>
                <button onclick="renderArenaMenu()" class="text-gray-500 hover:text-white transition-colors">
                    <i class="fas fa-arrow-left mr-2"></i> Volver
                </button>
            </div>

            <div class="grid gap-4 mb-8">
                ${gauntletWaves.map((wave, i) => `
                    <div class="glass-panel p-4 rounded-xl border ${wave.esJefe ? 'border-purple-500/50 bg-purple-900/10' : 'border-white/10'} flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-400 font-bold text-xl">
                                ${wave.oleada}
                            </div>
                            <div>
                                <h3 class="font-bold text-white">${wave.nombre}</h3>
                                <p class="text-sm text-gray-500">${wave.enemigos}</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-400">ND ${wave.nd}</p>
                            <p class="text-xs text-yellow-400">${wave.recompensa.oro} MO</p>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="text-center">
                <p class="text-gray-400 mb-4">Premio Total: <span class="text-yellow-400 font-bold">${gauntletWaves.reduce((a, w) => a + w.recompensa.oro, 0)} MO</span></p>
                <button onclick="startGauntlet()" 
                    class="px-8 py-4 bg-purple-700 hover:bg-purple-600 text-white rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-purple-900/30 transition-all hover:scale-105">
                    <i class="fas fa-fist-raised mr-2"></i> Comenzar Guantelete
                </button>
            </div>
        </div>
    `;

    window.startGauntlet = () => {
        currentWave = 0;
        currentOpponent = {
            nombre: gauntletWaves[0].nombre,
            dificultad: 'media',
            recompensa: gauntletWaves[0].recompensa
        };
        currentBetAmount = 0; // Sin apuestas en guantelete
        renderFightActive();
    };
}

// --- LEADERBOARD ---
function showLeaderboard() {
    const playerRank = calculatePlayerRank();

    arenaContent.innerHTML = `
        <div class="max-w-3xl mx-auto animate-fade-in">
            <div class="flex items-center justify-between mb-6">
                <h2 class="font-cinzel text-3xl font-bold text-yellow-500">CLASIFICACIÓN DEL FOSO</h2>
                <button onclick="renderArenaMenu()" class="text-gray-500 hover:text-white transition-colors">
                    <i class="fas fa-arrow-left mr-2"></i> Volver
                </button>
            </div>

            <div class="glass-panel rounded-xl border border-yellow-900/30 overflow-hidden">
                <table class="w-full">
                    <thead class="bg-yellow-900/20">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs uppercase tracking-widest text-yellow-500">#</th>
                            <th class="px-4 py-3 text-left text-xs uppercase tracking-widest text-yellow-500">Gladiador</th>
                            <th class="px-4 py-3 text-center text-xs uppercase tracking-widest text-yellow-500">Victorias</th>
                            <th class="px-4 py-3 text-center text-xs uppercase tracking-widest text-yellow-500">Derrotas</th>
                            <th class="px-4 py-3 text-center text-xs uppercase tracking-widest text-yellow-500">Racha</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${arenaLeaderboard.map((entry, i) => `
                            <tr class="border-t border-white/5 hover:bg-white/5">
                                <td class="px-4 py-3 ${i < 3 ? 'text-yellow-400 font-bold' : 'text-gray-500'}">${entry.puesto}</td>
                                <td class="px-4 py-3">
                                    <span class="font-bold text-white">${entry.nombre}</span>
                                    <span class="text-xs text-gray-500 ml-2">${entry.titulo}</span>
                                </td>
                                <td class="px-4 py-3 text-center text-green-400">${entry.victorias}</td>
                                <td class="px-4 py-3 text-center text-red-400">${entry.derrotas}</td>
                                <td class="px-4 py-3 text-center text-amber-400">${entry.racha}</td>
                            </tr>
                        `).join('')}
                        ${playerRank ? `
                            <tr class="border-t-2 border-purple-500 bg-purple-900/20">
                                <td class="px-4 py-3 text-purple-400 font-bold">${playerRank}</td>
                                <td class="px-4 py-3">
                                    <span class="font-bold text-white">${playerState.name}</span>
                                    <span class="text-xs text-purple-400 ml-2">(Tú)</span>
                                </td>
                                <td class="px-4 py-3 text-center text-green-400">${playerState.arenaStats?.wins || 0}</td>
                                <td class="px-4 py-3 text-center text-red-400">${playerState.arenaStats?.losses || 0}</td>
                                <td class="px-4 py-3 text-center text-amber-400">${playerState.arenaStats?.currentStreak || 0}</td>
                            </tr>
                        ` : ''}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// --- PLAYER STATS ---
function showArenaStats() {
    const stats = playerState.arenaStats || {};
    const winRate = stats.totalFights > 0 ? Math.round((stats.wins / stats.totalFights) * 100) : 0;

    arenaContent.innerHTML = `
        <div class="max-w-3xl mx-auto animate-fade-in">
            <div class="flex items-center justify-between mb-6">
                <h2 class="font-cinzel text-3xl font-bold text-blue-400">MIS ESTADÍSTICAS</h2>
                <button onclick="renderArenaMenu()" class="text-gray-500 hover:text-white transition-colors">
                    <i class="fas fa-arrow-left mr-2"></i> Volver
                </button>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div class="glass-panel p-6 rounded-xl border border-green-900/30 text-center">
                    <i class="fas fa-trophy text-3xl text-green-500 mb-2"></i>
                    <p class="text-3xl font-bold text-white">${stats.wins || 0}</p>
                    <p class="text-xs text-gray-500 uppercase">Victorias</p>
                </div>
                <div class="glass-panel p-6 rounded-xl border border-red-900/30 text-center">
                    <i class="fas fa-skull text-3xl text-red-500 mb-2"></i>
                    <p class="text-3xl font-bold text-white">${stats.losses || 0}</p>
                    <p class="text-xs text-gray-500 uppercase">Derrotas</p>
                </div>
                <div class="glass-panel p-6 rounded-xl border border-amber-900/30 text-center">
                    <i class="fas fa-fire text-3xl text-amber-500 mb-2"></i>
                    <p class="text-3xl font-bold text-white">${stats.bestStreak || 0}</p>
                    <p class="text-xs text-gray-500 uppercase">Mejor Racha</p>
                </div>
                <div class="glass-panel p-6 rounded-xl border border-blue-900/30 text-center">
                    <i class="fas fa-percent text-3xl text-blue-500 mb-2"></i>
                    <p class="text-3xl font-bold text-white">${winRate}%</p>
                    <p class="text-xs text-gray-500 uppercase">Win Rate</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="glass-panel p-6 rounded-xl border border-purple-900/30">
                    <h3 class="text-purple-400 font-bold uppercase tracking-widest mb-4">Progreso</h3>
                    <div class="space-y-4">
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-gray-400">Respeto</span>
                                <span class="text-purple-400">${stats.respect || 0}</span>
                            </div>
                            <div class="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div class="h-full bg-purple-500" style="width: ${Math.min(100, (stats.respect || 0) / 20)}%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="text-gray-400">Honor</span>
                                <span class="${stats.honor >= 0 ? 'text-green-400' : 'text-red-400'}">${stats.honor || 0}</span>
                            </div>
                            <div class="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div class="h-full ${stats.honor >= 0 ? 'bg-green-500' : 'bg-red-500'}" 
                                     style="width: ${Math.abs(stats.honor || 0) / 2}%; margin-left: ${stats.honor < 0 ? 'auto' : '50%'}"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="glass-panel p-6 rounded-xl border border-yellow-900/30">
                    <h3 class="text-yellow-400 font-bold uppercase tracking-widest mb-4">Economía</h3>
                    <div class="space-y-2">
                        <div class="flex justify-between">
                            <span class="text-gray-400">Ganancias Totales</span>
                            <span class="text-yellow-400 font-bold">${stats.totalEarnings || 0} MO</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Combates Totales</span>
                            <span class="text-white">${stats.totalFights || 0}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-400">Rango Actual</span>
                            <span class="text-purple-400 font-bold">${stats.rank || 'Carne Fresca'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// --- HELPERS ---
function calculateRank(respect) {
    const sorted = [...ARENA_RANKS].sort((a, b) => b.minRespeto - a.minRespeto);
    for (const rank of sorted) {
        if (respect >= rank.minRespeto) return rank.nombre;
    }
    return 'Carne Fresca';
}

function calculatePlayerRank() {
    const stats = playerState.arenaStats || {};
    const playerWins = stats.wins || 0;

    // Encontrar posición en la clasificación
    for (let i = 0; i < arenaLeaderboard.length; i++) {
        if (playerWins > arenaLeaderboard[i].victorias) {
            return i + 1;
        }
    }
    return arenaLeaderboard.length + 1;
}
