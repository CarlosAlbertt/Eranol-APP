import { state } from '../../state.js';
import { playerState, saveGame, addBloodCoins, removeBloodCoins } from './player.js'; // CORRECT IMPORT
import { showToast, updateGoldDisplay } from './ui.js';
import { addToCart } from './cart.js'; // Keep if used
import * as dndAPI from './dndApi.js'; // D&D 5e API for random items/monsters

let wheelModal;
let wheelContainer;
let wheelResult;
let spinBtn;
let patronageModal;
let patronageArea;
let currentCasinoGame = null;

export function initGames() {
    wheelModal = document.getElementById('wheel-modal');
    wheelContainer = document.getElementById('wheel');
    wheelResult = document.getElementById('wheel-result');
    spinBtn = document.getElementById('spin-btn');
    patronageModal = document.getElementById('patronage-modal');
    patronageArea = document.getElementById('patronage-area');

    // Event Listeners
    const wheelBtn = document.getElementById('wheel-btn');
    if (wheelBtn) {
        wheelBtn.addEventListener('click', openWheelModal);
    }

    // Globals (for legacy support if needed, though we should move away from strict inline handlers)
    window.openWheelModal = openWheelModal;
    window.closeWheelModal = closeWheelModal;
    window.spinWheel = spinWheel;
    window.openPatronageModal = openPatronageModal;
    window.closePatronageModal = closePatronageModal;
    window.requestLoan = requestLoan;
    window.requestLoan = requestLoan;
    window.loadCasinoGame = loadCasinoGame; // RENAMED FROM loadGame
    window.exitGame = exitGame;
    window.spinSlots = spinSlots;
    window.startBlackjack = startBlackjack;
    window.bjHit = bjHit;
    window.bjStand = bjStand;
    window.spinRouletteReal = spinRouletteReal;
    window.placeRouletteBet = placeRouletteBet;
    window.clearRouletteBets = clearRouletteBets;
}

// --- CASINO LOGIC ---
// --- CASINO LOGIC ---
// --- SCENE MANAGER LOGIC ---
export function loadCasinoGame(game) {
    console.log(`[CASINO] SCENE SWITCH -> GAME: ${game}`);

    // 1. Swap Views: Menu -> Stage
    // 1. Swap Views: Menu -> Stage
    const menu = document.getElementById('casino-menu');
    const stage = document.getElementById('casino-stage');

    if (menu) {
        menu.classList.add('hidden');
        menu.classList.remove('active');
    }
    if (stage) {
        stage.classList.remove('hidden');
        stage.classList.add('active'); // REQUIRED BY CASINO.CSS
        stage.style.display = 'flex'; // FORCE FLEX
        stage.style.flexDirection = 'column';
    }

    // 2. Hide all Game Stages First
    const games = ['game-roulette', 'game-blackjack', 'game-slots'];
    games.forEach(g => {
        const el = document.getElementById(g);
        if (el) el.classList.add('hidden');
    });

    // 3. Show Target Game
    const targetId = `game-${game}`;
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
        targetEl.classList.remove('hidden');

        // Init Game Specifics
        currentCasinoGame = game;
        if (game === 'roulette') initRouletteGrid();
        if (game === 'blackjack') updateGoldDisplay(); // Just refresh UI
        if (game === 'slots') updateGoldDisplay();
    } else {
        console.error(`[CASINO] Target stage not found: ${targetId}`);
    }
}

export function exitGame() {
    console.log(`[CASINO] SCENE SWITCH -> MENU`);
    currentCasinoGame = null;

    // 1. Swap Views: Stage -> Menu
    const menu = document.getElementById('casino-menu');
    const stage = document.getElementById('casino-stage');

    if (stage) {
        stage.classList.add('hidden');
        stage.classList.remove('active');
        stage.style.display = 'none'; // Force Hide
    }
    if (menu) {
        menu.classList.remove('hidden');
        menu.classList.add('active'); // RESTORE MENU
        menu.style.display = ''; // Reset display
    }

    // 2. Cleanup (Optional: Stop animations/sounds)
}

// --- ROULETTE ---
// --- ROULETTE ---
const rouletteNumbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const zones = {
    'voisins': [22, 18, 29, 7, 28, 12, 35, 3, 26, 0, 32, 15, 19, 4, 21, 2, 25],
    'tiers': [27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33],
    'orphelins': [1, 20, 14, 31, 9, 17, 34, 6]
};
const colors = { 0: '#35654d' }; // Green
[1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].forEach(n => colors[n] = '#991b1b');
for (let i = 1; i <= 36; i++) { if (!colors[i]) colors[i] = '#171717'; }

let startAngle = 0;
let arc = Math.PI / (rouletteNumbers.length / 2);
let spinTimeout = null;
let spinArcStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;
let ctxRoulette;
let activeRouletteBets = [];

export function drawRouletteWheel() {
    const canvas = document.getElementById("roulette-canvas");
    if (!canvas || !canvas.getContext) return;
    ctxRoulette = canvas.getContext("2d");

    // Scale to canvas size
    const size = Math.min(canvas.width, canvas.height);
    const outsideRadius = size * 0.45;
    const textRadius = size * 0.35;
    const insideRadius = size * 0.22;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctxRoulette.clearRect(0, 0, canvas.width, canvas.height);

    ctxRoulette.beginPath();
    ctxRoulette.arc(centerX, centerY, outsideRadius + 10, 0, Math.PI * 2);
    ctxRoulette.fillStyle = "#daa520";
    ctxRoulette.fill();

    for (let i = 0; i < rouletteNumbers.length; i++) {
        const angle = startAngle + i * arc;
        const number = rouletteNumbers[i];

        ctxRoulette.fillStyle = colors[number];
        ctxRoulette.beginPath();
        ctxRoulette.arc(centerX, centerY, outsideRadius, angle, angle + arc, false);
        ctxRoulette.arc(centerX, centerY, insideRadius, angle + arc, angle, true);
        ctxRoulette.fill();
        ctxRoulette.save();

        ctxRoulette.strokeStyle = "#b8860b";
        ctxRoulette.lineWidth = 2;
        ctxRoulette.stroke();

        ctxRoulette.shadowColor = "black";
        ctxRoulette.shadowBlur = 2;
        ctxRoulette.fillStyle = "white";
        const fontSize = Math.max(8, Math.floor(size * 0.04));
        ctxRoulette.font = `bold ${fontSize}px Cinzel`;
        ctxRoulette.translate(centerX + Math.cos(angle + arc / 2) * textRadius, centerY + Math.sin(angle + arc / 2) * textRadius);
        ctxRoulette.rotate(angle + arc / 2 + Math.PI / 2);
        const text = number.toString();
        ctxRoulette.fillText(text, -ctxRoulette.measureText(text).width / 2, 0);
        ctxRoulette.restore();
    }

    // Draw center circle
    ctxRoulette.beginPath();
    ctxRoulette.arc(centerX, centerY, insideRadius * 0.6, 0, Math.PI * 2);
    const gradient = ctxRoulette.createRadialGradient(centerX, centerY, 0, centerX, centerY, insideRadius * 0.6);
    gradient.addColorStop(0, '#4a0000');
    gradient.addColorStop(1, '#1a0000');
    ctxRoulette.fillStyle = gradient;
    ctxRoulette.fill();
    ctxRoulette.strokeStyle = '#daa520';
    ctxRoulette.lineWidth = 3;
    ctxRoulette.stroke();

    // Draw pointer/arrow at top
    ctxRoulette.save();
    ctxRoulette.fillStyle = '#fbbf24';
    ctxRoulette.strokeStyle = '#000';
    ctxRoulette.lineWidth = 2;
    ctxRoulette.beginPath();
    ctxRoulette.moveTo(centerX, 5);
    ctxRoulette.lineTo(centerX - 12, 25);
    ctxRoulette.lineTo(centerX + 12, 25);
    ctxRoulette.closePath();
    ctxRoulette.fill();
    ctxRoulette.stroke();
    ctxRoulette.restore();
}

export function spinRouletteReal() {
    if (activeRouletteBets.length === 0) { alert("¡Debes colocar al menos una apuesta!"); return; }
    document.getElementById('btn-spin-roulette').disabled = true;
    spinArcStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 4000 + 6000; // 6-10 seconds for more suspense
    rotateWheel();
}

function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    const spinAngle = spinArcStart - easeOut(spinTime, 0, spinArcStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = requestAnimationFrame(rotateWheel);
}

function stopRotateWheel() {
    cancelAnimationFrame(spinTimeout);
    const degrees = startAngle * 180 / Math.PI + 90;
    const arcd = 360 / rouletteNumbers.length;
    const index = Math.floor((360 - degrees % 360) / arcd);
    const winningNumber = rouletteNumbers[index];
    checkRouletteWin(winningNumber);
}

function easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

export function initRouletteGrid() {
    const grid = document.getElementById('roulette-grid');
    if (!grid) return;
    grid.innerHTML = '';
    activeRouletteBets = [];
    updateRouletteUI();

    // Container for special bets
    const specialContainer = document.createElement('div');
    specialContainer.className = "col-span-full grid grid-cols-3 gap-2 mb-2";

    // Zones (French Bets)
    ['voisins', 'tiers', 'orphelins'].forEach(zone => {
        const btn = document.createElement('button');
        btn.id = `btn-bet-zone-${zone}`;
        btn.className = "bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-[10px] py-1 rounded border border-purple-500/30 uppercase font-bold relative group";
        btn.innerText = zone.toUpperCase();
        btn.innerHTML += `<div class="hidden absolute -top-2 -right-2 bg-yellow-500 text-black text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border border-white chip-badge z-10"></div>`;
        btn.onclick = () => placeRouletteBet('zone', zone);
        specialContainer.appendChild(btn);
    });
    grid.appendChild(specialContainer);

    // 0 Button (Green) - Spans full width
    const zeroBtn = document.createElement('button');
    zeroBtn.id = `btn-bet-number-0`;
    zeroBtn.className = "col-span-full bg-green-900 hover:bg-green-700 text-white font-bold text-sm py-1 rounded border border-green-500/30 relative mb-2 group";
    zeroBtn.innerText = "0";
    zeroBtn.innerHTML += `<div class="hidden absolute -top-2 -right-2 bg-yellow-500 text-black text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border border-white chip-badge z-10"></div>`;
    zeroBtn.onclick = () => placeRouletteBet('number', 0);
    grid.appendChild(zeroBtn);

    // 1-36 Numbers
    const numbersContainer = document.createElement('div');
    numbersContainer.className = "col-span-full grid grid-cols-3 gap-1";
    for (let i = 1; i <= 36; i++) {
        const colorClass = colors[i] === '#991b1b' ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-800 hover:bg-gray-700';
        const btn = document.createElement('button');
        btn.id = `btn-bet-number-${i}`;
        btn.className = `${colorClass} relative text-white font-bold text-xs h-8 rounded border border-white/10 transition-transform active:scale-95 group`;
        btn.innerHTML = `${i}<div class="hidden absolute -top-2 -right-2 bg-yellow-500 text-black text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border border-white chip-badge z-10"></div>`;
        btn.onclick = () => placeRouletteBet('number', i);
        numbersContainer.appendChild(btn);
    }
    grid.appendChild(numbersContainer);

    // Dozens & Columns
    const dozensContainer = document.createElement('div');
    dozensContainer.className = "col-span-full grid grid-cols-3 gap-1 mt-2";
    ['1st 12', '2nd 12', '3rd 12'].forEach((d, i) => {
        const btn = document.createElement('button');
        btn.id = `btn-bet-dozen-${i + 1}`;
        btn.className = "bg-blue-900/50 hover:bg-blue-800 text-blue-200 text-[10px] py-1 rounded border border-blue-500/30 font-bold uppercase relative group";
        btn.innerText = d;
        btn.innerHTML += `<div class="hidden absolute -top-2 -right-2 bg-yellow-500 text-black text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border border-white chip-badge z-10"></div>`;
        btn.onclick = () => placeRouletteBet('dozen', i + 1);
        dozensContainer.appendChild(btn);
    });
    grid.appendChild(dozensContainer);

    // Even/Odd Red/Black
    const othersContainer = document.createElement('div');
    othersContainer.className = "col-span-full grid grid-cols-2 gap-1 mt-1";

    // Color Bets
    const redBtn = document.createElement('button'); redBtn.className = "bg-red-900 hover:bg-red-700 text-white text-[10px] py-1 rounded border border-red-500/30 uppercase font-bold relative"; redBtn.innerText = "ROJO"; redBtn.onclick = () => placeRouletteBet('color', 'red'); redBtn.id = "btn-bet-color-red"; redBtn.innerHTML += `<div class="hidden absolute -top-2 -right-2 bg-yellow-500 text-black text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border border-white chip-badge z-10"></div>`;
    const blackBtn = document.createElement('button'); blackBtn.className = "bg-gray-900 hover:bg-gray-700 text-white text-[10px] py-1 rounded border border-gray-500/30 uppercase font-bold relative"; blackBtn.innerText = "NEGRO"; blackBtn.onclick = () => placeRouletteBet('color', 'black'); blackBtn.id = "btn-bet-color-black"; blackBtn.innerHTML += `<div class="hidden absolute -top-2 -right-2 bg-yellow-500 text-black text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border border-white chip-badge z-10"></div>`;

    // Parity Bets
    const evenBtn = document.createElement('button'); evenBtn.className = "bg-indigo-900 hover:bg-indigo-700 text-white text-[10px] py-1 rounded border border-indigo-500/30 uppercase font-bold relative"; evenBtn.innerText = "PAR"; evenBtn.onclick = () => placeRouletteBet('parity', 'even'); evenBtn.id = "btn-bet-parity-even"; evenBtn.innerHTML += `<div class="hidden absolute -top-2 -right-2 bg-yellow-500 text-black text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border border-white chip-badge z-10"></div>`;
    const oddBtn = document.createElement('button'); oddBtn.className = "bg-indigo-900 hover:bg-indigo-700 text-white text-[10px] py-1 rounded border border-indigo-500/30 uppercase font-bold relative"; oddBtn.innerText = "IMPAR"; oddBtn.onclick = () => placeRouletteBet('parity', 'odd'); oddBtn.id = "btn-bet-parity-odd"; oddBtn.innerHTML += `<div class="hidden absolute -top-2 -right-2 bg-yellow-500 text-black text-[9px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg border border-white chip-badge z-10"></div>`;

    othersContainer.appendChild(redBtn); othersContainer.appendChild(blackBtn);
    othersContainer.appendChild(evenBtn); othersContainer.appendChild(oddBtn);
    grid.appendChild(othersContainer);

    drawRouletteWheel();
}

export function placeRouletteBet(type, value) {
    const amountInput = document.getElementById('roulette-chip-value');
    const amount = parseInt(amountInput.value);

    // CASINO USES BLOOD COINS NOW
    if ((playerState.bloodCoins || 0) < amount) { alert("No tienes suficientes Monedas de Sangre."); return; }
    if (amount <= 0) return;

    playerState.bloodCoins = (playerState.bloodCoins || 0) - amount; // Deduct Blood Coins
    saveGame(); // PERSIST
    updateGoldDisplay();

    const existingBet = activeRouletteBets.find(b => b.type === type && b.value === value);
    if (existingBet) {
        existingBet.amount += amount;
    } else {
        activeRouletteBets.push({ type, value, amount });
    }

    updateRouletteUI();
}

export function clearRouletteBets() {
    if (activeRouletteBets.length === 0) return;
    const totalRefund = activeRouletteBets.reduce((sum, b) => sum + b.amount, 0);
    playerState.bloodCoins = (playerState.bloodCoins || 0) + totalRefund; // Refund
    saveGame(); // PERSIST
    updateGoldDisplay();
    activeRouletteBets = [];
    updateRouletteUI();
}

function updateRouletteUI() {
    document.querySelectorAll('.chip-badge').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('flex');
    });

    let totalBet = 0;

    activeRouletteBets.forEach(bet => {
        totalBet += bet.amount;
        const btnId = `btn-bet-${bet.type}-${bet.value}`;
        const btn = document.getElementById(btnId);
        if (btn) {
            const badge = btn.querySelector('.chip-badge');
            if (badge) {
                badge.innerText = bet.amount >= 1000 ? (bet.amount / 1000).toFixed(1) + 'k' : bet.amount;
                badge.classList.remove('hidden');
                badge.classList.add('flex');
            }
        }
    });

    const totalBetEl = document.getElementById('roulette-total-bet');
    if (totalBetEl) totalBetEl.innerText = totalBet.toLocaleString();
}


function checkRouletteWin(winner) {
    const resEl = document.getElementById('roulette-result-display');
    const winnerColor = colors[winner] === '#991b1b' ? 'red' : (winner === 0 ? 'green' : 'black');

    // Animated result display
    if (resEl) {
        resEl.innerHTML = `<span class="inline-block animate-bounce text-2xl font-bold ${winnerColor === 'red' ? 'text-red-500' : (winnerColor === 'green' ? 'text-green-500' : 'text-white')}">${winner}</span>`;
    }

    // Show animated overlay with result
    showRouletteResult(winner, winnerColor);

    let totalWon = 0;

    activeRouletteBets.forEach(bet => {
        let won = false;
        let mult = 0;

        if (bet.type === 'number' && bet.value === winner) { won = true; mult = 36; }
        else if (bet.type === 'color' && bet.value === winnerColor) { won = true; mult = 2; }
        else if (bet.type === 'parity' && winner !== 0) {
            if (bet.value === 'even' && winner % 2 === 0) { won = true; mult = 2; }
            if (bet.value === 'odd' && winner % 2 !== 0) { won = true; mult = 2; }
        }
        else if (bet.type === 'dozen' && winner !== 0) {
            if (bet.value === 1 && winner >= 1 && winner <= 12) { won = true; mult = 3; }
            if (bet.value === 2 && winner >= 13 && winner <= 24) { won = true; mult = 3; }
            if (bet.value === 3 && winner >= 25 && winner <= 36) { won = true; mult = 3; }
        }
        else if (bet.type === 'zone' && winner !== 0) {
            if (zones[bet.value].includes(winner)) {
                if (bet.value === 'voisins') { won = true; mult = 2; }
                if (bet.value === 'tiers') { won = true; mult = 3; }
                if (bet.value === 'orphelins') { won = true; mult = 4; }
            }
        }

        if (won) totalWon += bet.amount * mult;
    });

    setTimeout(() => {
        if (totalWon > 0) {
            playerState.bloodCoins = (playerState.bloodCoins || 0) + totalWon;
            saveGame();
            showToast(`¡GANASTE ${totalWon.toLocaleString()} Monedas de Sangre!`);
        } else {
            showToast(`La casa gana. Salió ${winner} (${winnerColor === 'red' ? 'Rojo' : (winnerColor === 'green' ? 'Verde' : 'Negro')})`);
        }

        activeRouletteBets = [];
        updateRouletteUI();
        updateGoldDisplay();
        document.getElementById('btn-spin-roulette').disabled = false;
    }, 2000); // Delay to let animation play
}

// Show animated result overlay
function showRouletteResult(number, color) {
    // Create overlay if doesn't exist
    let overlay = document.getElementById('roulette-result-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'roulette-result-overlay';
        overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center pointer-events-none';
        document.body.appendChild(overlay);
    }

    const colorClass = color === 'red' ? 'bg-red-600' : (color === 'green' ? 'bg-green-600' : 'bg-gray-800');
    const textColor = 'text-white';

    overlay.innerHTML = `
        <div class="animate-scale-in ${colorClass} ${textColor} rounded-full w-40 h-40 flex items-center justify-center shadow-2xl border-4 border-yellow-500">
            <span class="text-6xl font-bold font-cinzel drop-shadow-lg">${number}</span>
        </div>
    `;
    overlay.style.opacity = '1';

    setTimeout(() => {
        overlay.style.transition = 'opacity 0.5s';
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.innerHTML = ''; }, 500);
    }, 1800);
}

// --- FORTUNE WHEEL ---
const segments = [{ text: '5%', color: '#9ca3af', value: 0.05, type: 'discount' }, { text: '10%', color: '#22c55e', value: 0.10, type: 'discount' }, { text: '15%', color: '#3b82f6', value: 0.15, type: 'discount' }, { text: '20%', color: '#a855f7', value: 0.20, type: 'discount' }, { text: '25%', color: '#fbbf24', value: 0.25, type: 'discount' }, { text: '🎁', color: '#f43f5e', value: 'item', type: 'item' }];

function initWheel() {
    if (!wheelContainer) return;
    wheelContainer.innerHTML = '';
    let gradientStr = '';
    const segmentSize = 100 / segments.length;
    segments.forEach((seg, i) => { const start = i * segmentSize; const end = (i + 1) * segmentSize; gradientStr += `${seg.color} ${start}% ${end}%, `; });
    wheelContainer.style.background = `conic-gradient(${gradientStr.slice(0, -2)})`;
    segments.forEach((seg, i) => { const label = document.createElement('div'); label.className = 'wheel-text'; label.innerText = seg.text; const angle = (i * 60) + 30; const radius = 100; const radians = (angle - 90) * (Math.PI / 180); const x = 150 + (radius * Math.cos(radians)); const y = 150 + (radius * Math.sin(radians)); label.style.left = `${x}px`; label.style.top = `${y}px`; label.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`; wheelContainer.appendChild(label); });
}

export function openWheelModal() {
    const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const now = Date.now();

    // Check persistent cooldown
    if (playerState.lastWheelSpinTime) {
        const timeSinceLastSpin = now - playerState.lastWheelSpinTime;
        const remainingTime = COOLDOWN_MS - timeSinceLastSpin;

        if (remainingTime > 0) {
            // Still on cooldown - show countdown
            const hours = Math.floor(remainingTime / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

            const timeString = `${hours}h ${minutes}m ${seconds}s`;
            showToast(`⏳ Ruleta disponible en: ${timeString}`);

            // Show modal with disabled spin button and countdown
            wheelModal.classList.remove('hidden');
            setTimeout(() => wheelModal.classList.remove('opacity-0'), 10);
            initWheel();

            // Update button to show countdown
            if (spinBtn) {
                spinBtn.disabled = true;
                spinBtn.classList.add('opacity-50');
                spinBtn.innerHTML = `<i class="fas fa-clock mr-2"></i>Disponible en ${timeString}`;

                // Start live countdown
                const countdownInterval = setInterval(() => {
                    const newRemaining = (playerState.lastWheelSpinTime + COOLDOWN_MS) - Date.now();
                    if (newRemaining <= 0) {
                        clearInterval(countdownInterval);
                        spinBtn.disabled = false;
                        spinBtn.classList.remove('opacity-50');
                        spinBtn.innerHTML = '<i class="fas fa-sync-alt mr-2"></i>¡GIRAR!';
                        state.hasSpunWheel = false;
                    } else {
                        const h = Math.floor(newRemaining / (1000 * 60 * 60));
                        const m = Math.floor((newRemaining % (1000 * 60 * 60)) / (1000 * 60));
                        const s = Math.floor((newRemaining % (1000 * 60)) / 1000);
                        spinBtn.innerHTML = `<i class="fas fa-clock mr-2"></i>${h}h ${m}m ${s}s`;
                    }
                }, 1000);
            }
            return;
        }
    }

    // Reset session flag if cooldown has passed
    state.hasSpunWheel = false;

    wheelModal.classList.remove('hidden');
    setTimeout(() => wheelModal.classList.remove('opacity-0'), 10);
    initWheel();

    // Reset button state
    if (spinBtn) {
        spinBtn.disabled = false;
        spinBtn.classList.remove('opacity-50');
        spinBtn.innerHTML = '<i class="fas fa-sync-alt mr-2"></i>¡GIRAR!';
    }
}

export function closeWheelModal() {
    wheelModal.classList.add('opacity-0');
    setTimeout(() => wheelModal.classList.add('hidden'), 300);
}

export function spinWheel() {
    if (state.hasSpunWheel) return;

    // Countdown
    const countdownOverlay = document.getElementById('wheel-countdown');
    const countdownNumber = document.getElementById('countdown-number');

    countdownOverlay.classList.remove('hidden');

    let count = 3;
    countdownNumber.innerText = count;
    countdownNumber.classList.add('animate-countdown');

    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownNumber.classList.remove('animate-countdown');
            void countdownNumber.offsetWidth; // Trigger reflow
            countdownNumber.innerText = count;
            countdownNumber.classList.add('animate-countdown');
        } else {
            clearInterval(interval);
            countdownOverlay.classList.add('hidden');
            startSpinAnimation();
        }
    }, 1000);
}

function startSpinAnimation() {
    state.hasSpunWheel = true;
    playerState.lastWheelSpinTime = Date.now(); // Save persistent timestamp
    saveGame(); // Persist the timestamp

    spinBtn.disabled = true;
    spinBtn.classList.add('opacity-50');
    const spins = 5 + Math.random() * 5;
    const degrees = spins * 360;
    const randomOffset = Math.floor(Math.random() * 360);
    const totalRotation = degrees + randomOffset;
    wheelContainer.style.transform = `rotate(-${totalRotation}deg)`;
    setTimeout(() => { const actualDeg = totalRotation % 360; const index = Math.floor(actualDeg / 60) % 6; handleWheelResult(segments[index]); }, 4000);
}

function handleWheelResult(result) {
    if (result.type === 'discount') {
        state.activeDiscount = result.value;
        wheelResult.innerHTML = `¡Descuento del <span class="text-green-400">${result.text}</span>!`;
        showToast(`Descuento activado.`);
    } else {
        wheelResult.innerHTML = `¡Objeto Misterioso!`;
        addToCart({ name: "Caja Misteriosa", price: 0, type: "Evento", desc: "Regalo del destino.", rarity: "Exótica" });
    }
}

// --- PATRONAGE ---
export function openPatronageModal() { patronageModal.classList.remove('hidden'); setTimeout(() => patronageModal.classList.remove('opacity-0'), 10); }
export function closePatronageModal() { patronageModal.classList.add('opacity-0'); setTimeout(() => patronageModal.classList.add('hidden'), 300); }
export function requestLoan(amount) {
    playerState.gold = (playerState.gold || 0) + amount; // Use playerState gold!
    saveGame();
    updateGoldDisplay();
    showToast(`Has recibido ${amount} mo.`);
    closePatronageModal();
}

// --- SLOTS (Blood Coins x10) ---
export function spinSlots() {
    const cost = 500; // x10 cost
    if ((playerState.bloodCoins || 0) < cost) { alert("Sin Monedas de Sangre."); return; }
    playerState.bloodCoins -= cost;
    saveGame(); // PERSIST
    updateGoldDisplay();
    const s = ["🍒", "🍋", "🔔", "💎", "💀", "7️⃣"];
    const s1 = document.getElementById('slot1'), s2 = document.getElementById('slot2'), s3 = document.getElementById('slot3'), msg = document.getElementById('slot-msg'), btn = document.getElementById('btn-slots');
    btn.disabled = true; msg.innerText = "Girando...";
    let spins = 0;
    const i = setInterval(() => { s1.innerText = s[Math.floor(Math.random() * 6)]; s2.innerText = s[Math.floor(Math.random() * 6)]; s3.innerText = s[Math.floor(Math.random() * 6)]; spins++; if (spins > 20) { clearInterval(i); btn.disabled = false; checkSlotWin(s1.innerText, s2.innerText, s3.innerText, msg); } }, 100);
}

function checkSlotWin(v1, v2, v3, m) {
    // Prizes also x10
    if (v1 === v2 && v2 === v3) {
        let p = v1 === "💀" ? 66660 : v1 === "7️⃣" ? 50000 : 2500;
        playerState.bloodCoins += p;
        m.innerText = `¡Premio! +${p} MS`;
    } else if (v1 === v2 || v2 === v3 || v1 === v3) {
        playerState.bloodCoins += 200;
        m.innerText = "+200 recuperados";
    } else {
        m.innerText = "Pierdes.";
    }
    saveGame(); // PERSIST
    updateGoldDisplay();
}

// --- BLACKJACK (Blood Coins) ---
let bjDeck = [], bjD = [], bjP = [];
let bjPRendered = 0, bjDRendered = 0; // Track how many cards have been rendered

export function startBlackjack() {
    const bet = parseInt(document.getElementById('bj-bet-input').value);
    if ((playerState.bloodCoins || 0) < bet) { alert("No tienes suficientes Monedas de Sangre"); return; }
    playerState.bloodCoins -= bet;
    saveGame(); // PERSIST
    updateGoldDisplay();
    const betControls = document.getElementById('bj-bet-controls');
    const actions = document.getElementById('bj-actions');
    const msgEl = document.getElementById('bj-message');
    if (betControls) betControls.classList.add('hidden');
    if (actions) actions.classList.remove('hidden');
    if (msgEl) { msgEl.innerText = ""; msgEl.classList.add('opacity-0'); }
    const s = ['♠', '♥', '♦', '♣'], v = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    bjDeck = [];
    for (let su of s) for (let va of v) bjDeck.push({ s: su, v: va });
    bjDeck.sort(() => Math.random() - 0.5);
    bjP = [bjDeck.pop(), bjDeck.pop()];
    bjD = [bjDeck.pop(), bjDeck.pop()];
    bjPRendered = 0; // Reset counters
    bjDRendered = 0;
    renderBJ();
    if (getBJScore(bjP) === 21) bjStand();
}

function getBJScore(h) {
    let sc = 0, aces = 0;
    for (let c of h) {
        if (['J', 'Q', 'K'].includes(c.v)) sc += 10;
        else if (c.v === 'A') { sc += 11; aces++; }
        else sc += parseInt(c.v);
    }
    while (sc > 21 && aces > 0) { sc -= 10; aces--; }
    return sc;
}

function renderBJ(show = false) {
    // Premium card design - only animate NEW cards (index >= previously rendered count)
    const renderCard = (c, index, isNew = false) => {
        const isRed = ['♥', '♦'].includes(c.s);
        return `
            <div class="bj-card ${isRed ? 'red' : 'black'} ${isNew ? 'animate-deal' : ''}" 
                 style="transform: rotate(${(index - 1) * 2}deg);">
                <div class="card-corner top-left">
                    <span class="card-value">${c.v}</span>
                    <span class="card-suit">${c.s}</span>
                </div>
                <div class="card-center">${c.s}</div>
                <div class="card-corner bottom-right">
                    <span class="card-value">${c.v}</span>
                    <span class="card-suit">${c.s}</span>
                </div>
            </div>
        `;
    };

    const hiddenCard = `
        <div class="bj-card card-back">
            <div class="card-pattern"></div>
        </div>
    `;

    const playerHandEl = document.getElementById('player-hand');
    const dealerHandEl = document.getElementById('dealer-hand');
    const playerScoreEl = document.getElementById('player-score');
    const dealerScoreEl = document.getElementById('dealer-score');

    // Only animate cards that haven't been rendered before
    if (playerHandEl) {
        playerHandEl.innerHTML = bjP.map((c, i) => renderCard(c, i, i >= bjPRendered)).join('');
    }
    bjPRendered = bjP.length; // Update count AFTER rendering
    if (playerScoreEl) playerScoreEl.innerText = getBJScore(bjP);

    if (show) {
        if (dealerHandEl) {
            dealerHandEl.innerHTML = bjD.map((c, i) => renderCard(c, i, i >= bjDRendered)).join('');
        }
        bjDRendered = bjD.length; // Update count AFTER rendering
        if (dealerScoreEl) dealerScoreEl.innerText = getBJScore(bjD);
    } else {
        if (dealerHandEl) dealerHandEl.innerHTML = renderCard(bjD[0], 0, false) + hiddenCard;
        if (dealerScoreEl) dealerScoreEl.innerText = "?";
    }
}

export function bjHit() { bjP.push(bjDeck.pop()); renderBJ(); if (getBJScore(bjP) > 21) endBJ(false, "¡Te pasaste!"); }
export function bjStand() {
    renderBJ(true);
    let d = getBJScore(bjD);
    const t = setInterval(() => {
        if (d < 17) {
            bjD.push(bjDeck.pop());
            d = getBJScore(bjD);
            renderBJ(true);
        } else {
            clearInterval(t);
            const p = getBJScore(bjP);
            if (d > 21) endBJ(true, "Dealer se pasó.");
            else if (p > d) endBJ(true, "Ganas.");
            else if (p < d) endBJ(false, "Pierdes.");
            else {
                playerState.bloodCoins += parseInt(document.getElementById('bj-bet-input').value);
                saveGame();
                endBJ(null, "Empate.");
            }
        }
    }, 800);
}

function endBJ(w, m) {
    const actions = document.getElementById('bj-actions');
    const betControls = document.getElementById('bj-bet-controls');
    const msgEl = document.getElementById('bj-message');
    if (actions) actions.classList.add('hidden');
    if (betControls) betControls.classList.remove('hidden');
    if (msgEl) {
        msgEl.innerText = m;
        msgEl.classList.remove('opacity-0');
    }
    if (w === true) {
        playerState.bloodCoins += parseInt(document.getElementById('bj-bet-input').value) * 2;
        saveGame();
    }
    updateGoldDisplay();
}

// EXPOSE TO WINDOW FOR HTML ONCLICK Handlers
window.spinRouletteReal = spinRouletteReal;
window.placeRouletteBet = placeRouletteBet;
window.clearRouletteBets = clearRouletteBets;
window.spinSlots = spinSlots;
window.startBlackjack = startBlackjack;
window.bjHit = bjHit;
window.bjStand = bjStand;
window.openWheelModal = openWheelModal;
window.closeWheelModal = closeWheelModal;
window.spinWheel = spinWheel;
window.openPatronageModal = openPatronageModal;
window.closePatronageModal = closePatronageModal;
window.requestLoan = requestLoan;
window.loadCasinoGame = loadCasinoGame; // CRITICAL FIX: EXPOSE LOAD FUNCTION

// ============================================
// RULETA MALDITA - MAZO DE MUCHAS COSAS (Black Market Only)
// ============================================

const cursedSegments = [
    // === CARTAS BUENAS ===
    { id: 'sol', text: '☀️ Sol', color: '#fbbf24', type: 'good', desc: '+50.000 XP y objeto maravilloso' },
    { id: 'luna', text: '🌙 Luna', color: '#c4b5fd', type: 'good', desc: 'Concede 1-3 Deseos' },
    { id: 'estrella', text: '⭐ Estrella', color: '#facc15', type: 'good', desc: '+2 a una característica (permanente)' },
    { id: 'gema', text: '💎 Gema', color: '#22d3ee', type: 'good', desc: 'Joyas por valor de 50.000 mo' },
    { id: 'llave', text: '🗝️ Llave', color: '#a78bfa', type: 'good', desc: 'Arma mágica rara o superior' },
    { id: 'caballero', text: '⚔️ Caballero', color: '#60a5fa', type: 'good', desc: 'Guerrero leal nivel 4 te sirve' },

    // === CARTAS MALAS ===
    { id: 'calavera', text: '💀 Calavera', color: '#1f2937', type: 'bad', desc: 'Avatar de la Muerte te ataca' },
    { id: 'vacio', text: '🕳️ Vacío', color: '#0f0f0f', type: 'bad', desc: 'Tu alma queda atrapada' },
    { id: 'mazmorra', text: '⛓️ Mazmorra', color: '#374151', type: 'bad', desc: 'Encerrado en animación suspendida' },
    { id: 'llamas', text: '🔥 Llamas', color: '#dc2626', type: 'bad', desc: 'Diablo poderoso te persigue' },
    { id: 'ruina', text: '📉 Ruina', color: '#450a0a', type: 'bad', desc: 'Pierdes TODA tu riqueza' },
    { id: 'garras', text: '🦅 Garras', color: '#581c87', type: 'bad', desc: 'Objetos mágicos desintegrados' }
];

let cursedWheelModal;
let cursedWheelResult;
let deckCardsContainer;
let demonDialogue;
let cardCountPhase;
let shufflePhase;
let cardsPhase;
let cardCountDisplay;
let totalCostDisplay;

let selectedCardCount = 1;
let dealtCards = []; // The unique cards dealt for this session
let revealedCount = 0;
let isProcessing = false;

const demonDialogues = {
    welcome: "\"Bienvenido, mortal... El <span class='text-purple-400 font-bold'>Mazo de Muchas Cosas</span> te aguarda. Primero, <span class='text-yellow-400'>declara cuántas cartas</span> robarás... Una vez declarado, <span class='text-red-400'>no hay vuelta atrás</span>.\"",
    shuffling: "\"<span class='text-purple-400 animate-pulse'>El mazo se baraja...</span> Las cartas eligen a sus víctimas...\"",
    ready: "\"<span class='text-green-400'>Tus cartas te esperan.</span> Cada una contiene un destino único. Revélalas... si te atreves.\"",
    revealing: "\"<span class='text-purple-400 animate-pulse'>El destino se revela...</span>\"",
    goodResult: "\"<span class='text-green-400'>Interesante...</span> La fortuna te sonríe. <span class='text-yellow-400'>Por ahora.</span>\"",
    badResult: "\"<span class='text-red-400'>Qué lástima...</span> El destino es cruel, ¿no es así? <span class='text-gray-400'>*risa oscura*</span>\"",
    allRevealed: "\"<span class='text-purple-400'>Has agotado tus cartas.</span> ¿Volverás a tentar al destino... otro día?\""
};

export function initCursedWheel() {
    cursedWheelModal = document.getElementById('cursed-wheel-modal');
    cursedWheelResult = document.getElementById('cursed-wheel-result');
    deckCardsContainer = document.getElementById('deck-cards');
    demonDialogue = document.getElementById('demon-dialogue');
    cardCountPhase = document.getElementById('card-count-phase');
    shufflePhase = document.getElementById('shuffle-phase');
    cardsPhase = document.getElementById('cards-phase');
    cardCountDisplay = document.getElementById('card-count-display');
    totalCostDisplay = document.getElementById('total-cost-display');
}

export function openCursedWheelModal() {
    if (!cursedWheelModal) initCursedWheel();

    // Reset state
    selectedCardCount = 1;
    dealtCards = [];
    revealedCount = 0;
    isProcessing = false;

    cursedWheelModal.classList.remove('hidden');
    setTimeout(() => cursedWheelModal.classList.remove('opacity-0'), 10);

    // Show phase 1 (card count selection)
    resetToPhase1();
}

function resetToPhase1() {
    if (cardCountPhase) cardCountPhase.classList.remove('hidden');
    if (shufflePhase) shufflePhase.classList.add('hidden');
    if (cardsPhase) cardsPhase.classList.add('hidden');

    selectedCardCount = 1;
    updateCardCountDisplay();

    if (demonDialogue) demonDialogue.innerHTML = demonDialogues.welcome;
    if (cursedWheelResult) cursedWheelResult.innerHTML = '<span class="text-gray-500 text-sm">Declara cuántas cartas robarás...</span>';
}

function updateCardCountDisplay() {
    if (cardCountDisplay) cardCountDisplay.textContent = selectedCardCount;
    if (totalCostDisplay) totalCostDisplay.textContent = (selectedCardCount * 1000).toLocaleString();
}

// Global function for +/- buttons
window.adjustCardCount = function (delta) {
    selectedCardCount = Math.max(1, Math.min(12, selectedCardCount + delta));
    updateCardCountDisplay();
};

// Global function for confirm button
window.confirmCardDraw = function () {
    if (isProcessing) return;

    const totalCost = selectedCardCount * 1000;
    if ((playerState.bloodCoins || 0) < totalCost) {
        showToast(`❌ Necesitas ${totalCost.toLocaleString()} Blood Coins`);
        return;
    }

    // Deduct cost
    playerState.bloodCoins -= totalCost;
    saveGame();
    updateGoldDisplay();

    isProcessing = true;

    // Move to phase 2 (shuffle)
    if (cardCountPhase) cardCountPhase.classList.add('hidden');
    if (shufflePhase) shufflePhase.classList.remove('hidden');
    if (demonDialogue) demonDialogue.innerHTML = demonDialogues.shuffling;

    // Start shuffle animation
    startShuffleAnimation();

    // After shuffle, deal cards
    setTimeout(() => {
        dealUniqueCards();
    }, 2000);
};

function startShuffleAnimation() {
    const shuffleContainer = document.getElementById('shuffle-animation');
    if (!shuffleContainer) return;

    shuffleContainer.innerHTML = '';

    // Create 5 animated cards
    for (let i = 0; i < 5; i++) {
        const card = document.createElement('div');
        card.className = 'absolute w-16 h-24 bg-gradient-to-br from-purple-900 to-black rounded-lg border-2 border-purple-600 shadow-lg';
        card.style.left = '0px';
        card.style.animation = `shuffle ${0.3 + i * 0.1}s ease-in-out infinite alternate`;
        card.style.animationDelay = `${i * 0.1}s`;
        card.innerHTML = '<div class="flex items-center justify-center h-full"><i class="fas fa-question text-purple-400"></i></div>';
        shuffleContainer.appendChild(card);
    }

    // Add shuffle keyframes if not exists
    if (!document.getElementById('shuffle-keyframes')) {
        const style = document.createElement('style');
        style.id = 'shuffle-keyframes';
        style.textContent = `
            @keyframes shuffle {
                0% { transform: translateX(-30px) rotate(-10deg); }
                100% { transform: translateX(30px) rotate(10deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

function dealUniqueCards() {
    // Shuffle the cursedSegments array and pick unique cards
    const shuffled = [...cursedSegments].sort(() => Math.random() - 0.5);
    dealtCards = shuffled.slice(0, selectedCardCount);
    revealedCount = 0;

    // Move to phase 3 (cards)
    if (shufflePhase) shufflePhase.classList.add('hidden');
    if (cardsPhase) cardsPhase.classList.remove('hidden');
    if (demonDialogue) demonDialogue.innerHTML = demonDialogues.ready;
    if (cursedWheelResult) cursedWheelResult.innerHTML = `<span class="text-gray-400 text-sm">Cartas por revelar: <span class="text-purple-400">${selectedCardCount}</span></span>`;

    renderDealtCards();
    isProcessing = false;
}

function renderDealtCards() {
    if (!deckCardsContainer) {
        deckCardsContainer = document.getElementById('deck-cards');
        if (!deckCardsContainer) return;
    }
    deckCardsContainer.innerHTML = '';

    // Render each dealt card (face down initially)
    dealtCards.forEach((cardData, index) => {
        const card = document.createElement('div');
        card.id = `dealt-card-${index}`;
        card.className = 'deck-card cursor-pointer w-16 h-24 md:w-20 md:h-28 bg-gradient-to-br from-purple-950 to-black rounded-lg border-2 border-purple-700/50 shadow-lg hover:shadow-purple-500/30 hover:scale-110 hover:border-purple-400 transition-all duration-300 flex items-center justify-center group';
        card.dataset.revealed = 'false';
        card.dataset.index = index;
        card.innerHTML = `
            <div class="text-purple-400 group-hover:text-purple-300 transition-colors">
                <i class="fas fa-question text-2xl md:text-3xl opacity-50 group-hover:opacity-100"></i>
            </div>
        `;
        card.onclick = () => revealCard(index);

        // Staggered entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);

        deckCardsContainer.appendChild(card);
    });
}

function revealCard(index) {
    if (isProcessing) return;

    const card = document.getElementById(`dealt-card-${index}`);
    if (!card || card.dataset.revealed === 'true') return;

    isProcessing = true;
    card.dataset.revealed = 'true';

    const cardData = dealtCards[index];

    // Flip animation
    card.style.transform = 'rotateY(180deg) scale(1.1)';
    card.style.transition = 'transform 0.6s';
    card.classList.remove('cursor-pointer', 'hover:scale-110', 'hover:border-purple-400');

    if (demonDialogue) demonDialogue.innerHTML = demonDialogues.revealing;

    setTimeout(() => {
        // Reveal the card
        const isGood = cardData.type === 'good';
        card.className = `deck-card w-16 h-24 md:w-20 md:h-28 rounded-lg border-2 shadow-lg flex items-center justify-center ${isGood ? 'bg-gradient-to-br from-green-900 to-black border-green-500' : 'bg-gradient-to-br from-red-900 to-black border-red-500'}`;
        card.innerHTML = `
            <div class="text-center p-1">
                <div class="text-xl mb-1">${cardData.text.split(' ')[0]}</div>
                <div class="text-[7px] text-gray-300 leading-tight">${cardData.desc}</div>
            </div>
        `;
        card.style.transform = 'scale(1.1)';

        // Handle the result
        handleCursedResult(cardData);

        // Update dialogue
        if (demonDialogue) {
            demonDialogue.innerHTML = isGood ? demonDialogues.goodResult : demonDialogues.badResult;
        }

        revealedCount++;
        const remaining = selectedCardCount - revealedCount;

        if (remaining > 0) {
            if (cursedWheelResult) {
                setTimeout(() => {
                    cursedWheelResult.innerHTML += `<br><span class="text-gray-400 text-xs">Cartas restantes: <span class="text-purple-400">${remaining}</span></span>`;
                }, 1500);
            }
        } else {
            // All cards revealed
            setTimeout(() => {
                if (demonDialogue) demonDialogue.innerHTML = demonDialogues.allRevealed;
                if (cursedWheelResult) cursedWheelResult.innerHTML += `<br><span class="text-yellow-400 text-xs mt-2">¡Todas las cartas reveladas!</span>`;
            }, 2000);
        }

        setTimeout(() => {
            isProcessing = false;
        }, 1000);
    }, 600);
}

export function closeCursedWheelModal() {
    if (cursedWheelModal) {
        cursedWheelModal.classList.add('opacity-0');
        setTimeout(() => cursedWheelModal.classList.add('hidden'), 300);
    }
}

// Keep spinCursedWheel for backwards compatibility
export function spinCursedWheel() {
    openCursedWheelModal();
}

function handleCursedResult(result) {
    const stats = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const statNames = { str: 'Fuerza', dex: 'Destreza', con: 'Constitución', int: 'Inteligencia', wis: 'Sabiduría', cha: 'Carisma' };

    switch (result.id) {
        // ========== CARTAS BUENAS ==========

        case 'sol':
            // Sun: +50,000 XP and wondrous item - NOW USES D&D API
            playerState.xp = (playerState.xp || 0) + 50000;
            cursedWheelResult.innerHTML = `<span class="text-yellow-400 text-xl">☀️ ¡EL SOL!</span><br><span class="text-sm text-green-400">+50.000 XP</span><br><span class="text-xs text-yellow-400 animate-pulse">Buscando objeto maravilloso...</span>`;

            dndAPI.getRandomMagicItem().then(item => {
                const rarity = dndAPI.translateRarity(item.rarity?.name || 'Rare');
                const desc = Array.isArray(item.desc) ? item.desc[0] : (item.desc || 'Un objeto de poder antiguo.');
                const shortDesc = desc.length > 80 ? desc.substring(0, 80) + '...' : desc;

                const sunItem = {
                    name: item.name,
                    desc: shortDesc,
                    type: "Objeto Maravilloso",
                    rarity: rarity,
                    fromAPI: true
                };
                playerState.inventory.push(sunItem);
                saveGame();

                cursedWheelResult.innerHTML = `<span class="text-yellow-400 text-xl">☀️ ¡EL SOL!</span><br><span class="text-sm text-green-400">+50.000 XP</span><br><span class="text-xs text-purple-400">+ ${item.name} (${rarity})</span>`;
                showToast(`☀️ SOL: +50.000 XP + ${item.name}`);
            }).catch(() => {
                const fallbackItem = { name: "Capa de Desplazamiento", desc: "Los ataques contra ti tienen desventaja", type: "Capa", rarity: "Mítica" };
                playerState.inventory.push(fallbackItem);
                saveGame();
                cursedWheelResult.innerHTML = `<span class="text-yellow-400 text-xl">☀️ ¡EL SOL!</span><br><span class="text-sm text-green-400">+50.000 XP</span><br><span class="text-xs text-purple-400">+ ${fallbackItem.name}</span>`;
                showToast(`☀️ SOL: +50.000 XP + ${fallbackItem.name}`);
            });
            break;

        case 'luna':
            // Moon: 1-3 Wishes (represented as massive gold + items)
            const wishes = Math.floor(Math.random() * 3) + 1;
            playerState.gold += wishes * 10000;
            playerState.bloodCoins = (playerState.bloodCoins || 0) + wishes * 500;
            cursedWheelResult.innerHTML = `<span class="text-purple-300 text-xl">🌙 ¡LA LUNA!</span><br><span class="text-sm text-green-400">${wishes} Deseo(s) concedidos</span><br><span class="text-xs text-yellow-400">+${wishes * 10000} oro, +${wishes * 500} Blood</span>`;
            showToast(`🌙 LUNA: ${wishes} Deseos (+${wishes * 10000} oro)`);
            break;

        case 'estrella':
            // Star: +2 to one ability score (permanent)
            const boostStat = stats[Math.floor(Math.random() * stats.length)];
            playerState.stats[boostStat] = (playerState.stats[boostStat] || 10) + 2;
            cursedWheelResult.innerHTML = `<span class="text-yellow-300 text-xl">⭐ ¡LA ESTRELLA!</span><br><span class="text-sm text-green-400">+2 ${statNames[boostStat]} (PERMANENTE)</span>`;
            showToast(`⭐ ESTRELLA: +2 ${statNames[boostStat]} ¡PERMANENTE!`);
            break;

        case 'gema':
            // Gem: 25 jewelry pieces worth 2000gp each = 50,000 gp
            playerState.gold += 50000;
            cursedWheelResult.innerHTML = `<span class="text-cyan-400 text-xl">💎 ¡LA GEMA!</span><br><span class="text-sm text-green-400">+50.000 oro en joyas</span>`;
            showToast('💎 GEMA: +50.000 oro en joyas');
            break;

        case 'llave':
            // Key: Rare+ magic weapon - NOW USES D&D API
            cursedWheelResult.innerHTML = `<span class="text-purple-400 text-xl">🗝️ ¡LA LLAVE!</span><br><span class="text-sm text-yellow-400 animate-pulse">Buscando objeto mágico...</span>`;

            // Fetch real magic item from D&D 5e API
            dndAPI.getRandomMagicItem().then(item => {
                const rarity = dndAPI.translateRarity(item.rarity?.name || 'Rare');
                const desc = Array.isArray(item.desc) ? item.desc[0] : (item.desc || 'Un objeto de poder antiguo.');
                const shortDesc = desc.length > 100 ? desc.substring(0, 100) + '...' : desc;

                const inventoryItem = {
                    name: item.name,
                    desc: shortDesc,
                    type: "Objeto Mágico",
                    rarity: rarity,
                    fromAPI: true
                };
                playerState.inventory.push(inventoryItem);
                saveGame();

                cursedWheelResult.innerHTML = `<span class="text-purple-400 text-xl">🗝️ ¡LA LLAVE!</span><br><span class="text-sm text-green-400">${item.name}</span><br><span class="text-xs text-gray-400">(${rarity})</span><br><span class="text-[10px] text-gray-500">${shortDesc}</span>`;
                showToast(`🗝️ LLAVE: Obtienes ${item.name} (${rarity})`);
            }).catch(() => {
                // Fallback if API fails
                const fallbackWeapon = { name: "Espada Vorpal", desc: "Crítico decapita al enemigo", type: "Arma", rarity: "Legendaria" };
                playerState.inventory.push(fallbackWeapon);
                saveGame();
                cursedWheelResult.innerHTML = `<span class="text-purple-400 text-xl">🗝️ ¡LA LLAVE!</span><br><span class="text-sm text-green-400">${fallbackWeapon.name}</span>`;
                showToast(`🗝️ LLAVE: Obtienes ${fallbackWeapon.name}`);
            });
            break;

        case 'caballero':
            // Knight: Loyal 4th level fighter serves you
            const knight = { name: "Caballero Juramentado", desc: "Guerrero Nivel 4, te sirve hasta la muerte", type: "Compañero", rarity: "Épica" };
            playerState.inventory.push(knight);
            playerState.gold += 5000; // Startup funds for the knight
            cursedWheelResult.innerHTML = `<span class="text-blue-400 text-xl">⚔️ ¡EL CABALLERO!</span><br><span class="text-sm text-green-400">Un Guerrero Nivel 4 te jura lealtad</span>`;
            showToast('⚔️ CABALLERO: ¡Nuevo compañero leal!');
            break;

        // ========== CARTAS MALAS ==========

        case 'calavera':
            // Skull: Avatar of Death attacks - OPENS BATTLE MODAL
            cursedWheelResult.innerHTML = `<span class="text-gray-400 text-xl">💀 LA CALAVERA</span><br><span class="text-sm text-red-500">¡El Avatar de la Muerte aparece!</span><br><span class="text-xs text-red-400">Prepárate para combatir...</span>`;
            showToast('💀 CALAVERA: ¡Avatar de la Muerte te ataca!');
            // Trigger battle modal after a delay
            setTimeout(() => {
                openDeathBattle();
            }, 2000);
            break;

        case 'vacio':
            // Void: Soul trapped - SHOWS CHAINS OVERLAY
            stats.forEach(stat => {
                playerState.stats[stat] = Math.max(1, (playerState.stats[stat] || 10) - 2);
            });
            cursedWheelResult.innerHTML = `<span class="text-gray-900 text-xl">🕳️ EL VACÍO</span><br><span class="text-sm text-red-600">Tu alma queda atrapada</span><br><span class="text-xs text-red-400">-2 a TODAS las características</span>`;
            showToast('🕳️ VACÍO: Tu alma está atrapada (-2 a TODO)');
            // Show chains overlay after a delay
            setTimeout(() => {
                showVoidChains();
            }, 2000);
            break;

        case 'mazmorra':
            // Donjon: Imprisoned - lose all portable items
            if (playerState.inventory.length > 0) {
                const lostItems = playerState.inventory.splice(0, Math.min(3, playerState.inventory.length));
                const names = lostItems.map(i => i.name).join(', ');
                cursedWheelResult.innerHTML = `<span class="text-gray-500 text-xl">⛓️ LA MAZMORRA</span><br><span class="text-sm text-red-500">Encerrado en animación suspendida</span><br><span class="text-xs text-red-400">Perdiste: ${names}</span>`;
                showToast(`⛓️ MAZMORRA: Perdiste ${lostItems.length} objeto(s)`);
            } else {
                playerState.gold = Math.floor(playerState.gold * 0.5);
                cursedWheelResult.innerHTML = `<span class="text-gray-500 text-xl">⛓️ LA MAZMORRA</span><br><span class="text-sm text-red-500">Encerrado - pierdes 50% del oro</span>`;
                showToast('⛓️ MAZMORRA: -50% oro');
            }
            break;

        case 'llamas':
            // Flames: Powerful devil becomes enemy - lose blood coins
            const bloodLoss = Math.floor((playerState.bloodCoins || 0) * 0.5);
            playerState.bloodCoins = (playerState.bloodCoins || 0) - bloodLoss;
            cursedWheelResult.innerHTML = `<span class="text-red-600 text-xl">🔥 LAS LLAMAS</span><br><span class="text-sm text-red-500">Un Diablo poderoso te persigue</span><br><span class="text-xs text-red-400">-${bloodLoss} Blood Coins (el tributo)</span>`;
            showToast(`🔥 LLAMAS: Diablo te persigue (-${bloodLoss} Blood)`);
            break;

        case 'ruina':
            // Ruin: All wealth lost
            const allGold = playerState.gold;
            playerState.gold = 0;
            cursedWheelResult.innerHTML = `<span class="text-red-900 text-xl">📉 LA RUINA</span><br><span class="text-sm text-red-600">TODA tu riqueza desaparece</span><br><span class="text-xs text-red-400">Perdiste ${allGold} oro</span>`;
            showToast(`📉 RUINA: Pierdes TODO tu oro (${allGold})`);
            break;

        case 'garras':
            // Talons: All magic items disintegrate
            if (playerState.inventory.length > 0) {
                const numLost = playerState.inventory.length;
                playerState.inventory = [];
                cursedWheelResult.innerHTML = `<span class="text-purple-900 text-xl">🦅 LAS GARRAS</span><br><span class="text-sm text-red-600">Tus objetos mágicos se desintegran</span><br><span class="text-xs text-red-400">Perdiste ${numLost} objeto(s)</span>`;
                showToast(`🦅 GARRAS: ¡${numLost} objetos DESTRUIDOS!`);
            } else {
                const penalty = 5000;
                playerState.gold = Math.max(0, playerState.gold - penalty);
                cursedWheelResult.innerHTML = `<span class="text-purple-900 text-xl">🦅 LAS GARRAS</span><br><span class="text-sm text-red-600">Sin objetos - pagas en oro</span><br><span class="text-xs text-red-400">-${penalty} oro</span>`;
                showToast(`🦅 GARRAS: -${penalty} oro`);
            }
            break;

        default:
            cursedWheelResult.innerHTML = `<span class="text-gray-400">Carta desconocida: ${result.id}</span>`;
            break;
    }

    saveGame();
    updateGoldDisplay();
}

// Expose Cursed Wheel globally
window.openCursedWheelModal = openCursedWheelModal;
window.closeCursedWheelModal = closeCursedWheelModal;
window.spinCursedWheel = spinCursedWheel;

// ============================================
// VOID CHAINS OVERLAY (Soul Trapped)
// ============================================

function showVoidChains() {
    const overlay = document.getElementById('void-chains-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        // Close the cursed wheel modal
        closeCursedWheelModal();
    }
}

window.closeVoidChains = function () {
    const overlay = document.getElementById('void-chains-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
};

// ============================================
// DEATH BATTLE SYSTEM (Avatar of Death Combat)
// ============================================

const GRID_SIZE = 6; // 6x6 grid for 30x30ft
const MOVEMENT_PER_TURN = 6; // 30ft = 6 squares

let battleState = {
    playerHP: 50,
    playerMaxHP: 50,
    avatarHP: 67, // Official D&D Avatar of Death HP
    avatarMaxHP: 67,
    playerPos: { x: 1, y: 2 },
    avatarPos: { x: 4, y: 3 },
    turn: 'player',
    inCombat: false,
    movementRemaining: MOVEMENT_PER_TURN,
    defending: false
};

function openDeathBattle() {
    const modal = document.getElementById('death-battle-modal');
    if (!modal) return;

    // Close cursed wheel modal
    closeCursedWheelModal();

    // Reset battle state
    battleState = {
        playerHP: 50 + (playerState.level || 1) * 10,
        playerMaxHP: 50 + (playerState.level || 1) * 10,
        avatarHP: 67,
        avatarMaxHP: 67,
        playerPos: { x: 1, y: 2 },
        avatarPos: { x: 4, y: 3 },
        turn: 'player',
        inCombat: true,
        movementRemaining: MOVEMENT_PER_TURN,
        defending: false
    };

    modal.classList.remove('hidden');
    renderBattleGrid();
    updateBattleUI();
    updateMovementDisplay();
    addCombatLog('⚔️ ¡El combate comienza! Es tu turno.', 'yellow');
    addCombatLog('💡 Haz clic en una casilla para moverte (30ft/turno).', 'blue');
}

function renderBattleGrid() {
    const grid = document.getElementById('battle-grid');
    if (!grid) return;

    grid.innerHTML = '';

    // Create 6x6 grid (36 squares, each 5ft = 30x30ft total)
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'w-[50px] h-[50px] border border-amber-900/30 relative flex items-center justify-center cursor-pointer hover:bg-amber-700/20 transition-colors';
            cell.style.backgroundColor = (x + y) % 2 === 0 ? 'rgba(30, 25, 20, 0.8)' : 'rgba(45, 35, 25, 0.8)';
            cell.dataset.x = x;
            cell.dataset.y = y;

            // Calculate distance from player
            const dist = Math.abs(x - battleState.playerPos.x) + Math.abs(y - battleState.playerPos.y);

            // Highlight reachable cells
            if (dist > 0 && dist <= battleState.movementRemaining &&
                !(x === battleState.avatarPos.x && y === battleState.avatarPos.y)) {
                cell.classList.add('ring-1', 'ring-green-500/30');
            }

            // Add player token
            if (x === battleState.playerPos.x && y === battleState.playerPos.y) {
                cell.innerHTML = `
                    <div class="w-10 h-10 rounded-full border-2 border-blue-400 bg-blue-900/80 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse z-10">
                        <span class="text-blue-200 font-bold text-lg">P</span>
                    </div>
                `;
                cell.classList.remove('cursor-pointer', 'hover:bg-amber-700/20');
            }

            // Add avatar token
            if (x === battleState.avatarPos.x && y === battleState.avatarPos.y) {
                cell.innerHTML = `
                    <div class="w-10 h-10 rounded-full border-2 border-red-400 bg-red-900 flex items-center justify-center shadow-lg shadow-red-500/50 z-10">
                        <span class="text-2xl">💀</span>
                    </div>
                `;
                cell.classList.remove('cursor-pointer', 'hover:bg-amber-700/20');
            }

            // Click to move
            cell.onclick = () => movePlayer(x, y);

            grid.appendChild(cell);
        }
    }
}

function movePlayer(targetX, targetY) {
    if (!battleState.inCombat || battleState.turn !== 'player') return;

    // Can't move to avatar's position
    if (targetX === battleState.avatarPos.x && targetY === battleState.avatarPos.y) {
        addCombatLog('❌ No puedes ocupar la casilla del enemigo.', 'red');
        return;
    }

    // Can't move to current position
    if (targetX === battleState.playerPos.x && targetY === battleState.playerPos.y) return;

    // Calculate Manhattan distance
    const distance = Math.abs(targetX - battleState.playerPos.x) + Math.abs(targetY - battleState.playerPos.y);

    if (distance > battleState.movementRemaining) {
        addCombatLog(`❌ Demasiado lejos. Solo puedes moverte ${battleState.movementRemaining * 5}ft más.`, 'red');
        return;
    }

    // Move player
    battleState.playerPos = { x: targetX, y: targetY };
    battleState.movementRemaining -= distance;

    addCombatLog(`🚶 Te mueves ${distance * 5}ft. Restante: ${battleState.movementRemaining * 5}ft.`, 'blue');

    renderBattleGrid();
    updateMovementDisplay();
}

function updateMovementDisplay() {
    const display = document.getElementById('movement-remaining');
    if (display) {
        display.textContent = `${battleState.movementRemaining * 5}ft`;
        display.className = battleState.movementRemaining > 0 ? 'text-green-400 font-bold text-sm' : 'text-red-400 font-bold text-sm';
    }
}

function updateBattleUI() {
    const playerHPDisplay = document.getElementById('player-hp-display');
    const avatarHPDisplay = document.getElementById('avatar-hp-display');

    if (playerHPDisplay) playerHPDisplay.textContent = `HP: ${battleState.playerHP}/${battleState.playerMaxHP}`;
    if (avatarHPDisplay) avatarHPDisplay.textContent = `HP: ${battleState.avatarHP}/${battleState.avatarMaxHP}`;
}

function addCombatLog(message, color = 'gray') {
    const log = document.getElementById('combat-log');
    if (!log) return;

    const colorClass = {
        'red': 'text-red-400',
        'green': 'text-green-400',
        'blue': 'text-blue-400',
        'yellow': 'text-yellow-400',
        'gray': 'text-gray-400'
    }[color] || 'text-gray-400';

    const entry = document.createElement('p');
    entry.className = colorClass;
    entry.textContent = message;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

// D&D Dice Roller
window.rollDice = function (sides) {
    const result = Math.floor(Math.random() * sides) + 1;
    const display = document.getElementById('dice-result');
    if (display) {
        display.innerHTML = `<span class="text-2xl font-bold text-yellow-400">${result}</span><span class="text-gray-500 text-sm ml-2">(d${sides})</span>`;
    }
    addCombatLog(`🎲 Tirada d${sides}: ${result}`, 'yellow');
    return result;
};

function rollD20() {
    return Math.floor(Math.random() * 20) + 1;
}

function rollDamage(dice, sides) {
    let total = 0;
    for (let i = 0; i < dice; i++) {
        total += Math.floor(Math.random() * sides) + 1;
    }
    return total;
}

window.battleAction = function (action) {
    if (!battleState.inCombat || battleState.turn !== 'player') return;

    switch (action) {
        case 'attack':
            playerAttack();
            endPlayerTurn();
            break;
        case 'defend':
            playerDefend();
            endPlayerTurn();
            break;
        case 'dash':
            // Dash action: double movement
            battleState.movementRemaining = MOVEMENT_PER_TURN;
            addCombatLog('🏃 ¡Carrera! Recuperas todo tu movimiento.', 'green');
            updateMovementDisplay();
            renderBattleGrid();
            endPlayerTurn();
            break;
        case 'endTurn':
            addCombatLog('⏭️ Terminas tu turno.', 'gray');
            endPlayerTurn();
            break;
    }
};

function endPlayerTurn() {
    // Check if avatar is dead
    if (battleState.avatarHP <= 0) {
        endBattle(true);
        return;
    }

    // Avatar's turn
    battleState.turn = 'avatar';
    addCombatLog('💀 Turno del Avatar de la Muerte...', 'red');

    setTimeout(() => {
        avatarTurn();

        // Check if player is dead
        if (battleState.playerHP <= 0) {
            endBattle(false);
            return;
        }

        // Reset player's turn
        battleState.turn = 'player';
        battleState.movementRemaining = MOVEMENT_PER_TURN;
        battleState.defending = false;
        updateMovementDisplay();
        renderBattleGrid();
        addCombatLog('⚔️ Es tu turno.', 'yellow');
    }, 1500);
}

function avatarTurn() {
    // Avatar moves towards player if not adjacent
    const dist = Math.abs(battleState.avatarPos.x - battleState.playerPos.x) +
        Math.abs(battleState.avatarPos.y - battleState.playerPos.y);

    if (dist > 1) {
        // Move towards player
        const dx = Math.sign(battleState.playerPos.x - battleState.avatarPos.x);
        const dy = Math.sign(battleState.playerPos.y - battleState.avatarPos.y);

        // Move up to 6 squares (30ft)
        let moved = 0;
        for (let i = 0; i < 6 && moved < 6; i++) {
            const newX = battleState.avatarPos.x + (i % 2 === 0 ? dx : 0);
            const newY = battleState.avatarPos.y + (i % 2 === 1 ? dy : 0);

            if (newX === battleState.playerPos.x && newY === battleState.playerPos.y) break;
            if (newX >= 0 && newX < GRID_SIZE && newY >= 0 && newY < GRID_SIZE) {
                if (dx !== 0 && i % 2 === 0) {
                    battleState.avatarPos.x = newX;
                    moved++;
                } else if (dy !== 0 && i % 2 === 1) {
                    battleState.avatarPos.y = newY;
                    moved++;
                }
            }
        }

        if (moved > 0) {
            addCombatLog(`💀 El Avatar se mueve ${moved * 5}ft hacia ti.`, 'red');
            renderBattleGrid();
        }
    }

    // Attack if adjacent
    const newDist = Math.abs(battleState.avatarPos.x - battleState.playerPos.x) +
        Math.abs(battleState.avatarPos.y - battleState.playerPos.y);

    if (newDist <= 1) {
        avatarAttack();
    }
}

function playerAttack() {
    // Check if adjacent to avatar
    const dist = Math.abs(battleState.avatarPos.x - battleState.playerPos.x) +
        Math.abs(battleState.avatarPos.y - battleState.playerPos.y);

    if (dist > 1) {
        addCombatLog('❌ El Avatar está demasiado lejos para atacar cuerpo a cuerpo.', 'red');
        return;
    }

    const roll = rollD20();
    const modifier = Math.floor(((playerState.stats?.str || 10) - 10) / 2);
    const totalAttack = roll + modifier;

    addCombatLog(`🎲 Tiras d20: ${roll} + ${modifier} = ${totalAttack}`, 'blue');

    // Avatar AC is 14
    if (totalAttack >= 14) {
        const damage = rollDamage(2, 6) + modifier; // 2d6 + mod
        battleState.avatarHP -= damage;
        addCombatLog(`⚔️ ¡Golpeas! Infliges ${damage} daño.`, 'green');
    } else {
        addCombatLog('❌ ¡Fallas el ataque!', 'red');
    }

    updateBattleUI();
}

function playerDefend() {
    addCombatLog('🛡️ Te preparas para defenderte. +2 CA este turno.', 'blue');
    battleState.defending = true;
}

function avatarAttack() {
    addCombatLog('💀 El Avatar ataca con su Guadaña Espectral...', 'red');

    const roll = rollD20();
    const playerAC = 10 + Math.floor(((playerState.stats?.dex || 10) - 10) / 2) + (battleState.defending ? 2 : 0);

    addCombatLog(`🎲 Avatar tira d20: ${roll} vs CA ${playerAC}`, 'gray');

    // Avatar has +6 to hit
    if (roll + 6 >= playerAC) {
        const damage = rollDamage(1, 8) + 4; // 1d8+4 slashing
        const necrotic = rollDamage(2, 6); // 2d6 necrotic
        const totalDamage = damage + necrotic;
        battleState.playerHP -= totalDamage;
        addCombatLog(`💀 ¡Te golpea! ${damage} cortante + ${necrotic} necrótico = ${totalDamage} total`, 'red');
    } else {
        addCombatLog('✨ ¡El Avatar falla!', 'green');
    }

    updateBattleUI();
}

function endBattle(playerWon) {
    battleState.inCombat = false;

    if (playerWon) {
        addCombatLog('🏆 ¡¡¡VICTORIA!!! Has derrotado al Avatar de la Muerte.', 'green');
        addCombatLog('✨ Ganas 10.000 XP por esta hazaña legendaria.', 'yellow');
        playerState.xp = (playerState.xp || 0) + 10000;
        showToast('🏆 ¡Derrotaste al Avatar! +10.000 XP');
    } else {
        addCombatLog('💀 Has caído ante el Avatar de la Muerte...', 'red');
        addCombatLog('☠️ Tu alma no puede ser restaurada. Pierdes 50% de oro y stats.', 'red');
        playerState.gold = Math.floor(playerState.gold * 0.5);
        const stats = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
        stats.forEach(stat => {
            playerState.stats[stat] = Math.max(1, (playerState.stats[stat] || 10) - 2);
        });
        showToast('💀 Caíste ante el Avatar. -50% oro, -2 a todas las stats');
    }

    saveGame();
    updateGoldDisplay();

    // Close modal after delay
    setTimeout(() => {
        const modal = document.getElementById('death-battle-modal');
        if (modal) modal.classList.add('hidden');
    }, 3000);
}

// Expose battle functions
window.openDeathBattle = openDeathBattle;


// FORCE EVENT LISTENERS & STYLES ON LOAD (Fail-safe)
// FORCE EVENT LISTENERS (Minimal Fallback for old buttons if any remain)
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cursed wheel
    initCursedWheel();
});
