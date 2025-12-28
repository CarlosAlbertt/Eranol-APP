import { audioManager } from './audio.js';

let overlay;
let bgLayer;
let textContainer;
let skipBtn;
let arrowIndicator;

let currentScene = null;
let currentStepIndex = 0;
let isTyping = false;
let typeTimeout;

export function initCinematics() {
    // Inject HTML if missing
    if (!document.getElementById('cinematic-overlay')) {
        const div = document.createElement('div');
        div.id = 'cinematic-overlay';
        div.className = 'fixed inset-0 z-[999] bg-black hidden flex flex-col items-center justify-end pb-20 pointer-events-auto'; // Start hidden
        div.innerHTML = `
            <!-- Background Layer -->
            <div id="cinematic-bg" class="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-50"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

            <!-- Content -->
            <div class="relative z-10 max-w-4xl w-full px-8 text-center">
                <p id="cinematic-text" class="font-cinzel text-xl md:text-3xl text-gray-100 leading-relaxed shadow-black drop-shadow-md min-h-[100px]">
                    <!-- Text goes here -->
                </p>
                <div id="cinematic-arrow" class="mt-8 text-amber-500 text-2xl animate-bounce hidden">
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>

            <!-- Controls -->
            <button id="cinematic-skip" class="absolute top-8 right-8 text-gray-500 text-xs uppercase tracking-[0.2em] hover:text-white transition-colors z-20">
                Saltar Escena <i class="fas fa-forward ml-1"></i>
            </button>
            
            <!-- Click Capture -->
            <div id="cinematic-click-area" class="absolute inset-0 z-0 user-select-none"></div>
        `;
        document.body.appendChild(div);
    }

    overlay = document.getElementById('cinematic-overlay');
    bgLayer = document.getElementById('cinematic-bg');
    textContainer = document.getElementById('cinematic-text');
    skipBtn = document.getElementById('cinematic-skip');
    arrowIndicator = document.getElementById('cinematic-arrow');

    // Event Listeners
    document.getElementById('cinematic-click-area').onclick = handleUserClick;
    skipBtn.onclick = endScene;
}

export function playScene(sceneData) {
    if (!overlay) initCinematics();

    currentScene = sceneData;
    currentStepIndex = 0;

    console.log(`🎬 [CINEMATIC] Starting Scene: ${sceneData.id}`);

    // Show Overlay
    overlay.classList.remove('hidden');
    overlay.classList.add('animate-fade-in');

    // Start Music
    if (sceneData.music) audioManager.playMusic(sceneData.music);

    playStep(0);
}

function playStep(index) {
    if (index >= currentScene.steps.length) {
        endScene();
        return;
    }

    const step = currentScene.steps[index];
    currentStepIndex = index;
    arrowIndicator.classList.add('hidden');

    // Background Transition
    if (step.bg) {
        bgLayer.style.backgroundImage = `url('${step.bg}')`;
        // Optional: Add simple ken-burns or movement classes here if we have CSS for it
    }

    // Sound Effect
    if (step.sfx) audioManager.playSFX(step.sfx);

    // Type Text
    typeText(step.text, () => {
        // Typing Finished
        isTyping = false;
        arrowIndicator.classList.remove('hidden');

        // Auto-advance if duration is set (and not 'click')
        if (step.duration && step.duration !== 'click') {
            setTimeout(() => {
                if (currentScene && currentStepIndex === index) nextStep();
            }, step.duration);
        }
    });
}

function typeText(text, callback) {
    textContainer.innerHTML = "";
    isTyping = true;
    let i = 0;
    const speed = 30; // ms per char

    if (typeTimeout) clearTimeout(typeTimeout);

    function type() {
        if (i < text.length) {
            textContainer.innerHTML += text.charAt(i);
            i++;
            // Optional: Random typing sound here
            if (i % 3 === 0) audioManager.playSFX('typewriter');
            typeTimeout = setTimeout(type, speed);
        } else {
            if (callback) callback();
        }
    }
    type();
}

function handleUserClick() {
    if (!currentScene) return;

    if (isTyping) {
        // Instant finish typing
        clearTimeout(typeTimeout);
        const step = currentScene.steps[currentStepIndex];
        textContainer.innerHTML = step.text;
        isTyping = false;
        arrowIndicator.classList.remove('hidden');
    } else {
        // Next Step
        nextStep();
    }
}

function nextStep() {
    playStep(currentStepIndex + 1);
}

function endScene() {
    console.log(`🎬 [CINEMATIC] Scene Complete`);
    overlay.classList.add('hidden');
    overlay.classList.remove('animate-fade-in');

    // Stop Music?? Or keep playing? Usually keep playing if it transitions to gameplay music
    // audioManager.stopMusic(); 

    if (currentScene && currentScene.onComplete) {
        currentScene.onComplete();
    }

    currentScene = null;
}
