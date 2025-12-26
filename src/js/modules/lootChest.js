/**
 * Loot Chest System - Gacha Style
 * 
 * Sistema de cofres con 3 clicks para revelar la rareza final.
 * El aura cambia progresivamente según las probabilidades.
 */

import { playerState, saveGame } from './player.js';
import { showToast, updateGoldDisplay } from './ui.js';
import { magicItemsES, getRandomSpanishItem } from '../data/magicItemsES.js';

// ============================================
// CHEST TIER DEFINITIONS (6 TIERS)
// ============================================
const CHEST_TIERS = {
    common: {
        name: 'Cofre Común',
        color: '#9CA3AF',      // gray
        colorClass: 'text-gray-400',
        borderClass: 'border-gray-500',
        glowColor: 'rgba(156, 163, 175, 0.6)',
        goldRange: [50, 200],
        itemCount: [1, 2],
        magicItemChance: 0.1,
        emoji: '📦',
        particles: ['⚪', '💨', '✧'],
        auraIntensity: 0.4
    },
    rare: {
        name: 'Cofre Raro',
        color: '#3B82F6',      // blue
        colorClass: 'text-blue-400',
        borderClass: 'border-blue-500',
        glowColor: 'rgba(59, 130, 246, 0.7)',
        goldRange: [200, 600],
        itemCount: [1, 3],
        magicItemChance: 0.25,
        emoji: '💎',
        particles: ['💙', '✨', '🔷'],
        auraIntensity: 0.5
    },
    special: {
        name: 'Cofre Especial',
        color: '#10B981',      // green/emerald
        colorClass: 'text-emerald-400',
        borderClass: 'border-emerald-500',
        glowColor: 'rgba(16, 185, 129, 0.7)',
        goldRange: [500, 1200],
        itemCount: [2, 3],
        magicItemChance: 0.4,
        emoji: '🌟',
        particles: ['💚', '⭐', '🍀', '✨'],
        auraIntensity: 0.6
    },
    epic: {
        name: 'Cofre Épico',
        color: '#A855F7',      // purple
        colorClass: 'text-purple-400',
        borderClass: 'border-purple-500',
        glowColor: 'rgba(168, 85, 247, 0.8)',
        goldRange: [1000, 3000],
        itemCount: [2, 4],
        magicItemChance: 0.6,
        emoji: '👑',
        particles: ['💜', '⭐', '🔮', '✨', '💎'],
        auraIntensity: 0.75
    },
    legendary: {
        name: 'Cofre Legendario',
        color: '#F59E0B',      // amber/gold
        colorClass: 'text-yellow-400',
        borderClass: 'border-yellow-500',
        glowColor: 'rgba(245, 158, 11, 0.9)',
        goldRange: [3000, 10000],
        itemCount: [3, 5],
        magicItemChance: 0.85,
        emoji: '🏆',
        particles: ['💛', '🌟', '👑', '💫', '✨', '⚡'],
        auraIntensity: 0.9
    },
    cursed: {
        name: 'Cofre Maldito',
        color: '#DC2626',      // red
        colorClass: 'text-red-500',
        borderClass: 'border-red-600',
        glowColor: 'rgba(220, 38, 38, 0.85)',
        goldRange: [2000, 8000],
        itemCount: [2, 4],
        magicItemChance: 0.7,
        emoji: '💀',
        particles: ['🔥', '💀', '👁️', '⛧', '🩸'],
        auraIntensity: 0.85,
        isCursed: true
    }
};

// Tier order for progression
const TIER_ORDER = ['common', 'rare', 'special', 'epic', 'legendary', 'cursed'];

// ============================================
// PROBABILITY SYSTEM
// ============================================
// Probabilities for each tier (must sum to 100%)
// Common: 40%, Rare: 28%, Special: 17%, Epic: 10%, Legendary: 4%, Cursed: 1%
const TIER_PROBABILITIES = {
    common: 0.40,      // 40%
    rare: 0.28,        // 28%
    special: 0.17,     // 17%
    epic: 0.10,        // 10%
    legendary: 0.04,   // 4%
    cursed: 0.01       // 1%
};

// Cumulative probabilities for roll calculation
const CUMULATIVE_PROBABILITIES = [];
let cumulative = 0;
for (const tier of TIER_ORDER) {
    cumulative += TIER_PROBABILITIES[tier];
    CUMULATIVE_PROBABILITIES.push({ tier, threshold: cumulative });
}

// ============================================
// STATE VARIABLES
// ============================================
let currentChest = null;
let finalTier = null;
let clickCount = 0;
const MAX_CLICKS = 3;
let isAnimating = false;
let generatedLoot = null;

// Progression tiers for each click (reveals progressively)
let clickTiers = [];

/**
 * Roll for final chest tier based on probabilities
 */
function rollFinalTier() {
    const roll = Math.random();
    for (const { tier, threshold } of CUMULATIVE_PROBABILITIES) {
        if (roll < threshold) {
            return tier;
        }
    }
    return 'common'; // Fallback
}

/**
 * Generate the progression path for 3 clicks
 * The chest can upgrade each click, showing anticipation
 */
function generateClickProgression(finalTierName) {
    const finalIndex = TIER_ORDER.indexOf(finalTierName);
    const progression = [];

    // Click 1: Start at common or one tier below final (min: common)
    const startIndex = Math.max(0, finalIndex - 2);
    progression.push(TIER_ORDER[startIndex]);

    // Click 2: May stay same, upgrade once, or upgrade twice (toward final)
    const midIndex = Math.min(finalIndex, Math.max(startIndex, Math.floor((startIndex + finalIndex) / 2) + (Math.random() > 0.5 ? 1 : 0)));
    progression.push(TIER_ORDER[Math.min(midIndex, TIER_ORDER.length - 1)]);

    // Click 3: Final tier
    progression.push(finalTierName);

    return progression;
}

/**
 * Open a loot chest (Gacha style - 3 clicks to reveal)
 * Always uses the probability system - no forced tiers
 */
export function openLootChest() {
    const modal = document.getElementById('loot-chest-modal');
    if (!modal) return;

    // Reset state
    clickCount = 0;
    isAnimating = false;
    generatedLoot = null;

    // Always roll for final tier using probabilities
    finalTier = rollFinalTier();
    currentChest = CHEST_TIERS[finalTier];

    // Generate click progression
    clickTiers = generateClickProgression(finalTier);

    console.log(`🎲 Chest rolled: ${finalTier} | Progression: ${clickTiers.join(' → ')}`);

    // Reset UI
    const title = document.getElementById('chest-title');
    const chestClosed = document.getElementById('chest-closed');
    const chestOpen = document.getElementById('chest-open');
    const lootDisplay = document.getElementById('loot-display');
    const chestGlow = document.getElementById('chest-glow');
    const chestBox = document.getElementById('chest-box');
    const particles = document.getElementById('chest-particles');
    const clickHint = document.getElementById('chest-click-hint');

    // Initial state - show mystery chest
    if (title) {
        title.textContent = '¿QUÉ MISTERIO AGUARDA?';
        title.className = 'text-2xl font-cinzel font-bold mb-4 text-white animate-pulse';
    }

    if (chestClosed) {
        chestClosed.classList.remove('hidden');
        const hintText = chestClosed.querySelector('p');
        if (hintText) {
            hintText.innerHTML = `<span class="text-yellow-400">Toca el cofre</span> (${MAX_CLICKS - clickCount} toques restantes)`;
        }
    }
    if (chestOpen) chestOpen.classList.add('hidden');
    if (lootDisplay) lootDisplay.classList.add('hidden');

    // Start with subtle white glow
    if (chestGlow) {
        chestGlow.style.background = 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)';
        chestGlow.style.opacity = '0.5';
    }

    if (chestBox) {
        chestBox.classList.remove('chest-opening', 'chest-shake');
    }
    if (particles) particles.innerHTML = '';

    modal.classList.remove('hidden');
}

/**
 * Handle chest click - progress through the gacha reveal
 */
window.openChest = async function () {
    if (isAnimating || clickCount >= MAX_CLICKS) return;
    isAnimating = true;

    clickCount++;
    const currentTierName = clickTiers[clickCount - 1];
    const tierData = CHEST_TIERS[currentTierName];

    const chestBox = document.getElementById('chest-box');
    const chestGlow = document.getElementById('chest-glow');
    const particles = document.getElementById('chest-particles');
    const title = document.getElementById('chest-title');
    const chestClosed = document.getElementById('chest-closed');
    const chestOpen = document.getElementById('chest-open');

    // Shake animation
    if (chestBox) {
        chestBox.classList.add('chest-shake');
        await sleep(400);
        chestBox.classList.remove('chest-shake');
    }

    // Update aura to current tier
    if (chestGlow) {
        chestGlow.style.background = `radial-gradient(circle, ${tierData.glowColor} 0%, transparent 70%)`;
        chestGlow.style.opacity = String(tierData.auraIntensity);
        chestGlow.style.transition = 'all 0.5s ease-out';
    }

    // Spawn tier-specific particles
    if (particles) {
        for (let i = 0; i < 8 + clickCount * 4; i++) {
            setTimeout(() => spawnParticle(particles, tierData), i * 60);
        }
    }

    // Update title with current tier preview
    if (title) {
        title.textContent = tierData.name.toUpperCase();
        title.className = `text-2xl font-cinzel font-bold mb-4 ${tierData.colorClass} transition-all duration-500`;

        // Special effects for high tiers
        if (currentTierName === 'legendary') {
            title.classList.add('animate-pulse');
        } else if (currentTierName === 'cursed') {
            title.classList.add('animate-pulse');
            title.style.textShadow = '0 0 20px rgba(220, 38, 38, 0.8)';
        }
    }

    // Update hint text
    if (chestClosed) {
        const hintText = chestClosed.querySelector('p');
        if (hintText) {
            if (clickCount < MAX_CLICKS) {
                hintText.innerHTML = `<span class="text-yellow-400">¡Sigue tocando!</span> (${MAX_CLICKS - clickCount} toques restantes)`;
            } else {
                hintText.innerHTML = '<span class="text-green-400">¡Abriendo cofre!</span>';
            }
        }
    }

    await sleep(300);

    // If final click, open the chest
    if (clickCount >= MAX_CLICKS) {
        await revealFinalChest();
    }

    isAnimating = false;
};

/**
 * Reveal the final chest and show loot
 */
async function revealFinalChest() {
    const chestBox = document.getElementById('chest-box');
    const chestClosed = document.getElementById('chest-closed');
    const chestOpen = document.getElementById('chest-open');
    const chestGlow = document.getElementById('chest-glow');
    const particles = document.getElementById('chest-particles');
    const title = document.getElementById('chest-title');

    // Big opening animation
    if (chestBox) {
        chestBox.classList.add('chest-opening-final');
    }

    // Max glow intensity
    if (chestGlow) {
        chestGlow.style.opacity = '1';
        chestGlow.style.transform = 'scale(1.5)';
    }

    // Explosion of particles
    if (particles) {
        for (let i = 0; i < 25; i++) {
            setTimeout(() => spawnParticle(particles, currentChest, true), i * 40);
        }
    }

    await sleep(600);

    // Switch to open chest
    if (chestClosed) chestClosed.classList.add('hidden');
    if (chestOpen) {
        chestOpen.classList.remove('hidden');
        // Update open chest emoji based on tier
        const sparkle = chestOpen.querySelector('.absolute');
        if (sparkle) {
            sparkle.textContent = currentChest.emoji;
        }
    }

    // Update title to final
    if (title) {
        title.textContent = `¡${currentChest.name.toUpperCase()}!`;
        title.style.textShadow = `0 0 30px ${currentChest.color}`;
    }

    // Generate and display loot
    await sleep(400);
    generateLoot();
    displayLoot();
}

/**
 * Generate random loot based on final chest tier
 */
function generateLoot() {
    const { goldRange, itemCount, magicItemChance, isCursed } = currentChest;

    // Random gold
    const gold = Math.floor(Math.random() * (goldRange[1] - goldRange[0])) + goldRange[0];

    // Random item count
    const numItems = Math.floor(Math.random() * (itemCount[1] - itemCount[0] + 1)) + itemCount[0];

    // Generate items
    const items = [];
    for (let i = 0; i < numItems; i++) {
        if (Math.random() < magicItemChance) {
            // Magic item from Spanish database
            const magicItem = getRandomSpanishItem();
            const item = {
                name: magicItem.name,
                desc: magicItem.desc,
                type: magicItem.type,
                rarity: magicItem.rarity,
                isMagic: true
            };

            // Cursed chests have a chance to curse items
            if (isCursed && Math.random() < 0.3) {
                item.isCursed = true;
                item.name = `${item.name} (Maldito)`;
            }

            items.push(item);
        } else {
            items.push(generateMundaneItem());
        }
    }

    generatedLoot = { gold, items };
}

/**
 * Generate a mundane item
 */
function generateMundaneItem() {
    const mundaneItems = [
        { name: 'Poción de Curación', desc: 'Recupera 2d4+2 HP', type: 'Poción', rarity: 'Común' },
        { name: 'Cuerda de Seda (15m)', desc: 'Resistente y ligera', type: 'Equipo', rarity: 'Común' },
        { name: 'Antorcha x5', desc: 'Ilumina 6m de radio', type: 'Equipo', rarity: 'Común' },
        { name: 'Raciones (7 días)', desc: 'Comida para viajes', type: 'Equipo', rarity: 'Común' },
        { name: 'Kit de Sanador', desc: '10 usos, estabiliza aliados', type: 'Equipo', rarity: 'Común' },
        { name: 'Gema pequeña', desc: 'Vale 50 oro', type: 'Tesoro', rarity: 'Común' },
        { name: 'Poción de Escalada', desc: '+10 a Atletismo por 1 hora', type: 'Poción', rarity: 'Poco Común' },
        { name: 'Aceite de Resbalón', desc: 'Crea superficie resbaladiza', type: 'Consumible', rarity: 'Poco Común' },
        { name: 'Pergamino de Protección', desc: 'Un uso, protege de un tipo', type: 'Pergamino', rarity: 'Poco Común' },
        { name: 'Piedra de Luz', desc: 'Brilla como una antorcha', type: 'Objeto', rarity: 'Poco Común' }
    ];

    return mundaneItems[Math.floor(Math.random() * mundaneItems.length)];
}

/**
 * Display the generated loot
 */
function displayLoot() {
    const lootDisplay = document.getElementById('loot-display');
    const lootItems = document.getElementById('loot-items');
    const lootGold = document.getElementById('loot-gold');
    const lootBorder = document.getElementById('loot-border');
    const lootHeader = document.getElementById('loot-header');

    if (!generatedLoot || !lootDisplay) return;

    // Style based on tier
    if (lootBorder) {
        lootBorder.className = `bg-black/70 border-2 ${currentChest.borderClass} rounded-xl p-4 mb-4 transition-all duration-500`;
        lootBorder.style.boxShadow = `0 0 30px ${currentChest.glowColor}`;
    }
    if (lootHeader) {
        lootHeader.className = `text-lg font-bold mb-3 ${currentChest.colorClass}`;
        lootHeader.innerHTML = `${currentChest.emoji} ¡Contenido del ${currentChest.name}!`;
    }

    // Display gold
    if (lootGold) {
        lootGold.innerHTML = `<i class="fas fa-coins mr-2"></i>+${generatedLoot.gold.toLocaleString()} Oro`;
    }

    // Display items with staggered animation
    if (lootItems) {
        lootItems.innerHTML = '';
        generatedLoot.items.forEach((item, index) => {
            const itemEl = document.createElement('div');

            let bgClass = 'bg-gray-800/50 border-gray-600/30';
            if (item.isCursed) {
                bgClass = 'bg-red-900/40 border-red-500/30';
            } else if (item.isMagic) {
                bgClass = 'bg-purple-900/40 border-purple-500/30';
            }

            itemEl.className = `p-2 rounded-lg ${bgClass} border loot-item-reveal`;
            itemEl.style.animationDelay = `${index * 150}ms`;
            itemEl.style.opacity = '0';

            const rarityColor = getRarityColor(item.rarity);
            const prefix = item.isCursed ? '💀 ' : (item.isMagic ? '✨ ' : '');

            itemEl.innerHTML = `
                <div class="flex justify-between items-start">
                    <span class="font-bold ${item.isCursed ? 'text-red-300' : (item.isMagic ? 'text-purple-300' : 'text-gray-200')}">${prefix}${item.name}</span>
                    <span class="text-xs ${rarityColor}">${item.rarity}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">${item.desc}</p>
            `;

            lootItems.appendChild(itemEl);
        });
    }

    lootDisplay.classList.remove('hidden');

    // Add items to inventory
    generatedLoot.items.forEach(item => {
        playerState.inventory.push({
            name: item.name,
            desc: item.desc,
            type: item.type,
            rarity: item.rarity,
            isCursed: item.isCursed || false
        });
    });

    // Add gold
    playerState.gold = (playerState.gold || 0) + generatedLoot.gold;

    saveGame();
    updateGoldDisplay();

    // Toast notification
    const tierEmoji = currentChest.emoji;
    showToast(`${tierEmoji} ¡${currentChest.name}! +${generatedLoot.gold} oro, +${generatedLoot.items.length} objetos`);
}

/**
 * Get color class for rarity
 */
function getRarityColor(rarity) {
    const colors = {
        'Común': 'text-gray-400',
        'Poco Común': 'text-green-400',
        'Raro': 'text-blue-400',
        'Muy Raro': 'text-purple-400',
        'Legendario': 'text-yellow-400',
        'Artefacto': 'text-red-400'
    };
    return colors[rarity] || 'text-gray-400';
}

/**
 * Spawn a floating particle
 */
function spawnParticle(container, tierData, isExplosion = false) {
    if (!tierData) return;

    const particle = document.createElement('div');
    const emoji = tierData.particles[Math.floor(Math.random() * tierData.particles.length)];

    particle.className = 'particle absolute text-2xl';
    particle.textContent = emoji;

    if (isExplosion) {
        // Explosion pattern - particles go in all directions
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        particle.style.left = `${50 + Math.cos(angle) * 20}%`;
        particle.style.top = '50%';
        particle.style.setProperty('--end-x', `${Math.cos(angle) * distance}px`);
        particle.style.setProperty('--end-y', `${Math.sin(angle) * distance - 50}px`);
    } else {
        particle.style.left = `${50 + (Math.random() - 0.5) * 80}%`;
        particle.style.top = '50%';
    }

    particle.style.animationDuration = `${1 + Math.random() * 0.5}s`;

    container.appendChild(particle);

    setTimeout(() => particle.remove(), 1500);
}

/**
 * Close the loot chest modal
 */
window.closeLootChest = function () {
    const modal = document.getElementById('loot-chest-modal');
    if (modal) modal.classList.add('hidden');

    // Reset all state
    currentChest = null;
    finalTier = null;
    clickCount = 0;
    isAnimating = false;
    generatedLoot = null;
    clickTiers = [];
};

/**
 * Utility sleep function
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Expose the single chest opening function globally
window.openLootChest = openLootChest;

// Export for module usage
export { CHEST_TIERS, TIER_PROBABILITIES };
