import { state } from '../../state.js';
import { showToast, updateGoldDisplay } from './ui.js';
import { addToCart } from './cart.js';

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
    window.loadGame = loadGame;
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
export function loadGame(game) {
    document.getElementById('casino-menu').classList.add('hidden');
    document.getElementById(`game-${game}`).classList.remove('hidden');
    currentCasinoGame = game;
    if (game === 'roulette') initRouletteGrid();
}

export function exitGame() {
    if (currentCasinoGame) document.getElementById(`game-${currentCasinoGame}`).classList.add('hidden');
    document.getElementById('casino-menu').classList.remove('hidden');
    currentCasinoGame = null;
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
    const canvas = document.getElementById("rouletteCanvas");
    if (!canvas || !canvas.getContext) return;
    ctxRoulette = canvas.getContext("2d");

    const outsideRadius = 240;
    const textRadius = 190;
    const insideRadius = 120;
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
        ctxRoulette.shadowBlur = 4;
        ctxRoulette.fillStyle = "white";
        ctxRoulette.font = 'bold 24px Cinzel';
        ctxRoulette.translate(centerX + Math.cos(angle + arc / 2) * textRadius, centerY + Math.sin(angle + arc / 2) * textRadius);
        ctxRoulette.rotate(angle + arc / 2 + Math.PI / 2);
        const text = number.toString();
        ctxRoulette.fillText(text, -ctxRoulette.measureText(text).width / 2, 0);
        ctxRoulette.restore();
    }
}

export function spinRouletteReal() {
    if (activeRouletteBets.length === 0) { alert("¡Debes colocar al menos una apuesta!"); return; }
    document.getElementById('btn-spin-roulette').disabled = true;
    spinArcStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3000 + 4 * 1000;
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
    const amountInput = document.getElementById('roulette-amount');
    const amount = parseInt(amountInput.value);

    // CASINO USES BLOOD COINS NOW
    if (state.userBloodCoins < amount) { alert("No tienes suficientes Monedas de Sangre."); return; }
    if (amount <= 0) return;

    state.userBloodCoins -= amount; // Deduct Blood Coins
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
    state.userBloodCoins += totalRefund; // Refund Blood Coins
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

    document.getElementById('total-bet-display').innerText = totalBet.toLocaleString();
}

function checkRouletteWin(winner) {
    const resEl = document.getElementById('roulette-last-result');
    const winnerColor = colors[winner] === '#991b1b' ? 'red' : (winner === 0 ? 'green' : 'black');
    resEl.innerText = winner;
    resEl.className = `text-4xl font-bold ${winnerColor === 'red' ? 'text-red-500' : (winnerColor === 'black' ? 'text-white' : 'text-green-500')}`;

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
                // Approximate payouts for simplicity or use standard odds?
                // Voisins: 17 numbers. Win prob ~46%. Payout ideally varies by specific split/corner hit.
                // Simplified "Arcade" Style: Treat as covering ~45% of wheel. Payout 2x (Total profit slightly less than straight up but consistent).
                // Actually, Voisins covers nearly half. Let's make it 2x payout (like Red/Black) for simplicity, or slightly higher?
                // Voisins (17/37) -> ~2.1x
                // Tiers (12/37) -> ~3x (Like Dozen)
                // Orphelins (8/37) -> ~4.5x 

                if (bet.value === 'voisins') { won = true; mult = 2; }
                if (bet.value === 'tiers') { won = true; mult = 3; }
                if (bet.value === 'orphelins') { won = true; mult = 4; }
            }
        }

        if (won) totalWon += bet.amount * mult;
    });

    if (totalWon > 0) {
        state.userBloodCoins += totalWon; // Win Blood Coins
        showToast(`¡GANASTE ${totalWon.toLocaleString()} Monedas de Sangre!`);
    } else {
        showToast(`La casa gana. Salió ${winner} (${winnerColor === 'red' ? 'Rojo' : (winnerColor === 'green' ? 'Verde' : 'Negro')})`);
    }

    activeRouletteBets = [];
    updateRouletteUI();
    updateGoldDisplay();
    document.getElementById('btn-spin-roulette').disabled = false;
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
    if (state.hasSpunWheel) { alert("Solo un giro al día."); return; }
    wheelModal.classList.remove('hidden');
    setTimeout(() => wheelModal.classList.remove('opacity-0'), 10);
    initWheel();
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

    // Close modal momentarily for dramatic effect? Or keep it open and overlay? 
    // Let's overlay on top of everything.
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
export function requestLoan(amount) { state.userGold += amount; updateGoldDisplay(); showToast(`Has recibido ${amount} mo.`); closePatronageModal(); }

// --- SLOTS (Blood Coins x10) ---
export function spinSlots() {
    const cost = 500; // x10 cost
    if (state.userBloodCoins < cost) { alert("Sin Monedas de Sangre."); return; }
    state.userBloodCoins -= cost;
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
        state.userBloodCoins += p;
        m.innerText = `¡Premio! +${p} MS`;
    } else if (v1 === v2 || v2 === v3 || v1 === v3) {
        state.userBloodCoins += 200;
        m.innerText = "+200 recuperados";
    } else {
        m.innerText = "Pierdes.";
    }
    updateGoldDisplay();
}

// --- BLACKJACK (Blood Coins) ---
let bjDeck = [], bjD = [], bjP = [];
export function startBlackjack() {
    const bet = parseInt(document.getElementById('bj-bet').value);
    if (state.userBloodCoins < bet) { alert("No tienes suficientes Monedas de Sangre"); return; }
    state.userBloodCoins -= bet;
    updateGoldDisplay();
    document.getElementById('btn-bj-deal').classList.add('hidden');
    document.getElementById('bj-controls').classList.remove('hidden');
    document.getElementById('bj-msg').innerText = "";
    const s = ['♠', '♥', '♦', '♣'], v = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    bjDeck = [];
    for (let su of s) for (let va of v) bjDeck.push({ s: su, v: va });
    bjDeck.sort(() => Math.random() - 0.5);
    bjP = [bjDeck.pop(), bjDeck.pop()];
    bjD = [bjDeck.pop(), bjDeck.pop()];
    renderBJ();
    if (getBJScore(bjP) === 21) bjStand();
}

function getBJScore(h) { let sc = 0, aces = 0; for (let c of h) { if (['J', 'Q', 'K'].includes(c.v)) sc += 10; else if (c.v === 'A') { sc += 11; aces++ } else sc += parseInt(c.v); } while (sc > 21 && aces > 0) { sc -= 10; aces-- } return sc; }

function renderBJ(show = false) { const dH = c => `<div class="bg-white text-black w-12 h-16 rounded flex items-center justify-center font-bold border border-gray-400 ${['♥', '♦'].includes(c.s) ? 'text-red-600' : ''}">${c.v}${c.s}</div>`; document.getElementById('player-cards').innerHTML = bjP.map(dH).join(''); document.getElementById('player-score').innerText = getBJScore(bjP); if (show) { document.getElementById('dealer-cards').innerHTML = bjD.map(dH).join(''); document.getElementById('dealer-score').innerText = getBJScore(bjD); } else { document.getElementById('dealer-cards').innerHTML = dH(bjD[0]) + `<div class="bg-red-900 w-12 h-16 rounded border border-white/20"></div>`; document.getElementById('dealer-score').innerText = "?"; } }

export function bjHit() { bjP.push(bjDeck.pop()); renderBJ(); if (getBJScore(bjP) > 21) endBJ(false, "Te pasaste."); }
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
                state.userBloodCoins += parseInt(document.getElementById('bj-bet').value);
                endBJ(null, "Empate.");
            }
        }
    }, 800);
}

function endBJ(w, m) {
    document.getElementById('bj-controls').classList.add('hidden');
    document.getElementById('btn-bj-deal').classList.remove('hidden');
    document.getElementById('bj-msg').innerText = m;
    if (w === true) {
        state.userBloodCoins += parseInt(document.getElementById('bj-bet').value) * 2;
    }
    updateGoldDisplay();
}
