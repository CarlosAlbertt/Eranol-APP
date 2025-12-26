/**
 * Base de Datos de Objetos Mágicos en Español
 * Traducción completa de D&D 5e SRD
 */

export const magicItemsES = [
    // ========== ARMADURAS ==========
    { id: "adamantine-armor", name: "Armadura de Adamantina", type: "Armadura", rarity: "Poco Común", desc: "Los golpes críticos contra ti se convierten en golpes normales." },
    { id: "armor-1", name: "Armadura +1", type: "Armadura", rarity: "Raro", desc: "+1 a la CA mientras llevas esta armadura." },
    { id: "armor-2", name: "Armadura +2", type: "Armadura", rarity: "Muy Raro", desc: "+2 a la CA mientras llevas esta armadura." },
    { id: "armor-3", name: "Armadura +3", type: "Armadura", rarity: "Legendario", desc: "+3 a la CA mientras llevas esta armadura." },
    { id: "armor-of-invulnerability", name: "Armadura de Invulnerabilidad", type: "Armadura", rarity: "Legendario", desc: "Resistencia al daño no mágico. Una vez al día, inmunidad a daño no mágico." },
    { id: "armor-of-resistance", name: "Armadura de Resistencia", type: "Armadura", rarity: "Raro", desc: "Resistencia a un tipo de daño determinado." },
    { id: "demon-armor", name: "Armadura Demoníaca", type: "Armadura", rarity: "Muy Raro", desc: "+1 CA, conoces abisal, desventaja en ataques contra demonios. Maldita." },
    { id: "dragon-scale-mail", name: "Cota de Escamas de Dragón", type: "Armadura", rarity: "Muy Raro", desc: "+1 CA, resistencia a un tipo de daño según el dragón, ventaja en salvaciones." },
    { id: "dwarven-plate", name: "Coraza Enana", type: "Armadura", rarity: "Muy Raro", desc: "+2 CA, reduce empujones y derribos 10 pies." },
    { id: "elven-chain", name: "Cota Élfica", type: "Armadura", rarity: "Raro", desc: "+1 CA, puedes llevarla sin competencia." },
    { id: "glamoured-studded-leather", name: "Cuero Tachonado Glamuroso", type: "Armadura", rarity: "Raro", desc: "+1 CA, puede cambiar de apariencia a voluntad." },
    { id: "mithral-armor", name: "Armadura de Mithral", type: "Armadura", rarity: "Poco Común", desc: "Sin desventaja en Sigilo, sin requisito de Fuerza." },
    { id: "plate-armor-of-etherealness", name: "Armadura de Placas Etéreas", type: "Armadura", rarity: "Legendario", desc: "Una vez al día puedes volverte etéreo durante 10 minutos." },

    // ========== ESCUDOS ==========
    { id: "animated-shield", name: "Escudo Animado", type: "Escudo", rarity: "Muy Raro", desc: "Flota y te protege sin usar las manos." },
    { id: "arrow-catching-shield", name: "Escudo Atrapa-Flechas", type: "Escudo", rarity: "Raro", desc: "+2 CA contra ataques a distancia, puedes atrapar proyectiles." },
    { id: "spellguard-shield", name: "Escudo Guardahechizos", type: "Escudo", rarity: "Muy Raro", desc: "Ventaja en salvaciones contra hechizos, ataques de hechizo con desventaja contra ti." },
    { id: "shield-of-missile-attraction", name: "Escudo Atractor de Proyectiles", type: "Escudo", rarity: "Raro", desc: "Maldito: los proyectiles cercanos te atacan a ti." },

    // ========== ARMAS ==========
    { id: "weapon-1", name: "Arma +1", type: "Arma", rarity: "Poco Común", desc: "+1 a tiradas de ataque y daño." },
    { id: "weapon-2", name: "Arma +2", type: "Arma", rarity: "Raro", desc: "+2 a tiradas de ataque y daño." },
    { id: "weapon-3", name: "Arma +3", type: "Arma", rarity: "Muy Raro", desc: "+3 a tiradas de ataque y daño." },
    { id: "berserker-axe", name: "Hacha del Berserker", type: "Arma", rarity: "Raro", desc: "+1 ataque/daño, +1 HP por nivel. Maldita: furia en combate." },
    { id: "dancing-sword", name: "Espada Danzarina", type: "Arma", rarity: "Muy Raro", desc: "Flota y ataca sola durante 4 turnos." },
    { id: "defender", name: "Defensora", type: "Arma", rarity: "Legendario", desc: "+3, puedes transferir el bono a CA en lugar de ataque." },
    { id: "dragon-slayer", name: "Matadragones", type: "Arma", rarity: "Raro", desc: "+1, +3d6 daño extra contra dragones." },
    { id: "dwarven-thrower", name: "Martillo Arrojadizo Enano", type: "Arma", rarity: "Muy Raro", desc: "+3, vuelve a tu mano, +2d8 contra gigantes." },
    { id: "flame-tongue", name: "Lengua de Fuego", type: "Arma", rarity: "Raro", desc: "Enciende en llamas: +2d6 daño de fuego, luz 40/80 pies." },
    { id: "frost-brand", name: "Marca de Escarcha", type: "Arma", rarity: "Muy Raro", desc: "+1d6 frío, resistencia al fuego, extingue llamas cercanas." },
    { id: "giant-slayer", name: "Matagigantes", type: "Arma", rarity: "Raro", desc: "+1, +2d6 contra gigantes y salvación o caen." },
    { id: "holy-avenger", name: "Vengador Sagrado", type: "Arma", rarity: "Legendario", desc: "+3, +2d10 radiante contra demonios/no-muertos, aura de protección." },
    { id: "javelin-of-lightning", name: "Jabalina del Relámpago", type: "Arma", rarity: "Poco Común", desc: "Se transforma en rayo de 120 pies, 4d6 eléctrico." },
    { id: "luck-blade", name: "Hoja de la Suerte", type: "Arma", rarity: "Legendario", desc: "+1, +1 salvaciones, 1d3 deseos." },
    { id: "mace-of-disruption", name: "Maza de Disrupción", type: "Arma", rarity: "Raro", desc: "+2d6 radiante contra demonios/no-muertos, puede destruirlos." },
    { id: "mace-of-smiting", name: "Maza Aplastante", type: "Arma", rarity: "Raro", desc: "+1 (+3 vs constructos), crítico: daño extra o destruye constructo." },
    { id: "mace-of-terror", name: "Maza del Terror", type: "Arma", rarity: "Raro", desc: "3 cargas: Miedo en cono de 30 pies." },
    { id: "nine-lives-stealer", name: "Ladrón de Nueve Vidas", type: "Arma", rarity: "Muy Raro", desc: "+2, crítico contra objetivo con menos de 100 HP: muerte instantánea (9 cargas)." },
    { id: "oathbow", name: "Arco del Juramento", type: "Arma", rarity: "Muy Raro", desc: "Jura enemigo: +3d6 daño, no puedes errar, ignora cobertura." },
    { id: "scimitar-of-speed", name: "Cimitarra de Velocidad", type: "Arma", rarity: "Muy Raro", desc: "+2, un ataque extra con acción adicional." },
    { id: "sun-blade", name: "Espada Solar", type: "Arma", rarity: "Raro", desc: "+2, +1d8 radiante vs no-muertos, luz solar 30/60 pies." },
    { id: "sword-of-life-stealing", name: "Espada Robavidas", type: "Arma", rarity: "Raro", desc: "Crítico: +10 daño necrótico, ganas 10 HP temporales." },
    { id: "sword-of-sharpness", name: "Espada Afilada", type: "Arma", rarity: "Muy Raro", desc: "Crítico: +14 daño cortante, 20 natural: corta extremidad." },
    { id: "sword-of-wounding", name: "Espada Hiriente", type: "Arma", rarity: "Raro", desc: "Las heridas sangran 1d4 por turno hasta curación." },
    { id: "vicious-weapon", name: "Arma Viciosa", type: "Arma", rarity: "Raro", desc: "Crítico: +7 daño extra del tipo del arma." },
    { id: "vorpal-sword", name: "Espada Vorpal", type: "Arma", rarity: "Legendario", desc: "+3, con 20 natural decapita al enemigo (muerte instantánea)." },
    { id: "dagger-of-venom", name: "Daga de Veneno", type: "Arma", rarity: "Raro", desc: "+1, una vez al día: 2d10 veneno + envenenado." },
    { id: "trident-of-fish-command", name: "Tridente de Control de Peces", type: "Arma", rarity: "Poco Común", desc: "3 cargas: Dominar Bestias sobre peces." },

    // ========== VARITAS ==========
    { id: "wand-of-binding", name: "Varita de Atadura", type: "Varita", rarity: "Raro", desc: "7 cargas: Retener Persona, Retener Monstruo." },
    { id: "wand-of-enemy-detection", name: "Varita de Detección de Enemigos", type: "Varita", rarity: "Raro", desc: "7 cargas: Detecta enemigos en 60 pies." },
    { id: "wand-of-fear", name: "Varita del Miedo", type: "Varita", rarity: "Raro", desc: "7 cargas: Causar Miedo, cono de terror." },
    { id: "wand-of-fireballs", name: "Varita de Bolas de Fuego", type: "Varita", rarity: "Raro", desc: "7 cargas: Bola de Fuego (8d6+)." },
    { id: "wand-of-lightning-bolts", name: "Varita de Relámpagos", type: "Varita", rarity: "Raro", desc: "7 cargas: Rayo (8d6+)." },
    { id: "wand-of-magic-detection", name: "Varita de Detección de Magia", type: "Varita", rarity: "Poco Común", desc: "3 cargas: Detectar Magia." },
    { id: "wand-of-magic-missiles", name: "Varita de Proyectiles Mágicos", type: "Varita", rarity: "Poco Común", desc: "7 cargas: Proyectil Mágico." },
    { id: "wand-of-paralysis", name: "Varita de Parálisis", type: "Varita", rarity: "Raro", desc: "7 cargas: Paraliza objetivos." },
    { id: "wand-of-polymorph", name: "Varita de Polimorfar", type: "Varita", rarity: "Muy Raro", desc: "7 cargas: Polimorfar." },
    { id: "wand-of-secrets", name: "Varita de Secretos", type: "Varita", rarity: "Poco Común", desc: "3 cargas: Detecta puertas y trampas en 30 pies." },
    { id: "wand-of-web", name: "Varita de Telaraña", type: "Varita", rarity: "Poco Común", desc: "7 cargas: Telaraña." },
    { id: "wand-of-wonder", name: "Varita de los Prodigios", type: "Varita", rarity: "Raro", desc: "7 cargas: Efecto aleatorio (tabla d100)." },

    // ========== BASTONES ==========
    { id: "staff-of-charming", name: "Bastón de Encantamiento", type: "Bastón", rarity: "Raro", desc: "10 cargas: Encantar Persona, Mandar, Comprensión de Idiomas." },
    { id: "staff-of-fire", name: "Bastón de Fuego", type: "Bastón", rarity: "Muy Raro", desc: "10 cargas: Muro de Fuego, Bola de Fuego, Manos Ardientes." },
    { id: "staff-of-frost", name: "Bastón de Escarcha", type: "Bastón", rarity: "Muy Raro", desc: "10 cargas: Cono de Frío, Niebla, Muro de Hielo." },
    { id: "staff-of-healing", name: "Bastón de Curación", type: "Bastón", rarity: "Raro", desc: "10 cargas: Curar Heridas, Curación Masiva, Restauración Menor." },
    { id: "staff-of-power", name: "Bastón del Poder", type: "Bastón", rarity: "Muy Raro", desc: "+2 CA/ataques/salvaciones, múltiples hechizos, golpe de represalia." },
    { id: "staff-of-striking", name: "Bastón de Golpear", type: "Bastón", rarity: "Muy Raro", desc: "+3, gasta cargas para +1d6 de fuerza por carga." },
    { id: "staff-of-swarming-insects", name: "Bastón de Enjambre de Insectos", type: "Bastón", rarity: "Raro", desc: "10 cargas: Plaga de Insectos, Enjambre de Insectos Gigantes." },
    { id: "staff-of-the-magi", name: "Bastón del Mago", type: "Bastón", rarity: "Legendario", desc: "+2 CA/salvaciones, absorbe hechizos, múltiples conjuros poderosos." },
    { id: "staff-of-the-python", name: "Bastón de la Pitón", type: "Bastón", rarity: "Poco Común", desc: "Se transforma en serpiente constrictora gigante." },
    { id: "staff-of-the-woodlands", name: "Bastón de los Bosques", type: "Bastón", rarity: "Raro", desc: "+2 ataques, varios hechizos de la naturaleza, pasa a través de plantas." },
    { id: "staff-of-thunder-and-lightning", name: "Bastón del Trueno y Relámpago", type: "Bastón", rarity: "Muy Raro", desc: "Rayo, trueno, golpe aturdidor, varios poderes eléctricos." },
    { id: "staff-of-withering", name: "Bastón Marchitador", type: "Bastón", rarity: "Raro", desc: "3 cargas: +2d10 necrótico y -1 a FUE o CON." },

    // ========== ANILLOS ==========
    { id: "ring-of-animal-influence", name: "Anillo de Influencia Animal", type: "Anillo", rarity: "Raro", desc: "3 cargas: Amistad con Animales, Miedo, Hablar con Animales." },
    { id: "ring-of-djinni-summoning", name: "Anillo de Invocación de Djinn", type: "Anillo", rarity: "Legendario", desc: "Invoca un djinn que te sirve durante 1 hora al día." },
    { id: "ring-of-evasion", name: "Anillo de Evasión", type: "Anillo", rarity: "Raro", desc: "3 cargas: Éxito automático en salvación de DES." },
    { id: "ring-of-feather-falling", name: "Anillo de Caída de Pluma", type: "Anillo", rarity: "Raro", desc: "Caes lentamente a 60 pies por turno sin daño." },
    { id: "ring-of-free-action", name: "Anillo de Acción Libre", type: "Anillo", rarity: "Raro", desc: "Inmune a parálisis, restricción, terreno difícil." },
    { id: "ring-of-invisibility", name: "Anillo de Invisibilidad", type: "Anillo", rarity: "Legendario", desc: "Invisible a voluntad hasta atacar/lanzar hechizo." },
    { id: "ring-of-jumping", name: "Anillo de Salto", type: "Anillo", rarity: "Poco Común", desc: "Salto triple distancia." },
    { id: "ring-of-mind-shielding", name: "Anillo de Escudo Mental", type: "Anillo", rarity: "Poco Común", desc: "Inmune a telepatía y detección de pensamientos." },
    { id: "ring-of-protection", name: "Anillo de Protección", type: "Anillo", rarity: "Raro", desc: "+1 CA y salvaciones." },
    { id: "ring-of-regeneration", name: "Anillo de Regeneración", type: "Anillo", rarity: "Muy Raro", desc: "Recuperas 1d6 HP cada 10 minutos, regeneras extremidades." },
    { id: "ring-of-spell-storing", name: "Anillo de Almacenar Hechizos", type: "Anillo", rarity: "Raro", desc: "Almacena hasta 5 niveles de hechizos." },
    { id: "ring-of-spell-turning", name: "Anillo de Desviar Hechizos", type: "Anillo", rarity: "Legendario", desc: "Ventaja en salvaciones vs magia, refleja hechizos fallados." },
    { id: "ring-of-swimming", name: "Anillo de Natación", type: "Anillo", rarity: "Poco Común", desc: "Velocidad de natación 40 pies." },
    { id: "ring-of-telekinesis", name: "Anillo de Telequinesis", type: "Anillo", rarity: "Muy Raro", desc: "Lanza Telequinesis a voluntad." },
    { id: "ring-of-the-ram", name: "Anillo del Ariete", type: "Anillo", rarity: "Raro", desc: "3 cargas: Golpe de fuerza 60 pies, 2d10 por carga." },
    { id: "ring-of-three-wishes", name: "Anillo de Tres Deseos", type: "Anillo", rarity: "Legendario", desc: "Concede 3 deseos, se vuelve no mágico después." },
    { id: "ring-of-warmth", name: "Anillo de Calidez", type: "Anillo", rarity: "Poco Común", desc: "Resistencia al frío, cómodo hasta -45°C." },
    { id: "ring-of-water-walking", name: "Anillo de Caminar sobre Agua", type: "Anillo", rarity: "Poco Común", desc: "Caminas sobre superficies líquidas." },
    { id: "ring-of-x-ray-vision", name: "Anillo de Visión de Rayos X", type: "Anillo", rarity: "Raro", desc: "Ves a través de paredes hasta 30 pies." },

    // ========== POCIONES ==========
    { id: "potion-of-healing", name: "Poción de Curación", type: "Poción", rarity: "Común", desc: "Recuperas 2d4+2 puntos de golpe." },
    { id: "potion-of-healing-greater", name: "Poción de Curación Mayor", type: "Poción", rarity: "Poco Común", desc: "Recuperas 4d4+4 puntos de golpe." },
    { id: "potion-of-healing-superior", name: "Poción de Curación Superior", type: "Poción", rarity: "Raro", desc: "Recuperas 8d4+8 puntos de golpe." },
    { id: "potion-of-healing-supreme", name: "Poción de Curación Suprema", type: "Poción", rarity: "Muy Raro", desc: "Recuperas 10d4+20 puntos de golpe." },
    { id: "potion-of-flying", name: "Poción de Vuelo", type: "Poción", rarity: "Muy Raro", desc: "Vuelas 60 pies durante 1 hora." },
    { id: "potion-of-invisibility", name: "Poción de Invisibilidad", type: "Poción", rarity: "Muy Raro", desc: "Invisible durante 1 hora." },
    { id: "potion-of-speed", name: "Poción de Velocidad", type: "Poción", rarity: "Muy Raro", desc: "Efecto de Acelerar durante 1 minuto." },
    { id: "potion-of-heroism", name: "Poción de Heroísmo", type: "Poción", rarity: "Raro", desc: "10 HP temporales, bendecido durante 1 hora." },
    { id: "potion-of-growth", name: "Poción de Crecimiento", type: "Poción", rarity: "Poco Común", desc: "Duplicas tu tamaño durante 1d4 horas." },
    { id: "potion-of-diminution", name: "Poción de Reducción", type: "Poción", rarity: "Raro", desc: "Reduces tu tamaño a la mitad durante 1d4 horas." },
    { id: "potion-of-climbing", name: "Poción de Escalada", type: "Poción", rarity: "Común", desc: "Velocidad de escalada igual a tu velocidad durante 1 hora." },
    { id: "potion-of-water-breathing", name: "Poción de Respirar Bajo el Agua", type: "Poción", rarity: "Poco Común", desc: "Respiras bajo el agua durante 1 hora." },
    { id: "potion-of-resistance-fire", name: "Poción de Resistencia al Fuego", type: "Poción", rarity: "Poco Común", desc: "Resistencia al daño de fuego durante 1 hora." },
    { id: "potion-of-resistance-cold", name: "Poción de Resistencia al Frío", type: "Poción", rarity: "Poco Común", desc: "Resistencia al daño de frío durante 1 hora." },
    { id: "potion-of-resistance-lightning", name: "Poción de Resistencia al Rayo", type: "Poción", rarity: "Poco Común", desc: "Resistencia al daño de rayo durante 1 hora." },
    { id: "oil-of-sharpness", name: "Aceite de Afilado", type: "Poción", rarity: "Muy Raro", desc: "Arma gana +3 durante 1 hora." },
    { id: "oil-of-slipperiness", name: "Aceite Resbaladizo", type: "Poción", rarity: "Poco Común", desc: "Efecto de Libertad de Movimiento o Grasa." },
    { id: "philter-of-love", name: "Filtro de Amor", type: "Poción", rarity: "Poco Común", desc: "Encantado por la primera criatura que veas durante 1 hora." },

    // ========== CAPAS Y MANTOS ==========
    { id: "cloak-of-displacement", name: "Capa de Desplazamiento", type: "Objeto Maravilloso", rarity: "Raro", desc: "Ataques con desventaja contra ti hasta que te golpeen." },
    { id: "cloak-of-elvenkind", name: "Capa Élfica", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Ventaja en Sigilo, desventaja en Percepción para verte." },
    { id: "cloak-of-protection", name: "Capa de Protección", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "+1 CA y salvaciones." },
    { id: "cloak-of-the-bat", name: "Capa del Murciélago", type: "Objeto Maravilloso", rarity: "Raro", desc: "Ventaja en Sigilo, puedes volar y transformarte en murciélago." },
    { id: "cloak-of-the-manta-ray", name: "Capa de la Mantarraya", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Respiras bajo el agua, nadas 60 pies." },
    { id: "cloak-of-arachnida", name: "Capa de Arácnido", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Trepas paredes, inmune a telarañas, resistencia a veneno." },
    { id: "cape-of-the-mountebank", name: "Capa del Charlatán", type: "Objeto Maravilloso", rarity: "Raro", desc: "Una vez al día: Puerta Dimensional." },
    { id: "mantle-of-spell-resistance", name: "Manto de Resistencia a Hechizos", type: "Objeto Maravilloso", rarity: "Raro", desc: "Ventaja en salvaciones contra hechizos." },
    { id: "robe-of-the-archmagi", name: "Túnica del Archimago", type: "Objeto Maravilloso", rarity: "Legendario", desc: "+2 CA, ventaja en salvaciones vs magia, CD de hechizos +2." },
    { id: "robe-of-eyes", name: "Túnica de los Ojos", type: "Objeto Maravilloso", rarity: "Raro", desc: "Ves en todas direcciones, visión en la oscuridad 120 pies." },
    { id: "robe-of-stars", name: "Túnica de las Estrellas", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "+1 salvaciones, 6 cargas de Proyectil Mágico, viaja al Astral." },
    { id: "robe-of-scintillating-colors", name: "Túnica de Colores Centelleantes", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Aturde a criaturas cercanas con luz parpadeante." },
    { id: "robe-of-useful-items", name: "Túnica de Objetos Útiles", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Parches que se convierten en objetos reales." },

    // ========== BOTAS ==========
    { id: "boots-of-elvenkind", name: "Botas Élficas", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Pasos silenciosos, ventaja en Sigilo." },
    { id: "boots-of-levitation", name: "Botas de Levitación", type: "Objeto Maravilloso", rarity: "Raro", desc: "Levitas a voluntad." },
    { id: "boots-of-speed", name: "Botas de Velocidad", type: "Objeto Maravilloso", rarity: "Raro", desc: "Duplica tu velocidad, ataques con desventaja contra ti." },
    { id: "boots-of-striding-and-springing", name: "Botas de Zancada y Salto", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Velocidad 30 pies mínimo, salto triple." },
    { id: "boots-of-the-winterlands", name: "Botas de las Tierras Invernales", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Resistencia al frío, caminas sobre hielo y nieve." },
    { id: "winged-boots", name: "Botas Aladas", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Vuelas hasta 4 horas al día." },
    { id: "slippers-of-spider-climbing", name: "Zapatillas de Trepar Arañas", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Caminas por paredes y techos." },

    // ========== GUANTES Y BRAZALES ==========
    { id: "gauntlets-of-ogre-power", name: "Guanteletes de Poder de Ogro", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Tu Fuerza es 19." },
    { id: "gloves-of-missile-snaring", name: "Guantes Atrapa-Proyectiles", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Reduces daño de proyectiles 1d10+DES, atrapas si reduces a 0." },
    { id: "gloves-of-swimming-and-climbing", name: "Guantes de Natación y Escalada", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Velocidad de natación y escalada igual a tu velocidad." },
    { id: "bracers-of-archery", name: "Brazales de Arquería", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "+2 daño con arcos, competencia con arcos." },
    { id: "bracers-of-defense", name: "Brazales de Defensa", type: "Objeto Maravilloso", rarity: "Raro", desc: "+2 CA si no llevas armadura ni escudo." },

    // ========== AMULETOS Y COLLARES ==========
    { id: "amulet-of-health", name: "Amuleto de Salud", type: "Objeto Maravilloso", rarity: "Raro", desc: "Tu Constitución es 19." },
    { id: "amulet-of-proof-against-detection", name: "Amuleto Contra la Detección", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Oculto de adivinación y detección mágica." },
    { id: "amulet-of-the-planes", name: "Amuleto de los Planos", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Viaja entre planos con Cambiar de Plano." },
    { id: "necklace-of-adaptation", name: "Collar de Adaptación", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Respiras en cualquier ambiente." },
    { id: "necklace-of-fireballs", name: "Collar de Bolas de Fuego", type: "Objeto Maravilloso", rarity: "Raro", desc: "Cuentas que lanzan Bolas de Fuego." },
    { id: "necklace-of-prayer-beads", name: "Collar de Cuentas de Oración", type: "Objeto Maravilloso", rarity: "Raro", desc: "Cuentas con hechizos divinos." },
    { id: "periapt-of-health", name: "Periapto de Salud", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Inmune a enfermedades." },
    { id: "periapt-of-proof-against-poison", name: "Periapto Contra el Veneno", type: "Objeto Maravilloso", rarity: "Raro", desc: "Inmune a veneno." },
    { id: "periapt-of-wound-closure", name: "Periapto de Cierre de Heridas", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Te estabilizas automáticamente, recuperas HP dobles." },
    { id: "medallion-of-thoughts", name: "Medallón de Pensamientos", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "3 cargas: Detectar Pensamientos." },
    { id: "scarab-of-protection", name: "Escarabajo de Protección", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Ventaja en salvaciones, 12 cargas absorben hechizos mortales." },

    // ========== BOLSAS Y CONTENEDORES ==========
    { id: "bag-of-holding", name: "Bolsa de Contención", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Interior extradimensional: 500 libras, 64 pies cúbicos." },
    { id: "bag-of-beans", name: "Bolsa de Habichuelas", type: "Objeto Maravilloso", rarity: "Raro", desc: "Habichuelas mágicas con efectos aleatorios." },
    { id: "bag-of-devouring", name: "Bolsa Devoradora", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Maldita: conecta a boca de criatura extradimensional." },
    { id: "bag-of-tricks", name: "Bolsa de Trucos", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Saca bolas de pelusa que se convierten en animales." },
    { id: "handy-haversack", name: "Mochila Práctica", type: "Objeto Maravilloso", rarity: "Raro", desc: "Bolsa de contención con acceso instantáneo a objetos." },
    { id: "portable-hole", name: "Agujero Portátil", type: "Objeto Maravilloso", rarity: "Raro", desc: "Círculo de tela que crea hoyo extradimensional." },
    { id: "efficient-quiver", name: "Carcaj Eficiente", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Contiene 60 flechas, 18 jabalinas o 6 arcos." },
    { id: "iron-flask", name: "Frasco de Hierro", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Atrapa criaturas extraplanares." },
    { id: "decanter-of-endless-water", name: "Jarra de Agua Infinita", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Produce agua fresca ilimitada." },
    { id: "eversmoking-bottle", name: "Botella de Humo Eterno", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Llena área con humo espeso." },
    { id: "efreeti-bottle", name: "Botella del Efreeti", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Contiene un efreeti que puede servirte o atacarte." },

    // ========== CINTURONES Y DIADEMAS ==========
    { id: "belt-of-dwarvenkind", name: "Cinturón de los Enanos", type: "Objeto Maravilloso", rarity: "Raro", desc: "+2 CON, resistencia a veneno, creces barba." },
    { id: "belt-of-giant-strength-hill", name: "Cinturón de Fuerza de Gigante de las Colinas", type: "Objeto Maravilloso", rarity: "Raro", desc: "Tu Fuerza es 21." },
    { id: "belt-of-giant-strength-stone", name: "Cinturón de Fuerza de Gigante de Piedra", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Tu Fuerza es 23." },
    { id: "belt-of-giant-strength-frost", name: "Cinturón de Fuerza de Gigante de Escarcha", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Tu Fuerza es 23." },
    { id: "belt-of-giant-strength-fire", name: "Cinturón de Fuerza de Gigante de Fuego", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Tu Fuerza es 25." },
    { id: "belt-of-giant-strength-cloud", name: "Cinturón de Fuerza de Gigante de las Nubes", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Tu Fuerza es 27." },
    { id: "belt-of-giant-strength-storm", name: "Cinturón de Fuerza de Gigante de las Tormentas", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Tu Fuerza es 29." },
    { id: "headband-of-intellect", name: "Diadema del Intelecto", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Tu Inteligencia es 19." },

    // ========== CASCOS Y YELMOS ==========
    { id: "helm-of-brilliance", name: "Yelmo del Resplandor", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Gemas que lanzan hechizos de fuego, luz solar dañina." },
    { id: "helm-of-comprehending-languages", name: "Yelmo de Comprensión de Idiomas", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Entiendes cualquier idioma escrito o hablado." },
    { id: "helm-of-telepathy", name: "Yelmo de Telepatía", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Telepatía 30 pies, Detectar Pensamientos." },
    { id: "helm-of-teleportation", name: "Yelmo de Teletransporte", type: "Objeto Maravilloso", rarity: "Raro", desc: "3 cargas: Teletransporte." },
    { id: "circlet-of-blasting", name: "Diadema Explosiva", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Una vez al día: Rayo Abrasador." },
    { id: "goggles-of-night", name: "Gafas de la Noche", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Visión en la oscuridad 60 pies." },
    { id: "eyes-of-charming", name: "Ojos del Encantamiento", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "3 cargas: Encantar Persona." },
    { id: "eyes-of-minute-seeing", name: "Ojos de Visión Minuciosa", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Ventaja en Investigación para objetos pequeños." },
    { id: "eyes-of-the-eagle", name: "Ojos del Águila", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Ventaja en Percepción visual." },
    { id: "hat-of-disguise", name: "Sombrero del Disfraz", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Lanza Disfrazarse a voluntad." },

    // ========== CUERDAS Y OBJETOS VARIOS ==========
    { id: "rope-of-climbing", name: "Cuerda Trepadora", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "60 pies de cuerda que obedece comandos." },
    { id: "rope-of-entanglement", name: "Cuerda de Enredo", type: "Objeto Maravilloso", rarity: "Raro", desc: "Atrapa y restringe criaturas." },
    { id: "immovable-rod", name: "Vara Inamovible", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Se fija en el espacio, soporta 8000 libras." },
    { id: "lantern-of-revealing", name: "Linterna Reveladora", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Revela criaturas invisibles en su luz." },
    { id: "gem-of-brightness", name: "Gema del Resplandor", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "50 cargas de luz, ceguera." },
    { id: "gem-of-seeing", name: "Gema de Visión Verdadera", type: "Objeto Maravilloso", rarity: "Raro", desc: "3 cargas: Visión Verdadera 120 pies." },
    { id: "chime-of-opening", name: "Campana de Apertura", type: "Objeto Maravilloso", rarity: "Raro", desc: "10 cargas: Abre cerraduras y cerrojos." },
    { id: "dimensional-shackles", name: "Grilletes Dimensionales", type: "Objeto Maravilloso", rarity: "Raro", desc: "Impiden teletransporte y viaje planar." },
    { id: "iron-bands-of-binding", name: "Bandas de Hierro del Aprisionamiento", type: "Objeto Maravilloso", rarity: "Raro", desc: "Esferas que aprisionan criaturas." },
    { id: "sovereign-glue", name: "Pegamento Soberano", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Une permanentemente cualquier objeto." },
    { id: "universal-solvent", name: "Solvente Universal", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Disuelve cualquier adhesivo." },
    { id: "stone-of-good-luck", name: "Piedra de la Buena Suerte", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "+1 a pruebas de característica y salvaciones." },

    // ========== BOLAS DE CRISTAL ==========
    { id: "crystal-ball", name: "Bola de Cristal", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Lanza Escudriñar." },
    { id: "crystal-ball-of-mind-reading", name: "Bola de Cristal de Leer Mentes", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Escudriñar + Detectar Pensamientos." },
    { id: "crystal-ball-of-telepathy", name: "Bola de Cristal de Telepatía", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Escudriñar + Telepatía + Sugestión." },
    { id: "crystal-ball-of-true-seeing", name: "Bola de Cristal de Visión Verdadera", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Escudriñar + Visión Verdadera." },

    // ========== PERGAMINOS ==========
    { id: "spell-scroll-1st", name: "Pergamino de Hechizo (1º)", type: "Pergamino", rarity: "Común", desc: "Contiene un hechizo de nivel 1." },
    { id: "spell-scroll-2nd", name: "Pergamino de Hechizo (2º)", type: "Pergamino", rarity: "Poco Común", desc: "Contiene un hechizo de nivel 2." },
    { id: "spell-scroll-3rd", name: "Pergamino de Hechizo (3º)", type: "Pergamino", rarity: "Poco Común", desc: "Contiene un hechizo de nivel 3." },
    { id: "spell-scroll-4th", name: "Pergamino de Hechizo (4º)", type: "Pergamino", rarity: "Raro", desc: "Contiene un hechizo de nivel 4." },
    { id: "spell-scroll-5th", name: "Pergamino de Hechizo (5º)", type: "Pergamino", rarity: "Raro", desc: "Contiene un hechizo de nivel 5." },
    { id: "spell-scroll-6th", name: "Pergamino de Hechizo (6º)", type: "Pergamino", rarity: "Muy Raro", desc: "Contiene un hechizo de nivel 6." },
    { id: "spell-scroll-7th", name: "Pergamino de Hechizo (7º)", type: "Pergamino", rarity: "Muy Raro", desc: "Contiene un hechizo de nivel 7." },
    { id: "spell-scroll-8th", name: "Pergamino de Hechizo (8º)", type: "Pergamino", rarity: "Muy Raro", desc: "Contiene un hechizo de nivel 8." },
    { id: "spell-scroll-9th", name: "Pergamino de Hechizo (9º)", type: "Pergamino", rarity: "Legendario", desc: "Contiene un hechizo de nivel 9." },

    // ========== INSTRUMENTOS ==========
    { id: "horn-of-blasting", name: "Cuerno de Estallido", type: "Objeto Maravilloso", rarity: "Raro", desc: "Cono de trueno 30 pies, 5d6 daño." },
    { id: "horn-of-valhalla-silver", name: "Cuerno de Valhalla (Plata)", type: "Objeto Maravilloso", rarity: "Raro", desc: "Invoca 2d4+2 espíritus guerreros." },
    { id: "horn-of-valhalla-brass", name: "Cuerno de Valhalla (Latón)", type: "Objeto Maravilloso", rarity: "Raro", desc: "Invoca 3d4+3 espíritus guerreros." },
    { id: "horn-of-valhalla-bronze", name: "Cuerno de Valhalla (Bronce)", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Invoca 4d4+4 espíritus guerreros." },
    { id: "horn-of-valhalla-iron", name: "Cuerno de Valhalla (Hierro)", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Invoca 5d4+5 espíritus guerreros." },
    { id: "pipes-of-haunting", name: "Flautas Embrujadas", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "3 cargas: Miedo en 30 pies." },
    { id: "pipes-of-the-sewers", name: "Flautas de las Cloacas", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "3 cargas: Invoca enjambres de ratas." },

    // ========== FIGURAS MARAVILLOSAS ==========
    { id: "figurine-bronze-griffon", name: "Figura del Grifo de Bronce", type: "Objeto Maravilloso", rarity: "Raro", desc: "Se convierte en grifo durante 6 horas." },
    { id: "figurine-ebony-fly", name: "Figura de la Mosca de Ébano", type: "Objeto Maravilloso", rarity: "Raro", desc: "Se convierte en mosca gigante voladora." },
    { id: "figurine-golden-lions", name: "Figuras de los Leones Dorados", type: "Objeto Maravilloso", rarity: "Raro", desc: "Se convierten en 2 leones durante 1 hora." },
    { id: "figurine-ivory-goats", name: "Figuras de las Cabras de Marfil", type: "Objeto Maravilloso", rarity: "Raro", desc: "3 cabras con diferentes poderes." },
    { id: "figurine-marble-elephant", name: "Figura del Elefante de Mármol", type: "Objeto Maravilloso", rarity: "Raro", desc: "Se convierte en elefante durante 24 horas." },
    { id: "figurine-obsidian-steed", name: "Figura del Corcel de Obsidiana", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Se convierte en pesadilla o destrero." },
    { id: "figurine-onyx-dog", name: "Figura del Perro de Ónice", type: "Objeto Maravilloso", rarity: "Raro", desc: "Se convierte en mastín con visión verdadera." },
    { id: "figurine-serpentine-owl", name: "Figura del Búho Serpentino", type: "Objeto Maravilloso", rarity: "Raro", desc: "Se convierte en búho gigante mensajero." },
    { id: "figurine-silver-raven", name: "Figura del Cuervo de Plata", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Se convierte en cuervo mensajero." },

    // ========== CETROS ==========
    { id: "rod-of-absorption", name: "Cetro de Absorción", type: "Cetro", rarity: "Muy Raro", desc: "Absorbe hechizos dirigidos a ti (50 niveles máx)." },
    { id: "rod-of-alertness", name: "Cetro de Alerta", type: "Cetro", rarity: "Muy Raro", desc: "+1 iniciativa, detecta magia/alineamiento/pensamientos." },
    { id: "rod-of-lordly-might", name: "Cetro del Poder Señorial", type: "Cetro", rarity: "Legendario", desc: "Se transforma en armas, escala paredes, abre cerraduras." },
    { id: "rod-of-rulership", name: "Cetro del Dominio", type: "Cetro", rarity: "Raro", desc: "Una vez al día: Ordena a criaturas que te obedezcan." },
    { id: "rod-of-security", name: "Cetro de Seguridad", type: "Cetro", rarity: "Muy Raro", desc: "Transporta a 200 criaturas a un paraíso extradimensional." },

    // ========== ALFOMBRAS Y TRANSPORTE ==========
    { id: "carpet-of-flying-3x5", name: "Alfombra Voladora (90x150 cm)", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Vuela 80 pies, carga 200 libras." },
    { id: "carpet-of-flying-4x6", name: "Alfombra Voladora (120x180 cm)", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Vuela 60 pies, carga 400 libras." },
    { id: "carpet-of-flying-5x7", name: "Alfombra Voladora (150x210 cm)", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Vuela 40 pies, carga 600 libras." },
    { id: "carpet-of-flying-6x9", name: "Alfombra Voladora (180x270 cm)", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Vuela 30 pies, carga 800 libras." },
    { id: "broom-of-flying", name: "Escoba Voladora", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Vuela 50 pies, puede venir cuando la llamas." },
    { id: "folding-boat", name: "Bote Plegable", type: "Objeto Maravilloso", rarity: "Raro", desc: "Caja que se convierte en bote o barco." },
    { id: "apparatus-of-the-crab", name: "Aparato del Cangrejo", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Vehículo mecánico con forma de cangrejo gigante." },
    { id: "horseshoes-of-speed", name: "Herraduras de Velocidad", type: "Objeto Maravilloso", rarity: "Raro", desc: "Aumenta velocidad del caballo en 30 pies." },
    { id: "horseshoes-of-a-zephyr", name: "Herraduras del Céfiro", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "El caballo camina sobre agua y aire." },

    // ========== PIEDRAS IOUN ==========
    { id: "ioun-stone-absorption", name: "Piedra Ioun de Absorción", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Absorbe hechizos hasta 4º nivel (20 cargas)." },
    { id: "ioun-stone-agility", name: "Piedra Ioun de Agilidad", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "+2 Destreza (máximo 20)." },
    { id: "ioun-stone-awareness", name: "Piedra Ioun de Conciencia", type: "Objeto Maravilloso", rarity: "Raro", desc: "No puedes ser sorprendido." },
    { id: "ioun-stone-fortitude", name: "Piedra Ioun de Fortaleza", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "+2 Constitución (máximo 20)." },
    { id: "ioun-stone-insight", name: "Piedra Ioun de Perspicacia", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "+2 Sabiduría (máximo 20)." },
    { id: "ioun-stone-intellect", name: "Piedra Ioun del Intelecto", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "+2 Inteligencia (máximo 20)." },
    { id: "ioun-stone-leadership", name: "Piedra Ioun del Liderazgo", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "+2 Carisma (máximo 20)." },
    { id: "ioun-stone-mastery", name: "Piedra Ioun de Maestría", type: "Objeto Maravilloso", rarity: "Legendario", desc: "+1 a bono de competencia." },
    { id: "ioun-stone-protection", name: "Piedra Ioun de Protección", type: "Objeto Maravilloso", rarity: "Raro", desc: "+1 CA." },
    { id: "ioun-stone-regeneration", name: "Piedra Ioun de Regeneración", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Recuperas 15 HP cada hora." },
    { id: "ioun-stone-reserve", name: "Piedra Ioun de Reserva", type: "Objeto Maravilloso", rarity: "Raro", desc: "Almacena 3 niveles de hechizos." },
    { id: "ioun-stone-strength", name: "Piedra Ioun de Fuerza", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "+2 Fuerza (máximo 20)." },
    { id: "ioun-stone-sustenance", name: "Piedra Ioun de Sustento", type: "Objeto Maravilloso", rarity: "Raro", desc: "No necesitas comer ni beber." },

    // ========== LIBROS Y TOMOS ==========
    { id: "manual-of-bodily-health", name: "Manual de Salud Corporal", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "+2 CON permanente (tarda 48h en leer)." },
    { id: "manual-of-gainful-exercise", name: "Manual de Ejercicio Provechoso", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "+2 FUE permanente (tarda 48h en leer)." },
    { id: "manual-of-quickness-of-action", name: "Manual de Rapidez de Acción", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "+2 DES permanente (tarda 48h en leer)." },
    { id: "tome-of-clear-thought", name: "Tomo de Pensamiento Claro", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "+2 INT permanente (tarda 48h en leer)." },
    { id: "tome-of-leadership-and-influence", name: "Tomo de Liderazgo e Influencia", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "+2 CAR permanente (tarda 48h en leer)." },
    { id: "tome-of-understanding", name: "Tomo de Entendimiento", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "+2 SAB permanente (tarda 48h en leer)." },
    { id: "manual-of-golems-clay", name: "Manual de Gólem de Arcilla", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Permite crear un gólem de arcilla." },
    { id: "manual-of-golems-flesh", name: "Manual de Gólem de Carne", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Permite crear un gólem de carne." },
    { id: "manual-of-golems-iron", name: "Manual de Gólem de Hierro", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Permite crear un gólem de hierro." },
    { id: "manual-of-golems-stone", name: "Manual de Gólem de Piedra", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Permite crear un gólem de piedra." },
    { id: "deck-of-illusions", name: "Baraja de Ilusiones", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Cartas que crean ilusiones de criaturas." },
    { id: "deck-of-many-things", name: "Baraja de Muchas Cosas", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Cartas con efectos aleatorios poderosos." },

    // ========== TALISMANES ==========
    { id: "talisman-of-pure-good", name: "Talismán del Bien Puro", type: "Objeto Maravilloso", rarity: "Legendario", desc: "7 cargas: Destruye criaturas malvadas (clérigo bueno)." },
    { id: "talisman-of-ultimate-evil", name: "Talismán del Mal Supremo", type: "Objeto Maravilloso", rarity: "Legendario", desc: "6 cargas: Destruye criaturas buenas (clérigo malvado)." },
    { id: "talisman-of-the-sphere", name: "Talismán de la Esfera", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Controla la Esfera de Aniquilación." },

    // ========== ESFERAS Y CUBOS ==========
    { id: "sphere-of-annihilation", name: "Esfera de Aniquilación", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Esfera negra que destruye todo lo que toca." },
    { id: "cube-of-force", name: "Cubo de Fuerza", type: "Objeto Maravilloso", rarity: "Raro", desc: "36 cargas: Crea barrera de fuerza cúbica." },
    { id: "cubic-gate", name: "Puerta Cúbica", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Cubo con 6 caras que abren portales a planos." },
    { id: "bead-of-force", name: "Cuenta de Fuerza", type: "Objeto Maravilloso", rarity: "Raro", desc: "Explota en esfera de fuerza, atrapa criaturas." },

    // ========== ESPEJOS Y VELAS ==========
    { id: "mirror-of-life-trapping", name: "Espejo de Atrapar Vidas", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "12 celdas extradimensionales que atrapan criaturas." },
    { id: "candle-of-invocation", name: "Vela de Invocación", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "4 horas de luz que potencia hechizos, invoca deidades." },
    { id: "marvelous-pigments", name: "Pigmentos Maravillosos", type: "Objeto Maravilloso", rarity: "Muy Raro", desc: "Pinturas que crean objetos reales." },
    { id: "well-of-many-worlds", name: "Pozo de Muchos Mundos", type: "Objeto Maravilloso", rarity: "Legendario", desc: "Tela que abre portal a otro plano." },
    { id: "instant-fortress", name: "Fortaleza Instantánea", type: "Objeto Maravilloso", rarity: "Raro", desc: "Cubo que se convierte en torre de adamantina." },

    // ========== POLVOS Y ACEITES ==========
    { id: "dust-of-disappearance", name: "Polvo de Desaparición", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Invisibilidad para criaturas cubiertas durante 2d4 minutos." },
    { id: "dust-of-dryness", name: "Polvo de Sequedad", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Absorbe agua, crea bolitas que explotan." },
    { id: "dust-of-sneezing-and-choking", name: "Polvo de Estornudos y Ahogo", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Parece polvo de desaparición, pero causa ahogo." },
    { id: "oil-of-etherealness", name: "Aceite de Etereidad", type: "Poción", rarity: "Raro", desc: "Te vuelves etéreo durante 1 hora." },
    { id: "restorative-ointment", name: "Ungüento Restaurador", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "5 dosis: Cura veneno/enfermedad o 2d8+2 HP." },

    // ========== GEMAS ELEMENTALES ==========
    { id: "elemental-gem-air", name: "Gema Elemental (Aire)", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Invoca un elemental de aire." },
    { id: "elemental-gem-earth", name: "Gema Elemental (Tierra)", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Invoca un elemental de tierra." },
    { id: "elemental-gem-fire", name: "Gema Elemental (Fuego)", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Invoca un elemental de fuego." },
    { id: "elemental-gem-water", name: "Gema Elemental (Agua)", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Invoca un elemental de agua." },
    { id: "bowl-of-commanding-water-elementals", name: "Cuenco de Controlar Elementales de Agua", type: "Objeto Maravilloso", rarity: "Raro", desc: "Invoca y controla elementales de agua." },
    { id: "brazier-of-commanding-fire-elementals", name: "Brasero de Controlar Elementales de Fuego", type: "Objeto Maravilloso", rarity: "Raro", desc: "Invoca y controla elementales de fuego." },
    { id: "censer-of-controlling-air-elementals", name: "Incensario de Controlar Elementales de Aire", type: "Objeto Maravilloso", rarity: "Raro", desc: "Invoca y controla elementales de aire." },
    { id: "stone-of-controlling-earth-elementals", name: "Piedra de Controlar Elementales de Tierra", type: "Objeto Maravilloso", rarity: "Raro", desc: "Invoca y controla elementales de tierra." },

    // ========== MUNICIÓN MÁGICA ==========
    { id: "ammunition-1", name: "Munición +1", type: "Munición", rarity: "Poco Común", desc: "+1 a tiradas de ataque y daño (10 unidades)." },
    { id: "ammunition-2", name: "Munición +2", type: "Munición", rarity: "Raro", desc: "+2 a tiradas de ataque y daño (10 unidades)." },
    { id: "ammunition-3", name: "Munición +3", type: "Munición", rarity: "Muy Raro", desc: "+3 a tiradas de ataque y daño (10 unidades)." },
    { id: "arrow-of-slaying", name: "Flecha de Ejecución", type: "Munición", rarity: "Muy Raro", desc: "Contra tipo específico: +6d10 daño o muerte." },

    // ========== PLUMAS MÁGICAS ==========
    { id: "feather-token-anchor", name: "Pluma Mágica (Ancla)", type: "Objeto Maravilloso", rarity: "Raro", desc: "Crea ancla que detiene embarcaciones." },
    { id: "feather-token-bird", name: "Pluma Mágica (Pájaro)", type: "Objeto Maravilloso", rarity: "Raro", desc: "Crea pájaro mensajero que vuela 50 millas." },
    { id: "feather-token-fan", name: "Pluma Mágica (Abanico)", type: "Objeto Maravilloso", rarity: "Raro", desc: "Crea viento para impulsar barcos." },
    { id: "feather-token-swan-boat", name: "Pluma Mágica (Bote Cisne)", type: "Objeto Maravilloso", rarity: "Raro", desc: "Crea bote en forma de cisne para 32 personas." },
    { id: "feather-token-tree", name: "Pluma Mágica (Árbol)", type: "Objeto Maravilloso", rarity: "Raro", desc: "Crea roble de 60 pies de alto." },
    { id: "feather-token-whip", name: "Pluma Mágica (Látigo)", type: "Objeto Maravilloso", rarity: "Raro", desc: "Crea látigo que agarra y empuja." },

    // ========== BROCHES Y JOYERÍA ==========
    { id: "brooch-of-shielding", name: "Broche de Escudo", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Inmune a Proyectil Mágico, resistencia a fuerza." },
    { id: "pearl-of-power", name: "Perla del Poder", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "Recupera un espacio de hechizo de 3º nivel o menor." },
    { id: "orb-of-dragonkind", name: "Orbe del Dominio Dragontino", type: "Objeto Maravilloso", rarity: "Artefacto", desc: "Controla dragones, absorbe almas de dragones." },

    // ========== OBJETOS VARIOS FINALES ==========
    { id: "wind-fan", name: "Abanico del Viento", type: "Objeto Maravilloso", rarity: "Poco Común", desc: "3 cargas: Ráfaga de Viento." },
    { id: "wings-of-flying", name: "Alas Voladoras", type: "Objeto Maravilloso", rarity: "Raro", desc: "Capa que da velocidad de vuelo 60 pies durante 1 hora." }
];

// Función para obtener objeto aleatorio
export function getRandomSpanishItem() {
    return magicItemsES[Math.floor(Math.random() * magicItemsES.length)];
}

// Función para filtrar por rareza
export function getItemsByRarity(rarity) {
    return magicItemsES.filter(item => item.rarity === rarity);
}

// Función para filtrar por tipo
export function getItemsByType(type) {
    return magicItemsES.filter(item => item.type === type);
}

// Exposición global
window.getRandomSpanishItem = getRandomSpanishItem;
