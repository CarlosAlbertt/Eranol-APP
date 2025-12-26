import { addItem, playerState } from './player.js';

/*
    DIALOGUE MODULE
    Handles NPC conversations, skill checks, and detailed interactions.
*/

// --- STATE ---
let currentNpcId = null;
let failedOptions = {}; // Track failed skill checks per NPC: { npcId: [optionIndex1, optionIndex2] }

// --- DATA: DIALOGUE TREES ---
// Hardcoded here for now, could be moved to src/js/data/dialogues.js later
const dialogueData = {
    // 1. BORG (Tabernero) - ETAPA 1
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
                failure: "Borg gruñe. 'No me hagas la pelota. Cómprame algo o lárgate.'",
                reward: { name: "Cerveza de la Casa", desc: "Una jarra de cerveza tibia. Recupera 1d4 PV.", type: "consumable", rarity: "common", image: "" },
                successNext: 'borg_stage2_glory'
            },
            {
                label: "🧐 [Investigar] (Investigación CD 14) ¿Quién es esa tal Zora?",
                check: { skill: "Investigación", dc: 14 },
                success: "Baja la voz. 'Zora... es peligrosa. Ex-Ignis. Busca algo o a alguien. Si yo fuera tú, no la molestaría a menos que tengas oro o una sentencia de muerte.'",
                failure: "Te mira con desconfianza. 'Es una clienta. Yo no vendo información, vendo alcohol. Calla y bebe.'",
                successNext: 'borg_stage2_zora'
            },
            {
                label: "😡 [Amenaza] (Intimidación CD 18) Dame lo mejor que tengas, gratis. Ahora.",
                check: { skill: "Intimidación", dc: 18 },
                success: "Borg se tensa, luego suelta una carcajada. '¡HUEVOS! Me gustas. Tienes agallas. Toma este 'Matarratas', invita la casa. Pero no lo vuelvas a hacer.'",
                reward: { name: "Orujo Matarratas", desc: "Arde al bajar. Arde al subir. +5 FUE, -2 INT durante 1 hora.", type: "consumable", rarity: "uncommon", image: "" },
                failure: "En un parpadeo, Borg saca una escopeta recortada y te apunta a la nariz. '¿Decías? Fuera de mi vista antes de que decore la pared con tus sesos.'",
                onFailure: "fight",
                successNext: 'borg_stage2_threat'
            }
        ]
    },

    // BORG - ETAPA 2: Gloria (después de halagarle)
    'borg_stage2_glory': {
        name: "Borg",
        role: "Ex-Campeón del Foso",
        avatar: "/img/npcs/borg.png",
        greeting: "Borg llena dos jarras y desliza una hacia ti. 'Siéntate. Hace mucho que nadie pregunta por los viejos tiempos. ¿Sabes por qué perdí el ojo?'",
        options: [
            {
                label: "👂 Cuéntamelo.",
                success: "Borg se toca el parche. 'Un trol. Tercer combate del Guantelete. Me arrancó el ojo de un mordisco, pero yo le arranqué las tripas. Gané igual. Esa fue mi última pelea.'",
                successNext: 'borg_stage3_troll'
            },
            {
                label: "💀 ¿Por qué dejaste de pelear?",
                success: "'Porque ya no tenía nada que demostrar. Y porque la edad te hace más lento, pero no más inteligente. Los jóvenes mueren rápido ahí dentro.'",
                successNext: 'borg_stage3_retirement'
            },
            {
                label: "🏆 ¿Quién es el mejor luchador que has visto?",
                success: "Borg mira a la nada por un momento. 'Brunhilda. Sin duda. Esa mujer... no es humana. Lleva 37 victorias. Yo tenía 15 cuando me retiré. Ni me acerqué.'",
                successNext: 'borg_stage3_brunhilda'
            },
            { label: "👋 Gracias por la charla.", nextDialogue: null }
        ]
    },

    // BORG - ETAPA 2: Zora (después de preguntar por ella)
    'borg_stage2_zora': {
        name: "Borg",
        role: "Informante Reacio",
        avatar: "/img/npcs/borg.png",
        greeting: "Borg mira alrededor nervioso. 'Oye, no debería contarte esto, pero... Zora ha estado preguntando por los túneles bajo la ciudad. Dice que busca a alguien que desapareció hace años.'",
        options: [
            {
                label: "🕵️ [Investigación CD 15] ¿Los túneles? ¿Qué hay ahí abajo?",
                check: { skill: "Investigación", dc: 15 },
                success: "'Nadie lo sabe con certeza. Catacumbas antiguas, alcantarillas, y... celdas. Algunas de antes de que existiera Eranol. He oído que hay cosas vivas ahí abajo que nunca han visto el sol.'",
                failure: "'No sé nada de túneles. Y tú tampoco si sabes lo que te conviene.'",
                successNext: 'borg_stage3_tunnels'
            },
            {
                label: "💰 [Soborno] Toma 50 monedas de oro. ¿A quién busca Zora?",
                success: "Borg coge las monedas rápidamente. 'Un tal Aldric Vorn. Era... algo así como un alquimista. Desapareció hace 5 años. Dicen que experimentaba con cosas prohibidas.'",
                successNext: 'borg_stage3_aldric'
            },
            {
                label: "☠️ ¿Zora es peligrosa para mí?",
                success: "'Solo si te metes en su camino. O si tienes algo que ella quiere. De lo contrario, te ignorará. Pero cuidado: tiene ojos en todas partes.'",
                successNext: null
            },
            { label: "👋 Mejor me voy.", nextDialogue: null }
        ]
    },

    // BORG - ETAPA 2: Amenaza (después de intimidarlo con éxito)
    'borg_stage2_threat': {
        name: "Borg",
        role: "Aliado Forzoso",
        avatar: "/img/npcs/borg.png",
        greeting: "Borg te mira con una mezcla de respeto y recelo. 'Tienes cojones, te lo concedo. Pero no tientes a la suerte. ¿Qué más quieres?'",
        options: [
            {
                label: "🗡️ Información sobre trabajos peligrosos.",
                success: "'Trabajos, ¿eh? Hay un tipo en la esquina, Dedos Vance. Siempre sabe de trabajos sucios. Dile que te mando yo.'",
                successNext: null
            },
            {
                label: "🔒 ¿Hay una habitación trasera aquí?",
                check: { skill: "Intimidación", dc: 16 },
                success: "Borg suspira. 'Sí. Para clientes VIP. Juegos privados, reuniones discretas. Pero necesitas invitación. O... podrías ganar en el Foso. Los campeones siempre tienen acceso.'",
                failure: "'No sé de qué hablas. Y deja de amenazarme o te echo. Me da igual lo duro que parezcas.'",
                successNext: 'borg_stage3_vip'
            },
            {
                label: "🩸 ¿Puedo pelear en el Foso esta noche?",
                success: "'El Foso siempre acepta carne fresca. Baja por el pasillo de la izquierda, busca a Krug. Él se encarga de las inscripciones. Pero cuidado... ahí abajo las apuestas son con sangre.'",
                successNext: null
            },
            { label: "👋 Nos vemos, Borg.", nextDialogue: null }
        ]
    },

    // BORG - ETAPA 3: Historia del Trol
    'borg_stage3_troll': {
        name: "Borg",
        role: "Veterano Nostálgico",
        avatar: "/img/npcs/borg.png",
        greeting: "Borg se sirve un trago largo. 'Aquel trol... se llamaba Grunk. Tres metros de músculo y rabia. Todavía tengo su colmillo guardado. ¿Sabes qué? Te lo vendo por 200 monedas de oro.'",
        options: [
            {
                label: "💰 [Comprar] Trato hecho. (200 MO)",
                success: "Borg saca un enorme colmillo amarillento de debajo de la barra. 'Es tuyo. Dicen que trae suerte en combate.'",
                reward: { name: "Colmillo de Trol", desc: "Amuleto de un trol derrotado. +1 a tiradas de daño crítico.", type: "accessory", rarity: "rare", image: "" }
            },
            {
                label: "🤔 [Regatear] (Persuasión CD 14) 200 es mucho. ¿Qué tal 100?",
                check: { skill: "Persuasión", dc: 14 },
                success: "Borg gruñe pero asiente. 'Por los viejos tiempos. 100 monedas.'",
                failure: "'No regateo. 200 o nada.'",
                reward: { name: "Colmillo de Trol", desc: "Amuleto de un trol derrotado. +1 a tiradas de daño crítico.", type: "accessory", rarity: "rare", image: "" }
            },
            { label: "👋 Quizás otro día.", nextDialogue: null }
        ]
    },

    // BORG - ETAPA 3: Brunhilda
    'borg_stage3_brunhilda': {
        name: "Borg",
        role: "Admirador",
        avatar: "/img/npcs/borg.png",
        greeting: "Los ojos de Borg brillan al hablar de ella. 'Brunhilda... La vi pelear contra un minotauro. Tres golpes. Tres. El bicho ni la tocó. Si quieres un consejo: no la provoques. Jamás.'",
        options: [
            {
                label: "⚔️ Quiero enfrentarme a ella.",
                success: "'¿Estás loco? Bueno... si insistes. Primero tienes que ganar el Guantelete. Solo entonces Brunhilda te considerará digno de combatir. Buena suerte... la necesitarás.'",
                mission: { id: 'challenge_brunhilda', name: 'Desafiar a Brunhilda', desc: 'Ganar el Guantelete para poder retar a la campeona.' }
            },
            {
                label: "🏆 ¿Cuál es su debilidad?",
                check: { skill: "Perspicacia", dc: 16 },
                success: "Borg baja mucho la voz. 'Vi algo una vez. Su hombro izquierdo. Tiene una vieja herida que a veces le molesta. Nunca lo muestra, pero la vi tocárselo entre combates.'",
                failure: "'¿Debilidad? No tiene ninguna. Es perfecta.'"
            },
            { label: "👋 Interesante. Me voy.", nextDialogue: null }
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
                failure: "Te ignora. 'Es una espada. Corta. Eso es todo lo que necesitas saber.'",
                successNext: 'zora_stage2_history'
            },
            {
                label: "🤝 [Amistoso] (Persuasión CD 15) Invitar a un trago.",
                check: { skill: "Persuasión", dc: 15 },
                success: "Acepta la jarra. 'Gracias. Pocos se atreven a acercarse. Dicen que traigo mala suerte. Tal vez tengan razón... o tal vez soy la única que sobrevive.'",
                failure: "Empuja la jarra lejos. 'No bebo con desconocidos. Se pierde el pulso.'",
                successNext: 'zora_stage2_persuasion'
            },
            {
                label: "⚔️ [Duelo] (Atletismo CD 16) Apuesto a que soy más rápido que tú.",
                check: { skill: "Atletismo", dc: 16 },
                success: "Se ríe y en un borrón su daga está clavada entre tus dedos en la mesa. 'Rápido. Pero ruidoso. Me caes bien, chico. Ten cuidado en el Foso.'",
                failure: "Ni la ves moverse. Tienes su hoja en tu garganta. 'Muerto. Estarías muerto. Lárgate.'",
                onFailure: "fight",
                successNext: 'zora_stage2_duel'
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
                failure: "Señala tu oreja y saca la moneda de ahí. 'Lento. Demasiado lento. ¿Te falta oro, amigo?'",
                successNext: 'vance_stage2'
            },
            {
                label: "🔎 [Investigar] (Investigación CD 12) Busco rumores del Mercado Negro.",
                check: { skill: "Investigación", dc: 12 },
                success: "'Shhh... no tan alto. Busca la puerta marcada con el Ojo Azul, tras la medianoche. Di que Vance te envía... si quieres un descuento.'",
                failure: "'¿Mercado Negro? No sé de qué hablas. Aquí somos ciudadanos honrados.' (Se ríe)",
                successNext: 'vance_stage2'
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
        avatar: "/img/npcs/grumm.png",
        greeting: "Grumm revuelve una olla que burbujea color verde. Huele a podrido y a... ¿canela? '¡NO TOCAR! ¡Explota! Digo... ¡Se cocina!'",
        options: [
            {
                label: "🤮 [Pregunta] (Naturaleza CD 12) ¿Qué demonios es eso?",
                check: { skill: "Naturaleza", dc: 12 },
                success: "'Es... rata de alcantarilla fermentada con setas luminiscentes. ¡Da visión en la oscuridad! O diarrea. ¡Prueba!'",
                failure: "'¡Es *Gourmet*! ¡Mousse de Otyugh! ¡Ignorante!'",
                successNext: 'grumm_stage2'
            },
            {
                label: "🤝 [Amistoso] (Engaño CD 14) Huele... delicioso.",
                check: { skill: "Engaño", dc: 14 },
                success: "Grumm llora de alegría. '¡Alguien me entiende! ¡Toma! ¡La mejor parte!' Te da un cucharón de lodo verde. (Es tóxico, pero él está feliz).",
                failure: "Te huele. 'Mientes. Tienes cara de asco. ¡Fuera de mi cocina!'",
                successNext: 'grumm_stage2',
                reward: { name: "Lodo Verde de Grumm", desc: "Un cucharón de sustancia dudosa. ¿Comestible? Probablemente no. +5 HP o -5 HP (50/50).", type: "consumable", rarity: "uncommon" }
            },
            {
                label: "🧪 [Comercio] ¿Vendes algo que no mate?",
                type: "shop",
                action: "openShop"
            }
        ]
    },
    'grumm_stage2': {
        name: "Grumm",
        role: "Maestro de los Sabores Mortales",
        avatar: "/img/npcs/grumm.png",
        greeting: "'¡FINALMENTE! ¡Alguien que aprecia mi ARTE! Escucha... tengo una receta ancestral. Poción de Fuego Interno. ¡BOOM en el estómago! Pero me faltan... *ingredientes especiales*.'",
        options: [
            {
                label: "🧪 [Misión] ¿Qué necesitas?",
                check: { skill: "Supervivencia", dc: 10 },
                success: "Misión Aceptada: Ingredientes Explosivos. 'Necesito: 3 Lenguas de Salamandra, 1 Corazón de Fuego Fátuo, y... ¡Un Diente de Dragón Joven! Tráemelos y te haré la MEJOR poción de Eranol.'",
                mission: { id: 'ingredientes_explosivos', title: 'Ingredientes Explosivos', desc: 'Grumm necesita ingredientes raros para su poción secreta.', obj: 'Consigue los ingredientes de criaturas de fuego.', reward: { name: 'Poción de Fuego Interno', rarity: 'rare' } }
            },
            {
                label: "💰 [Comercio] Primero muéstrame qué tienes.",
                type: "shop",
                action: "openShop"
            },
            { label: "👋 Eso suena peligroso, paso.", nextDialogue: 'npc_grumm' }
        ]
    },

    // 5. SILAS "EL MUDO" (Kenku Misterioso)
    // 5. SILAS "EL MUDO" (Kenku Misterioso)
    'npc_mudo': {
        name: "El Mudo",
        role: "Dueño Kenku",
        avatar: "/img/npcs/elmudo.png",
        greeting: "*El Kenku te mira con ojos de cuervo. Hace un gesto de beber y señala un cartel tosco que dice 'ORO = TRAGO'. Luego imita el sonido de una bolsa de monedas cayendo.*",
        options: [
            {
                label: "📜 [Misión] Busco trabajo... del tipo silencioso.",
                check: { skill: "Sigilo", dc: 14 },
                success: "*El Mudo te pasa una nota arrugada por debajo de la mesa. Huele a sangre seca.* 'Objetivo: Capataz de la Mina. Vivo o muerto. Preferiblemente muerto.'",
                failure: "*Te ignora y sigue limpiando un vaso con un trapo sucio. No pareces lo suficientemente discreto.*",
                mission: { id: 'mision_mudo_1', title: 'Silencio en la Mina', desc: 'El Mudo quiere que el Capataz de la Mina "desaparezca".', reward: { name: 'Daga de Sombras', rarity: 'rare' } }
            },
            {
                label: "🪙 [Moneda del Cuervo] *Muestras una moneda negra con un cuervo grabado*",
                requiresItem: "Moneda del Cuervo", // Must have this item in inventory
                success: "*Los ojos del Kenku se abren como platos. Reconoce la moneda. Con reverencia, te hace pasar a la trastienda.*",
                reward: { name: "Llave de la Trastienda", desc: "Acceso a los productos prohibidos.", type: "key", rarity: "rare", image: "" },
                successNext: 'silas_stage2_backroom'
            },
            {
                label: "🧐 [Perspicacia] (Sabiduría CD 13) ¿Qué intentas decirme?",
                check: { skill: "Perspicacia", dc: 13 },
                success: "*El Mudo imita el sonido de una espada desenvainándose y señala a un rincón oscuro.* Te está advirtiendo de un peligro.",
                failure: "*El Mudo te hace un corte de manga y grazna como un cuervo. Claramente piensa que eres idiota.*",
                successNext: 'silas_stage2_warning'
            },
            {
                label: "🗣️ [Mímica] *Intentar imitar sus sonidos*",
                check: { skill: "Actuación", dc: 14 },
                success: "*Los ojos del Kenku se iluminan. Grazna con entusiasmo y te hace una reverencia. Has ganado su respeto.*",
                failure: "*El Mudo te mira con desprecio. Tu imitación ha sido patética.*",
                successNext: 'silas_stage2_friends'
            },
            { label: "👋 *Irte sin decir nada*", nextDialogue: null }
        ]
    },

    // SILAS - ETAPA 2: Interesado
    'silas_stage2_interested': {
        name: "Silas 'El Mudo'",
        role: "Comerciante Curioso",
        avatar: "/img/npcs/silas.png",
        greeting: "*Silas inclina la cabeza estudiándote. Emite un sonido que parece... ¿una pregunta? Saca varios frascos pequeños y los coloca sobre el mostrador.*",
        options: [
            {
                label: "💰 ¿Qué más tienes escondido?",
                success: "*Silas se ríe (o lo que pasa por risa en un Kenku). Saca un mapa viejo y arrugado, y lo señala con insistencia.*",
                reward: { name: "Mapa de las Catacumbas", desc: "Un mapa parcial de los túneles bajo Eranol.", type: "quest", rarity: "rare", image: "" }
            },
            { label: "👋 *Asentir y marcharte*", nextDialogue: null }
        ]
    },

    // SILAS - ETAPA 2: Advertencia
    // SILAS - ETAPA 2: Advertencia
    'silas_stage2_warning': {
        name: "El Mudo",
        role: "Vigía Silencioso",
        avatar: "/img/npcs/elmudo.png",
        greeting: "*El Kenku mira nerviosamente hacia las sombras. Imita el sonido de pasos, luego de monedas, y finalmente... un grito ahogado. Algo está pasando en este local.*",
        options: [
            {
                label: "👀 [Percepción CD 15] Buscar lo que indica",
                check: { skill: "Percepción", dc: 15 },
                success: "En el rincón oscuro ves una figura encapuchada que observa a todos. Lleva una daga oculta en la manga. Es un espía o un asesino.",
                failure: "No ves nada especial. Solo borrachos y sombras."
            },
            { label: "👋 Gracias por el aviso...", nextDialogue: null }
        ]
    },

    // SILAS - ETAPA 2: Amigos
    // SILAS - ETAPA 2: Amigos
    'silas_stage2_friends': {
        name: "El Mudo",
        role: "Aliado Kenku",
        avatar: "/img/npcs/elmudo.png",
        greeting: "*El Mudo te trata como a un igual. Te ofrece sentarte detrás de la barra y comparte un trago contigo. ¡Ahora eres bienvenido aquí!*",
        options: [
            {
                label: "🎁 ¿Tienes algo especial para mí?",
                success: "*El Kenku te entrega una pluma de su propia cabeza. Es un gesto de gran confianza.*",
                reward: { name: "Pluma del Cuervo", desc: "Una pluma de Kenku. Permite +5 a una tirada de sigilo (un uso).", type: "consumable", rarity: "rare", image: "" }
            },
            { label: "🍺 Solo quiero beber en paz.", nextDialogue: null }
        ]
    },

    // SILAS - ETAPA ESPECIAL: Trastienda (requiere Moneda del Cuervo)
    // SILAS - ETAPA ESPECIAL: Trastienda (requiere Moneda del Cuervo)
    // SILAS - ETAPA ESPECIAL: Trastienda (requiere Moneda del Cuervo)
    'silas_stage2_backroom': {
        name: "El Mudo",
        role: "Guardián de Secretos",
        avatar: "/img/npcs/elmudo.png",
        greeting: "*En la trastienda, El Mudo cambia de actitud. Ya no imita sonidos ridículos. Te mira con intensidad, saca un mapa antiguo de debajo de una tabla del suelo y lo extiende ante ti. Señala una 'X' marcada en sangre.*",
        options: [
            {
                label: "🗺️ [Tomar Mapa] ¿Qué es esto?",
                success: "*El Kenku grazna suavemente: 'El... Origen...'. Te entrega el mapa. Marca la entrada oculta a las Catacumbas Reales, debajo del Foso.*",
                reward: { name: "Mapa de la Cripta Real", desc: "Revela la entrada secreta a las catacumbas bajo la Arena.", type: "quest", rarity: "epic", image: "" }
            },
            {
                label: "🗝️ [Preguntar] ¿Quién eres realmente?",
                success: "*Se baja la capucha un instante, revelando plumas grises marcadas con runas. Hace el gesto de 'silencio' y te da una llave negra. 'Vigilante'.*",
                reward: { name: "Llave de Obsidiana", desc: "Una llave fría al tacto. Abre una puerta sellada en algún lugar.", type: "key", rarity: "legendary", image: "" }
            },
            { label: "👋 Guardaré el secreto.", nextDialogue: null }
        ]
    },


    // SILAS (Falso Cura)
    'npc_silas': {
        name: "Silas",
        role: "Falso Cura",
        avatar: "/img/npcs/silas.png",
        greeting: "El hombre sonríe con demasiados dientes. 'Hijo mío... veo pecado en tus ojos. Pecado y MONEDAS. Por una donación modesta, los dioses mirarán hacia otro lado.'",
        options: [
            {
                label: "💰 [Donar 10 oro] Perdona mis pecados.",
                success: "'Ego te absolvo... de ser rico.' Te hace una señal sagrada mal hecha y se guarda las monedas a la velocidad del rayo.",
                reward: { name: "Bendición Dudosa", desc: "Te sientes... más ligero de bolsillo. (+1 Moral, -10 Oro mentalmente)", type: "consumable", rarity: "common", qty: 1 }
            },
            {
                label: "🤨 [Perspicacia CD 12] ¿Eres un sacerdote de verdad?",
                check: { skill: "Perspicacia", dc: 12 },
                success: "'¡Por supuesto! Orden de la... Mano Dorada. ¿No ves mi túnica? (Es claramente una cortina vieja).' Se pone nervioso.",
                failure: "'¡Blasfemia! ¡Hereje! ¡Que te parta un rayo! (Mira al techo esperando un rayo, nada pasa)'"
            },
            {
                label: "👋 No necesito perdón.",
                nextDialogue: null
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

    // BORG BRANCHES
    'borg_stage2_glory': {
        name: "Borg",
        role: "Veterano Nostálgico",
        avatar: "/img/npcs/borg.png",
        greeting: "'Esos eran días de gloria. Oye, aún guardo mi viejo equipo en el almacén. Si traes cuero de Basilisco, podría pedirle al herrero que te haga algo decente. ¿Te interesa?'",
        options: [
            { label: "🛡️ [Misión] Buscaré ese cuero.", success: "Misión Aceptada: Piel de Basilisco. 'Suerte. Tienen mal aliento.'", check: { skill: "Supervivencia", dc: 10 } },
            { label: "👋 Volver", nextDialogue: 'owner_g' }
        ]
    },
    'borg_stage2_zora': {
        name: "Borg",
        role: "Informante Cauteloso",
        avatar: "/img/npcs/borg.png",
        greeting: "'Zora busca a un desertor. Un tal 'Fantasma'. Si te enteras de algo, díselo a ella, no a mí. Pero ten cuidado, chico. En Eranol, el conocimiento pesa más que el hierro.'",
        options: [
            { label: "🕵️ ¿Quién es el Fantasma?", check: { skill: "Historia", dc: 15 }, success: "Borg susurra: 'Un asesino de magos. Dicen que puede caminar entre las sombras.'", failure: "'Ya he dicho demasiado. Bebe tu trago.'" },
            { label: "👋 Volver", nextDialogue: 'owner_g' }
        ]
    },
    'borg_stage2_threat': {
        name: "Borg",
        role: "Respeto Ganado",
        avatar: "/img/npcs/borg.png",
        greeting: "'Me recuerdas a mí de joven. Imprudente. Estúpido. Fuerte. Escucha, necesito a alguien que 'cobre' unas deudas a unos clientes morosos en el Anillo 3. ¿Te apuntas?'",
        options: [
            { label: "💰 [Misión] Iré a cobrar.", success: "Misión Aceptada: El Cobrador. Borg te da una lista. 'No los mates... si no es necesario.'", check: { skill: "Intimidación", dc: 10 }, mission: { id: 'el_cobrador', title: 'El Cobrador', desc: 'Borg necesita que alguien le recuerde a sus deudores quién manda.', obj: 'Cobra 3 deudas en el Anillo 3', reward: { name: 'Escopeta Recortada', rarity: 'rare' } } },
            { label: "👋 No soy un matón.", nextDialogue: 'owner_g' }
        ]
    },

    'zora_stage2_persuasion': {
        name: "Zora 'La Cicatriz'",
        role: "Contacto del Gremio",
        avatar: "/img/npcs/zora.png",
        greeting: "'Sobrevives. Eso es raro aquí. ¿Buscas trabajo de verdad? El Gremio de Cazadores paga bien por trofeos de monstruos del Abismo.'",
        options: [
            { label: "📜 ¿Dónde me apunto?", check: { skill: "Persuasión", dc: 12 }, success: "Te entrega una moneda negra. 'Enséñale esto al tablón de anuncios. Te darán las misiones difíciles.' (Desbloquea Contratos)", reward: { name: "Moneda de Sangre", desc: "Una moneda negra y pesada con el símbolo del Gremio. Abre puertas oscuras.", type: "quest", rarity: "rare", image: "img/items/zora_coin.png" } },
            { label: "👋 Luego", nextDialogue: 'npc_zora' }
        ]
    },

    'zora_stage2_history': {
        name: "Zora 'La Cicatriz'",
        role: "Veterana de Guerra",
        avatar: "/img/npcs/zora.png",
        greeting: "'No mucha gente conoce los viejos regimientos. ¿También serviste? Hay un alijo de armas viejas en las ruinas del Anillo 4. Me vendría bien alguien que cubra mi espalda.'",
        options: [
            { label: "🛡️ [Misión] Ayudar a recuperar las armas.", success: "Misión Aceptada: Ecos de Ignis. 'Bien. Nos movemos al anochecer.'", check: { skill: "Historia", dc: 12 }, mission: { id: 'ecos_ignis', title: 'Ecos de Ignis', desc: 'Zora busca el viejo arsenal de su regimiento perdido.', obj: 'Localiza el búnker en las Ruinas.', reward: { name: 'Medalla de Honor', rarity: 'epic' } } },
            { label: "👋 No soy soldado.", nextDialogue: 'npc_zora' }
        ]
    },

    'zora_stage2_duel': {
        name: "Zora 'La Cicatriz'",
        role: "Duelista Impresionada",
        avatar: "/img/npcs/zora.png",
        greeting: "'Tienes buenos reflejos. Me recuerdas a... alguien. Escucha, necesito sparring para un torneo clandestino. La paga es buena, si no te importa sangrar.'",
        options: [
            { label: "⚔️ [Misión] Seré tu sparring.", success: "Misión Aceptada: Sangre y Arena. 'Intenta no morir el primer día.'", check: { skill: "Atletismo", dc: 14 }, mission: { id: 'sangre_arena', title: 'Sangre y Arena', desc: 'Sobrevive al entrenamiento de Zora y entra en el torneo.', obj: 'Gana 3 combates de práctica', canvas: 'arena' } },
            { label: "👋 Prefiero mis dientes intactos.", nextDialogue: 'npc_zora' }
        ]
    },

    'vance_stage2': {
        name: "'Dedos' Vance",
        role: "Socio Comercial",
        avatar: "/img/npcs/vance.png",
        greeting: "'Bien, bien... parece que podemos confiar (un poco) en ti. Tengo un mapa de una ruta segura para contrabando en el Anillo 3. ¿Lo quieres? 500 oros.'",
        options: [
            { label: "💰 Comprar Mapa (500 MO)", check: { skill: "Persuasión", dc: 15 }, success: "Vance te da un papel arrugado. 'No digas que te lo di yo.'", reward: { name: "Mapa de Contrabandista", desc: "Rutas seguras a través de las alcantarillas del Anillo 3.", type: "quest", rarity: "rare", image: "" }, failure: "'¿Sin oro? No hay mapa. El capitalismo es así.'" },
            { label: "👋 Volver", nextDialogue: 'npc_vance' }
        ]
    },

    // --- NPCS DEL POOL (ROTACIÓN DIARIA) ---

    // SASHA (Arquera Tuerta)
    'pool_3': {
        name: "Sasha",
        role: "Arquera Tuerta",
        avatar: "/img/npcs/sasha.png",
        greeting: "Sasha afila una flecha con una piedra mientras te mira con su único ojo. 'No me mires así. Lo perdí apostando. ¿Buscas flechas especiales?'",
        options: [
            {
                label: "🏹 [Comercio] ¿Qué tipo de flechas vendes?",
                type: "shop",
                action: "openShop"
            },
            {
                label: "🎯 [Percepción] (CD 14) ¿Cómo apuntas con un solo ojo?",
                check: { skill: "Percepción", dc: 14 },
                success: "Se ríe. 'El ojo que me queda ve mejor que los dos tuyos. Mira.' Lanza una flecha que atraviesa una mosca al otro lado de la taberna. 'Puedo enseñarte... por un precio.'",
                failure: "'No tan bien como antes. Pero lo suficiente para clavarte una flecha en la rodilla si sigues preguntando.'",
                successNext: 'sasha_stage2'
            },
            {
                label: "💀 [Historia] (CD 13) ¿La apuesta fue con dados?",
                check: { skill: "Historia", dc: 13 },
                success: "Su expresión se oscurece. 'Fue con un demonio en el Anillo 0. Me ofreció visión perfecta a cambio de un ojo. No especificó cuál me quitaría.' Te muestra una cuenca vacía que brilla púrpura. 'Ahora veo... otras cosas.'",
                failure: "'Eso no te importa. Siguiente pregunta o siguiente cliente.'"
            }
        ]
    },
    'sasha_stage2': {
        name: "Sasha",
        role: "Instructora de Tiro",
        avatar: "/img/npcs/sasha.png",
        greeting: "'Si quieres aprender a disparar como yo, necesitarás práctica. Y paciencia. Mucha paciencia.'",
        options: [
            { label: "🏹 [Misión] Enséñame a disparar.", success: "Misión Aceptada: Ojo de Halcón. 'Tráeme 5 plumas de Cocatriz y empezamos.'", check: { skill: "Destreza", dc: 10 } },
            { label: "👋 Volver", nextDialogue: 'pool_3' }
        ]
    },

    // VIEJO RORN (Minero)
    'pool_4': {
        name: "Viejo Rorn",
        role: "Minero Paranoico",
        avatar: "/img/npcs/rorn.png",
        greeting: "Rorn tiembla mientras agarra una jarra vacía. Sus ojos se mueven frenéticamente. '¡La encontré! ¡Plata pura! Pero... las sombras... SE MOVÍAN...' Estalla en sudor frío.",
        options: [
            {
                label: "🧠 [Medicina] (CD 12) Pareces traumatizado. ¿Qué viste?",
                check: { skill: "Medicina", dc: 12 },
                success: "Le calmas. Respira hondo. 'Era... como las paredes respiraban. Ojos en la piedra. Y susurros. Nombres. MI nombre.' Te agarra del brazo. 'No vayas abajo. Nunca.'",
                failure: "'¡NO ME TOQUES!' Tira la jarra y huye a un rincón oscuro.",
                successNext: 'rorn_stage2'
            },
            {
                label: "💰 [Persuasión] (CD 14) ¿Dónde está esa veta de plata?",
                check: { skill: "Persuasión", dc: 14 },
                success: "'Túnel 7-B. Bajo la Arena. Pero escucha... lleva sal. MUCHA sal. Las cosas de abajo odian la sal.' Te dibuja un mapa tembloroso en una servilleta.",
                failure: "'¡NO! ¡Es mía! ¡La plata es MÍA!' Esconde la cabeza entre las manos.",
                reward: { name: "Mapa de Rorn", desc: "Un mapa tembloroso hacia una supuesta veta de plata en las profundidades.", type: "quest", rarity: "uncommon" }
            },
            {
                label: "🍺 Invitarle una cerveza.",
                success: "Acepta la cerveza con manos temblorosas. 'Gracias... hacía tiempo que nadie era amable.' (+5 Confianza)"
            }
        ]
    },
    'rorn_stage2': {
        name: "Viejo Rorn",
        role: "Superviviente",
        avatar: "/img/npcs/rorn.png",
        greeting: "'Escucha... no soy el único que ha vuelto *cambiado*. Hay otros mineros. Los llaman los Huecoscuro. Se reúnen a medianoche en el Foso.'",
        options: [
            { label: "🕵️ [Investigación] (CD 15) ¿Reunión secreta?", check: { skill: "Investigación", dc: 15 }, success: "'Dicen que encontraron algo. Un templo antiguo. Y quieren volver.' Te da una contraseña: 'Sombra Hambrienta.'", failure: "'Ya he dicho demasiado. Olvídame.'" },
            { label: "👋 Volver", nextDialogue: 'pool_4' }
        ]
    },

    // TRIXIE (Hada en Tarro)
    'pool_5': {
        name: "Trixie",
        role: "Hada Prisionera",
        avatar: "/img/npcs/trixie.png",
        greeting: "Una luz púrpura brilla dentro de un tarro sucio en la barra. Una vocecita chillona grita: '¡EH! ¡TÚ! ¡El de la cara fea! ¡Sácame de aquí! ¡Te daré TRES DESEOS!' *Obviamente miente.*",
        options: [
            {
                label: "🧚 [Perspicacia] (CD 10) Eso suena a mentira...",
                check: { skill: "Perspicacia", dc: 10 },
                success: "'¡Vale, vale! Dos deseos. ¡Uno! ¡MEDIO! Ugh, está bien... NO tengo deseos. Pero puedo darte INFORMACIÓN. Sé cosas. Muchas cosas. Las hadas escuchamos TODO.'",
                failure: "'¡Tres deseos! ¡Palabra de hada!' El brillo en sus ojos es claramente sospechoso."
            },
            {
                label: "🔓 [Juego de Manos] (CD 14) Abrir el tarro discretamente.",
                check: { skill: "Juego de Manos", dc: 14 },
                success: "¡PLINK! El tarro se abre. Trixie sale volando y te da un beso en la nariz. '¡LIBRE! ¡Eres mi héroe! Toma, ten esto.' Te da un Polvo de Hada antes de desaparecer por una grieta.",
                failure: "Borg te ve y gruñe. 'Ese bicho vale 50 oros. Tócalo otra vez y te arranco los dedos.'",
                reward: { name: "Polvo de Hada", desc: "Espolvorea sobre un objeto para hacerlo brillar o sobre una herida para curar 1d4 HP.", type: "consumable", rarity: "uncommon" }
            },
            {
                label: "😈 [Intimidación] (CD 8) Agitar el tarro.",
                check: { skill: "Intimidación", dc: 8 },
                success: "Agitas el tarro. Trixie rebota como una pelota gritando insultos en idioma Silvano. Muy satisfactorio.",
                failure: "¡CRACK! El tarro explota en tu mano. Trixie te muerde la oreja y huye. -1 HP."
            }
        ]
    },

    // GARRA (Tabaxi)
    'pool_6': {
        name: "Garra",
        role: "Tabaxi Informante",
        avatar: "/img/npcs/garra.png",
        greeting: "Un Tabaxi flaco se rasca compulsivamente. Sus pupilas están dilatadas. Tú pareces de confianza. Tengo información. Sobre la Guardia. Cambio de turno. Puerta trasera. Solo necesito un poco de Polvo de Sueño...",
        options: [
            {
                label: "💊 [Medicina] (CD 12) Evaluar su adicción.",
                check: { skill: "Medicina", dc: 12 },
                success: "Síndrome de abstinencia severo. Polvo de Sueño, extracto de Seta del Abismo. Muy adictivo. 'Por favor... solo un poco. Te cuento todo.'",
                failure: "'¡No me mires así! ¡Estoy bien! Solo... necesito... ayuda...'"
            },
            {
                label: "🕵️ [Persuasión] (CD 14) Información primero, droga después.",
                check: { skill: "Persuasión", dc: 14 },
                success: "'V-vale... El cambio de guardia en la Puerta Norte es a medianoche. Hay un hueco de 3 minutos. Y el Capitán Volker acepta sobornos.' Te da un papel con horarios.",
                failure: "'¿Crees que soy idiota? Primero el polvo. Luego hablamos.' Se aleja temblando.",
                reward: { name: "Horarios de la Guardia", desc: "Documento con los cambios de turno y debilidades de la Guardia de Eranol.", type: "quest", rarity: "rare" }
            },
            {
                label: "❌ [Rechazo] No trato con yonquis.",
                success: "Garra te sisea. 'Algún día... tú también necesitarás algo. Y nadie te ayudará.' Se arrastra hacia las sombras."
            }
        ]
    },

    // EL MUDO (Kenku Espía)
    'pool_9': {
        name: "El Mudo",
        role: "Kenku Espía",
        avatar: "/img/npcs/elmudo.png",
        greeting: "El Kenku te mira con ojos negros como el vacío. Abre el pico y emite un sonido perfecto: el rugido de una Hidra, seguido del tintineo de monedas cayendo. Luego, el grito de un hombre muriendo.",
        options: [
            {
                label: "🎭 [Interpretación] (CD 13) Intentar comunicarse con sonidos.",
                check: { skill: "Interpretación", dc: 13 },
                success: "Imitas el sonido de aplausos. El Mudo ladea la cabeza, impresionado. Responde con el sonido de una puerta abriéndose y pasos alejándose. ¿Una invitación?",
                failure: "Haces un ruido. El Mudo te mira decepcionado y grazna como un cuervo enfadado.",
                successNext: 'elmudo_stage2'
            },
            {
                label: "💰 [Oro] Mostrar monedas.",
                success: "Los ojos del Kenku brillan. Imita el sonido de una bolsa abriéndose y luego un susurro: 'Recompensa... por... el Rata...' Reproduce una risa conocida del Anillo 0."
            },
            {
                label: "👀 [Percepción] (CD 15) Observar qué ha visto recientemente.",
                check: { skill: "Percepción", dc: 15 },
                success: "Notas manchas de sangre seca en sus plumas. Y un olor a azufre. Ha estado en el Anillo 0. Hace poco.",
                failure: "Solo ves un pájaro raro. Probablemente inofensivo."
            }
        ]
    },
    'elmudo_stage2': {
        name: "El Mudo",
        role: "Guía Silencioso",
        avatar: "/img/npcs/elmudo.png",
        greeting: "El Kenku reproduce el sonido de tus propios pasos, luego los de alguien siguiéndote. Un gruñido. Y tu grito de dolor. ¿Una advertencia? ¿O una predicción?",
        options: [
            { label: "¿Quién me sigue?", success: "El Mudo imita el sonido de una capa ondeando y el clic de una ballesta amartillándose. 'Sombra... Cazador...'" },
            { label: "👋 Retirarse", nextDialogue: 'pool_9' }
        ]
    },

    // REY RIKO (Halfling Rey de las Ratas)
    'pool_10': {
        name: "Rey Riko",
        role: "Señor de las Ratas",
        avatar: "/img/npcs/reyriko.png",
        greeting: "Un Halfling sucio está rodeado de ratas que parecen obedecerle. Una de ellas está sentada en su hombro royendo queso. 'Mis pequeños ojos lo ven TODO. Cada migaja, cada secreto, cada traición. ¿Qué quieres saber?'",
        options: [
            {
                label: "🐀 [Trato con Animales] (CD 12) Ganarse la confianza de las ratas.",
                check: { skill: "Trato con Animales", dc: 12 },
                success: "Extiendes la mano. Una rata la olfatea y chilla. Riko sonríe. 'Le gustas. Eso es raro. Mis niñas no confían fácilmente.'",
                failure: "Una rata te muerde el dedo. '-1 HP'. Riko se ríe. 'A mis niñas no les gustas. Mala señal.'",
                successNext: 'riko_stage2'
            },
            {
                label: "🕵️ [Investigación] (CD 14) ¿Qué han visto tus ratas últimamente?",
                check: { skill: "Investigación", dc: 14 },
                success: "'Mis espías encontraron un túnel nuevo bajo la Arena. Va a algún lugar antiguo. Las ratas viejas tienen miedo de bajar.' Te describe la ubicación.",
                failure: "'Esa información cuesta. 50 oros por susurro.'"
            },
            {
                label: "👑 [Historia] (CD 10) ¿Por qué te llaman 'Rey'?",
                check: { skill: "Historia", dc: 10 },
                success: "'Porque MANDO. Cada rata de Eranol responde a mí. Son mis ojos, mis oídos, mis asesinas silenciosas.' Chasquea los dedos y cien ojos rojos brillan desde las sombras.",
                failure: "'Porque soy el mejor. Siguiente pregunta.'"
            }
        ]
    },
    'riko_stage2': {
        name: "Rey Riko",
        role: "Aliado Roedor",
        avatar: "/img/npcs/reyriko.png",
        greeting: "'Escucha, me caes bien. Puedo prestarte una de mis exploradoras. Te guiará por los túneles. Pero me debes un favor. Un día lo cobraré.'",
        options: [
            { label: "🤝 Aceptar el trato.", success: "Una rata gorda sube a tu hombro. 'Se llama Princesa. Trátala bien.' (Ganas Compañero Temporal)", reward: { name: "Princesa la Rata", desc: "Una rata entrenada que conoce los túneles de Eranol.", type: "companion", rarity: "uncommon" } },
            { label: "👋 Declinar", nextDialogue: 'pool_10' }
        ]
    },

    // VEX (Brujo Dracónido)
    'pool_11': {
        name: "Vex",
        role: "Brujo Desesperado",
        avatar: "/img/npcs/vex.png",
        greeting: "Un Dracónido de escamas negras bebe nerviosamente. Tiene ojeras y las garras le tiemblan. 'Necesito... romper mi pacto. Es demasiado. Me pide... cosas. ¿Conoces a alguien que pueda ayudar?'",
        options: [
            {
                label: "📜 [Arcano] (CD 15) ¿Qué tipo de pacto es?",
                check: { skill: "Arcano", dc: 15 },
                success: "'Un pacto de sangre con un Archidiablo. Nivel 6. Casi imposible de romper sin... sacrificio.' Notas marcas de quemaduras en sus escamas formando runas.",
                failure: "'No lo entenderías. Es... complicado.' Se frota los ojos cansado.",
                successNext: 'vex_stage2'
            },
            {
                label: "💀 [Intimidación] (CD 16) ¿Qué te ha pedido hacer?",
                check: { skill: "Intimidación", dc: 16 },
                success: "Palidece (para ser un dracónido). 'Almas. Jóvenes. Tengo hasta la luna nueva o... seré yo el sacrificio.' Te muestra una cuenta regresiva tatuada en su muñeca.",
                failure: "'¡Eso es entre mi Patrón y yo!' Escamas de humo brotan de su cuello, señal de que está asustado."
            },
            {
                label: "📜 [Comercio] ¿Pergaminos oscuros?",
                type: "shop",
                action: "openShop"
            }
        ]
    },
    'vex_stage2': {
        name: "Vex",
        role: "Brujo en Deuda",
        avatar: "/img/npcs/vex.png",
        greeting: "'Hay una forma de engañar al contrato. Necesito el Cálamo del Primer Escriba. Está en las Ruinas del Ateneo. ¿Me ayudas a buscarlo?'",
        options: [
            { label: "📜 [Misión] Buscar el Cálamo.", success: "Misión Aceptada: Contrato Roto. 'Si lo logras, te enseñaré un conjuro prohibido.'", check: { skill: "Arcano", dc: 12 }, mission: { id: 'contrato_roto', title: 'Contrato Roto', desc: 'Vex necesita el Cálamo del Primer Escriba para romper su pacto.', obj: 'Encuentra el Cálamo en las Ruinas del Ateneo.', reward: { name: 'Hechizo: Llamas Abisales', rarity: 'legendary' } } },
            { label: "👋 Paso de problemas demoniacos", nextDialogue: 'pool_11' }
        ]
    },

    // LA ENCAPUCHADA (Drow)
    'pool_12': {
        name: "La Encapuchada",
        role: "Asesina Drow",
        avatar: "/img/npcs/encapuchada.png",
        greeting: "Una figura en las sombras. Solo ves sus ojos: rojos como rubíes. Una voz fría susurra: 'Una gota basta para parar un corazón de ogro. 200 oros. Sin preguntas.'",
        options: [
            {
                label: "💀 [Comercio] Quiero veneno.",
                type: "shop",
                action: "openShop"
            },
            {
                label: "🕵️ [Sigilo] (CD 16) Intentar ver su cara.",
                check: { skill: "Sigilo", dc: 16 },
                success: "Por un instante, la luz de una vela ilumina rasgos élficos perfectos, cicatrizados por un símbolo grabado a fuego en la mejilla: el emblema de una Casa Drow caída.",
                failure: "Sientes un frío en el cuello. Un cuchillo. 'No. Mires. Otra vez.' El cuchillo desaparece y ella sigue en la sombra.",
                successNext: 'encapuchada_stage2'
            },
            {
                label: "🤝 [Persuasión] (CD 18) ¿Por qué te escondes?",
                check: { skill: "Persuasión", dc: 18 },
                success: "Silencio largo. 'Porque si me encuentran, moriremos todos. Hay cosas peores que demonios en la Infraoscuridad.' Una carta cae a tus pies. 'Si ves este símbolo, corre.'",
                failure: "'Lo que escondo no te concierne, superficial.' La sombra se desvanece.",
                reward: { name: "Carta de Advertencia", desc: "Un símbolo extraño y una nota: 'Los Ojos del Vacío observan.'", type: "quest", rarity: "rare" }
            }
        ]
    },
    'encapuchada_stage2': {
        name: "La Encapuchada",
        role: "Exiliada",
        avatar: "/img/npcs/encapuchada.png",
        greeting: "'Casa Zau'Ith. Mi antigua familia. Me marcaron como traidora por no participar en un sacrificio. Ahora cazo a los que me cazaban. Y tú... acabas de convertirte en testigo.'",
        options: [
            { label: "🤐 Tu secreto está a salvo.", success: "Asiente casi imperceptiblemente. 'Bien. Si necesitas que alguien... desaparezca, sabes dónde encontrarme.' (+15 Confianza)" },
            { label: "👋 Me voy.", nextDialogue: 'pool_12' }
        ]
    },

    // --- NPCS DEL MUDO REIDOR ---

    // SUSURROS (Informante)
    'npc_whisper': {
        name: "Susurros",
        role: "Mercader de Secretos",
        avatar: "/img/npcs/encapuchada.png",
        greeting: "Apenas distingues una silueta en el rincón más oscuro. Una voz sin género susurra: 'Tengo algo que te interesa. Siempre lo tengo. La pregunta es... ¿qué tienes tú para mí?'",
        options: [
            {
                label: "💰 [Persuasión] (CD 14) Dinero. ¿Cuánto por un buen rumor?",
                check: { skill: "Persuasión", dc: 14 },
                success: "'50 oros por un susurro. 100 por un grito.' Te inclinas y escuchas: 'El Gremio de Ladrones planea un golpe al Banco Gnomo. Esta semana.'",
                failure: "'Tu bolsa suena vacía. Vuelve cuando tengas algo real.'",
                reward: { name: "Rumor: Golpe al Banco", desc: "El Gremio planea robar el Banco Gnomo esta semana.", type: "quest", rarity: "uncommon" }
            },
            {
                label: "🔄 [Engaño] (CD 16) Ofrezco información por información.",
                check: { skill: "Engaño", dc: 16 },
                success: "'Interesante. Cuéntame algo primero.' Le inventas una historia sobre un noble. Susurros asiente. 'Bien jugado. Toma tu premio: El Comandante de la Guardia tiene una amante secreta. En el Anillo 0.'",
                failure: "'Eso es mentira. Y mal contada.' Sientes un pinchazo en la espalda. '-2 HP'. 'La próxima vez, no me hagas perder el tiempo.'"
            },
            {
                label: "🔍 [Investigación] (CD 13) ¿Qué sabes del Mercado Negro?",
                check: { skill: "Investigación", dc: 13 },
                success: "'La entrada está en el callejón detrás del Grifo Tuerto. Busca el Ojo Azul pintado en la pared. Di 'Sombra Hambrienta' al guardián.'",
                failure: "'Esa información cuesta más de lo que puedes pagar. Busca en otra parte.'"
            }
        ]
    },

    // --- NPCS DEL CÁLIZ DE MANÁ ---

    // LADY ELARA (Dueña)
    'owner_c': {
        name: "Lady Elara",
        role: "Propietaria del Cáliz",
        avatar: "/img/npcs/sasha.png",
        greeting: "Una elfa de cabello plateado te evalúa con ojos antiguos. Camareros invisibles flotan a su alrededor. 'Bienvenido al Cáliz de Maná. Este es un establecimiento *selecto*. Espero que tu comportamiento esté a la altura.'",
        options: [
            {
                label: "🍷 [Comercio] Ver la carta de lujo.",
                type: "shop",
                action: "openShop",
                shopId: "caliz-mana"
            },
            {
                label: "🎭 [Etiqueta] (CD 12) Hacer una reverencia apropiada.",
                check: { skill: "Interpretación", dc: 12 },
                success: "Elara sonríe levemente. 'Vaya, alguien con modales. Refrescante. Quizás puedas sentarte en la mesa de los Nobles. Si tu bolsa lo permite.'",
                failure: "'Tu gesto es... adecuado. Para un herrero.' Una sombra de desprecio cruza su rostro.",
                successNext: 'elara_stage2'
            },
            {
                label: "🧐 [Arcano] (CD 14) Esos camareros invisibles son sirvientes conjurados...",
                check: { skill: "Arcano", dc: 14 },
                success: "'Observador. Sí, son ecos de mi magia. Más fiables que los vivos. No roban, no mienten, no... fallan.' Su voz tiene un dejo de amargura.",
                failure: "'La magia de este lugar no es asunto de curiosos.' Los ojos de los invisibles parecen mirarte."
            }
        ]
    },
    'elara_stage2': {
        name: "Lady Elara",
        role: "Anfitriona Secreta",
        avatar: "/img/npcs/sasha.png",
        greeting: "'Veo potencial en ti. Hay una reunión esta noche. Nobles, mercaderes, y... otros. Si quieres ascender en Eranol, necesitas contactos. ¿Te interesa una invitación?'",
        options: [
            { label: "👔 [Misión] Acepto la invitación.", success: "Misión Aceptada: La Cena de Cristal. 'Viste apropiadamente. Y no hables de más.'", check: { skill: "Persuasión", dc: 10 }, mission: { id: 'cena_cristal', title: 'La Cena de Cristal', desc: 'Lady Elara te ha invitado a una reunión secreta de élites.', obj: 'Asiste a la cena y consigue un contacto valioso.', reward: { name: 'Invitación VIP', rarity: 'epic' } } },
            { label: "👋 No es mi ambiente.", nextDialogue: 'owner_c' }
        ]
    },

    // VIZCONDE POMPOUS (Noble)
    'npc_3': {
        name: "Vizconde Pompous",
        role: "Noble Arrogante",
        avatar: "/img/npcs/borg.png",
        greeting: "Un humano gordo te mira a través de un monóculo de oro. '¡Tú! El de la ropa... *pasable*. Pareces alguien que hace trabajos sucios. He perdido mi broche familiar en las alcantarillas. Un Devorador lo robó. Quiero *MI BROCHE*.'",
        options: [
            {
                label: "💰 [Persuasión] (CD 14) ¿Cuánto paga por el trabajo?",
                check: { skill: "Persuasión", dc: 14 },
                success: "'¡Hmph! Mercenarios. 500 oros de oro puro cuando me lo devuelvas. Y 200 de anticipo.' Te lanza una bolsa con desprecio.",
                failure: "'¿Negociar? ¿CONMIGO? Deberías estar agradecido de trabajar para un Vizconde. 300 oros. Tómalo o déjalo.'",
                reward: { name: "Anticipo del Vizconde", desc: "200 monedas de oro del Vizconde Pompous.", type: "gold", rarity: "common" }
            },
            {
                label: "🕵️ [Perspicacia] (CD 12) ¿Qué hace un broche noble en las alcantarillas?",
                check: { skill: "Perspicacia", dc: 12 },
                success: "El Vizconde se pone rojo. 'Eso... eso no te incumbe.' Notas que evita mirarte. Claramente hay más en esta historia.",
                failure: "'¡Impertinente! ¡El broche estaba en mi carruaje cuando fui asaltado! ¡Nada más!'"
            },
            {
                label: "❌ [Rechazo] No trabajo para presumidos.",
                success: "'¡¿Cómo te ATREVES?!' Se atraganta con el vino. Los nobles cercanos murmuran. Has hecho un enemigo (-20 Reputación Noble).",
                failure: "El Vizconde hace un gesto y dos guardias aparecen. 'Fuera de MI vista.'"
            }
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
    window.handleReward = handleReward;
    window.retryDialogue = retryDialogue; // For "Intentar otra cosa" button
}

export function startDialogue(npcId, fallbackData = null) {
    currentNpcId = npcId;
    console.log("Starting dialogue for ID:", npcId);

    let data = dialogueData[npcId];

    if (!data) {
        console.warn(`Dialogue data not found for ${npcId}. Using fallback.`);
        console.log("Available IDs:", Object.keys(dialogueData)); // Debug help

        if (fallbackData) {
            data = fallbackData;
        } else {
            console.error("No data and no fallback for", npcId);
            return;
        }
    }

    // Populate UI
    document.getElementById('dialogue-name').innerText = data.name;
    document.getElementById('dialogue-role').innerText = data.role || 'Habitante';

    // TRUST SYSTEM
    // Ensure player has trust record
    if (!playerState.npcStatus) playerState.npcStatus = {};
    if (!playerState.npcStatus[npcId]) {
        playerState.npcStatus[npcId] = { trust: 50, encountered: true };
    }
    const trust = playerState.npcStatus[npcId].trust;

    // Render Trust Bar (Injecting into the role container if possible, or appending)
    // We assume there's a container. Let's append to dialogue-role's parent or replace content if needed.
    // Simpler: Target the #dialogue-portrait container or similar. 
    // Actually, user wants it visible. Let's put it below role.
    const roleEl = document.getElementById('dialogue-role');
    // Check if bar already exists to avoid dupes
    let trustBar = document.getElementById('dialogue-trust-bar');
    if (!trustBar) {
        trustBar = document.createElement('div');
        trustBar.id = 'dialogue-trust-bar';
        trustBar.className = "w-full max-w-[120px] bg-black/50 h-1 rounded-full mt-3 border border-white/10 relative overflow-hidden group mx-auto";
        roleEl.parentNode.insertBefore(trustBar, roleEl.nextSibling);

        // Label below
        const label = document.createElement('div');
        label.className = "text-[8px] text-gray-500 uppercase tracking-widest mt-1 text-center font-mono";
        label.innerText = "AFINIDAD";
        trustBar.parentNode.insertBefore(label, trustBar.nextSibling);
    }

    // Color logic
    let barColor = "bg-white"; // Neutral
    if (trust < 30) barColor = "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]";
    else if (trust < 70) barColor = "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]";
    else barColor = "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";

    trustBar.innerHTML = `
        <div class="h-full ${barColor} transition-all duration-1000 ease-out relative" style="width: ${trust}%">
           <div class="absolute right-0 top-0 bottom-0 w-[1px] bg-white/50 shadow-[0_0_5px_white]"></div>
        </div>
    `;

    document.getElementById('dialogue-portrait').style.backgroundImage = `url('${data.avatar}')`;

    // Robust text handling: prefer greeting, then dialogue, then default
    const text = data.greeting || data.dialogue || "*Te mira en silencio.*";
    document.getElementById('dialogue-text').innerText = `"${text}"`;

    document.getElementById('dialogue-result').classList.add('hidden');

    // If falling back to simple NPC object, it might not have 'options'. 
    // We should render a default "Leave" option.
    if (!data.options) {
        renderOptions([{ label: "👋 Adiós", action: "close" }]);
    } else {
        renderOptions(data.options);
    }

    // Show Modal
    dialogueModal.classList.remove('hidden');
}



export function closeDialogue() {
    dialogueModal.classList.add('hidden');
    document.getElementById('dialogue-result').classList.add('hidden'); // Ensure result is hidden next time
    document.getElementById('dialogue-options').innerHTML = ''; // Clear options
    currentNpcId = null;
}

// Retry dialogue - go back to options
function retryDialogue() {
    if (!currentNpcId) return;

    const data = dialogueData[currentNpcId];
    if (data && data.options) {
        document.getElementById('dialogue-result').classList.add('hidden');
        renderOptions(data.options);
    }
}

function renderOptions(options) {
    const container = document.getElementById('dialogue-options');
    container.innerHTML = '';

    if (!options) return;

    options.forEach((opt, index) => {
        const btn = document.createElement('button');

        // Check if this option was failed before (skill check failed)
        const wasFailed = failedOptions[currentNpcId]?.includes(index);

        // Check if this option requires a special item
        let hasRequiredItem = true;
        if (opt.requiresItem) {
            hasRequiredItem = playerState.inventory?.some(item => item.name === opt.requiresItem);
        }

        if (wasFailed) {
            // Disabled style for failed options
            btn.className = "w-full text-left p-4 rounded bg-red-950/20 border border-red-900/30 cursor-not-allowed opacity-50 flex items-center justify-between";
            btn.disabled = true;
        } else if (!hasRequiredItem && opt.requiresItem) {
            // Disabled style for options that require an item you don't have
            btn.className = "w-full text-left p-4 rounded bg-purple-950/20 border border-purple-900/30 cursor-not-allowed opacity-60 flex items-center justify-between";
            btn.disabled = true;
        } else {
            btn.className = "w-full text-left p-4 rounded bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/50 transition-all group flex items-center justify-between";
        }

        let icon = "fa-comment";
        if (opt.label.includes("Combate")) icon = "fa-swords";
        if (opt.label.includes("Comercio")) icon = "fa-coins";
        if (opt.label.includes("Investig")) icon = "fa-search";
        if (opt.label.includes("Amenaza")) icon = "fa-fist-raised";
        if (opt.requiresItem) icon = "fa-key";

        if (wasFailed) {
            btn.innerHTML = `
                <span class="text-sm md:text-base text-red-400/50 line-through font-medium">${opt.label}</span>
                <span class="text-xs text-red-500"><i class="fas fa-ban mr-1"></i>Fallado</span>
            `;
        } else if (!hasRequiredItem && opt.requiresItem) {
            btn.innerHTML = `
                <span class="text-sm md:text-base text-purple-400/50 font-medium">${opt.label}</span>
                <span class="text-xs text-purple-400"><i class="fas fa-lock mr-1"></i>Requiere: ${opt.requiresItem}</span>
            `;
        } else {
            btn.innerHTML = `
                <span class="text-sm md:text-base text-gray-300 group-hover:text-white font-medium">${opt.label}</span>
                <i class="fas ${icon} text-gray-600 group-hover:text-amber-500 opacity-50 group-hover:opacity-100 transition-opacity"></i>
            `;
            btn.onclick = () => handleDialogueOption(index);
        }

        container.appendChild(btn);
    });
}

export function handleDialogueOption(optionIndex) {
    const data = dialogueData[currentNpcId];
    if (!data) return;

    const opt = data.options[optionIndex];
    if (!opt) return;

    // Mission/Reward Trigger:
    // If there is a CHECK, we wait for resolveManualRoll.
    // If there is NO CHECK, we grant immediately.

    // Is it a skill check?
    if (opt.check) {
        renderManualRollInput(optionIndex, opt);
        return;
    }

    // If no check, grant immediately
    if (opt.reward) handleReward(opt.reward);
    if (opt.mission && window.addMission) window.addMission(opt.mission);

    // Is it a shop action?
    if (opt.type === 'shop') {
        closeDialogue();
        if (opt.action === 'openShop') {
            if (window.openTavernMenu) {
                const shopId = opt.shopId || 'grifo-tuerto';
                window.openTavernMenu(shopId);
            }
        }
        return;
    }

    // Is it a close action?
    if (opt.action === 'close') {
        closeDialogue();
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

    // Track failed options so they can't be retried
    if (!isSuccess && opt.check) {
        if (!failedOptions[currentNpcId]) {
            failedOptions[currentNpcId] = [];
        }
        if (!failedOptions[currentNpcId].includes(optionIndex)) {
            failedOptions[currentNpcId].push(optionIndex);
        }
    }

    // UPDATE TRUST
    if (playerState.npcStatus && playerState.npcStatus[currentNpcId]) {
        const change = isSuccess ? 10 : -5;
        let newTrust = playerState.npcStatus[currentNpcId].trust + change;
        newTrust = Math.max(0, Math.min(100, newTrust)); // Clamp 0-100
        playerState.npcStatus[currentNpcId].trust = newTrust;

        // Grant Rewards/Missions ON SUCCESS
        if (isSuccess) {
            if (opt.reward) handleReward(opt.reward);
            // We use a small timeout to let the result render first, or just call it.
            // Missions usually have a visual feedback too.
            if (opt.mission && window.addMission) {
                window.addMission(opt.mission);
            }
        }

        // Refresh Trust Bar visually immediate
        const trustBarInner = document.querySelector('#dialogue-trust-bar div');
        if (trustBarInner) {
            trustBarInner.style.width = `${newTrust}%`;
            if (newTrust < 30) trustBarInner.className = "h-full bg-red-600 transition-all duration-700 ease-out";
            else if (newTrust < 70) trustBarInner.className = "h-full bg-yellow-500 transition-all duration-700 ease-out";
            else trustBarInner.className = "h-full bg-green-500 transition-all duration-700 ease-out";
        }
    }

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

    // Render Next Action Button or Auto-Transition
    // Render Next Action Button (Manual)
    if (nextStep) {
        resultContainer.innerHTML += `
            <div class="mt-4 flex justify-end animate-fade-in">
                <button onclick="startDialogue('${nextStep}')" class="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-amber-500 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2 group shadow-lg">
                    Continuar <i class="fas fa-chevron-right text-amber-500 group-hover:translate-x-1 transition-transform"></i>
                </button>
            </div>
        `;
        document.getElementById('dialogue-options').innerHTML = '';

    } else {
        // End of branch: Offer choice to Close or Return
        document.getElementById('dialogue-options').innerHTML = '';

        // If it was a success (e.g. Mission Accepted), force a cleanup option to avoid looping
        if (isSuccess) {
            resultContainer.innerHTML += `
                <div class="flex flex-col gap-2 mt-4 animate-fade-in">
                    <button onclick="event.stopPropagation(); closeDialogue()" class="w-full py-3 bg-green-900/50 hover:bg-green-800 border-2 border-green-500 rounded text-center uppercase tracking-widest text-sm font-bold text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all transform hover:scale-[1.02]">
                        ✅ ¡Hecho! (Cerrar)
                    </button>
                </div>
            `;
        } else {
            // Failure or neutral end: allow retry if appropriate (or close)
            resultContainer.innerHTML += `
                <div class="flex flex-col gap-2 mt-4 animate-fade-in">
                    <button onclick="event.stopPropagation(); closeDialogue()" class="w-full py-3 bg-red-900/50 hover:bg-red-800 border-2 border-red-500 rounded text-center uppercase tracking-widest text-sm font-bold text-white shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all transform hover:scale-[1.02]">
                        👋 Terminar Conversación
                    </button>
                    ${!opt.onFailure ? `
                    <button onclick="retryDialogue()" class="w-full py-2 text-gray-400 hover:text-white text-xs uppercase tracking-widest transition-colors">
                        <i class="fas fa-undo mr-1"></i> Intentar otra cosa
                    </button>` : ''}
                </div>
            `;
        }
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

function handleReward(item) {
    // Add to player inventory
    // We import addItem from player.js
    addItem(item);

    // Visual Feedback (BG3 Style Modal)
    const rewardModal = document.createElement('div');
    rewardModal.className = "fixed inset-0 z-[100] flex items-center justify-center bg-black/80 animate-fade-in";
    rewardModal.onclick = () => rewardModal.remove();

    // Color based on rarity
    let colorClass = "text-white";
    if (item.rarity === 'legendary') colorClass = "text-amber-500";
    if (item.rarity === 'rare') colorClass = "text-blue-400";
    if (item.rarity === 'uncommon') colorClass = "text-green-400";

    rewardModal.innerHTML = `
        <div class="glass-panel p-8 rounded-xl border border-white/20 text-center transform scale-90 animate-fade-in-up max-w-sm mx-4 bg-black/90 shadow-[0_0_50px_rgba(255,165,0,0.2)]">
            <h2 class="text-xs uppercase tracking-[0.3em] text-gray-400 mb-6 border-b border-white/10 pb-2">Recompensa Obtenida</h2>
            
            <div class="relative w-24 h-24 mx-auto mb-6 group">
                <div class="absolute inset-0 bg-${item.rarity === 'legendary' ? 'amber' : 'blue'}-500/20 rounded-full blur-xl animate-pulse"></div>
                <div class="relative w-full h-full bg-black/50 rounded-full border-2 border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
                     ${item.image ? `<img src="${item.image}" class="w-full h-full object-cover" style="mix-blend-mode: multiply;">` : `<i class="fas fa-gift text-4xl ${colorClass}"></i>`}
                </div>
            </div>

            <h3 class="font-cinzel text-2xl font-bold ${colorClass} mb-2 drop-shadow-md">${item.name}</h3>
            
            <div class="h-px w-16 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-4"></div>
            
            <p class="text-gray-300 italic text-sm leading-relaxed mb-6">"${item.desc}"</p>
            
            <div class="text-[10px] text-gray-500 uppercase tracking-widest animate-pulse flex items-center justify-center gap-2">
                <i class="fas fa-mouse"></i> Click para continuar
            </div>
        </div>
    `;

    document.body.appendChild(rewardModal);
}
