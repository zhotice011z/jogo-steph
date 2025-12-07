import { AudioManager } from './audio.js';
import {changeScene} from './navigation.js';

// 1. Create the manager
const audioManager = new AudioManager();

// 2. Initialize on first user interaction (required by browsers)
document.body.addEventListener('click', async (event) => {
    if (!audioManager.audioContext) {
        audioManager.init();
        await audioManager.changeMusic('Tupperwave - Timeless.mp3', 6000);
    }
}, { once: true });
// 3. Change music