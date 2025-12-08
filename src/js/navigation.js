async function sceneTransition(enter=true){
    const sceneTransitionDiv = document.getElementById('sceneTransition');
    if (enter){
        sceneTransitionDiv.classList.add('fade');
        sceneTransitionDiv.classList.remove('hidden');
        await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
        sceneTransitionDiv.classList.remove('fade');
        await new Promise(resolve => setTimeout(resolve, 1000));
        sceneTransitionDiv.classList.add('hidden');
    }
}

async function changeScene(sceneName, variation = null) {
    try {
        const res = await fetch(`src/levels/${sceneName}.html`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const htmlText = await res.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        
        const game = document.getElementById('game');
        if (!game) {
            console.error('#game container not found');
            return;
        }

        // Clear existing content
        await sceneTransition(true);
        game.innerHTML = '';

        // Import all body child nodes from the fetched doc
        const nodes = Array.from(doc.body.childNodes);
        nodes.forEach(node => game.appendChild(document.importNode(node, true)));

        // Re-insert scripts so they execute (handles inline and external scripts)
        const scripts = Array.from(game.querySelectorAll('script'));
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.text = oldScript.textContent;
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });

        document.getElementById('scenes').setAttribute('scene', sceneName);
        await sceneTransition(false);

    } catch (err) {
        console.error('Error loading scene:', err);
    }
}

export { changeScene };

if (typeof window !== 'undefined') {
    window.changeScene = changeScene;
}

// // Example usage:
// document.addEventListener('DOMContentLoaded', () => sceneChange('menu.html'));
// // or sceneChange('scenes/level1.html');