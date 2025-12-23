import { state } from '../../state.js';


/*
    DIALOGUE MODULE
    Handles NPC conversations, skill checks, and detailed interactions.
*/

// --- STATE ---
let currentNpcId = null;

// --- DATA: DIALOGUE TREES ---
// Hardcoded here for now, could be moved to src/js/data/dialogues.js later
const dialogueData = {
    // 1. BORG (Dueño)
    'owner_g': {
        name: "Borg",
        role: "Dueño del Grifo",
        avatar: "/img/npcs/borg.png",
        greeting: "Borg deja un vaso sucio sobre la barra con un golpe seco. Su único ojo te escanea buscando problemas. 'Si vas a potar, hazlo fuera. ¿Qué quieres?'",
        options: [
            {
                label: "🍺 [Comercio] ¡Ponme una ronda!",
                type: "shop",
                action: "openShop"
            },
            {
                label: "🤝 [Amistoso] (Persuasión CD 12) Buen local. Debiste ser un grande en la Arena.",
                check: { skill: "Persuasión", dc: 12 },
                success: "Borg sonríe, mostrando dientes de oro. '¡JA! El mejor. Aplasté tres cabezas de ogro en una tarde. La clave es el equilibrio... y golpear primero. Toma, la primera invita la casa.' (Ganas una Cerveza)",
                failure: "Borg gruñe. 'No me hagas la pelota. Cómprame algo o lárgate.'"
            },
            {
                label: "🧐 [Investigar] (Investigación CD 14) ¿Quién es esa tal Zora?",
                check: { skill: "Investigación", dc: 14 },
                success: "Baja la voz. 'Zora... es peligrosa. Ex-Ignis. Busca algo o a alguien. Si yo fuera tú, no la molestaría a menos que tengas oro o una sentencia de muerte.'",
                failure: "Te mira con desconfianza. 'Es una clienta. Yo no vendo información, vendo alcohol. Calla y bebe.'"
            },
            {
                label: "😡 [Amenaza] (Intimidación CD 18) Dame lo mejor que tengas, gratis. Ahora.",
                check: { skill: "Intimidación", dc: 18 },
                success: "Borg se tensa, luego suelta una carcajada. '¡HUEVOS! Me gustas. Tienes agallas. Toma este 'Matarratas', invita la casa. Pero no lo vuelvas a hacer.'",
                failure: "En un parpadeo, Borg saca una escopeta recortada y te apunta a la nariz. '¿Decías? Fuera de mi vista antes de que decore la pared con tus sesos.'",
                onFailure: "fight"
            }
        ]
    },

    // 2. ZORA (Mercenaria)
    'npc_zora': {
        name: "Zora 'La Cicatriz'",
        role: "Veterana de Ignis",
        avatar: "/img/npcs/zora.png",
        greeting: "Zora no levanta la vista de su espada. Pasa el trapo lentamente por el filo mellao. 'Si buscas compañía, te has equivocado de mesa. Si buscas sangre, espera tu turno.'",
        options: [
            {
                label: "❓ [Pregunta] (Historia CD 13) Esa espada es de oficial de Ignis...",
                check: { skill: "Historia", dc: 13 },
                success: "Se detiene. Te mira a los ojos. 'Observador. Sí. Era de mi capitán. Murió gritando órdenes que nadie escuchó. Ahora corto cabezas por dinero, no por banderas.'",
                failure: "Te ignora. 'Es una espada. Corta. Eso es todo lo que necesitas saber.'"
            },
            {
                label: "🤝 [Amistoso] (Persuasión CD 15) Invitar a un trago.",
                check: { skill: "Persuasión", dc: 15 },
                success: "Acepta la jarra. 'Gracias. Pocos se atreven a acercarse. Dicen que traigo mala suerte. Tal vez tengan razón... o tal vez soy la única que sobrevive.'",
                failure: "Empuja la jarra lejos. 'No bebo con desconocidos. Se pierde el pulso.'"
            },
            {
                label: "⚔️ [Duelo] (Atletismo CD 16) Apuesto a que soy más rápido que tú.",
                check: { skill: "Atletismo", dc: 16 },
                success: "Se ríe y en un borrón su daga está clavada entre tus dedos en la mesa. 'Rápido. Pero ruidoso. Me caes bien, chico. Ten cuidado en el Foso.'",
                failure: "Ni la ves moverse. Tienes su hoja en tu garganta. 'Muerto. Estarías muerto. Lárgate.'",
                onFailure: "fight"
            }
        ]
    },

    // 3. VANCE (Ladrón)
    'npc_vance': {
        name: "'Dedos' Vance",
        role: "Informante",
        avatar: "/img/npcs/vance.png",
        greeting: "La moneda baila entre sus nudillos. Ahora la ves, ahora no. Vance te guiña un ojo. '¿Negocios o placer? Aunque aquí, suelen ser lo mismo...'",
        options: [
            {
                label: "🧐 [Dudoso] (Juego de Manos CD 14) ¿Dónde está la moneda?",
                check: { skill: "Juego de Manos", dc: 14 },
                success: "Atrapas su mano en el aire revelando la moneda en su manga. Vance silba impresionado. '¡Vaya! Ojos de halcón. Vale, hablemos. Sé cosas sobre las alcantarillas...'",
                failure: "Señala tu oreja y saca la moneda de ahí. 'Lento. Demasiado lento. ¿Te falta oro, amigo?'"
            },
            {
                label: "🔎 [Investigar] (Investigación CD 12) Busco rumores del Mercado Negro.",
                check: { skill: "Investigación", dc: 12 },
                success: "'Shhh... no tan alto. Busca la puerta marcada con el Ojo Azul, tras la medianoche. Di que Vance te envía... si quieres un descuento.'",
                failure: "'¿Mercado Negro? No sé de qué hablas. Aquí somos ciudadanos honrados.' (Se ríe)"
            },
            {
                label: "😡 [Acusación] (Intimidación CD 15) ¡Devuélveme la bolsa!",
                check: { skill: "Intimidación", dc: 15 },
                success: "Levanta las manos. '¡Hey, hey! Era una broma. Tienes mal genio. Toma, y esta gema extra por las molestias.'",
                failure: "'Yo no tengo nada...' ¡POOF! Desaparece en una bomba de humo y reaparece en la otra punta de la barra saludándote."
            }
        ]
    },

    // 4. GRUMM (Cocinero)
    'npc_grumm': {
        name: "Grumm",
        role: "Chef Alquimista",
        avatar: "img/npcs/grumm.png",
        greeting: "Grumm revuelve una olla que burbujea color verde. Huele a podrido y a... ¿canela? '¡NO TOCAR! ¡Explota! Digo... ¡Se cocina!'",
        options: [
            {
                label: "🤮 [Pregunta] (Naturaleza CD 12) ¿Qué demonios es eso?",
                check: { skill: "Naturaleza", dc: 12 },
                success: "'Es... rata de alcantarilla fermentada con setas luminiscentes. ¡Da visión en la oscuridad! O diarrea. ¡Prueba!'",
                failure: "'¡Es *Gourmet*! ¡Mousse de Otyugh! ¡Ignorante!'"
            },
            {
                label: "🤝 [Amistoso] (Engaño CD 14) Huele... delicioso.",
                check: { skill: "Engaño", dc: 14 },
                success: "Grumm llora de alegría. '¡Alguien me entiende! ¡Toma! ¡La mejor parte!' Te da un cucharón de lodo verde. (Es tóxico, pero él está feliz).",
                failure: "Te huele. 'Mientes. Tienes cara de asco. ¡Fuera de mi cocina!'"
            },
            {
                label: "🧪 [Comercio] ¿Vendes algo que no mate?",
                type: "shop",
                action: "openShop" // Could open specific food menu
            }
        ]
    },

    // 5. SILAS "EL MUDO" (Dueño Mudo Reidor)
    'owner_m': {
        name: "Silas 'El Mudo'",
        role: "Dueño Kenku",
        avatar: "img/npcs/silas_mudo.png",
        greeting: "*Silas te mira con ojos de cuervo. Hace un gesto de beber y señala un cartel tosco que dice 'ORO = TRAGO'. Luego imita el sonido de una bolsa de monedas cayendo.*",
        options: [
            {
                label: "🍺 [Comercio] Quiero ver qué vendes en este agujero.",
                type: "shop",
                action: "openShop",
                shopId: "el-mudo-reidor" // Explicit ID for our helper logic
            },
            {
                label: "🧐 [Perspicacia] (Sabiduría CD 13) ¿Qué intentas decirme?",
                check: { skill: "Perspicacia", dc: 13 },
                success: "*Silas imita el sonido de una espada desenvainándose y señala a un rincón oscuro.* Te está advirtiendo de un peligro.",
                failure: "*Silas te hace un corte de manga y grazna como un cuervo. Claramente piensa que eres idiota.*"
            }
        ]
    },

    // --- NUEVOS NPC'S (EXPANSIÓN) ---

    // 5. MYLA (Brujo Loco)
    'npc_myla': {
        name: "Myla",
        role: "Brujo del Subsuelo",
        avatar: "/img/npcs/myla.png",
        greeting: "Myla dibuja espirales en la cerveza derramada. Sus ojos no enfocan nada en particular. 'Están cavando... abajo. ¿Lo oyes? Rascan la piedra.'",
        options: [
            {
                label: "👂 [Escuchar] (Percepción CD 12) Intentar oír lo que ella oye.",
                check: { skill: "Percepción", dc: 12 },
                success: "Te concentras. Por un momento, sientes una vibración sutil en el suelo. Algo enorme se mueve en las profundidades. (Ganas Pista)",
                failure: "Solo oyes borrachos y gritos. Myla se ríe de ti. 'Estás sordo. Todos estáis sordos.'",
                successNext: 'myla_stage2',
                failureNext: 'myla_stage2'
            },
            {
                label: "💊 [Medicina] (Medicina CD 10) Parece enferma. Ofrecer ayuda.",
                check: { skill: "Medicina", dc: 10 },
                success: "Le tomas el pulso. Su piel arde. No es fiebre normal, es corrupción mágica. 'No me toques... se contagia la verdad.'",
                failure: "Te muerde la mano. '¡Aléjate! ¡Eres uno de ellos!'",
                successNext: 'myla_stage2'
            }
        ]
    },
    'myla_stage2': {
        name: "Myla",
        role: "Profeta de la Ruina",
        avatar: "/img/npcs/myla.png",
        greeting: "Se calma un poco, pero tiembla. 'La 'Cosa' en el pozo... tiene hambre. Antes comía basura. Ahora quiere... otra cosa. He visto los planos.'",
        options: [
            { label: "🗺️ ¿Qué planos? (Historia)", check: { skill: "Historia", dc: 14 }, success: "Dibuja un mapa tosco. 'Túneles prohibidos. Debajo de la Arena. Conectan con la Antigua Prisón.'", failure: "Borra el dibujo. 'No... me miran.'" },
            { label: "👋 Volver", nextDialogue: 'npc_myla' }
        ]
    },

    // 6. KRUG (Portero Poeta)
    'npc_krug': {
        name: "Krug",
        role: "Portero Poeta",
        avatar: "/img/npcs/krug.png",
        greeting: "El ogro te bloquea el paso con un brazo del tamaño de un tronco. 'La luna es blanca, tu cara es pálida... si entras aquí, la salida es cálida (y sangrienta).'",
        options: [
            {
                label: "📜 [Poesía] (Interpretación CD 13) Completar la rima.",
                check: { skill: "Interpretación", dc: 13 },
                success: "'...Pero mi espada es dura y mi sed es válida!' Krug suelta una carcajada sísmica. '¡HERMANO DE VERSO! Pasa.'",
                failure: "'...Eh... ¿tu madre es gorda?' Krug te mira inexpresivo. 'Mala métrica. Y ofensivo.'",
                successNext: 'krug_stage2'
            },
            {
                label: "💪 [Fuerza] (Atletismo CD 16) Mover su brazo.",
                check: { skill: "Atletismo", dc: 16 },
                success: "Empujas con todo. El brazo se mueve dos centímetros. Krug asiente. 'Respeto. Eres fuerte para ser pequeñajo.'",
                failure: "Es como empujar una montaña. Krug te da un empujoncito y vuelas tres metros.",
                onFailure: 'fight'
            }
        ]
    },
    'krug_stage2': {
        name: "Krug",
        role: "Amante del Arte",
        avatar: "/img/npcs/krug.png",
        greeting: "'Pocos aprecian el arte del mamporro y la rima. ¿Buscas entrar al Club de Lucha Privado?'",
        options: [
            { label: "🥊 ¿Club Privado?", nextDialogue: 'zone_foso' }, // Link to Arena logic? Or text.
            { label: "👋 Hasta luego", nextDialogue: 'npc_krug' }
        ]
    },

    // 7. SILAS (Falso Cura) (Updated from previous pool)
    'npc_silas': {
        name: "Silas",
        role: "Clérigo de la Moneda",
        avatar: "/img/npcs/silas.png",
        greeting: "Silas hace tintinear una bolsa de monedas. 'Los dioses están ocupados, hijo. Pero yo tengo línea directa. ¿Tienes pecados? Tengo tarifas.'",
        options: [
            {
                label: "💰 [Comercio] Ver mercancía 'sagrada'.",
                type: "shop",
                action: "openShop",
                shopId: "el-mudo-reidor" // Reuse Mudo shop for now or unique Silas shop
            },
            {
                label: "🛐 [Religión] (Religión CD 12) Cuestionar su fe.",
                check: { skill: "Religión", dc: 12 },
                success: "Notas que su símbolo sagrado es una chapa de cerveza aplastada. 'Detalles, detalles. La fe está en el oro.' Te guiña un ojo.",
                failure: "Te suelta un sermón incomprensible y te cobra 5 monedas por 'escuchar'.",
                successNext: 'silas_stage2'
            }
        ]
    },
    'silas_stage2': {
        name: "Silas",
        role: "Estafador Maestro",
        avatar: "/img/npcs/silas.png",
        greeting: "'Mira, entre tú y yo... estoy organizando una 'peregrinación' a la cámara del tesoro del Banco Gnomo. Solo para fieles VIP. ¿Te interesa?'",
        options: [
            { label: "🕵️ Cuéntame más (Investigación)", check: { skill: "Investigación", dc: 16 }, success: "Te revela que tiene planos de los conductos de ventilación. '50% para cada uno.'", failure: "'Olvídalo. Tienes cara de guardia.'" },
            { label: "👋 Paso", nextDialogue: 'npc_silas' }
        ]
    },

    // 8. BRUNHILDA (Campeona)
    'npc_brunhilda': {
        name: "Brunhilda",
        role: "La Invicto",
        avatar: "/img/npcs/brunhilda.png",
        greeting: "Brunhilda está doblando una herradura con una mano. Te mira aburrida. '¿Vienes a retarme o a invitarme? Espero que sea lo primero, tengo sed de violencia.'",
        options: [
            {
                label: "💪 [Reto] (Atletismo CD 18) ¡Pulso! Ahora mismo.",
                check: { skill: "Atletismo", dc: 18 },
                success: "Las mesas tiemblan. Las venas se hinchan. ¡PAM! Estampas su mano contra la madera. Todo el bar se calla. '...Nadie... me había ganado. Tienes mi respeto.' (Ganas Aliado)",
                failure: "Te rompe la muñeca (casi). 'Vuelve cuando tomes tu leche, niño.' -2 HP.",
                successNext: 'brunhilda_stage2'
            },
            {
                label: "🍺 [Invitar] (Constitución CD 14) Bebamos hasta caer.",
                check: { skill: "Constitución", dc: 14 },
                success: "Cinco jarras después, sigues en pie (apenas). Brunhilda se ríe y te da una palmada que te saca el aire. '¡Buen hígado!'",
                failure: "Te despiertas 3 horas después en el callejón sin pantalones. Brunhilda te ganó.",
                successNext: 'brunhilda_stage2'
            }
        ]
    },
    'brunhilda_stage2': {
        name: "Brunhilda",
        role: "Aliada Potencial",
        avatar: "/img/npcs/brunhilda.png",
        greeting: "'No estás mal. Oye, hay un torneo de dobles la semana que viene en la Arena. Busco pareja que no muera en 5 segundos. ¿Te apuntas?'",
        options: [
            { label: "⚔️ ¡Cuenta conmigo!", nextDialogue: 'zone_foso' },
            { label: "👋 Quizás luego", nextDialogue: 'npc_brunhilda' }
        ]
    },

    // --- DIÁLOGOS ANIDADOS (STAGE 2) PARA NPCS ORIGINALES ---

    'borg_stage2': {
        name: "Borg",
        role: "Dueño del Grifo",
        avatar: "/img/npcs/borg.png",
        greeting: "'Veo que sabes cuidarte. Escucha... tengo un problema de 'plagas' en el sótano. No son ratas. Son cosas que Zora trajo y se escaparon. ¿Te interesa un trabajo sucio?'",
        options: [
            { label: "⚔️ [Misión] Matar a las bestias.", success: "Marked as Quest Accepted (WIP). 'Bien. Habla conmigo cuando tengas sus cabezas.'", check: { skill: "Supervivencia", dc: 10 } },
            { label: "👋 Volver", nextDialogue: 'owner_g' }
        ]
    },

    'zora_stage2': {
        name: "Zora 'La Cicatriz'",
        role: "Veterana Cínica",
        avatar: "/img/npcs/zora.png",
        greeting: "'Sobrevives. Eso es raro aquí. ¿Buscas trabajo de verdad? El Gremio de Cazadores paga bien por trofeos de monstruos del Abismo.'",
        options: [
            { label: "📜 ¿Dónde me apunto?", check: { skill: "Persuasión", dc: 12 }, success: "Te entrega una moneda negra. 'Enséñale esto al tablón de anuncios. Te darán las misiones difíciles.' (Desbloquea Contratos)" },
            { label: "👋 Luego", nextDialogue: 'npc_zora' }
        ]
    },

    'vance_stage2': {
        name: "'Dedos' Vance",
        role: "Socio Comercial",
        avatar: "/img/npcs/vance.png",
        greeting: "'Bien, bien... parece que podemos confiar (un poco) en ti. Tengo un mapa de una ruta segura para contrabando en el Anillo 3. ¿Lo quieres? 500 oros.'",
        options: [
            { label: "💰 Comprar Mapa (500 MO)", check: { skill: "Persuasión", dc: 15 }, success: "Vance te da un papel arrugado. 'No digas que te lo di yo.'", failure: "'¿Sin oro? No hay mapa. El capitalismo es así.'" },
            { label: "👋 Volver", nextDialogue: 'npc_vance' }
        ]
    }
};


// --- DOM ELEMENTS ---
let dialogueModal;
let dialogueContent;

export function initDialogueSystem() {
    // Inject Modal HTML if not exists
    if (!document.getElementById('dialogue-modal')) {
        const modalHtml = `
            <div id="dialogue-modal" class="hidden fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6 animate-fade-in">
                <div class="w-full max-w-4xl bg-gray-900 border border-amber-900/50 rounded-t-3xl md:rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
                    
                    <!-- LEFT: PORTRAIT -->
                    <div class="w-full md:w-1/3 h-64 md:h-auto bg-black relative">
                        <div id="dialogue-portrait" class="absolute inset-0 bg-cover bg-top transform scale-110 transition-transform duration-700"></div>
                        <div class="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-transparent to-transparent opacity-80"></div>
                        <div class="absolute bottom-4 left-4 text-left">
                            <h2 id="dialogue-name" class="text-3xl font-cinzel font-bold text-white drop-shadow-md leading-none mb-1">NPC Name</h2>
                            <p id="dialogue-role" class="text-amber-500 text-xs font-bold uppercase tracking-widest">Role</p>
                        </div>
                    </div>

                    <!-- RIGHT: CONVERSATION -->
                    <div class="w-full md:w-2/3 p-6 md:p-8 flex flex-col relative bg-gradient-to-b from-gray-900 to-gray-950">
                        <button onclick="closeDialogue()" class="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-20">
                            <i class="fas fa-times text-xl"></i>
                        </button>

                        <!-- Dialogue Text -->
                        <div class="flex-1 mb-6 overflow-y-auto custom-scrollbar pr-2">
                             <p id="dialogue-text" class="text-gray-300 text-lg leading-relaxed italic border-l-4 border-amber-600 pl-4 py-2">
                                "Greeting text goes here..."
                             </p>
                             <div id="dialogue-result" class="hidden mt-4 p-4 rounded bg-black/40 border border-white/10 animate-fade-in">
                                <!-- Result of roll -->
                             </div>
                        </div>

                        <!-- Options -->
                        <div id="dialogue-options" class="space-y-3">
                            <!-- Dynamic Buttons -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    dialogueModal = document.getElementById('dialogue-modal');

    // Global Expose
    window.startDialogue = startDialogue;
    window.closeDialogue = closeDialogue;
    window.handleDialogueOption = handleDialogueOption;
    window.resolveManualRoll = resolveManualRoll;
}

export function startDialogue(npcId, fallbackData = null) {
    currentNpcId = npcId;
    const data = dialogueData[npcId] || fallbackData;

    if (!data) {
        console.error("No dialogue data for", npcId);
        return;
    }

    // Populate UI
    document.getElementById('dialogue-name').innerText = data.name;
    document.getElementById('dialogue-role').innerText = data.role || 'Habitante';
    document.getElementById('dialogue-portrait').style.backgroundImage = `url('${data.avatar}')`;
    document.getElementById('dialogue-text').innerText = `"${data.greeting}"`;
    document.getElementById('dialogue-result').classList.add('hidden');

    renderOptions(data.options);

    // Show Modal
    dialogueModal.classList.remove('hidden');
}

export function closeDialogue() {
    dialogueModal.classList.add('hidden');
    currentNpcId = null;
}

function renderOptions(options) {
    const container = document.getElementById('dialogue-options');
    container.innerHTML = '';

    if (!options) return;

    options.forEach((opt, index) => {
        const btn = document.createElement('button');
        btn.className = "w-full text-left p-4 rounded bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/50 transition-all group flex items-center justify-between";

        let icon = "fa-comment";
        if (opt.label.includes("Combate")) icon = "fa-swords";
        if (opt.label.includes("Comercio")) icon = "fa-coins";
        if (opt.label.includes("Investig")) icon = "fa-search";
        if (opt.label.includes("Amenaza")) icon = "fa-fist-raised";

        btn.innerHTML = `
            <span class="text-sm md:text-base text-gray-300 group-hover:text-white font-medium">${opt.label}</span>
            <i class="fas ${icon} text-gray-600 group-hover:text-amber-500 opacity-50 group-hover:opacity-100 transition-opacity"></i>
        `;

        btn.onclick = () => handleDialogueOption(index);
        container.appendChild(btn);
    });
}

export function handleDialogueOption(optionIndex) {
    const data = dialogueData[currentNpcId];
    if (!data) return;

    const opt = data.options[optionIndex];
    if (!opt) return;

    // Is it a shop action?
    if (opt.type === 'shop') {
        closeDialogue();
        if (opt.action === 'openShop') {
            // We need to pass the proper NPC ID for the shop function to know which menu
            // Assuming openTavernMenu handles this or valid shop logic
            if (window.openTavernMenu) {
                // Pass ID string for best compatibility with Back button logic
                const shopId = opt.shopId || 'grifo-tuerto';
                window.openTavernMenu(shopId);
            }
        }
        return;
    }

    // Is it a simple branching option?
    if (opt.nextDialogue) {
        startDialogue(opt.nextDialogue);
        return;
    }

    // Is it a skill check?
    if (opt.check) {
        renderManualRollInput(optionIndex, opt);
        return;
    }
}

function renderManualRollInput(index, opt) {
    const container = document.getElementById('dialogue-options');
    container.innerHTML = `
        <div class="p-4 bg-black/40 border border-amber-500/30 rounded animate-fade-in">
            <p class="text-amber-400 font-bold mb-2 text-lg"><i class="fas fa-dice-d20 mr-2"></i>Tira ${opt.check.skill} (CD ${opt.check.dc})</p>
            <p class="text-sm text-gray-400 mb-4">Lanza tus dados y escribe el resultado total:</p>
            <div class="flex gap-2">
                <input type="number" id="manual-roll-input" class="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded w-24 text-center font-bold text-xl focus:border-amber-500 outline-none" placeholder="0">
                <button onclick="resolveManualRoll(${index})" class="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded font-bold uppercase tracking-wider transition-colors flex-1 shadow-lg shadow-amber-900/20">
                    Confirmar Resultado
                </button>
                <button onclick="startDialogue(currentNpcId)" class="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded transition-colors" title="Cancelar">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    // Auto-focus input
    setTimeout(() => {
        const input = document.getElementById('manual-roll-input');
        if (input) input.focus();
    }, 100);
}

function resolveManualRoll(optionIndex) {
    const data = dialogueData[currentNpcId];
    if (!data) return;

    const opt = data.options[optionIndex];
    const input = document.getElementById('manual-roll-input');
    const val = parseInt(input.value);

    if (isNaN(val)) {
        alert("Por favor, introduce un número válido.");
        return;
    }

    const isSuccess = val >= opt.check.dc;
    const nextStep = isSuccess ? opt.successNext : opt.failureNext;

    // Render Result
    const resultContainer = document.getElementById('dialogue-result');

    // Styles
    resultContainer.className = `mt-4 p-4 rounded border animate-fade-in ${isSuccess ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'}`;

    resultContainer.innerHTML = `
        <div class="flex items-center gap-3 mb-2">
            <i class="fas ${isSuccess ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500'} text-xl"></i>
            <div class="flex-1">
                <div class="flex justify-between items-center">
                    <p class="text-xs uppercase tracking-widest ${isSuccess ? 'text-green-400' : 'text-red-400'} font-bold">
                        ${opt.check.skill} CD ${opt.check.dc}
                    </p>
                    <span class="text-white font-mono font-bold bg-black/20 px-2 rounded">Resultado: ${val}</span>
                </div>
            </div>
        </div>
        <p class="text-sm ${isSuccess ? 'text-green-200' : 'text-red-200'} italic leading-relaxed mb-4">
            "${isSuccess ? opt.success : opt.failure}"
        </p>
    `;

    // Trigger Fight logic if failed
    if (!isSuccess && opt.onFailure === 'fight') {
        setTimeout(() => {
            triggerFight(data.name);
            closeDialogue();
        }, 1500);
        return;
    }

    // Render Next Action Button if chain exists, else restore options
    if (nextStep) {
        resultContainer.innerHTML += `
            <button onclick="startDialogue('${nextStep}')" class="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-center uppercase tracking-widest text-sm font-bold transition-all">
                Continuar <i class="fas fa-arrow-right ml-2"></i>
            </button>
        `;
        // Clear options to focus user on result
        document.getElementById('dialogue-options').innerHTML = '';
    } else {
        // Restore Options (so they can continue or leave)
        renderOptions(data.options);
    }

    resultContainer.classList.remove('hidden');
}

function triggerFight(opponentName) {
    let fightModal = document.getElementById('fight-modal');
    if (!fightModal) {
        fightModal = document.createElement('div');
        fightModal.id = 'fight-modal';
        fightModal.className = 'fixed inset-0 z-[100] bg-red-900/90 flex items-center justify-center animate-fight-pulse';
        fightModal.innerHTML = `
            <div class="text-center transform transition-all scale-100 p-8">
                <h1 class="text-6xl md:text-9xl font-black text-white tracking-tighter drop-shadow-[0_0_25px_rgba(0,0,0,0.8)] border-8 border-white p-6 uppercase transform -rotate-3 bg-red-600 shadow-2xl">
                    ! A PELEAR !
                </h1>
                <p class="text-white text-2xl mt-8 font-bold uppercase tracking-widest drop-shadow-md">
                    VS <span id="fight-opponent" class="text-amber-400 text-3xl"></span>
                </p>
                <div class="mt-12 space-y-4">
                    <p class="text-white/80 animate-pulse">Tira Iniciativa...</p>
                    <button onclick="document.getElementById('fight-modal').remove()" class="px-8 py-3 bg-black text-white border-2 border-white hover:bg-white hover:text-black transition-all hover:scale-110 font-bold uppercase tracking-widest shadow-lg">
                        CERRAR
                    </button>
                </div>
            </div>
            <style>
                @keyframes fight-pulse {
                    0%, 100% { background-color: rgba(127, 29, 29, 0.95); }
                    50% { background-color: rgba(153, 27, 27, 0.95); }
                }
                .animate-fight-pulse { animation: fight-pulse 2s infinite; }
            </style>
        `;
        document.body.appendChild(fightModal);
    } else {
        fightModal.classList.remove('hidden');
    }

    document.getElementById('fight-opponent').innerText = opponentName;
}
