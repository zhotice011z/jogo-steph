import { AudioManager } from './audio.js';
import {changeScene} from './navigation.js';

// 1. Create the manager
const audioManager = new AudioManager();

// 2. Initialize on first user interaction (required by browsers)
document.getElementById('startGame').addEventListener('click', async (event) => {
    document.body.requestFullscreen();
    event.target.style.display = 'none';
    await changeScene('menu');
    document.querySelector('.main').style.display = 'block';
    if (!audioManager.audioContext) {
        audioManager.init();
        await audioManager.changeMusic('Tupperwave - Timeless.mp3', 6000);
    }
}, { once: true });
// 3. Change music

document.getElementById('test').addEventListener('click', async () => {
    audioManager.changeMusic('Regona - B__ Start Up.mp3');
});