async function changeScene(sceneName) {
    try {
        const res = await fetch(`${sceneName}.html`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const htmlText = await res.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const container = document.getElementById('game');
        if (!container) {
            console.error('#game container not found');
            return;
        }

        // Clear existing content
        container.innerHTML = '';

        // Import all body child nodes from the fetched doc
        const nodes = Array.from(doc.body.childNodes);
        nodes.forEach(node => container.appendChild(document.importNode(node, true)));

        // Re-insert scripts so they execute (handles inline and external scripts)
        const scripts = Array.from(container.querySelectorAll('script'));
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
            newScript.text = oldScript.textContent;
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });

        document.getElementById('scenes').setAttribute('scene', sceneName);
    } catch (err) {
        console.error('Error loading scene:', err);
    }
}

// // Example usage:
// document.addEventListener('DOMContentLoaded', () => sceneChange('menu.html'));
// // or sceneChange('scenes/level1.html');