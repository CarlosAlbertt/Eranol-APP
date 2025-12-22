import { state } from '../../state.js';
import { showToast, updateGoldDisplay } from './ui.js';
import { addItem, removeGold, playerState } from './player.js';

let cartSidebar;
let cartCount;
let cartItemsContainer;
let cartTotal;
let discountRow;
let discountAmount;

export function initCart() {
    cartSidebar = document.getElementById('cart-sidebar');
    cartCount = document.getElementById('cart-count');
    cartItemsContainer = document.getElementById('cart-items');
    cartTotal = document.getElementById('cart-total');
    discountRow = document.getElementById('discount-row');
    discountAmount = document.getElementById('discount-amount');

    window.removeFromCart = removeFromCart;
    window.increaseQty = increaseQty;
    window.toggleCart = toggleCart;
    window.checkout = checkout;
}

export function addToCart(item) {
    // Check if item already exists in cart
    const existingItem = state.cart.find(i => i.name === item.name);

    if (existingItem) {
        existingItem.qty = (existingItem.qty || 1) + 1;
        showToast(`"${item.name}" x${existingItem.qty}`);
    } else {
        state.cart.push({ ...item, qty: 1 });
        showToast(`"${item.name}" añadido.`);
    }
    updateCartUI();
}

export function increaseQty(index) {
    const item = state.cart[index];
    if (item) {
        // Ensure number type
        item.qty = (Number(item.qty) || 1) + 1;
        updateCartUI();
        showToast(`+1 ${item.name} (Total: ${item.qty})`);
    }
}

export function removeFromCart(index) {
    const item = state.cart[index];
    if (item.qty > 1) {
        item.qty--;
    } else {
        state.cart.splice(index, 1);
    }
    updateCartUI();
}

export function toggleCart() {
    cartSidebar.classList.toggle('translate-x-full');
}

export function updateCartUI() {
    // Total Items Value for Badge
    const totalItems = state.cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    cartCount.innerText = totalItems;

    if (state.cart.length > 0) cartCount.classList.remove('hidden'); else cartCount.classList.add('hidden');

    let totalCost = state.cart.reduce((sum, i) => sum + (i.price * (i.qty || 1)), 0);
    if (state.activeDiscount > 0) {
        discountRow.classList.remove('hidden');
        discountAmount.innerText = `-${(state.activeDiscount * 100)}%`;
        totalCost = totalCost * (1 - state.activeDiscount);
    } else {
        discountRow.classList.add('hidden');
    }
    const isRing0 = state.currentRing === 0;
    cartTotal.innerText = Math.round(totalCost).toLocaleString() + (isRing0 ? ' Monedas de Sangre' : ' mo');

    if (cartItemsContainer) cartItemsContainer.innerHTML = '';
    state.cart.forEach((item, index) => {
        const isRing0 = state.currentRing === 0;
        const unit = isRing0 ? 'Monedas de Sangre' : 'mo';
        const el = document.createElement('div');
        el.className = 'flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5';

        el.innerHTML = `
            <div class="flex-1">
                <div class="flex justify-between items-start">
                    <div class="text-sm font-bold text-gray-200">
                        ${item.name} <span class="text-purple-400 font-mono text-xs ml-1">x${item.qty || 1}</span>
                    </div>
                </div>
                <div class="text-xs text-yellow-500 mt-1">
                    ${(item.price * (item.qty || 1)).toLocaleString()} ${unit}
                </div>
            </div>
            <div class="flex items-center gap-1 pl-3 border-l border-white/10 ml-3 relative z-50">
                <button onclick="removeFromCart(${index})" class="text-red-400 hover:text-red-300 w-8 h-8 flex items-center justify-center rounded hover:bg-white/5 transition-colors cursor-pointer relative z-50 pointer-events-auto">
                    <i class="fas fa-minus"></i>
                </button>
                <button onclick="increaseQty(${index})" class="text-green-400 hover:text-green-300 w-8 h-8 flex items-center justify-center rounded hover:bg-white/5 transition-colors cursor-pointer relative z-50 pointer-events-auto">
                    <i class="fas fa-plus"></i>
                </button>
            </div>`;
        cartItemsContainer.appendChild(el);
    });
}

export function checkout() {
    if (state.cart.length === 0) return;

    // Check if we are in Ring 0 (Blood Currency)
    const isRing0 = state.currentRing === 0;

    let total = Math.round(state.cart.reduce((s, i) => s + (i.price * (i.qty || 1)), 0) * (1 - state.activeDiscount));

    // For Ring 0
    if (isRing0) {
        if (removeBloodCoins(total)) {
            // Add items with quantity
            state.cart.forEach(item => {
                for (let i = 0; i < (item.qty || 1); i++) addItem(item);
            });
            updateGoldDisplay();
            showToast('¡Compra realizada (Mercado Negro)!');
            state.cart = [];
            updateCartUI();
            toggleCart();
        } else {
            showToast(`No tienes suficiente sangre.`);
        }
        return;
    }

    // For Standard Gold (Ring 1+)
    // Use playerState via removeGold helper which handles saving
    if (removeGold(total)) {
        // Gold removed and saved inside removeGold
        state.cart.forEach(item => {
            for (let i = 0; i < (item.qty || 1); i++) addItem(item);
        });

        updateGoldDisplay();
        showToast('¡Compra realizada!');
        state.cart = [];
        updateCartUI();
        toggleCart();
    } else {
        showToast(`No tienes suficiente oro.`);
    }
}
