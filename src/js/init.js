import { AudioManager } from '/src/js//audio.js';
import { loadStory } from '/src/js//dialog.js';
import {changeScene} from '/src/js//navigation.js';
import { ProgressTracker } from '/src/js/progress.js';

window.audioManager = new AudioManager();
window.progressTracker = new ProgressTracker();


document.getElementById('startGame').addEventListener('click', async (event) => {
    document.body.requestFullscreen();
    event.target.classList.add('hidden');
    loadStory();
    loadDialogConfig();
    document.querySelector('.main').classList.remove('hidden');
    if (!window.audioManager.audioContext) {
        window.audioManager.init();
    }
    if (!window.progressTracker.progressElement) {
        window.progressTracker.init('progress', 'endings');
    }
    await changeScene('menu');
}, { once: true });
// 3. Change music