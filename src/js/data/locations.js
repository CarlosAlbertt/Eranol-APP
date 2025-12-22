export const mapNodes = [
    // --- LANDMARKS (Center/North/South) ---
    {
        id: 'market_tower',
        label: 'Torre de los Anillos',
        type: 'landmark',
        x: 50, y: 85,
        image: 'img/map/icon_market_tower.png', // Planned unique icon
        fallbackIcon: 'fa-building',
        color: 'text-yellow-500',
        actionType: 'shop',
        target: 'ring_hub',
        ring: 2,
        description: 'Centro económico. Una mega-estructura de tres niveles flotantes.'
    },
    {
        id: 'palace',
        label: 'Palacio del Cónclave',
        type: 'landmark',
        x: 50, y: 10,
        image: 'img/icons/guild_5.png', // Palace Icon
        fallbackIcon: 'fa-chess-rook',
        color: 'text-white',
        actionType: 'dialog',
        text: 'Sede del gobierno. Agujas blancas y cúpulas doradas bajo un cielo estático.',
        ring: 3,
        description: 'Hogar de la realeza y líderes de los gremios.'
    },
    {
        id: 'plaza_contracts',
        label: 'Plaza de los Contratos',
        type: 'landmark',
        x: 50, y: 50,
        image: 'img/map/icon_obelisk.png', // Planned unique icon
        fallbackIcon: 'fa-monument',
        color: 'text-gray-200',
        actionType: 'modal',
        target: 'mission-board',
        ring: 2,
        description: 'Punto de encuentro. El Obelisco central muestra misiones globales.'
    },

    // --- DISTRICTS ---

    // SOUTHWEST: IGNIS
    {
        id: 'coliseum',
        label: 'Coliseo de Ceniza',
        type: 'poi',
        x: 25, y: 75,
        image: 'img/icons/guild_1.png', // Ignis/Coliseum
        fallbackIcon: 'fa-skull',
        color: 'text-red-600',
        actionType: 'dialog',
        text: 'El calor de los fosos de fuego te golpea la cara. Gritos de combate resuenan.',
        ring: 2,
        description: 'Arena de combate sancionada por el Gremio Ignis.'
    },

    // NORTHWEST: CRYXIS
    {
        id: 'mirror_alley',
        label: 'Callejón de los Espejos',
        type: 'poi',
        x: 25, y: 25,
        image: 'img/icons/guild_2.png', // Cryxis/Mirrors
        fallbackIcon: 'fa-mask',
        color: 'text-indigo-400',
        actionType: 'shop',
        target: 'casino',
        ring: 0,
        description: 'Zona laberíntica. Un espejo no refleja tu cara, sino la entrada a lo prohibido.'
    },
    {
        id: 'casino_entrance',
        label: 'Entrada al Mercado Negro',
        type: 'portal',
        x: 22, y: 28,
        image: 'img/map/icon_casino.png', // Existing!
        fallbackIcon: 'fa-dice-d20',
        color: 'text-purple-600',
        actionType: 'shop',
        target: 'casino',
        ring: 2,
        description: '¿Buscas algo más fuerte? Sigue al conejo blanco...'
    },

    // NORTHEAST: UMBRA
    {
        id: 'observatory',
        label: 'El Observatorio de Ecos',
        type: 'poi',
        x: 75, y: 25,
        image: 'img/map/icon_observatory.png',
        fallbackIcon: 'fa-eye',
        color: 'text-gray-500',
        actionType: 'dialog',
        text: 'Silencio absoluto. Los monjes escuchan lo que no existe.',
        ring: 2,
        description: 'Búnker donde se predicen catástrofes escuchando el Velo.'
    },

    // NORTH: VIRIDIA
    {
        id: 'roots_market',
        label: 'El Laberinto de Raíces',
        type: 'poi',
        x: 50, y: 30,
        image: 'img/icons/guild_3.png', // Viridia/Roots
        fallbackIcon: 'fa-tree',
        color: 'text-green-500',
        actionType: 'shop',
        target: 'bazar', // Shop ID
        ring: 2,
        description: 'Mercado orgánico entre árboles gigantes. Venenos y pociones.'
    },
    {
        id: 'tavern_caldero',
        label: 'Taberna "El Caldero"',
        type: 'poi',
        x: 35, y: 35,
        image: 'img/map/icon_tavern.png',
        fallbackIcon: 'fa-beer',
        color: 'text-orange-500',
        actionType: 'dialog',
        text: 'El interior huele a carne asada y humo dulce. Un bardo toca una melodía frenética.',
        ring: 2,
        description: 'Construida dentro del esqueleto de una bestia. Noticias y rumores.'
    },

    // SOUTHEAST: NEOR
    {
        id: 'clinic_tide',
        label: 'Clínica de la Marea',
        type: 'poi',
        x: 75, y: 75,
        image: 'img/icons/guild_4.png', // Neor/Clinic
        fallbackIcon: 'fa-heart-pulse',
        color: 'text-cyan-400',
        actionType: 'shop',
        target: 'nebulosa', // Shop ID
        ring: 2,
        description: 'Santuario sobre el agua. Estasis regenerativa.'
    },

    // SPECIAL
    {
        id: 'rift',
        label: 'La Grieta Estabilizada',
        type: 'danger',
        x: 55, y: 15, // Near Palace
        image: 'img/map/icon_rift.png',
        fallbackIcon: 'fa-exclamation-triangle',
        color: 'text-fuchsia-500',
        actionType: 'dialog',
        text: '⚠ ZONA DE CUARENTENA. La realidad parpadea violentamente.',
        ring: 3,
        description: 'Fractura del Velo. Solo personal autorizado.'
    }
];
