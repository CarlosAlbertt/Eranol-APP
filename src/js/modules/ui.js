import { state } from '../../state.js';
import { playerState } from './player.js'; // Import playerState

export function showToast(msg) {
    const overlay = document.getElementById('status-overlay');
    const msgEl = document.getElementById('status-msg');
    const iconEl = document.getElementById('status-icon');

    if (!overlay || !msgEl) return;

    msgEl.innerText = msg;

    // Auto-icon logic
    if (msg.includes('Bloqueado') || msg.includes('Nivel')) {
        iconEl.className = 'fas fa-lock';
    } else if (msg.includes('Compra')) {
        iconEl.className = 'fas fa-shopping-cart';
    } else if (msg.includes('No tienes')) {
        iconEl.className = 'fas fa-times-circle';
    } else {
        iconEl.className = 'fas fa-info-circle';
    }

    // Show
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.querySelector('div.relative').classList.remove('scale-95');
    overlay.querySelector('div.relative').classList.add('scale-100');

    // Hide automatically after 1s
    setTimeout(() => {
        overlay.classList.add('opacity-0', 'pointer-events-none');
        overlay.querySelector('div.relative').classList.add('scale-95');
        overlay.querySelector('div.relative').classList.remove('scale-100');
    }, 1000);
}

// Expose globally for player.js to use without circular dependency
window.showToast = showToast;

export function updateGoldDisplay() {
    // Top Bar Display
    const goldDisplay = document.getElementById('gold-display');
    if (goldDisplay) {
        if (state.currentRing === 0) {
            const blood = playerState.bloodCoins || 0;
            goldDisplay.innerHTML = `<span class="text-red-500 font-cinzel font-bold text-lg drop-shadow-[0_0_5px_rgba(220,38,38,0.8)]"><i class="fas fa-burn mr-2"></i>Monedas de Sangre: ${blood.toLocaleString()}</span>`;
        } else {
            goldDisplay.innerHTML = `<span class="text-yellow-400 font-bold"><i class="fas fa-coins mr-2"></i>${playerState.gold.toLocaleString()} mo</span>`;
        }
    }

    // Sidebar HUD Display (New)
    updateHUD();
}

export function updateHUD() {
    const hudName = document.getElementById('hud-name');
    const hudRank = document.getElementById('hud-rank');
    const hudGuild = document.getElementById('hud-guild');
    const hudGold = document.getElementById('hud-gold');

    if (hudName) hudName.innerText = playerState.name || 'Viajero';
    if (hudRank) hudRank.innerText = playerState.rank || 'F';
    if (hudGuild) hudGuild.innerText = playerState.guild || 'Sin Gremio';

    // Gold & Kaiser Override
    if (hudGold) {
        hudGold.innerText = (playerState.gold || 0).toLocaleString();

        // KAISER BUTTON INJECTION
        const parent = hudGold.parentElement;
        // Only add if not exists
        if (!parent.querySelector('.kaiser-btn') && playerState.name && playerState.name.toLowerCase() === 'kaiser') {
            const btn = document.createElement('button');
            btn.className = 'kaiser-btn ml-2 text-[10px] bg-yellow-900/50 hover:bg-yellow-700 text-yellow-200 px-1 rounded border border-yellow-500/50';
            btn.innerHTML = '<i class="fas fa-sync"></i>';
            btn.onclick = (e) => {
                e.stopPropagation();
                window.forceGold(10000000);
            };
            btn.title = "Restaurar Fortuna";
            parent.appendChild(btn);
        }
    }

    // Missions List
    const hudMissions = document.getElementById('hud-missions-list');
    if (hudMissions) {
        // Filter active missions
        const active = [];
        if (playerState.missionStatus) {
            for (const [id, mission] of Object.entries(playerState.missionStatus)) {
                if (mission.status === 'active') active.push({ id, ...mission });
            }
        }

        if (active.length === 0) {
            hudMissions.innerHTML = '<div class="text-center italic opacity-50 text-xs py-4">Sin contratos activos</div>';
        } else {
            hudMissions.innerHTML = active.map(m => `
                <div class="bg-gradient-to-r from-gray-900 to-gray-800 p-3 rounded border-l-2 border-amber-500 shadow-md mb-2 group hover:brightness-110 transition-all cursor-help" title="${m.desc || 'Misión Activa'}">
                    <div class="flex justify-between items-start">
                        <h4 class="text-xs font-bold text-amber-500 font-cinzel leading-tight">${m.title || m.id}</h4>
                        ${m.type === 'main' ? '<i class="fas fa-crown text-[10px] text-yellow-600"></i>' : '<i class="fas fa-scroll text-[10px] text-gray-500"></i>'}
                    </div>
                    <p class="text-[10px] text-gray-400 mt-1 line-clamp-2">${m.obj || 'Objetivo en curso...'}</p>
                    
                    <!-- DEBUG BUTTON -->
                    <button onclick="event.stopPropagation(); if(window.completeMission && window.handleReward) window.handleReward(window.completeMission('${m.id}'));" 
                            class="w-full mt-2 text-[9px] bg-green-900/30 hover:bg-green-800/80 text-green-400 border border-green-500/30 rounded py-1 uppercase tracking-widest transition-colors font-bold flex items-center justify-center gap-1 group-hover:opacity-100 opacity-60">
                        <i class="fas fa-check-circle"></i> Completar
                    </button>
                </div>
            `).join('');
        }
    }
}

let patronageModal = null;
let pendingLoanAmount = 0;
let loanModal = null;

export function initPatronage() {
    patronageModal = document.getElementById('patronage-modal');
    loanModal = document.getElementById('loan-confirm-modal');
    window.openPatronageModal = openPatronageModal;
    window.closePatronageModal = closePatronageModal;
    window.requestLoan = requestLoan;
    window.confirmLoan = confirmLoan;
    window.closeLoanConfirm = closeLoanConfirm;
}

export function openPatronageModal() {
    patronageModal.classList.remove('hidden');
    setTimeout(() => patronageModal.classList.remove('opacity-0'), 10);
}

export function closePatronageModal() {
    patronageModal.classList.add('opacity-0');
    setTimeout(() => patronageModal.classList.add('hidden'), 300);
}

export function requestLoan(amount) {
    if (state.userBloodCoins >= amount) {
        showToast("Ya tienes suficientes fondos.");
        return;
    }
    pendingLoanAmount = amount;
    // Open Confirmation
    const confirmAmountEl = document.getElementById('loan-confirm-amount');
    if (confirmAmountEl) confirmAmountEl.innerText = amount.toLocaleString();

    loanModal.classList.remove('hidden');
    setTimeout(() => loanModal.classList.remove('opacity-0'), 10);
}

export function closeLoanConfirm() {
    loanModal.classList.add('opacity-0');
    setTimeout(() => loanModal.classList.add('hidden'), 300);
}

import { addBloodCoins } from './player.js';

export function confirmLoan() {
    addBloodCoins(pendingLoanAmount);
    // updateGoldDisplay called by addBloodCoins internally
    showToast(`Pacto sellado: +${pendingLoanAmount.toLocaleString()} Monedas de Sangre.`);
    closeLoanConfirm();
    closePatronageModal();
}
