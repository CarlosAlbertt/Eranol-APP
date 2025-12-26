/*
    DATOS DE OPONENTES DE LA ARENA
    Base de datos completa con estadísticas de D&D 5e en español
*/

// --- RANGOS DE ARENA ---
export const ARENA_RANKS = [
    { id: 'carne_fresca', nombre: 'Carne Fresca', minRespeto: 0, color: '#6b7280', icono: 'fa-skull', desc: 'Recién llegado al Foso. Nadie te conoce.' },
    { id: 'novato', nombre: 'Novato', minRespeto: 50, color: '#84cc16', icono: 'fa-fist-raised', desc: 'Has sobrevivido algunos combates. La gente empieza a recordar tu cara.' },
    { id: 'gladiador', nombre: 'Gladiador', minRespeto: 200, color: '#3b82f6', icono: 'fa-shield-alt', desc: 'Luchador respetado. Los apostadores empiezan a apostar por ti.' },
    { id: 'campeon', nombre: 'Campeón', minRespeto: 500, color: '#a855f7', icono: 'fa-crown', desc: 'Campeón del Foso. Tu nombre se grita en las gradas.' },
    { id: 'leyenda', nombre: 'Leyenda', minRespeto: 1000, color: '#f59e0b', icono: 'fa-star', desc: 'Leyenda viviente. Los niños quieren ser como tú.' },
    { id: 'matadioses', nombre: 'Matadioses', minRespeto: 2000, color: '#dc2626', icono: 'fa-skull-crossbones', desc: 'Has derrotado a criaturas que ni los dioses se atreven a enfrentar.' }
];

// --- OPONENTES DE DUELO (1v1) ---
export const duelOpponents = [
    // ===== NIVEL 1: CARNE FRESCA (ND 1-2) =====
    {
        id: 'drunk_farmboy',
        nombre: 'Granjero Borracho',
        titulo: 'El Apestoso',
        nd: 1, // Nivel de Desafío
        dificultad: 'facil',
        probabilidad: 1.2,
        minRespeto: 0,
        avatar: '/img/npcs/borg.png',
        frase: '"¿Tú también vienes por mi cerda? ¡PELEA!"',
        descripcion: 'Huele a estiércol y aguardiente barato. Ataca con una pala oxidada y mucha rabia.',
        estadisticas: { pv: 11, ca: 10, fue: 13, des: 8, con: 12, velocidad: '9 metros' },
        ataques: [
            { nombre: 'Pala Oxidada', bonificador: '+3', daño: '1d6+1 contundente', desc: 'Ataque torpe pero doloroso' }
        ],
        habilidades: ['Furia de Borracho: Ventaja en ataques el primer turno, desventaja después'],
        debilidades: ['Lento', 'Se cansa rápido', 'Vulnerable a fintas'],
        tactica: 'Carga de frente gritando. No tiene estrategia.',
        recompensa: { oro: 20, respeto: 5 },
        botin: ['Botella de Aguardiente', 'Diente de Granjero', '1d6 monedas de cobre']
    },
    {
        id: 'street_rat',
        nombre: 'Rata Callejera',
        titulo: 'Dedos Rápidos',
        nd: 2,
        dificultad: 'facil',
        probabilidad: 1.3,
        minRespeto: 0,
        avatar: '/img/npcs/vance.png',
        frase: '"Te voy a quitar hasta los calzoncillos, amigo. Nunca me verás venir."',
        descripcion: 'Ladronzuelo juvenil de los callejones del Anillo 3. Rápido y escurridizo, pero cobarde.',
        estadisticas: { pv: 18, ca: 13, fue: 10, des: 16, con: 10, velocidad: '10,5 metros' },
        ataques: [
            { nombre: 'Daga (x2)', bonificador: '+5', daño: '1d4+3 perforante', desc: 'Dos ataques rápidos' },
            { nombre: 'Arena a los Ojos', bonificador: 'CD 12 CON', daño: 'Cegado 1 turno', desc: 'Truco sucio' }
        ],
        habilidades: ['Ataque Furtivo: +2d6 con ventaja', 'Escapar: Acción bonus para desengancharse'],
        debilidades: ['Cobarde (huye bajo 5 PV)', 'Baja resistencia'],
        tactica: 'Busca flanquear. Si pierde ventaja, intenta escapar.',
        recompensa: { oro: 30, respeto: 8 },
        botin: ['Daga Oxidada', 'Bolsa de Monedas Robada', 'Ganzúas']
    },
    {
        id: 'retired_guard',
        nombre: 'Guardia Retirado',
        titulo: 'El Cojo',
        nd: 2,
        dificultad: 'facil',
        probabilidad: 1.4,
        minRespeto: 0,
        avatar: '/img/npcs/borg.png',
        frase: '"En mis tiempos, los críos como tú limpiaban las letrinas del cuartel."',
        descripcion: 'Veterano de la Guardia de Eranol con pata de palo. Lento pero experimentado.',
        estadisticas: { pv: 22, ca: 16, fue: 14, des: 10, con: 14, velocidad: '6 metros' },
        ataques: [
            { nombre: 'Espada Corta', bonificador: '+4', daño: '1d6+2 cortante', desc: 'Golpes precisos' },
            { nombre: 'Golpe de Escudo', bonificador: '+4', daño: '1d4+2 contundente', desc: 'Puede aturdir' }
        ],
        habilidades: ['Veterano: No puede ser sorprendido', 'Posición Defensiva: +2 CA como acción'],
        debilidades: ['Lento (velocidad reducida)', 'Rodilla mala (vulnerable a derribos)'],
        tactica: 'Se mantiene defensivo. Contraataca cuando el enemigo falla.',
        recompensa: { oro: 40, respeto: 10 },
        botin: ['Escudo Abollado', 'Medalla de Servicio Oxidada', 'Petaca de Licor']
    },

    // ===== NIVEL 2: NOVATO (ND 3-5) =====
    {
        id: 'armored_bear',
        nombre: 'Oso Pardo Acorazado',
        titulo: 'La Bestia',
        nd: 4,
        dificultad: 'media',
        probabilidad: 1.6,
        minRespeto: 50,
        avatar: '/img/npcs/borg.png',
        frase: '*ROOOAAAR* (El oso está drogado y enfurecido. No hay negociación.)',
        descripcion: 'Un oso de 500kg con placas de acero soldadas al cuerpo. Drogado con estimulantes del Mercado Negro.',
        estadisticas: { pv: 68, ca: 15, fue: 20, des: 10, con: 18, velocidad: '12 metros' },
        ataques: [
            { nombre: 'Mordisco', bonificador: '+7', daño: '2d6+5 perforante', desc: 'Mandíbulas de acero' },
            { nombre: 'Garras', bonificador: '+7', daño: '2d8+5 cortante', desc: 'Dos ataques por turno' }
        ],
        habilidades: ['Multiataques: Mordisco + Garras', 'Olfato Agudo: Ventaja en Percepción (olfato)', 'Furia Química: Inmune a encantamientos'],
        debilidades: ['Sin inteligencia táctica', 'Reacciona al movimiento', 'Las drogas lo hacen impredecible'],
        tactica: 'Carga al objetivo más cercano. Ataca hasta que algo muere.',
        recompensa: { oro: 80, respeto: 20 },
        botin: ['Piel de Oso', 'Collar de Púas', 'Muestras de Droga', 'Placas de Armadura']
    },
    {
        id: 'masked_duelist',
        nombre: 'El Duelista Enmascarado',
        titulo: 'Sombra de Acero',
        nd: 5,
        dificultad: 'media',
        probabilidad: 1.8,
        minRespeto: 75,
        avatar: '/img/npcs/encapuchada.png',
        frase: '"En garde. El baile comienza cuando alguien sangra. ¿Preparado?"',
        descripcion: 'Espadachín misterioso de técnica impecable. Nadie ha visto su rostro bajo la máscara.',
        estadisticas: { pv: 65, ca: 17, fue: 12, des: 18, con: 14, velocidad: '10,5 metros' },
        ataques: [
            { nombre: 'Estoque', bonificador: '+7', daño: '1d8+4 perforante', desc: 'Precisión letal' },
            { nombre: 'Riposte', bonificador: '+7', daño: '1d8+4 perforante', desc: 'Contraataque como reacción' }
        ],
        habilidades: ['Evasión: Medio daño en área', 'Parada Elegante: +4 CA contra un ataque', 'Estocada Final: +4d6 daño a enemigos bajo 20 PV'],
        debilidades: ['Arrogante (no ataca primero)', 'Ligero (vulnerable a cargas)'],
        tactica: 'Espera a que ataques. Parada-Riposte. Busca golpe de gracia.',
        recompensa: { oro: 100, respeto: 25 },
        botin: ['Estoque Afilado', 'Máscara de Porcelana', 'Capa Elegante', 'Nota Misteriosa']
    },
    {
        id: 'drunk_monk',
        nombre: 'Monje Borracho',
        titulo: 'Puño Ebrio',
        nd: 5,
        dificultad: 'media',
        probabilidad: 1.7,
        minRespeto: 75,
        avatar: '/img/npcs/rorn.png',
        frase: '"¿Agua? ¿AGUA?! ¡Eso es veneno para el alma! *hip* ¿Dónde estaba...?"',
        descripcion: 'Maestro del estilo del Puño Ebrio. Se tambalea, pero esquiva todo con movimientos imposibles.',
        estadisticas: { pv: 52, ca: 16, fue: 14, des: 18, con: 14, velocidad: '13,5 metros' },
        ataques: [
            { nombre: 'Puño Ebrio (x3)', bonificador: '+6', daño: '1d8+4 contundente', desc: 'Tres golpes impredecibles' },
            { nombre: 'Patada Tambaleante', bonificador: '+6', daño: '2d6+4 contundente', desc: 'Empuja 3 metros' }
        ],
        habilidades: ['Esquiva Tambaleante: +2 CA mientras se mueve', 'Contraataque Fluido: Ataca cuando fallas', 'Ki Fermentado: 2 puntos de ki para ataques extra'],
        debilidades: ['Impredecible (a veces falla solo)', 'Sin armadura', 'Vulnerable a agarre'],
        tactica: 'No para de moverse. Ataca desde ángulos imposibles. Parece que va a caerse pero nunca cae.',
        recompensa: { oro: 90, respeto: 22 },
        botin: ['Jarra Irrompible', 'Manual del Puño Ebrio', 'Receta de Licor Antiguo']
    },
    {
        id: 'ignis_deserter',
        nombre: 'Guerrero de Ignis',
        titulo: 'El Traidor',
        nd: 6,
        dificultad: 'media',
        probabilidad: 2.0,
        minRespeto: 100,
        avatar: '/img/npcs/zora.png',
        frase: '"En Ignis aprendí que el honor no detiene las espadas. Solo la victoria importa."',
        descripcion: 'Desertor de las legiones de Ignis. Entrenamiento militar brutal. Juega sucio para ganar.',
        estadisticas: { pv: 78, ca: 17, fue: 16, des: 14, con: 16, velocidad: '9 metros' },
        ataques: [
            { nombre: 'Espada de Legionario', bonificador: '+6', daño: '2d6+3 cortante', desc: 'Técnica de formación' },
            { nombre: 'Arena a los Ojos', bonificador: 'CD 13 CON', daño: 'Cegado 1 turno', desc: 'Truco sucio' },
            { nombre: 'Golpe Bajo', bonificador: '+6', daño: '1d4+3 contundente', desc: 'Aturde si falla CD 14 CON' }
        ],
        habilidades: ['Sin Piedad: +2 daño contra enemigos aturdidos/cegados', 'Formación: +1 CA por aliado adyacente'],
        debilidades: ['Predecible si lo conoces', 'Odiado por la multitud (no recibe bonus de apoyo)'],
        tactica: 'Ciega primero, golpea después. Sin remordimientos.',
        recompensa: { oro: 120, respeto: 30 },
        botin: ['Espada de Legionario', 'Insignia de Ignis', 'Veneno de Arena', 'Diario de Desertor']
    },

    // ===== NIVEL 3: GLADIADOR (ND 7-9) =====
    {
        id: 'mimic_chest',
        nombre: 'Mímico Cofre',
        titulo: 'El Engaño',
        nd: 7,
        dificultad: 'dificil',
        probabilidad: 2.2,
        minRespeto: 200,
        avatar: '/img/npcs/trixie.png',
        frase: '"¡SORPRESA! ¡SOY YO, NO UN COFRE!" *lengua babeante de 3 metros*',
        descripcion: 'Colocado como "premio" en el centro de la arena. Es todo dientes y pegamento.',
        estadisticas: { pv: 58, ca: 12, fue: 17, des: 12, con: 15, velocidad: '4,5 metros' },
        ataques: [
            { nombre: 'Mordisco', bonificador: '+5', daño: '1d8+3 perforante', desc: 'Si acierta, objetivo adherido' },
            { nombre: 'Pseudópodo', bonificador: '+5', daño: '1d8+3 contundente', desc: 'Alcance 3 metros' }
        ],
        habilidades: ['Adherencia: CD 13 FUE para escapar de mordisco', 'Metamorfo: Parece un cofre normal', 'Inmunidades: Ácido, derribado'],
        debilidades: ['Muy lento', 'Vulnerable al fuego', 'No puede perseguir'],
        tactica: 'Espera que te acerques. Muerde y no suelta. Arrastra a la boca.',
        recompensa: { oro: 150, respeto: 40 },
        botin: ['Diente de Mímico', 'Oro Falso', 'Adhesivo de Mímico', 'Tesoro Real (a veces)']
    },
    {
        id: 'minotaur_gladiator',
        nombre: 'Kragos el Minotauro',
        titulo: 'El Laberinto',
        nd: 7,
        dificultad: 'dificil',
        probabilidad: 2.3,
        minRespeto: 200,
        avatar: '/img/npcs/krug.png',
        frase: '"En el laberinto, yo era el monstruo. Aquí, soy la LEYENDA."',
        descripcion: 'Minotauro exiliado de su laberinto. Ahora busca gloria en el Foso.',
        estadisticas: { pv: 76, ca: 14, fue: 18, des: 11, con: 16, int: 6, sab: 16, velocidad: '12 metros' },
        ataques: [
            { nombre: 'Gran Hacha', bonificador: '+6', daño: '2d12+4 cortante', desc: 'Ataque devastador' },
            { nombre: 'Embestida', bonificador: '+6', daño: '2d8+4 perforante', desc: 'Si carga 3+ metros. CD 14 FUE o derribo' }
        ],
        habilidades: ['Carga: +2d8 daño si corre 3+ metros', 'Imprudente: Ventaja en ataques, desventaja en defensa', 'Recuerdo Laberíntico: Nunca se pierde'],
        debilidades: ['Imprudente (fácil de golpear si ataca)', 'Orgullo (no huye)'],
        tactica: 'Carga, embestida, hacha. Repite. No para hasta que alguien cae.',
        recompensa: { oro: 160, respeto: 45 },
        botin: ['Gran Hacha de Minotauro', 'Cuerno Roto', 'Carne de Minotauro', 'Mapa de Laberinto']
    },
    {
        id: 'orc_warlord',
        nombre: 'Thrakka',
        titulo: 'Rompecráneos',
        nd: 8,
        dificultad: 'dificil',
        probabilidad: 2.4,
        minRespeto: 250,
        avatar: '/img/npcs/krug.png',
        frase: '"THRAKKA APLASTA. THRAKKA COME. THRAKKA GANA. ¿ENTIENDES?"',
        descripcion: 'Señor de la guerra orco exiliado de su tribu. Busca esclavos... o cadáveres.',
        estadisticas: { pv: 93, ca: 16, fue: 20, des: 12, con: 17, velocidad: '9 metros' },
        ataques: [
            { nombre: 'Hacha Doble', bonificador: '+8', daño: '2d8+5 cortante', desc: 'Dos ataques por turno' },
            { nombre: 'Grito de Guerra', bonificador: 'CD 14 SAB', daño: 'Asustado 1 turno', desc: 'Radio 9 metros' }
        ],
        habilidades: ['Furia Orca: +1d6 daño cuando bajo 50% PV', 'Resistencia Implacable: 1/día ignora daño letal'],
        debilidades: ['Arrogante', 'Predecible', 'Odia la magia'],
        tactica: 'Grito de guerra para asustar, luego carga con hacha. Sin táctica, solo fuerza bruta.',
        recompensa: { oro: 180, respeto: 50 },
        botin: ['Gran Hacha Orca', 'Colmillo de Trofeo', 'Cinturón de Fuerza', 'Estandarte de Tribu']
    },
    {
        id: 'vampire_spawn',
        nombre: 'Vasil el Sediento',
        titulo: 'Engendro Vampírico',
        nd: 9,
        dificultad: 'dificil',
        probabilidad: 2.6,
        minRespeto: 300,
        avatar: '/img/npcs/encapuchada.png',
        frase: '"Tu sangre huele... deliciosa. Como rubíes líquidos."',
        descripcion: 'Engendro vampírico capturado para los combates nocturnos. Solo pelea después del anochecer.',
        estadisticas: { pv: 82, ca: 15, fue: 16, des: 16, con: 16, velocidad: '9 metros' },
        ataques: [
            { nombre: 'Garras (x2)', bonificador: '+6', daño: '2d4+3 cortante', desc: 'Dos ataques' },
            { nombre: 'Mordisco', bonificador: '+6', daño: '1d6+3 perforante + 3d6 necrótico', desc: 'Cura PV igual al daño necrótico' }
        ],
        habilidades: ['Regeneración: 10 PV/turno (no si daño radiante/agua bendita)', 'Trepar Arañas: Camina por paredes', 'Resistencias: Necrótico, no-mágico'],
        debilidades: ['Luz solar: Desventaja y sin regeneración', 'Agua Corriente: No puede cruzar', 'Estaca al Corazón: Parálisis'],
        tactica: 'Ataca rápido, muerde para curarse. Se retira si hay luz.',
        recompensa: { oro: 200, respeto: 60 },
        botin: ['Capa de Sombra', 'Vial de Sangre Vampírica', 'Colmillos', 'Anillo de su Vida Anterior']
    },

    // ===== NIVEL 4: CAMPEÓN (ND 10-12) =====
    {
        id: 'chain_devil',
        nombre: 'Kyton el Encadenador',
        titulo: 'Diablo de Cadenas',
        nd: 11,
        dificultad: 'mortal',
        probabilidad: 3.0,
        minRespeto: 500,
        avatar: '/img/npcs/encapuchada.png',
        frase: '"En el Infierno, el dolor es la única moneda verdadera. Pagarás."',
        descripcion: 'Diablo de cadenas invocado para combates especiales. Sus cadenas están vivas.',
        estadisticas: { pv: 85, ca: 16, fue: 18, des: 15, con: 18, velocidad: '9 metros' },
        ataques: [
            { nombre: 'Cadenas Animadas (x2)', bonificador: '+8', daño: '2d6+4 cortante', desc: 'Alcance 3 metros' },
            { nombre: 'Atrapar', bonificador: '+8 vs CA', daño: 'Agarrado', desc: 'CD 14 FUE para escapar' }
        ],
        habilidades: ['Inmune: Fuego, Veneno', 'Resistente: Frío, No-mágico', 'Regeneración: 5 PV/turno (no si daño plateado)'],
        debilidades: ['Armas plateadas hacen daño completo', 'Vulnerable a magia divina'],
        tactica: 'Encadena y arrastra. Tortura metódicamente. Disfruta el combate.',
        recompensa: { oro: 300, respeto: 80, honor: 10 },
        botin: ['Eslabón Infernal', 'Cadena Animada', 'Contrato Infernal', 'Lágrimas Cristalizadas']
    },
    {
        id: 'brunhilda_champion',
        nombre: 'Brunhilda',
        titulo: 'La Invicta',
        nd: 12,
        dificultad: 'mortal',
        probabilidad: 3.5,
        minRespeto: 600,
        avatar: '/img/npcs/brunhilda.png',
        frase: '"37 victorias. Cero derrotas. Tú serás la número 38. O morirás intentándolo."',
        descripcion: 'Campeona actual del Foso de Sangre. Nunca ha perdido un combate oficial.',
        estadisticas: { pv: 112, ca: 18, fue: 20, des: 16, con: 18, velocidad: '9 metros' },
        ataques: [
            { nombre: 'Martillo de Guerra (x2)', bonificador: '+9', daño: '2d8+5 contundente', desc: 'Ataques devastadores' },
            { nombre: 'Patada', bonificador: '+9', daño: '1d6+5 contundente', desc: 'Empuja 3 metros, derribo CD 17' }
        ],
        habilidades: ['Campeona: Ventaja en salvaciones vs miedo', 'Resistencia Brutal: 2/día recupera 20 PV', 'Crítico Mejorado: Crítico en 19-20'],
        debilidades: ['Arrogancia (subestima a novatos)', 'Antigua herida en el hombro izquierdo'],
        tactica: 'Evalúa al oponente 1-2 turnos. Luego ataca sin piedad. Sin errores.',
        recompensa: { oro: 400, respeto: 100, honor: 15 },
        botin: ['Guantes de Campeón', 'Cinturón de Campeón', 'Colgante de Victoria', 'Fama Instantánea']
    },

    // ===== NIVEL 5: LEYENDA (ND 14+) =====
    {
        id: 'death_knight',
        nombre: 'Lord Varkos',
        titulo: 'Caballero de la Muerte',
        nd: 14,
        dificultad: 'legendario',
        probabilidad: 4.0,
        minRespeto: 1000,
        avatar: '/img/npcs/encapuchada.png',
        frase: '"La muerte no me detuvo. ¿Crees que tú podrás?"',
        descripcion: 'Caballero de la Muerte. Antiguo paladín caído. Armadura negra maldita.',
        estadisticas: { pv: 180, ca: 20, fue: 20, des: 11, con: 20, velocidad: '9 metros' },
        ataques: [
            { nombre: 'Espada Maldita (x3)', bonificador: '+11', daño: '1d8+5 cortante + 4d6 necrótico', desc: 'Tres ataques' },
            { nombre: 'Bola de Fuego Infernal', bonificador: 'CD 18 DES', daño: '10d6 fuego + 10d6 necrótico', desc: '1/día, 6 metros radio' }
        ],
        habilidades: ['Inmune: Necrótico, Veneno, Encantado', 'Aura de Terror: CD 18 SAB o Asustado', 'Resistencia Mágica: Ventaja en salvaciones vs magia'],
        debilidades: ['Agua Bendita hace daño extra', 'Orgullo (ataques imprudentes si lo insultas)'],
        tactica: 'Terror para debilitar, luego ataques implacables. Bola de fuego si hay grupo.',
        recompensa: { oro: 600, respeto: 150, honor: 25 },
        botin: ['Espada Maldita', 'Yelmo del Vacío', 'Fragmento de Alma', 'Pergamino Prohibido']
    },
    {
        id: 'pit_fiend_avatar',
        nombre: 'Mazzrik',
        titulo: 'Señor del Foso',
        nd: 17,
        dificultad: 'legendario',
        probabilidad: 5.0,
        minRespeto: 2000,
        avatar: '/img/npcs/vex.png',
        frase: '"Este foso lleva mi nombre por algo, mortal. Soy su dios."',
        descripcion: 'Avatar del Demonio que fundó el Foso hace siglos. Solo aparece en luna nueva.',
        estadisticas: { pv: 300, ca: 19, fue: 26, des: 14, con: 24, velocidad: '9 metros, volar 18 metros' },
        ataques: [
            { nombre: 'Maza Infernal', bonificador: '+14', daño: '2d6+8 contundente + 6d6 fuego', desc: 'Arde eternamente' },
            { nombre: 'Mordisco', bonificador: '+14', daño: '4d6+8 perforante + veneno CD 21', desc: 'Veneno: 6d6 daño' },
            { nombre: 'Cola', bonificador: '+14', daño: '3d10+8 contundente', desc: 'Alcance 4,5 metros' }
        ],
        habilidades: ['Inmune: Fuego, Veneno', 'Resistente: Frío, No-mágico', 'Regeneración: 20 PV/turno', 'Aura de Fuego: 10 daño fuego a 3 metros'],
        debilidades: ['Armas sagradas', 'Agua bendita', 'Puede ser desterrado (no matado)'],
        tactica: 'Vuelo + ataques a distancia. Baja cuando quiere humillar. Regenera todo.',
        recompensa: { oro: 1000, respeto: 300, honor: 50 },
        botin: ['Cuerno del Señor del Foso', 'Contrato Infernal', 'Llama Eterna', 'Título: Matademonios']
    }
];

// --- BESTIAS OPONENTES (Grupo vs Monstruo) ---
export const beastOpponents = [
    // NIVEL 1
    {
        id: 'giant_rats_swarm',
        nombre: 'Enjambre de Ratas Gigantes',
        nd: 4,
        dificultad: 'media',
        minRespeto: 0,
        frase: 'Decenas de ratas del tamaño de perros. Vienen de las alcantarillas.',
        descripcion: '12 ratas gigantes. Muerden, trepan, no paran.',
        estadisticas: { pv: '84 (12x7)', ca: 12, fue: 7, des: 15, con: 11, velocidad: '9 metros' },
        ataques: [
            { nombre: 'Mordisco (x12)', bonificador: '+4', daño: '1d4+2 perforante', desc: 'Ventaja en grupo, puede enfermar' }
        ],
        habilidades: ['Enjambre: Difícil de golpear a todos', 'Oscuridad: Ventaja en oscuridad'],
        debilidades: ['Fuego', 'Ataques de área', 'Mata líder y huyen'],
        tactica: 'Rodear, morder, desangrar. Atacan a los heridos.',
        recompensa: { oro: 100, respeto: 15 },
        botin: ['Cola de Rata x5', 'Diente de Rata Gigante', 'Peste Embotellada']
    },
    {
        id: 'owlbears_3',
        nombre: '3 Osos Lechuzas',
        nd: 9,
        dificultad: 'dificil',
        minRespeto: 50,
        frase: 'Hambrientos y furiosos. No distinguen amigo de comida.',
        descripcion: 'Tres osos lechuza (ND 3 cada uno). Garras, picos, y mucha rabia. ND total 9.',
        estadisticas: { pv: '177 (59x3)', ca: 13, fue: 20, des: 12, con: 17, velocidad: '12 metros' },
        ataques: [
            { nombre: 'Pico', bonificador: '+7', daño: '1d10+5 perforante', desc: 'Cada oso ataca' },
            { nombre: 'Garras', bonificador: '+7', daño: '2d8+5 cortante', desc: 'Cada oso ataca' }
        ],
        habilidades: ['Olfato/Vista Aguda: Ventaja en Percepción', 'Multiataques: Pico + Garras por oso'],
        debilidades: ['Impulsivos', 'Se distraen con comida', 'Atacan al más cercano'],
        tactica: 'Cargan todos a la vez. Sin coordinación, solo furia.',
        recompensa: { oro: 250, respeto: 40 },
        botin: ['Pluma de Oso Lechuza x3', 'Garras Afiladas', 'Piel Moteada', 'Pico']
    },
    {
        id: 'wyvern',
        nombre: 'Guiverno Herido',
        titulo: 'Alas Cortadas',
        nd: 6,
        dificultad: 'dificil',
        minRespeto: 100,
        frase: 'Tiene las alas cortadas, pero su cola es veneno puro.',
        descripcion: 'Dragón menor sin vuelo. 110 PV, cola venenosa, mordisco letal.',
        estadisticas: { pv: 110, ca: 13, fue: 19, des: 10, con: 16, velocidad: '6 metros (sin vuelo)' },
        ataques: [
            { nombre: 'Mordisco', bonificador: '+7', daño: '2d6+4 perforante', desc: 'Alcance 3 metros' },
            { nombre: 'Aguijón', bonificador: '+7', daño: '2d6+4 perforante + 7d6 veneno', desc: 'CD 15 CON para mitad' }
        ],
        habilidades: ['Multiataques: Mordisco o Aguijón', 'Veneno Letal: 7d6 si falla CD 15'],
        debilidades: ['Sin vuelo (cortaron alas)', 'Lento', 'Predecible'],
        tactica: 'Se mantiene a 3 metros. Aguijón primero, mordisco a heridos.',
        recompensa: { oro: 350, respeto: 50 },
        botin: ['Escama de Guiverno x5', 'Aguijón Venenoso', 'Sangre de Guiverno', 'Membrana de Ala']
    },
    {
        id: 'hydra',
        nombre: 'Hidra Joven',
        titulo: 'Las Cinco Bocas',
        nd: 8,
        dificultad: 'dificil',
        minRespeto: 200,
        frase: '5 cabezas. Si cortas una y no quemas el muñón, salen dos.',
        descripcion: 'Hidra de 5 cabezas. 172 PV. Regenera cabezas sin fuego.',
        estadisticas: { pv: 172, ca: 15, fue: 20, des: 12, con: 20, velocidad: '9 metros, nadar 9 metros' },
        ataques: [
            { nombre: 'Mordiscos (x5)', bonificador: '+8', daño: '1d10+5 perforante', desc: 'Un ataque por cabeza' }
        ],
        habilidades: ['Múltiples Cabezas: Ventaja vs. cegar/aturdir', 'Regeneración: +2 cabezas si no fuego', 'Cabezas Reactivas: Reacciones extra por cabeza'],
        debilidades: ['Fuego previene regeneración', 'Ácido también funciona', 'Lenta en tierra'],
        tactica: '5 mordiscos por turno. Regenera si no usas fuego. Inevitable.',
        recompensa: { oro: 500, respeto: 80 },
        botin: ['Cabeza de Hidra', 'Sangre Regeneradora', 'Corazón de Hidra', 'Dientes x10']
    },
    // NIVEL 2: MORTAL
    {
        id: 'troll',
        nombre: 'Trol del Foso',
        titulo: 'El Que No Muere',
        nd: 5,
        dificultad: 'media',
        minRespeto: 150,
        frase: 'Lo han matado 47 veces. Siempre vuelve.',
        descripcion: 'Trol regenerador. 84 PV que se recuperan cada turno.',
        estadisticas: { pv: 84, ca: 15, fue: 18, des: 13, con: 20, velocidad: '9 metros' },
        ataques: [
            { nombre: 'Mordisco', bonificador: '+7', daño: '1d6+4 perforante', desc: 'Ataque secundario' },
            { nombre: 'Garras (x2)', bonificador: '+7', daño: '2d6+4 cortante', desc: 'Dos ataques principales' }
        ],
        habilidades: ['Regeneración: 10 PV/turno (anulado por fuego/ácido)', 'Olfato Agudo: Ventaja en Percepción'],
        debilidades: ['Fuego anula regeneración', 'Ácido anula regeneración', 'Estúpido'],
        tactica: 'Ataca sin parar. No le importa recibir daño. Regenera todo.',
        recompensa: { oro: 300, respeto: 45 },
        botin: ['Sangre de Trol', 'Corazón Regenerador', 'Garras de Trol', 'Grasa de Trol']
    },
    {
        id: 'young_red_dragon',
        nombre: 'Fyrrax',
        titulo: 'Dragón Rojo Joven',
        nd: 10,
        dificultad: 'mortal',
        minRespeto: 500,
        frase: '"Oro. Quiero más oro. Y tu sangre de postre."',
        descripcion: 'Dragón Rojo Joven. 178 PV. Aliento de fuego. Vuelo limitado en arena techada.',
        estadisticas: { pv: 178, ca: 18, fue: 23, des: 10, con: 21, velocidad: '12 metros, volar 24 metros (limitado)' },
        ataques: [
            { nombre: 'Mordisco', bonificador: '+10', daño: '2d10+6 perforante + 1d6 fuego', desc: 'Alcance 3 metros' },
            { nombre: 'Garras (x2)', bonificador: '+10', daño: '2d6+6 cortante', desc: 'Dos ataques' },
            { nombre: 'Aliento de Fuego', bonificador: 'CD 17 DES', daño: '16d6 fuego', desc: 'Cono 9 metros, recarga 5-6' }
        ],
        habilidades: ['Inmune: Fuego', 'Multiataques: Mordisco + 2 Garras', 'Aliento: 16d6 fuego, cono 9 metros'],
        debilidades: ['Arrogante', 'Techo limita vuelo', 'Frío hace daño extra'],
        tactica: 'Aliento primero, luego ataques cuerpo a cuerpo. Vuela si puede.',
        recompensa: { oro: 1500, respeto: 200, honor: 35 },
        botin: ['Escama de Dragón Rojo x5', 'Diente de Dragón', 'Corazón de Fuego', 'Sangre de Dragón']
    },
    {
        id: 'purple_worm',
        nombre: 'Gusano Púrpura',
        titulo: 'Devorador del Subsuelo',
        nd: 15,
        dificultad: 'legendario',
        minRespeto: 1000,
        frase: 'Traga caballos enteros. El ácido digestivo derrite armaduras.',
        descripcion: '25 metros de gusano. 247 PV. Traga entero. Ácido digestivo.',
        estadisticas: { pv: 247, ca: 18, fue: 28, des: 7, con: 22, velocidad: '15 metros, excavar 9 metros' },
        ataques: [
            { nombre: 'Mordisco', bonificador: '+14', daño: '3d8+9 perforante', desc: 'Si excede CA por 10+, traga' },
            { nombre: 'Aguijón de Cola', bonificador: '+14', daño: '3d6+9 perforante + 12d6 veneno', desc: 'CD 19 CON' }
        ],
        habilidades: ['Tragar: 6d6 ácido/turno si tragado', 'Excavar: Crea túneles', 'Blindaje Natural: CA 18'],
        debilidades: ['Lento girando', 'Cegado (sin ojos)', 'Vulnerable a ataques desde dentro'],
        tactica: 'Emerge del suelo, muerde, traga. Aguijón a los que huyen.',
        recompensa: { oro: 800, respeto: 120, honor: 20 },
        botin: ['Colmillo de Gusano', 'Ácido Digestivo', 'Piel de Gusano Púrpura', 'Contenido Estomacal']
    },
    // ===== BESTIAS ÉPICAS ADICIONALES =====
    {
        id: 'remorhaz',
        nombre: 'Remorhaz',
        titulo: 'Gusano Ardiente del Hielo',
        nd: 11,
        dificultad: 'mortal',
        minRespeto: 600,
        frase: 'Del hielo eterno surge este horror. Su cuerpo derrite el acero.',
        descripcion: 'Monstruo del ártico. Su lomo arde. 195 PV. Traga entero y te cocina.',
        estadisticas: { pv: 195, ca: 17, fue: 24, des: 13, con: 21, velocidad: '9 metros, excavar 6 metros' },
        ataques: [
            { nombre: 'Mordisco', bonificador: '+11', daño: '6d10+7 perforante + 3d6 fuego', desc: 'Traga si excede por 5+' }
        ],
        habilidades: ['Cuerpo Ardiente: 3d6 fuego a quien lo toca', 'Tragar: 6d6 fuego/turno', 'Resistente: Frío, Fuego'],
        debilidades: ['Una sola cabeza', 'Sin ataques a distancia', 'Vulnerable a agua bendita'],
        tactica: 'Se acerca, muerde, traga. El calor de su cuerpo daña a atacantes.',
        recompensa: { oro: 600, respeto: 100, honor: 15 },
        botin: ['Sangre de Fuego', 'Escama de Remorhaz', 'Glándula de Calor', 'Corazón Ardiente']
    },
    {
        id: 'behir',
        nombre: 'Behir',
        titulo: 'Serpiente del Rayo',
        nd: 11,
        dificultad: 'mortal',
        minRespeto: 600,
        frase: 'Doce patas, un rayo mortal, y hambre eterna de dragones.',
        descripcion: 'Depredador de dragones. 168 PV. Aliento de rayo. Constricción letal.',
        estadisticas: { pv: 168, ca: 17, fue: 23, des: 16, con: 18, velocidad: '15 metros, trepar 12 metros' },
        ataques: [
            { nombre: 'Mordisco', bonificador: '+10', daño: '3d10+6 perforante', desc: 'Puede agarrar' },
            { nombre: 'Aliento de Rayo', bonificador: 'CD 16 DES', daño: '12d10 rayo', desc: 'Línea 6 metros, recarga 5-6' },
            { nombre: 'Constricción', bonificador: '+10', daño: '2d10+6 contundente + 2d10 cortante', desc: 'Objetivo agarrado' }
        ],
        habilidades: ['Inmune: Rayo', 'Tragar: Puede tragar medianos o menores', 'Multiataque: Mordisco + Constricción'],
        debilidades: ['Odio a dragones (los ataca primero)', 'Largo pero lento girando'],
        tactica: 'Aliento primero, constricción después. Traga a los pequeños.',
        recompensa: { oro: 650, respeto: 105, honor: 18 },
        botin: ['Glándula de Rayo', 'Escama de Behir x6', 'Sangre Eléctrica', 'Colmillos de Behir']
    },
    {
        id: 'adult_blue_dragon',
        nombre: 'Volthrax',
        titulo: 'Dragón Azul Adulto',
        nd: 16,
        dificultad: 'legendario',
        minRespeto: 1500,
        frase: '"El desierto es mío. La tormenta es mía. TÚ eres mío."',
        descripcion: 'Dragón Azul Adulto. 225 PV. Aliento de rayo. Acciones legendarias.',
        estadisticas: { pv: 225, ca: 19, fue: 25, des: 10, con: 23, velocidad: '12 metros, volar 24 metros, excavar 9 metros' },
        ataques: [
            { nombre: 'Mordisco', bonificador: '+12', daño: '2d10+7 perforante + 2d6 rayo', desc: 'Alcance 3 metros' },
            { nombre: 'Garras (x2)', bonificador: '+12', daño: '2d6+7 cortante', desc: 'Dos ataques' },
            { nombre: 'Aliento de Rayo', bonificador: 'CD 19 DES', daño: '12d10 rayo', desc: 'Línea 27 metros, recarga 5-6' }
        ],
        habilidades: ['Inmune: Rayo', 'Acciones Legendarias: 3/turno', 'Presencia Aterradora: CD 17 SAB o Asustado', 'Resistencia Legendaria: 3/día'],
        debilidades: ['Arrogante', 'Techo bajo limita vuelo', 'Frío extremo lo irrita'],
        tactica: 'Aterroriza, vuela, aliento. Acciones legendarias para ataques extra.',
        recompensa: { oro: 2000, respeto: 250, honor: 40 },
        botin: ['Escama de Dragón Azul x10', 'Cuerno del Trueno', 'Corazón Eléctrico', 'Sangre de Dragón Azul']
    },
    {
        id: 'beholder',
        nombre: 'Xanthros',
        titulo: 'El Ojo Tirano',
        nd: 13,
        dificultad: 'legendario',
        minRespeto: 1200,
        frase: '"Veo TODO. Cada pensamiento. Cada debilidad. Cada muerte posible."',
        descripcion: 'Aberración flotante. 10 rayos oculares. Campo antimagia central.',
        estadisticas: { pv: 180, ca: 18, fue: 10, des: 14, con: 18, velocidad: '0 metros, volar 6 metros (suspendido)' },
        ataques: [
            { nombre: 'Mordisco', bonificador: '+5', daño: '4d6 perforante', desc: 'Único ataque cuerpo a cuerpo' },
            { nombre: 'Rayos Oculares (x3)', bonificador: 'Varía', daño: 'Varía', desc: '3 rayos aleatorios/turno' }
        ],
        habilidades: ['Cono Antimagia: 45 metros, anula magia', 'Rayos: Encanto, Parálisis, Miedo, Petrificación, etc.', 'Acciones Legendarias: 3/turno'],
        debilidades: ['Paranoico (puede huir)', 'Ojo central puede cerrarse accidentalmente', 'Vulnerable a ataques físicos'],
        tactica: 'Flota a distancia. Usa rayos. El cono antimagia protege su frente.',
        recompensa: { oro: 1200, respeto: 180, honor: 30 },
        botin: ['Ojo Central', 'Tallo Ocular x3', 'Cerebro de Beholder', 'Esencia Aberrante']
    },
    {
        id: 'hutijin',
        nombre: 'Hutijin',
        titulo: 'Duque del Infierno',
        nd: 21,
        dificultad: 'legendario',
        minRespeto: 2500,
        frase: '"Serví bajo Asmodeus. Comandé legiones. Tú... eres un entretenimiento."',
        descripcion: 'Archidiablo, Duque del Infierno. General de las legiones de Minos. 200 PV de poder infernal puro.',
        estadisticas: { pv: 200, ca: 19, fue: 27, des: 15, con: 25, velocidad: '9 metros, volar 18 metros' },
        ataques: [
            { nombre: 'Maza Infernal', bonificador: '+14', daño: '2d8+8 contundente + 2d10 fuego', desc: 'Arma maldita' },
            { nombre: 'Garras', bonificador: '+14', daño: '2d10+8 cortante', desc: 'Dos ataques' },
            { nombre: 'Cola', bonificador: '+14', daño: '2d6+8 perforante + veneno CD 22', desc: 'Veneno infernal' },
            { nombre: 'Aliento Infernal', bonificador: 'CD 22 DES', daño: '13d6 fuego', desc: 'Cono 18 metros, recarga 5-6' }
        ],
        habilidades: ['Inmune: Fuego, Veneno, Encantado', 'Resistencia Mágica: Ventaja en salvaciones vs magia', 'Regeneración: 20 PV/turno (anulado por armas sagradas)', 'Acciones Legendarias: 3/turno', 'Teleportación: 36 metros como acción bonus'],
        debilidades: ['Armas sagradas anulan regeneración', 'Nombre verdadero (raramente conocido)', 'Orgullo de general (respeta a guerreros fuertes)'],
        tactica: 'Evalúa primero. Teleportación táctica. Aliento + maza. Regenera todo.',
        recompensa: { oro: 5000, respeto: 500, honor: 100 },
        botin: ['Cuerno de Duque Infernal', 'Contrato de Hutijin', 'Llama del Infierno', 'Título: Matademonios']
    }
];

// --- OLEADAS DEL GUANTELETE (Modo Supervivencia) ---
export const gauntletWaves = [
    {
        oleada: 1,
        nombre: 'Oleada de Goblins',
        enemigos: '6 Goblins (ND 1/4 cada uno)',
        nd: 2,
        descripcion: 'Goblins cobardes con arcos cortos y cimitarras oxidadas.',
        estadisticas: { pvTotal: 42, caPromedio: 15 },
        tactica: 'Disparan desde lejos, huyen si pierden la mitad.',
        recompensa: { oro: 30, respeto: 5 }
    },
    {
        oleada: 2,
        nombre: 'Kobolds y Trampas',
        enemigos: '8 Kobolds + 2 Trampas de Foso',
        nd: 3,
        descripcion: 'Kobolds con trampas preparadas. Cuidado dónde pisas.',
        estadisticas: { pvTotal: 40, caPromedio: 12, trampas: 'CD 12 DES o 2d6 daño' },
        tactica: 'Atraen a las trampas. Atacan en grupo para Ventaja.',
        recompensa: { oro: 50, respeto: 10 }
    },
    {
        oleada: 3,
        nombre: 'Orcos Berserker',
        enemigos: '4 Orcos Berserker (ND 2 cada uno)',
        nd: 8,
        descripcion: 'Orcos enfurecidos. Atacan sin parar hasta que mueren.',
        estadisticas: { pvTotal: 60, caPromedio: 13, fue: 16 },
        tactica: 'Cargan directamente. Furia orca cuando bajo PV.',
        recompensa: { oro: 80, respeto: 20 }
    },
    {
        oleada: 4,
        nombre: 'El Capitán Hobgoblin',
        enemigos: '1 Capitán Hobgoblin + 6 Soldados',
        nd: 9,
        descripcion: 'Formación militar. El capitán da órdenes y bonificaciones.',
        estadisticas: { pvTotal: 93, caPromedio: 17, capitan: { pv: 39, ca: 17 } },
        tactica: 'Formación cerrada. Ataques coordinados. Protegen al capitán.',
        recompensa: { oro: 120, respeto: 35 }
    },
    {
        oleada: 5,
        nombre: 'JEFE: El Trol Campeón',
        enemigos: '1 Trol Campeón (ND 9)',
        nd: 9,
        esJefe: true,
        descripcion: 'Trol mutado. Más grande, más fuerte, igual de hambriento.',
        estadisticas: { pv: 126, ca: 16, fue: 20, regeneracion: '15 PV/turno' },
        tactica: 'Ataca al más cercano. Regenera hasta que le apliquen fuego.',
        recompensa: { oro: 200, respeto: 60, honor: 10 },
        botin: ['Corona del Rey de la Basura', 'Corazón de Trol Campeón', 'Garras de Campeón']
    }
];

// --- CLASIFICACIÓN (Campeones NPC) ---
export const arenaLeaderboard = [
    { puesto: 1, nombre: 'Brunhilda', titulo: 'La Invicta', victorias: 37, derrotas: 0, racha: 37, respeto: 2500 },
    { puesto: 2, nombre: 'Krug el Poeta', titulo: 'Rompehuesos', victorias: 28, derrotas: 4, racha: 12, respeto: 1800 },
    { puesto: 3, nombre: 'Silas el Silencioso', titulo: 'Sombra', victorias: 25, derrotas: 6, racha: 8, respeto: 1500 },
    { puesto: 4, nombre: 'Zora la Cicatriz', titulo: 'Ex-Ignis', victorias: 22, derrotas: 5, racha: 5, respeto: 1200 },
    { puesto: 5, nombre: 'Kragos', titulo: 'El Minotauro', victorias: 19, derrotas: 8, racha: 3, respeto: 900 },
    { puesto: 6, nombre: 'Dedos Vance', titulo: 'Escurridizo', victorias: 15, derrotas: 12, racha: 2, respeto: 600 },
    { puesto: 7, nombre: 'Grumm', titulo: 'Cocinero Loco', victorias: 12, derrotas: 9, racha: 1, respeto: 450 },
    { puesto: 8, nombre: 'El Mudo', titulo: 'Kenku Asesino', victorias: 10, derrotas: 3, racha: 4, respeto: 400 },
    { puesto: 9, nombre: 'Trixie', titulo: 'Hada Rabiosa', victorias: 8, derrotas: 15, racha: 0, respeto: 200 },
    { puesto: 10, nombre: 'Viejo Rorn', titulo: 'El Superviviente', victorias: 5, derrotas: 20, racha: 0, respeto: 100 }
];

// --- SISTEMA DE APUESTAS ---
export const BETTING_CONFIG = {
    apuestaMinima: 10,
    apuestaMaxima: 5000,
    multiplicadorMaximo: 0.5, // Max = 50% del oro del jugador
    comisionCasa: 0.05, // 5% de comisión del Foso
    multiplicadores: {
        facil: 1.2,
        media: 1.6,
        dificil: 2.4,
        mortal: 3.2,
        legendario: 5.0
    }
};

// --- CAMBIOS DE HONOR ---
export const HONOR_CHANGES = {
    victoriaLimpia: 5,          // Victoria sin trucos
    victoriaImpecable: 10,      // Victoria sin recibir daño
    victoriaSucia: -10,         // Usaste veneno, trampas, etc.
    matarIndefenso: -5,         // Mataste a enemigo indefenso
    perdonarVida: 10,           // Perdonaste la vida
    huirCombate: -20,           // Huiste del combate
    remateEpico: 15,            // Remate espectacular
    favoritoPublico: 8,         // La multitud te aclama
    abucheado: -8,              // La multitud te abuchea
    derrotarJefe: 20,           // Derrotaste a un jefe
    matarLeyenda: 30            // Derrotaste a un oponente legendario
};
