// src/js/modules/audio.js

const sfxLibrary = {
    // Placeholder sounds - In a real app these would be paths to .mp3/.wav files
    'click': 'assets/sounds/click.mp3',
    'typewriter': 'assets/sounds/typewriter_key.mp3',
    'wind_howl': 'assets/sounds/wind_howl.mp3',
    'metal_door': 'assets/sounds/metal_door_heavy.mp3',
    'whispers': 'assets/sounds/whispers_dark.mp3'
};

const musicLibrary = {
    'ominous_drone': 'assets/music/ominous_drone.mp3',
    'black_market_theme': 'assets/music/black_market_theme.mp3'
};

let currentMusic = null;

export const audioManager = {
    playSFX: (key) => {
        // Placeholder implementation
        console.log(`🔊 [AUDIO-SFX] Playing: ${key}`);
        // Real implementation would be:
        // const audio = new Audio(sfxLibrary[key]);
        // audio.volume = 0.5;
        // audio.play().catch(e => console.warn("Audio play failed", e));
    },

    playMusic: (key) => {
        console.log(`🎵 [AUDIO-MUSIC] Starting: ${key}`);
        if (currentMusic) {
            console.log(`🎵 [AUDIO-MUSIC] Stopping previous track.`);
            // currentMusic.pause();
        }
        currentMusic = key;
        // const audio = new Audio(musicLibrary[key]);
        // audio.loop = true;
        // audio.play().catch(...)
    },

    stopMusic: () => {
        if (currentMusic) {
            console.log(`🎵 [AUDIO-MUSIC] Stopped.`);
            currentMusic = null;
        }
    }
};

window.playSFX = audioManager.playSFX; // Expose for testing
