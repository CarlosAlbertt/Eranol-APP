/**
 * D&D 5e API Service
 * API: https://www.dnd5eapi.co/
 * 
 * Provides functions to fetch random magic items, monsters, spells, etc.
 * for use in the Deck of Many Things and other game features.
 */

const DND_API_BASE = 'https://www.dnd5eapi.co/api';

// Cache for API responses to reduce requests
const apiCache = {
    magicItems: null,
    monsters: null,
    spells: null,
    equipment: null
};

/**
 * Fetch all items from an endpoint and cache them
 */
async function fetchAndCache(endpoint, cacheKey) {
    if (apiCache[cacheKey]) {
        return apiCache[cacheKey];
    }

    try {
        const response = await fetch(`${DND_API_BASE}/${endpoint}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        const data = await response.json();
        apiCache[cacheKey] = data.results || [];
        return apiCache[cacheKey];
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return [];
    }
}

/**
 * Get details for a specific item
 */
async function fetchDetails(url) {
    try {
        const response = await fetch(`https://www.dnd5eapi.co${url}`);
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching details:', error);
        return null;
    }
}

/**
 * Get a random magic item
 */
export async function getRandomMagicItem() {
    const items = await fetchAndCache('magic-items', 'magicItems');
    if (items.length === 0) {
        return {
            name: "Objeto Mágico Misterioso",
            desc: ["Un objeto de poder desconocido."],
            rarity: { name: "Unknown" }
        };
    }

    const randomItem = items[Math.floor(Math.random() * items.length)];
    const details = await fetchDetails(randomItem.url);

    return details || {
        name: randomItem.name,
        desc: ["Un objeto mágico poderoso."],
        rarity: { name: "Varies" }
    };
}

/**
 * Get a random monster by challenge rating range
 */
export async function getRandomMonster(minCR = 0, maxCR = 30) {
    const monsters = await fetchAndCache('monsters', 'monsters');
    if (monsters.length === 0) {
        return {
            name: "Criatura Misteriosa",
            challenge_rating: 1,
            type: "unknown",
            hit_points: 10
        };
    }

    // Fetch a few random monsters and filter by CR
    const randomMonster = monsters[Math.floor(Math.random() * monsters.length)];
    const details = await fetchDetails(randomMonster.url);

    if (details && details.challenge_rating >= minCR && details.challenge_rating <= maxCR) {
        return details;
    }

    return details || {
        name: randomMonster.name,
        challenge_rating: 1,
        type: "beast",
        hit_points: 20
    };
}

/**
 * Get a random spell by level range
 */
export async function getRandomSpell(minLevel = 0, maxLevel = 9) {
    const spells = await fetchAndCache('spells', 'spells');
    if (spells.length === 0) {
        return {
            name: "Hechizo Arcano",
            level: 1,
            school: { name: "Evocation" },
            desc: ["Un hechizo de poder misterioso."]
        };
    }

    const randomSpell = spells[Math.floor(Math.random() * spells.length)];
    const details = await fetchDetails(randomSpell.url);

    if (details && details.level >= minLevel && details.level <= maxLevel) {
        return details;
    }

    return details || {
        name: randomSpell.name,
        level: 1,
        school: { name: "Unknown" },
        desc: ["Un hechizo antiguo."]
    };
}

/**
 * Get random equipment (weapons, armor, etc.)
 */
export async function getRandomEquipment() {
    const equipment = await fetchAndCache('equipment', 'equipment');
    if (equipment.length === 0) {
        return {
            name: "Equipo Aventurero",
            equipment_category: { name: "Adventuring Gear" },
            cost: { quantity: 10, unit: "gp" }
        };
    }

    const randomEquipment = equipment[Math.floor(Math.random() * equipment.length)];
    const details = await fetchDetails(randomEquipment.url);

    return details || {
        name: randomEquipment.name,
        equipment_category: { name: "Gear" },
        cost: { quantity: 5, unit: "gp" }
    };
}

/**
 * Generate a complete random encounter
 */
export async function generateRandomEncounter(difficulty = 'medium') {
    const crRanges = {
        easy: { min: 0, max: 2 },
        medium: { min: 1, max: 5 },
        hard: { min: 3, max: 10 },
        deadly: { min: 5, max: 20 }
    };

    const range = crRanges[difficulty] || crRanges.medium;
    const monster = await getRandomMonster(range.min, range.max);

    // Generate number of monsters based on CR
    const count = monster.challenge_rating <= 1 ? Math.floor(Math.random() * 4) + 1 : 1;

    return {
        monster,
        count,
        difficulty,
        xpReward: (monster.xp || 100) * count
    };
}

/**
 * Generate a treasure hoard with random magic items
 */
export async function generateTreasureHoard(tier = 1) {
    const goldMultipliers = [100, 500, 2000, 10000]; // By tier
    const itemCounts = [1, 2, 3, 4]; // Magic items by tier

    const gold = Math.floor(Math.random() * goldMultipliers[tier - 1]) + goldMultipliers[tier - 1];
    const numItems = Math.floor(Math.random() * itemCounts[tier - 1]) + 1;

    const items = [];
    for (let i = 0; i < numItems; i++) {
        const item = await getRandomMagicItem();
        items.push(item);
    }

    return {
        gold,
        items,
        tier
    };
}

/**
 * Get a random creature type for visual effects
 */
export function getRandomCreatureType() {
    const types = [
        'aberration', 'beast', 'celestial', 'construct', 'dragon',
        'elemental', 'fey', 'fiend', 'giant', 'humanoid',
        'monstrosity', 'ooze', 'plant', 'undead'
    ];
    return types[Math.floor(Math.random() * types.length)];
}

/**
 * Translate rarity to Spanish
 */
export function translateRarity(rarity) {
    const translations = {
        'Common': 'Común',
        'Uncommon': 'Poco Común',
        'Rare': 'Raro',
        'Very Rare': 'Muy Raro',
        'Legendary': 'Legendario',
        'Artifact': 'Artefacto',
        'Varies': 'Variable',
        'Unknown': 'Desconocido'
    };
    return translations[rarity] || rarity;
}

/**
 * Translate monster type to Spanish
 */
export function translateMonsterType(type) {
    const translations = {
        'aberration': 'Aberración',
        'beast': 'Bestia',
        'celestial': 'Celestial',
        'construct': 'Constructo',
        'dragon': 'Dragón',
        'elemental': 'Elemental',
        'fey': 'Feérico',
        'fiend': 'Demonio',
        'giant': 'Gigante',
        'humanoid': 'Humanoide',
        'monstrosity': 'Monstruosidad',
        'ooze': 'Cieno',
        'plant': 'Planta',
        'undead': 'No-muerto'
    };
    return translations[type] || type;
}

// Expose to window for use in other modules
window.dndAPI = {
    getRandomMagicItem,
    getRandomMonster,
    getRandomSpell,
    getRandomEquipment,
    generateRandomEncounter,
    generateTreasureHoard,
    translateRarity,
    translateMonsterType
};

export default {
    getRandomMagicItem,
    getRandomMonster,
    getRandomSpell,
    getRandomEquipment,
    generateRandomEncounter,
    generateTreasureHoard,
    translateRarity,
    translateMonsterType
};
