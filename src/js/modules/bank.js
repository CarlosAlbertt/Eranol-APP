import { state } from '../../state.js';
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
    bankModal.classList.remove('hidden');
    // Force layout reflow
    void bankModal.offsetWidth;
    bankModal.classList.remove('opacity-0');

    // Update balances in modal
    const goldBal = document.getElementById('bank-gold-balance');
    const bloodBal = document.getElementById('bank-blood-balance');
    if (goldBal) goldBal.innerText = state.userGold.toLocaleString();
    if (bloodBal) bloodBal.innerText = state.userBloodCoins.toLocaleString();

    updateBankEstimate();
}

export function closeBankModal() {
    bankModal.classList.add('opacity-0');
    setTimeout(() => bankModal.classList.add('hidden'), 300);
}

function updateBankEstimate() {
    const amount = parseInt(bankInput.value) || 0;
    const blood = amount * 10;
    bankEstimateEl.innerText = blood.toLocaleString();
}

export function bankExchangeMax() {
    bankInput.value = state.userGold;
    updateBankEstimate();
}

/**
 * Updates the bank UI with current balances (since we might hide it in main UI)
 */
function updateBankBalances() {
    // Ideally we update the text in the modal if we add spans for balances
    // For now, the input placeholder or a dedicated span could show it.
    // Let's assume the user knows their gold or checks the max button.
}

export function bankExchange() {
    const amount = parseInt(bankInput.value);

    if (isNaN(amount) || amount <= 0) {
        showToast("Cantidad inválida.");
        return;
    }

    if (state.userGold < amount) {
        showToast("No tienes suficiente oro.");
        return;
    }

    state.userGold -= amount;
    state.userBloodCoins += (amount * 10);

    // Update displays
    updateGoldDisplay();

    // Also update UI inside the modal for immediate feedback
    document.getElementById('bank-gold-balance').innerText = state.userGold.toLocaleString();
    document.getElementById('bank-blood-balance').innerText = state.userBloodCoins.toLocaleString();
    // We should also implement logic to update the blood coin display if we had a separate one
    // For now we might repurpose the gold display or add a new one, but let's stick to state updates first.

    showToast(`Cambio realizado: +${(amount * 10).toLocaleString()} Monedas de Sangre`);
    closeBankModal();
    bankInput.value = '';
}
