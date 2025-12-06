import { AudioManager } from './audio.js';

// 1. Create the manager
const audioManager = new window.AudioManager();

// 2. Initialize on first user interaction (required by browsers)
document.addEventListener('click', () => {
    if (!audioManager.audioContext) {
        audioManager.init();
    }
}, { once: true });

// 3. Change music
audioManager.changeMusic('architecture in tokyo - HUMID AIR', 2000);
