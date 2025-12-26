import './css/index.css';
import './css/medieval-sheet.css';
import './css/casino.css';


import { initAuth } from './js/modules/auth.js';
import { initNavigation } from './js/modules/navigation.js';
import { initCart } from './js/modules/cart.js';
import { initGames } from './js/modules/games.js';
import { initBank } from './js/modules/bank.js';
import { initPatronage } from './js/modules/ui.js';
import { initSheetUI } from './js/modules/sheet_ui.js';
import './js/modules/lootChest.js'; // Loot chest system



const initApp = () => {
    initNavigation(); // Run first to set up UI vars and hide sidebars
    initCart();
    initAuth(); // Run later to restore session and potentially Show sidebars
    initGames();
    initBank();
    initPatronage();
    initSheetUI();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
