import { AudioManager } from '/src/js//audio.js';
import { loadStory } from '/src/js//dialog.js';
import {changeScene} from '/src/js//navigation.js';

// 1. Create the manager
window.audioManager = new AudioManager();

// 2. Initialize on first user interaction (required by browsers)
document.getElementById('startGame').addEventListener('click', async (event) => {
    document.body.requestFullscreen();
    event.target.classList.add('hidden');
    loadStory();
    loadDialogConfig();
    document.querySelector('.main').classList.remove('hidden');
    if (!window.audioManager.audioContext) {
        window.audioManager.init();
    }
    await changeScene('menu');
}, { once: true });
// 3. Change music