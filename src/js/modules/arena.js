import { state } from '../../state.js';

/* 
    ARENA MODULE: "EL FOSO DE SANGRE"
    Mode: Registration / Info Display (No Simulation)
*/

// --- STATE ---
let currentArenaMode = null;

// --- DOM ELEMENTS ---
let arenaViewContainer;
let arenaContent;

export function initArena() {
    arenaViewContainer = document.getElementById('arena-view');
    arenaContent = document.getElementById('arena-content');

    // Global Expose
    window.startArenaMode = startArenaMode;
    window.signUpForArena = signUpForArena;
    window.exitArena = exitArena;
    window.renderArenaMenu = renderArenaMenu; // Expose for "Back" button
}

export function enterArena() {
    // MODAL MODE: We don't need to hide the background grid/tavern
    // This allows the user to return exactly where they were.

    if (arenaViewContainer) {
        arenaViewContainer.classList.remove('hidden');
        arenaViewContainer.classList.add('animate-fade-in'); // Add fade in
        renderArenaMenu();
    }
}

export function exitArena() {
    if (arenaViewContainer) arenaViewContainer.classList.add('hidden');
    // No need to re-call enterTavern as we didn't leave it, we just overlayed.
}

function renderArenaMenu() {
    if (!arenaContent) return;

    arenaContent.innerHTML = `
        <div class="text-center max-w-4xl mx-auto animate-fade-in relative z-10">
            <h2 class="font-cinzel text-5xl text-red-600 font-bold mb-2 drop-shadow-md">EL FOSO DE SANGRE</h2>
            <p class="text-gray-400 italic mb-8">"Lo que pasa en el foso, se queda en el foso." - Borg</p>
            <p class="text-sm text-gray-500 mb-8 max-w-2xl mx-auto">
                Bienvenido al espectáculo más sangriento del Anillo 2. Aquí no hay dados digitales, solo gloria real. 
                Elige tu categoría para ver contra quién te enfrentas y cuál es el premio. 
                Luego, tira Iniciativa en tu mesa.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <!-- MODE A: DUEL -->
                <button onclick="startArenaMode('duel')" class="group relative bg-black/60 border border-red-900/50 p-6 rounded-xl hover:bg-red-900/20 transition-all hover:-translate-y-1">
                    <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black border border-red-600 text-red-500 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full">1 vs 1</div>
                    <i class="fas fa-skull-crossbones text-5xl text-gray-600 group-hover:text-red-500 mb-4 transition-colors"></i>
                    <h3 class="font-cinzel text-xl font-bold text-gray-200 group-hover:text-white">Duelo de Honor</h3>
                    <p class="text-xs text-gray-500 mt-2">Pelea simple.<br>Premio: 50 mo + Apuestas</p>
                </button>

                <!-- MODE B: BEAST -->
                <button onclick="startArenaMode('beast')" class="group relative bg-black/60 border border-red-900/50 p-6 rounded-xl hover:bg-red-900/20 transition-all hover:-translate-y-1">
                    <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black border border-amber-600 text-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full">PvE</div>
                    <i class="fas fa-paw text-5xl text-gray-600 group-hover:text-amber-500 mb-4 transition-colors"></i>
                    <h3 class="font-cinzel text-xl font-bold text-gray-200 group-hover:text-white">Jaula de la Bestia</h3>
                    <p class="text-xs text-gray-500 mt-2">Grupo vs Monstruo.<br>Premio: 200 mo + Materiales</p>
                </button>

                <!-- MODE C: SURVIVAL -->
                <button onclick="startArenaMode('gauntlet')" class="group relative bg-black/60 border border-red-900/50 p-6 rounded-xl hover:bg-red-900/20 transition-all hover:-translate-y-1">
                    <div class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black border border-purple-600 text-purple-500 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full">Hardcore</div>
                    <i class="fas fa-fist-raised text-5xl text-gray-600 group-hover:text-purple-500 mb-4 transition-colors"></i>
                    <h3 class="font-cinzel text-xl font-bold text-gray-200 group-hover:text-white">Guantelete Ciego</h3>
                    <p class="text-xs text-gray-500 mt-2">Sin armadura.<br>Premio: Honor + Objeto</p>
                </button>
            </div>

            <div class="mt-8 border-t border-white/10 pt-6">
                 <button onclick="exitArena()" class="text-gray-500 hover:text-white text-sm uppercase tracking-widest transition-colors"><i class="fas fa-arrow-left mr-2"></i> Volver a la Barra</button>
            </div>
        </div>
    `;
}

function startArenaMode(mode) {
    currentArenaMode = mode;

    let rivalName = "Rival Desconocido";
    let rivalDesc = "";
    let reward = "";

    if (mode === 'duel') {
        const opponents = [
            { name: "Oso Pardo con Armadura", desc: "Gruñe y echa espuma por la boca. Está drogado." },
            { name: "El Duelista Enmascarado", desc: "Mueve su estoque con elegancia letal (CR 8 Swashbuckler)." },
            { name: "Monje Borracho", desc: "Se tambalea pero esquiva todo (Maestro del Puño Ebrio)." },
            { name: "Guerrero de Ignis", desc: "Juega sucio y tira arena a los ojos." },
            { name: "Mímico Cofre", desc: "Parece un premio en el centro, pero tiene dientes." }
        ];
        const opp = opponents[Math.floor(Math.random() * opponents.length)];
        rivalName = opp.name;
        rivalDesc = opp.desc;
        reward = "50 Monedas de Oro + Apuestas";
    } else if (mode === 'beast') {
        const beasts = [
            { name: "3 Osos Lechuza", desc: "Hambrientos y furiosos." },
            { name: "Wyvern Herido", desc: "Tiene las alas cortadas, pero escupe veneno." },
            { name: "Hidra Joven", desc: "5 Cabezas. Si cortas una y no quemas el muñón, salen dos." }
        ];
        const beast = beasts[Math.floor(Math.random() * beasts.length)];
        rivalName = beast.name;
        rivalDesc = beast.desc;
        reward = "200 Monedas de Oro + Despojos de Monstruo";
    } else {
        rivalName = "Horda de Goblins y Kobolds";
        rivalDesc = "Oleada tras oleada de criaturas débiles pero numerosas. Armas improvisadas.";
        reward = "Título 'Rey de la Basura' + Objeto Mágico Menor";
    }

    renderMatchUI(mode, rivalName, rivalDesc, reward);
}

function renderMatchUI(mode, rivalName, rivalDesc, reward) {
    arenaContent.innerHTML = `
        <div class="max-w-3xl mx-auto h-full flex flex-col items-center justify-center animate-fade-in relative z-10">
            <div class="glass-panel p-8 rounded-xl border border-red-900/50 bg-black/80 w-full text-center relative overflow-hidden">
                <!-- Background decoration -->
                <div class="absolute inset-0 bg-[url('/img/hub/arena.png')] bg-cover bg-center opacity-20 pointer-events-none"></div>
                
                <h3 class="text-red-500 font-bold tracking-widest uppercase text-sm mb-2">CARTEL DEL COMBATE</h3>
                <h2 class="text-4xl font-cinzel text-white font-bold mb-6">${mode === 'duel' ? 'DUELO DE HONOR' : (mode === 'beast' ? 'LA JAULA' : 'GUANTELETE')}</h2>

                <div class="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
                    <div class="text-center">
                        <div class="w-24 h-24 rounded-full bg-gray-800 border-2 border-green-500 flex items-center justify-center mb-2 mx-auto">
                            <i class="fas fa-user text-3xl text-gray-400"></i>
                        </div>
                        <p class="font-bold text-white">TÚ</p>
                    </div>
                    
                    <div class="text-2xl font-bold text-red-600">VS</div>

                    <div class="text-center">
                        <div class="w-24 h-24 rounded-full bg-gray-800 border-2 border-red-500 flex items-center justify-center mb-2 mx-auto">
                            <i class="fas fa-skull text-3xl text-gray-400"></i>
                        </div>
                        <p class="font-bold text-white">RIVAL</p>
                    </div>
                </div>

                <div class="bg-white/5 p-4 rounded-lg border border-white/10 mb-6 max-w-lg mx-auto">
                    <h4 class="text-xl font-bold text-red-400 mb-1">${rivalName}</h4>
                    <p class="text-gray-400 text-sm italic">"${rivalDesc}"</p>
                </div>

                <div class="mb-8">
                    <span class="text-xs uppercase tracking-widest text-yellow-500 block mb-1">Recompensa</span>
                    <span class="text-2xl font-cinzel text-white">${reward}</span>
                </div>

                <button onclick="signUpForArena()" class="px-8 py-3 bg-red-700 hover:bg-red-600 text-white font-bold rounded shadow-lg shadow-red-900/20 uppercase tracking-widest transition-all transform hover:scale-105">
                    <i class="fas fa-quill mr-2"></i> Inscribirse al Combate
                </button>
                
                <div class="mt-4">
                    <button onclick="renderArenaMenu()" class="text-gray-500 hover:text-white text-xs underline">Elegir otra categoría</button>
                </div>
            </div>
        </div>
    `;
}

function signUpForArena() {
    alert("📝 ¡Inscripción Aceptada!\n\nBrunhilda grita: '¡ENTRAD AL FOSO!'\n\n(Ahora gestiona el combate en tu mesa de juego. ¡Suerte!)");
}
