import { AudioManager } from './audio.js';
import { loadStory } from './dialog.js';
import {changeScene} from './navigation.js';

// 1. Create the manager
window.audioManager = new AudioManager();

// 2. Initialize on first user interaction (required by browsers)
document.getElementById('startGame').addEventListener('click', async (event) => {
    document.body.requestFullscreen();
    event.target.classList.add('hidden');
    await changeScene('menu');
    loadStory();
    document.querySelector('.main').classList.remove('hidden');
    if (!window.audioManager.audioContext) {
        window.audioManager.init();
    }
}, { once: true });
// 3. Change music

document.getElementById('test').addEventListener('click', async () => {
    window.audioManager.changeMusic('Regona - B__ Start Up.mp3');
});