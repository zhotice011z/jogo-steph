import { AudioManager } from './audio.js';

// 1. Create the manager
const audioManager = new AudioManager();

// 2. Initialize on first user interaction (required by browsers)
document.addEventListener('click', async () => {
    if (!audioManager.audioContext) {
        audioManager.init();
        await audioManager.changeMusic('Tupperwave - Timeless.mp3', 6000);
    }
}, { once: true });
// 3. Change music

document.getElementById('test').addEventListener('click', async () => {
    audioManager.changeMusic('Regona - B__ Start Up.mp3');
});