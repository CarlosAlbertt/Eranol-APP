import { state, constants } from '../../state.js';
import { knownUsers } from '../data/users.js';
import { showToast, updateGoldDisplay } from './ui.js';
import { loadGame, saveGame, playerState } from './player.js'; // Import loadGame, saveGame

import { enterMarket, enterGlobalMap } from './navigation.js';

let adventurerLoginScreen;
let landingScreen;
let loginModal;
let loginMsg;
let penaltyOverlay;
let displayUsername;
let advNameInput;
let loginUser;
let loginPass;
let globalUserUi;
let globalUsername;

export function initAuth() {
    adventurerLoginScreen = document.getElementById('adventurer-login');
    landingScreen = document.getElementById('landing-screen');
    loginModal = document.getElementById('login-modal');
    loginMsg = document.getElementById('login-msg');
    penaltyOverlay = document.getElementById('penalty-overlay');
    displayUsername = document.getElementById('display-username');
    advNameInput = document.getElementById('adv-name-input');
    // START: Added Password Input
    window.advPassInput = document.getElementById('adv-pass-input');
    // END
    loginUser = document.getElementById('login-user');
    loginPass = document.getElementById('login-pass');

    // Global UI
    globalUserUi = document.getElementById('global-user-ui');
    globalUsername = document.getElementById('global-username');

    // Event listeners
    const loginBtn = document.querySelector('button[onclick="loginAdventurer()"]');
    if (loginBtn) loginBtn.onclick = loginAdventurer;

    // We might need to expose some functions globally if they are called from HTML onclicks
    // But better to attach listeners here if possible. 
    // For now, I will attach them to window for compatibility with existing HTML or attach them if I find the elements.
    window.loginAdventurer = loginAdventurer;
    window.openLoginModal = openLoginModal;
    window.closeLoginModal = closeLoginModal;
    window.attemptLogin = attemptLogin;

    restoreSession(); // Auto-restore on init
}

export function restoreSession() {
    // Attempt to load the last active user
    // STRICT MODE: We probably shouldn't auto-restore without password in a real strict app,
    // but for UX let's allow "Remember Me" style if they are already in strictly known users.
    loadGame();

    if (playerState.name && playerState.name !== "Viajero") {
        const lowerName = playerState.name.toLowerCase();
        const userData = knownUsers[lowerName];

        // STRICT CHECK: Only restore if user is KNOWN.
        if (userData) {
            state.currentAdventurer = playerState.name;
            state.currentUserMaxRing = userData.maxRing;
            console.log(`Session Restored: ${playerState.name} (Rank ${userData.maxRing})`);

            if (displayUsername) displayUsername.innerText = playerState.name;
            if (globalUsername) globalUsername.innerText = playerState.name;

            // SHOW GLOBAL UI
            if (globalUserUi) globalUserUi.classList.remove('hidden');

            updateGoldDisplay();

            // SKIP LOGIN SCREEN
            if (adventurerLoginScreen) adventurerLoginScreen.classList.add('hidden');
            if (landingScreen) landingScreen.classList.add('hidden');

            // Go straight to Map
            enterGlobalMap();
        } else {
            // If saved user is not in knownUsers (e.g. old "Khan" or guest), DO NOT RESTORE.
            console.log("Saved user not authorized in strict mode. Clearing.");
            localStorage.removeItem('eranol_last_user');
            // Stay on Login Screen
        }
    }
}

export function loginAdventurer() {
    const nameInput = advNameInput.value.trim();
    const passInput = window.advPassInput.value.trim(); // Read password

    if (!nameInput) { showToast("⚠️ Identificación requerida."); return; }
    if (!passInput) { showToast("⚠️ Contraseña requerida."); return; }

    const lowerName = nameInput.toLowerCase();
    const userData = knownUsers[lowerName];

    // STRICT VALIDATION
    if (!userData) {
        showToast("⛔ ID DE CAZADOR NO RECONOCIDO");
        return;
    }

    if (userData.password !== passInput) {
        showToast("⛔ CREDENCIALES INVÁLIDAS");
        return;
    }

    // AUTH SUCCESS
    loadGame(nameInput); // Load/Create profile

    // APPLY STARTING GOLD (Configuration)
    if (userData.startingGold) {
        // Force Kaiser's wealth explicitly every time if it's wrong
        if (lowerName === 'kaiser' && playerState.gold < userData.startingGold) {
            console.log(`[AUTH] Enforcing Kaiser Gold: ${userData.startingGold}`);
            playerState.gold = userData.startingGold;
            saveGame();
            showToast(`💰 Patrimonio Restaurado: ${userData.startingGold.toLocaleString()}`);
        }
        // New user default logic
        else if (playerState.gold === 500) {
            playerState.gold = userData.startingGold;
            saveGame();
        }
    }

    // SYNC INFO TO STATE
    if (userData.rank) playerState.rank = userData.rank;
    if (userData.title) playerState.guild = userData.title; // Using Title as 'Guild/Role' for now
    saveGame();

    state.currentAdventurer = nameInput;
    displayUsername.innerText = nameInput;
    if (globalUsername) globalUsername.innerText = nameInput;

    // Apply Permissions from Database (Source of Truth)
    state.currentUserMaxRing = userData.maxRing;
    showToast(`Acceso Concedido: ${userData.title} (Rango ${userData.rank})`);

    // SHOW GLOBAL UI
    if (globalUserUi) globalUserUi.classList.remove('hidden');

    updateGoldDisplay();
    adventurerLoginScreen.classList.add('animate-fade-out');
    setTimeout(() => {
        adventurerLoginScreen.classList.add('hidden');
        // Go to Global Map Hub
        enterGlobalMap();
    }, 500);
}

export function openLoginModal() {
    loginModal.classList.remove('hidden');
    loginUser.value = '';
    loginPass.value = '';
    loginMsg.innerText = '';
}

export function closeLoginModal() {
    loginModal.classList.add('hidden');
}

export function attemptLogin() {
    const user = loginUser.value.trim();
    const pass = loginPass.value.trim();

    // Check credentials for Admin/Special users (Black Market Access)
    const isAdmin = (user === "Sombra" && pass === "1234") ||
        (user === "Asolador" && pass === "Asolador") ||
        (user.toLowerCase() === "kaiser" && pass === "ashmir");

    if (isAdmin) {
        closeLoginModal();

        // CRITICAL FIX: Load the profile for admin users so persistence works
        loadGame(user);

        // Force Admin Permissions Synchronously
        state.currentUserMaxRing = 4;
        state.currentAdventurer = user;
        state.blackMarketAuthenticated = true; // NEW: Mark as authenticated for Black Market

        // Visuals
        if (displayUsername) displayUsername.innerText = user;
        if (globalUsername) globalUsername.innerText = user;
        if (globalUserUi) globalUserUi.classList.remove('hidden');

        showToast(`Bienvenido, ${user}. (MODO: OMNIPOTENTE)`);
        state.loginAttempts = 0;

        // Enter Ring 0 (Market of Shadows) or stay in landing? 
        // User logic seemed to be entering Ring 0 immediately.
        enterMarket(0);
    } else {
        state.loginAttempts++;
        if (state.loginAttempts >= constants.MAX_ATTEMPTS) {
            loginMsg.innerText = "¡BLOQUEO MÁGICO!";
            penaltyOverlay.classList.remove('hidden');
            document.body.classList.add('animate-glitch');
            setTimeout(() => {
                penaltyOverlay.classList.add('hidden');
                document.body.classList.remove('animate-glitch');
                state.loginAttempts = 0;
                closeLoginModal();
            }, 3000);
        } else loginMsg.innerText = `Acceso denegado.`;
    }
}

export function logout() {
    localStorage.removeItem('eranol_last_user');
    location.reload();
}

// Expose logout
window.logout = logout;
