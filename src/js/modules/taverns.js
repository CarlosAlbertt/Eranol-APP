import { loadShop } from './navigation.js';
import { initDialogueSystem, startDialogue } from './dialogue.js'; // New Dialogue System
import { openDiceGame } from './diceGame.js'; // Dice Game Logic

export const tavernsData = {
    'grifo-tuerto': {
        name: "El Grifo Tuerto",
        subtitle: "Anillo 1 / Fondo del Mercado",
        desc: "Ruidoso, olor a cerveza rancia y sudor. Serrín manchado de sangre. Ideal para mercenarios y ladrones.",
        icon: "fa-beer",
        theme: "border-red-900/50 bg-red-950/90",
        themeClass: "theme-grifo",
        bgImage: "/img/hub/tavern_low.png",
        npcs: [

            {
                id: 'owner_g',
                name: "Borg",
                role: "Dueño",
                avatar: "/img/npcs/borg.png",
                desc: "Gladiador retirado con una escopeta recortada bajo la barra.",
                type: "owner",
                dialogue: "Si rompes algo, lo pagas. Si te rompen algo, te aguantas. ¿Qué vas a beber?"
            },
            {
                id: 'npc_zora',
                name: "Zora 'La Cicatriz'",
                role: "Mercenaria",
                avatar: "/img/npcs/zora.png",
                desc: "Ex-Capitana de Ignis. Limpia una espada de aspecto vorpal mientras observa la puerta.",
                type: "quest",
                dialogue: "Ignis caerá. Si buscas gloria (o muerte), siéntate."
            },
            {
                id: 'npc_vance',
                name: "'Dedos' Vance",
                role: "Parroquiano",
                avatar: "/img/npcs/vance.png",
                desc: "Juega con una moneda de oro que desaparece y reaparece.",
                type: "info",
                dialogue: "¿Buscas entrar a las alcantarillas? Tengo la llave... por un precio."
            },
            {
                id: 'npc_grumm',
                name: "Grumm",
                role: "Cocinero",
                avatar: "/img/npcs/grumm.png",
                desc: "Huele a azufre y especias picantes. Tiene frascos inestables en el delantal.",
                type: "vendor",
                dialogue: "¡Prueba el estofado! Si sobrevives, te vendo pociones baratas."
            },
            {
                id: 'npc_myla',
                name: "Myla",
                role: "Brujo Loco",
                avatar: "/img/npcs/myla.png",
                desc: "Dibuja mapas de túneles antiguos en la mesa con cerveza. Tiene la mirada perdida.",
                type: "info",
                dialogue: "Las ratas susurran... dicen que el subsuelo va a arder. ¿Lo oyes?"
            },
            {
                id: 'npc_krug',
                name: "Krug",
                role: "Portero Poeta",
                avatar: "/img/npcs/krug.png",
                desc: "Un ogro de 3 metros que recita versos mientras aplasta jarras con la mano.",
                type: "guard",
                dialogue: "La sangre es roja, la espada es gris... paga la ronda o te parto la nariz."
            },
            {
                id: 'npc_silas',
                name: "Silas",
                role: "Falso Cura",
                avatar: "/img/npcs/silas.png",
                desc: "Vende reliquias falsas y perdona pecados por monedas de oro.",
                type: "vendor",
                dialogue: "Por 10 oros los dioses perdonan ese robo. Por 20, perdonan... cosas peores."
            },
            {
                id: 'npc_brunhilda',
                name: "Brunhilda",
                role: "Campeona",
                avatar: "/img/npcs/brunhilda.png",
                desc: "La mujer más fuerte del foso. Exhibe músculos de acero y una sonrisa desafiante.",
                type: "quest",
                dialogue: "¿Crees que tienes brazo? Si me ganas, te respeto. Si pierdes, pagas tú."
            }
        ],
        // Pool for Daily Rotation (d12)
        npcPool: [
            { id: 'pool_1', name: "Myla", role: "Brujo Loco", avatar: "/img/npcs/myla.png", desc: "Dibuja mapas de túneles antiguos en la mesa con cerveza.", dialogue: "¡Las ratas hablan! Dicen que el subsuelo arderá..." },
            { id: 'pool_2', name: "Krug", role: "Portero Poeta", avatar: "/img/npcs/krug.png", desc: "Un ogro que recita versos mientras rompe jarras.", dialogue: "La sangre es roja, la espada es gris... págadme la ronda o os haré trizas. (Rima asonante)." },
            { id: 'pool_3', name: "Sasha", role: "Arquera Tuerta", avatar: "/img/npcs/sasha.png", desc: "Vende flechas mágicas de dudosa procedencia.", dialogue: "Tengo una flecha que persigue al que te debe dinero. ¿Interesa?" },
            { id: 'pool_4', name: "Viejo Rorn", role: "Minero", avatar: "/img/npcs/rorn.png", desc: "Jura haber encontrado una veta de plata en las alcantarillas.", dialogue: "¡Es verdad! ¡Brillaba! Pero las sombras se movían..." },
            { id: 'pool_5', name: "Trixie", role: "Hada en Tarro", avatar: "/img/npcs/trixie.png", desc: "Está atrapada en un tarro de cristal en la barra. Insulta a todos.", dialogue: "¡Sácame de aquí, gigante estúpido! ¡Te daré tres deseos! (Mentira)." },
            { id: 'pool_6', name: "Garra", role: "Tabaxi Yonqui", avatar: "/img/npcs/garra.png", desc: "Tiembla y se rasca. Vende secretos de la guardia.", dialogue: "Tengo... tengo info buena. Cambio de turno... puerta trasera... ¿tienes 'polvo de sueño'?" },
            { id: 'pool_7', name: "Silas", role: "Falso Cura", avatar: "/img/npcs/silas.png", desc: "Vende reliquias falsas y perdona pecados por monedas.", dialogue: "Por 10 oros, los dioses perdonan ese robo. Por 20, perdonan el asesinato." },
            { id: 'pool_8', name: "Brunhilda", role: "Campeona", avatar: "/img/npcs/brunhilda.png", desc: "La mujer más fuerte del foso. Reta a pulsos.", dialogue: "¿Crees que tienes brazo? Si me ganas, te doy mis guanteletes. Si pierdes, pagas la ronda." },
            { id: 'pool_9', name: "El Mudo", role: "Kenku Espía", avatar: "/img/npcs/elmudo.png", desc: "Imita sonidos de monstruos que ha visto recientemente.", dialogue: "*Sonido de una Hidra rugiendo y monedas cayendo*" },
            { id: 'pool_10', name: "Rey Riko", role: "Halfling", avatar: "/img/npcs/reyriko.png", desc: "Dice controlar a todas las ratas de la ciudad.", dialogue: "Mis pequeñas ojos lo ven todo. Cuidado donde pisas." },
            { id: 'pool_11', name: "Vex", role: "Brujo Dracónido", avatar: "/img/npcs/vex.png", desc: "Busca romper su pacto. Vende pergaminos oscuros.", dialogue: "No leas eso en voz alta. A menos que quieras invocar algo que no puedas matar." },
            { id: 'pool_12', name: "La Encapuchada", role: "Drow", avatar: "/img/npcs/encapuchada.png", desc: "Vende veneno drow letal. Muy peligrosa.", dialogue: "Una gota basta para parar un corazón de ogro. 200 oros. Sin preguntas." }
        ],
        zones: [
            {
                id: 'zone_foso',
                name: "Foso de Arena",
                icon: "fa-fist-raised",
                image: "/img/hub/arena_portrait.png",
                desc: "Peleas sin armas letales. Apuestas y gloria.",
                action: "fight"
            },
            {
                id: 'zone_dados',
                name: "Dados de Cráneo",
                icon: "fa-dice",
                desc: "Mesa de juego. Tira 2d6, busca 7 o 12. Cuidado con las trampas.",
                action: "dice_game"
            }
        ],
        food: [
            { name: 'Estofado "Ruleta Rusa"', price: 5, currency: 'mo', type: 'Comida', rarity: 'Común', desc: '1d6: (1-2) Veneno, (3-5) +2d4 HP, (6) +1 STR / -1 INT.' },
            { name: 'Costillar Infernal', price: 2, currency: 'mo', type: 'Comida', rarity: 'Rara', desc: 'Resistencia al Fuego. Eructas llamas (1d6) al recibir daño fuego.' },
            { name: 'Hamburguesa Rompetripas', price: 1, currency: 'mo', type: 'Comida', rarity: 'Poco Común', desc: '+10 HP Temp, pero -10 pies velocidad.' },
            { name: 'Brochetas de Rata', price: 8, currency: 'mo', type: 'Comida', rarity: 'Común', desc: 'Ventaja en salvaciones vs Enfermedad y Veneno.' },
            { name: 'Cecina de Troll', price: 1, currency: 'mo', type: 'Comida', rarity: 'Poco Común', desc: 'Regeneración 1 HP/min fuera de combate (<50% HP).' },
            { name: 'Ojo de Cíclope', price: 2, currency: 'mo', type: 'Comida', rarity: 'Rara', desc: 'Ignoras cobertura media en ataques a distancia.' }
        ],
        drinks: [
            { name: 'Cerveza "Golpe de Ogro"', price: 5, currency: 'mo', type: 'Bebida', rarity: 'Común', desc: 'Ventaja en Fuerza, Desventaja en Inteligencia.' },
            { name: 'Chupito Aliento Dragón', price: 1, currency: 'mo', type: 'Bebida', rarity: 'Rara', desc: 'Acción Bonus: Escupir fuego (Cono 15 pies, 2d6 daño). 1 Uso.' },
            { name: 'Hidromiel "Hacha Doble"', price: 4, currency: 'mo', type: 'Bebida', rarity: 'Común', desc: 'Ventaja contra Miedo, Desventaja en Sigilo.' },
            { name: 'Licor de Seta', price: 1, currency: 'mo', type: 'Bebida', rarity: 'Poco Común', desc: 'Ver lo Invisible, pero Desventaja en ataques a distancia (alucinaciones).' }
        ]
    },
    'el-mudo-reidor': {
        name: "El Mudo Reidor",
        subtitle: "Anillo 2 / Bajos Fondos",
        desc: "Un antro oscuro y ruidoso, donde los secretos se venden más baratos que la cerveza. La clientela es... variopinta.",
        icon: "fa-mask",
        theme: "border-gray-700/50 bg-gray-900/90",
        themeClass: "theme-mudo",
        bgImage: "/img/hub/library.png",
        npcs: [
            {
                id: 'owner_m',
                name: "Silas 'El Mudo'",
                role: "Dueño",
                avatar: "/img/npcs/silas.png",
                desc: "Un kenku que se comunica con sonidos y gestos. Nadie sabe su verdadero nombre.",
                type: "owner",
                dialogue: "*Sonido de monedas cayendo y un gruñido de bienvenida*"
            },
            {
                id: 'npc_whisper',
                name: "Susurros",
                role: "Informante",
                avatar: "/img/npcs/encapuchada.png",
                desc: "Siempre en las sombras, siempre escuchando. Vende rumores y secretos.",
                type: "info",
                dialogue: "Tengo algo que te interesa... si el precio es justo."
            }
        ],
        food: [
            { name: 'Brochetas de Rata', price: 8, currency: 'mo', type: 'Comida', rarity: 'Común', desc: 'Ventaja en salvaciones vs Enfermedad y Veneno.' },
            { name: 'Cecina de Troll', price: 1, currency: 'mo', type: 'Comida', rarity: 'Poco Común', desc: 'Regeneración 1 HP/min fuera de combate (<50% HP).' },
            { name: 'Ojo de Cíclope', price: 2, currency: 'mo', type: 'Comida', rarity: 'Rara', desc: 'Ignoras cobertura media en ataques a distancia.' }
        ],
        drinks: [
            { name: "Cerveza Aguada", price: 2, currency: "mo", type: "Bebida", desc: "Sabe a desesperación." },
            { name: "Licor de Papa", price: 5, currency: "mo", type: "Bebida", desc: "Quema la garganta." }
        ],
        weirdItems: [
            { name: "Ojo Encurtido", price: 15, currency: "mo", type: "Reliquia Comestible", desc: "Te mira mientras lo comes." },
            { name: "Licor de Cloaca", price: 8, currency: "mo", type: "Peligro Biológico", desc: "Brilla en la oscuridad. Probablemente radioactivo." },
            { name: "Pan Mohoso Ancestral", price: 4, currency: "mo", type: "Alucinógeno", desc: "Dicen que si lo comes ves a tus antepasados." },
            { name: "Dedos de Goblin Fritos", price: 12, currency: "mo", type: "Snack", desc: "Muy crujientes. Aún tienen las uñas." }
        ],
        features: ["Tratos turbios", "Peleas frecuentes", "Comida cuestionable"]
    },
    'caliz-mana': {
        name: "El Cáliz de Maná",
        subtitle: "Zona Alta / VIP",
        desc: "Iluminación mágica suave, música de arpa automática, camareros invisibles.",
        icon: "fa-wine-glass-alt",
        theme: "border-purple-500/50 bg-purple-900/90",
        themeClass: "theme-caliz",
        bgImage: "img/hub/tavern_high.png",
        npcs: [
            {
                id: 'owner_c',
                name: "Lady Elara",
                role: "Dueña",
                avatar: "/img/npcs/sasha.png",
                desc: "Una elfa de alta cuna que gestiona el local con magia.",
                type: "owner",
                dialogue: "Bienvenido al Cáliz. Por favor, no molestes a la clientela selecta."
            },
            {
                id: 'npc_3',
                name: "Vizconde Pompous",
                role: "Noble",
                avatar: "/img/npcs/borg.png",
                desc: "Observa a todos con desdén a través de un monóculo.",
                type: "quest",
                dialogue: "¡Tú! Pareces... útil. He perdido mi broche en las alcantarillas. Recupéralo."
            }
        ],
        food: [
            { name: 'Filete de Hidra Regenerativo', price: 120, currency: 'gp', type: 'Comida', rarity: 'Rara', desc: 'Recuperas 1 HP cada 10 min durante 4 horas.', image: '' },
            { name: 'Ensalada de Flor de Cristal', price: 45, currency: 'gp', type: 'Comida', rarity: 'Poco Común', desc: 'Elimina ceguera o sordera.', image: '' },
            { name: 'Carpaccio de Kraken', price: 80, currency: 'gp', type: 'Comida', rarity: 'Muy Rara', desc: 'Respirar bajo el agua por 1 hora.', image: '' }
        ],
        drinks: [
            { name: 'Vino "Lágrima Lunar"', price: 50, currency: 'gp', type: 'Bebida', rarity: 'Rara', desc: 'Elimina 1 nivel de Agotamiento al instante.', image: '' },
            { name: 'Cóctel "Esencia de Maná"', price: 40, currency: 'gp', type: 'Bebida', rarity: 'Poco Común', desc: 'Recuperas un espacio de conjuro Nivel 1 (1/día).', image: '' },
            { name: 'Whisky "Tiempo Perdido"', price: 200, currency: 'gp', type: 'Bebida', rarity: 'Muy Rara', desc: 'Un trago cuenta como Descanso Corto (1/semana).', image: '' }
        ]
    }
};

// -- LOGIC --

export function enterTavern(tavernId) {
    const data = tavernsData[tavernId];
    if (!data) return;

    // Reuse landing screen or create a specific Tavern Lobby View?
    // We'll use a dynamic "District Selection View" container for the Lobby
    // preventing the need for new DOM elements.

    // 1. Hide Other Views
    const cityIndex = document.getElementById('city-index-view');
    if (cityIndex) cityIndex.classList.add('hidden');

    // Initialize Dialogue System (creates modal if missing)
    initDialogueSystem();

    const appScreen = document.getElementById('app');
    if (appScreen) {
        appScreen.classList.remove('hidden');
        appScreen.classList.add('animate-fade-in');
        // Apply Theme Class
        appScreen.className = `relative z-10 flex flex-col md:flex-row h-full transition-colors duration-500 ${data.themeClass || 'theme-black-market'}`;
    }

    // Ensure Sidebar is HUB (Profile) not Shop List
    if (document.getElementById('hub-sidebar')) document.getElementById('hub-sidebar').classList.remove('hidden');
    if (document.getElementById('ring-sidebar')) document.getElementById('ring-sidebar').classList.add('hidden');

    // 2. Setup Tavern Lobby UI (reusing district-selection-view container properties if possible, or shop container)
    // We will render a custom "Lobby" inside the 'app' container directly or reuse 'district-selection-view'
    const container = document.getElementById('district-cards-container'); // Reusing the grid container for NPCs?
    // Better: Render a custom layout into 'inventory-grid' parent or a new specific area.

    // Let's use the standard SHOP layout but populated with NPC Cards instead of Items initially.

    // UPDATE HEADER
    const title = document.getElementById('shop-title');
    const desc = document.getElementById('shop-desc');
    const icon = document.getElementById('shop-icon');

    if (title) title.innerText = data.name;
    if (desc) desc.innerText = data.desc;
    if (icon) icon.innerHTML = `<i class="fas ${data.icon}"></i>`;

    // SHOW BACK BUTTON (To Hub)
    const marketControls = document.getElementById('market-controls');
    if (marketControls) marketControls.classList.remove('hidden');

    const backBtn = document.getElementById('btn-back-to-hub');
    if (backBtn) {
        backBtn.classList.remove('hidden');
        backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Salir al Hub';
        backBtn.onclick = () => window.enterCityIndex();
    }

    // HIDE INVENTORY GRID TEMPORARILY (We show NPC Lobby first)
    // Actually, let's use the 'inventory-grid' to show the NPCs as "Cards" you can click to interact.
    const grid = document.getElementById('inventory-grid');
    if (grid) {
        grid.classList.remove('hidden');
        grid.style.display = 'grid'; // FORCE GRID LAYOUT
        grid.innerHTML = ''; // Clear items

        // Render NPCs
        // Render NPCs
        // Check if we already selected daily NPCs for this session (Hourly Rotation)
        let displayNPCs = [...(data.npcs || [])];

        if (data.npcPool) {
            const ONE_HOUR = 60 * 60 * 1000;
            const lastRotation = localStorage.getItem('tavern_last_rotation_ts');
            const now = Date.now();
            let selectedPoolNPCs = [];

            if (!lastRotation || (now - parseInt(lastRotation)) > ONE_HOUR) {
                // New Rotation
                const pool = [...data.npcPool];
                selectedPoolNPCs = [];
                for (let i = 0; i < 3; i++) {
                    if (pool.length === 0) break;
                    const idx = Math.floor(Math.random() * pool.length);
                    selectedPoolNPCs.push(pool[idx]);
                    pool.splice(idx, 1);
                }
                // Save
                localStorage.setItem('tavern_last_rotation_ts', now.toString());
                localStorage.setItem('tavern_daily_npcs', JSON.stringify(selectedPoolNPCs));
            } else {
                // Load from Cache
                try {
                    selectedPoolNPCs = JSON.parse(localStorage.getItem('tavern_daily_npcs') || '[]');
                    // Validate if they still strictly match the current pool data (optional, but good practice)
                } catch (e) {
                    selectedPoolNPCs = [];
                }
            }

            displayNPCs = [...displayNPCs, ...selectedPoolNPCs];
        }

        if (displayNPCs.length > 0) {
            displayNPCs.forEach(npc => {
                const card = document.createElement('div');
                card.className = "glass-panel p-6 rounded-xl border border-white/10 flex flex-col items-center text-center hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden";

                const avatarHtml = npc.avatar
                    ? `<div class="w-24 h-24 rounded-full bg-cover bg-center mb-4 border-2 border-white/20 group-hover:border-white/50 transition-all shadow-lg" style="background-image: url('${npc.avatar}')"></div>`
                    : `<div class="w-24 h-24 rounded-full bg-gray-700 mb-4 flex items-center justify-center border-2 border-white/20"><i class="fas fa-user text-3xl text-gray-400"></i></div>`;

                // Only show role for Owner
                const roleBadge = npc.type === 'owner'
                    ? `<div class="mb-1"><span class="text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded bg-black/40 text-amber-500 border border-amber-500/20">${npc.role}</span></div>`
                    : `<div class="mb-1 h-6"></div>`; // Spacer to keep alignment or just empty

                card.innerHTML = `
                    ${avatarHtml}
                    ${roleBadge}
                    <h3 class="font-cinzel text-xl font-bold text-white group-hover:text-amber-300 transition-colors">${npc.name}</h3>
                    <p class="text-xs text-gray-400 mt-2 line-clamp-2">${npc.desc}</p>
                    <div class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                        <span class="text-xs uppercase tracking-widest border-b border-white/20 pb-1">Hablar</span>
                    </div>
                `;
                card.onclick = () => interactWithNPC(npc, tavernId);
                grid.appendChild(card);
            });
        }

        // Render Zones (Minigames/Areas)
        if (data.zones) {
            data.zones.forEach(zone => {
                const card = document.createElement('div');
                card.className = "glass-panel p-6 rounded-xl border border-white/5 bg-white/5 flex flex-col items-center text-center hover:bg-white/10 transition-all cursor-pointer group relative overflow-hidden hover:border-amber-500/30";

                let iconHtml;
                if (zone.image) {
                    iconHtml = `<div class="w-24 h-24 rounded-full bg-cover bg-center mb-4 border-2 border-white/20 group-hover:border-amber-500/50 transition-all shadow-lg" style="background-image: url('${zone.image}')"></div>`;
                } else {
                    iconHtml = `
                    <div class="w-16 h-16 rounded-full bg-black/40 mb-4 flex items-center justify-center border border-white/10 group-hover:border-amber-500/50 transition-colors">
                        <i class="fas ${zone.icon} text-2xl text-gray-400 group-hover:text-amber-400"></i>
                    </div>`;
                }

                card.innerHTML = `
                    ${iconHtml}
                    <h3 class="font-cinzel text-lg font-bold text-gray-200 group-hover:text-white transition-colors">${zone.name}</h3>
                    <p class="text-xs text-gray-500 mt-2 line-clamp-3">${zone.desc}</p>
                    <div class="absolute inset-0 border-2 border-amber-500/0 group-hover:border-amber-500/20 rounded-xl transition-all"></div>
                `;
                card.onclick = () => handleZoneInteraction(zone, tavernId);
                grid.appendChild(card);
            });
        }
    }

    // Hide extra UI
    if (document.getElementById('district-selection-view')) document.getElementById('district-selection-view').classList.add('hidden');
    if (document.getElementById('casino-view')) document.getElementById('casino-view').classList.add('hidden');
    // Ensure Arena view is hidden
    if (document.getElementById('arena-view')) document.getElementById('arena-view').classList.add('hidden');
}

// Interaction Logic
function interactWithNPC(npc, tavernId) {
    console.log("Interacting with NPC:", npc.name);

    // Use new Dialogue System for everyone
    startDialogue(npc.id, npc);
}

function openTavernMenu(tavernIdOrData) {
    let data;
    if (typeof tavernIdOrData === 'string') {
        data = tavernsData[tavernIdOrData];
    } else {
        data = tavernIdOrData;
    }

    if (!data) {
        console.error("No tavern data found for menu:", tavernIdOrData);
        return;
    }

    // CREATE AD-HOC SHOP OBJECT
    // We map food/drinks to the "Items" structure expected by loadShop logic (games.js/cart.js)
    // Note: creating a clean list. Rarity needed for colors.

    const shopItems = [...(data.food || []), ...(data.drinks || []), ...(data.weirdItems || [])];

    const virtualShop = {
        name: `${data.name} - Carta`,
        description: data.shopDescription || "Pide lo que quieras. Paga por adelantado.",
        icon: data.icon,
        ring: 99, // Special ID
        themeClass: data.themeClass || 'theme-black-market',
        image: data.bgImage,
        items: shopItems
    };

    // Use global loadShop mechanism if possible, OR custom render.
    // Since loadShop relies on 'state.activeShops' index, we might need a direct render function 
    // or push this virtual shop to state.

    // Determine pure ID for back navigation
    const tavernId = (typeof tavernIdOrData === 'string') ? tavernIdOrData : 'grifo-tuerto'; // Default fallback if object passed without ID

    // Custom Render to avoid messing with global shop index state too much
    renderTavernShopUI(virtualShop, tavernId);
}

function renderTavernShopUI(shop, tavernId) {
    const grid = document.getElementById('inventory-grid');
    if (!grid) return;

    // Force Grid visibility
    grid.classList.remove('hidden');
    grid.style.display = 'grid';

    // Clear NPC view
    grid.innerHTML = '';

    // Update Header
    document.getElementById('shop-title').innerText = shop.name;
    document.getElementById('shop-desc').innerText = shop.description;

    const backBtn = document.getElementById('btn-back-to-hub');
    if (backBtn) {
        backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Volver a la Sala';
        backBtn.onclick = () => enterTavern(tavernId); // Return to NPC view
    }

    // Render Items
    shop.items.forEach((item, i) => {
        // Logic copied/adapted from loadShop to maintain style
        // We assume item price is just a number in Shops, but here taberns had '2 sp'. 
        // We normalized data above to number + currency field.

        const card = document.createElement('div');
        card.className = `glass-panel p-5 rounded-xl border-t border-white/10 relative overflow-hidden item-card group animate-fade-in`;

        // Simple color mapping
        const color = item.type === 'Comida' ? '#f59e0b' : '#3b82f6'; // Amber / Blue

        card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-black/40 text-gray-400 border border-white/5">${item.type}</span>
                <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded" style="color: ${color}; border: 1px solid ${color}40">${item.currency.toUpperCase()}</span>
            </div>
            <h3 class="font-cinzel text-lg font-bold text-white mb-1 group-hover:brightness-125 transition-all leading-tight">${item.name}</h3>
            <div class="flex items-baseline gap-1 mb-3">
                <span class="text-yellow-400 font-mono font-bold">${item.price} ${item.currency}</span>
            </div>
            <p class="text-sm text-gray-400 leading-relaxed border-t border-white/10 pt-2 group-hover:text-gray-300 line-clamp-3">${item.desc}</p>
            <button class="w-full mt-4 py-2 rounded border border-white/20 hover:bg-white/10 text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group-hover:bg-amber-900/50">
                <i class="fas fa-utensils"></i> Pedir
            </button>
        `;

        // Confirm Purchase Modal Interaction
        card.querySelector('button').onclick = () => {
            confirmPurchase(item);
        };

        grid.appendChild(card);
    });
}

// Compat for import errors
export function closeTavern() {
    console.warn("closeTavern is deprecated. Using enterCityIndex.");
    window.enterCityIndex();
}

import { initArena, enterArena } from './arena.js';

// Expose
window.enterTavern = enterTavern;
window.closeTavern = closeTavern;
// Zone Logic
function handleZoneInteraction(zone, tavernId) {
    if (zone.action === 'fight') {
        // Initialize Arena if not done (lazy check or rely on main init)
        if (typeof window.startArenaMode === 'undefined') initArena();
        if (typeof window.startArenaMode === 'undefined') initArena();
        enterArena();
    } else if (zone.action === 'dice_game') {
        openDiceGame();
    } else if (zone.action === 'fight') {
        alert("🥊 Entras al foso. Un orco te mira mal. Tiras iniciativa... (Sistema de combate pendiente)");
    } else if (zone.action === 'view_board') {
        alert("📜 Lees la lista: 'Se busca a El Rata por 50gp'. 'Recompensa por cabeza de Goblin'.");
    } else if (zone.action === 'rest') {
        const confirm = window.confirm("¿Dormir en El Palomar por 2sp? (Recuperas Salud, riesgo de robo)");
        if (confirm) alert("Te despiertas con dolor de espalda, pero vivo.");
    } else {
        alert(`Te acercas a: ${zone.name}`);
    }
}

// Expose
window.enterTavern = enterTavern;
window.closeTavern = closeTavern;
window.interactWithNPC = interactWithNPC;
window.handleZoneInteraction = handleZoneInteraction;
window.openTavernMenu = openTavernMenu;
// Confirm Purchase Logic
function confirmPurchase(item) {
    // 1. Ensure Modal Exists
    if (!document.getElementById('purchase-modal')) {
        const modalHtml = `
            <div id="purchase-modal" class="hidden fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fade-in">
                <div class="glass-panel p-8 rounded-2xl border border-amber-500/30 max-w-md w-full text-center relative shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                    <h3 class="text-2xl font-cinzel font-bold text-white mb-2">Confirmar Compra</h3>
                    
                    <div class="my-6 py-6 border-y border-white/10 bg-white/5 rounded-lg">
                        <h4 id="purchase-item-name" class="text-xl font-bold text-amber-400 mb-1">Nombre Item</h4>
                        <p id="purchase-item-price" class="text-sm font-mono text-gray-400">0 mo</p>
                        <p id="purchase-item-desc" class="text-xs text-gray-500 mt-2 px-4 italic">...</p>
                    </div>

                    <div class="flex gap-4">
                        <button onclick="document.getElementById('purchase-modal').classList.add('hidden')" 
                            class="flex-1 py-3 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold uppercase tracking-wider transition-colors">
                            Cancelar
                        </button>
                        <button id="btn-confirm-purchase" 
                            class="flex-1 py-3 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold uppercase tracking-wider shadow-lg hover:shadow-amber-500/20 transition-all">
                            Comprar
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    // 2. Populate Data
    const modal = document.getElementById('purchase-modal');
    document.getElementById('purchase-item-name').innerText = item.name;
    document.getElementById('purchase-item-price').innerText = `${item.price} ${item.currency}`;
    document.getElementById('purchase-item-desc').innerText = item.desc;

    // 3. Bind Confirm Action (with Closure for Item Effects)
    document.getElementById('btn-confirm-purchase').onclick = () => {
        modal.classList.add('hidden');
        executePurchaseEffect(item);
    };

    // 4. Show
    modal.classList.remove('hidden');
}

function executePurchaseEffect(item) {
    // Visual Effects Map
    const effects = {
        "Ojo Encurtido": () => {
            document.body.style.filter = "sepia(100%) invert(100%)";
            showToast("👁️ ¡El ojo estalla! Todo se ve extraño...");
            setTimeout(() => document.body.style.filter = "", 5000);
        },
        "Licor de Cloaca": () => {
            document.body.style.filter = "blur(4px)";
            showToast("🤢 ¡Puaj! Sientes arcadas radioactivas.");
            setTimeout(() => document.body.style.filter = "", 5000);
        },
        "Pan Mohoso Ancestral": () => {
            const style = document.createElement('style');
            style.innerHTML = `@keyframes hue-rotate { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }`;
            document.head.appendChild(style);
            document.body.style.animation = "hue-rotate 0.5s infinite linear";
            showToast("🍄 ¡COLORES! ¡VEO EL TIEMPO!");
            setTimeout(() => {
                document.body.style.animation = "";
                style.remove();
            }, 5000);
        },
        "Dedos de Goblin Fritos": () => {
            showToast("🥨 *Crunch* *Crunch*... Sabor a victoria.");
        }
    };

    if (effects[item.name]) {
        effects[item.name]();
    } else {
        // Default Success
        if (window.showToast) window.showToast(`Has comprado: ${item.name}`);
        else alert(`Has comprado: ${item.name}`);
    }
}

// Ensure showToast exists or polyfill
if (!window.showToast) {
    window.showToast = (msg) => {
        const toast = document.createElement('div');
        toast.className = "fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white px-6 py-3 rounded-full shadow-2xl z-[200] animate-fade-in-up font-bold";
        toast.innerText = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}
