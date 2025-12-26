import { state } from '../../state.js';
import { playerState, saveGame } from './player.js';
import { showToast, updateGoldDisplay } from './ui.js';

let bankModal;
let bankInput;
let bankEstimate;
let bankEstimateEl;

export function initBank() {
    bankModal = document.getElementById('bank-modal');
    bankInput = document.getElementById('bank-input');
    bankEstimateEl = document.getElementById('bank-estimate');

    if (bankInput) {
        bankInput.addEventListener('input', updateBankEstimate);
    }

    // Expose Global Functions
    window.openBankModal = openBankModal;
    window.closeBankModal = closeBankModal;
    window.bankExchange = bankExchange;
    window.bankExchangeMax = bankExchangeMax;
}

export function openBankModal() {
    if (!bankModal) return;
    bankModal.classList.remove('hidden');
    // Force layout reflow
    void bankModal.offsetWidth;
    bankModal.classList.remove('opacity-0');

    // Update balances in modal - USE PLAYERSTATE!
    const goldBal = document.getElementById('bank-gold-balance');
    const bloodBal = document.getElementById('bank-blood-balance');
    if (goldBal) goldBal.innerText = (playerState.gold || 0).toLocaleString();
    if (bloodBal) bloodBal.innerText = (playerState.bloodCoins || 0).toLocaleString();

    updateBankEstimate();
}

export function closeBankModal() {
    if (!bankModal) return;
    bankModal.classList.add('opacity-0');
    setTimeout(() => bankModal.classList.add('hidden'), 300);
}

function updateBankEstimate() {
    if (!bankInput || !bankEstimateEl) return;
    const amount = parseInt(bankInput.value) || 0;
    const blood = amount * 10;
    bankEstimateEl.innerText = blood.toLocaleString();
}

export function bankExchangeMax() {
    if (!bankInput) return;
    bankInput.value = playerState.gold || 0;
    updateBankEstimate();
}

export function bankExchange() {
    const amount = parseInt(bankInput.value);

    if (isNaN(amount) || amount <= 0) {
        showToast("Cantidad inválida.");
        return;
    }

    if ((playerState.gold || 0) < amount) {
        showToast("No tienes suficiente oro.");
        return;
    }

    // Deduct gold, add blood coins
    playerState.gold = (playerState.gold || 0) - amount;
    playerState.bloodCoins = (playerState.bloodCoins || 0) + (amount * 10);
    saveGame(); // PERSIST!

    // Update displays
    updateGoldDisplay();

    // Also update UI inside the modal for immediate feedback
    const goldBal = document.getElementById('bank-gold-balance');
    const bloodBal = document.getElementById('bank-blood-balance');
    if (goldBal) goldBal.innerText = (playerState.gold || 0).toLocaleString();
    if (bloodBal) bloodBal.innerText = (playerState.bloodCoins || 0).toLocaleString();

    showToast(`Cambio realizado: +${(amount * 10).toLocaleString()} Monedas de Sangre`);
    closeBankModal();
    if (bankInput) bankInput.value = '';
}
