import { changeScene } from "./navigation.js";

function loadStory() {
    return fetch(`src/levels/story.json`)
        .then(response => response.json())
        .then(data => {
            window.story = data;
            console.log("Story loaded:", window.story);
        })
        .catch(e => {
            console.log("Error parsing JSON: " + e.message);
            throw e; // rethrow so callers see the error
        });
}



const actions = {
    changeScene: ({sceneName, variation}) => {
        changeScene(sceneName, variation)
    }
};
// Load a specific story node
function loadNode(nodeId) {
    if (!window.story) {
        console.log("Error: Story not loaded yet!");
        return;
    }

    const node = window.story[nodeId];

    if (!node) {
        console.log("Error: Node not found!");
        return;
    }

    console.log(`Current Node: ${nodeId}`);
    document.getElementById('dialog-text').textContent = node.text;

    const characterNameElem = document.getElementById('dialog-title');
    if (node.character) {
        characterNameElem.textContent = node.character;
    }else {
        characterNameElem.textContent = '???';
    }
    const btn1 = document.getElementById('dialog-1');
    const btn2 = document.getElementById('dialog-2');
    const buttons = [btn1, btn2];

    // Hide all buttons first
    buttons.forEach(btn => btn.classList.add('hidden'));

    // Update buttons based on available choices
    node.choices.forEach((choice, index) => {
        if (index < buttons.length) {
            const btn = buttons[index];
            btn.textContent = choice.text;
            btn.classList.remove('hidden');
            btn.onclick = () => {
                // Execute custom action if specified
                if (choice.actions){
                    choice.actions.forEach(actionObject => {                        
                        try{
                            actions[actionObject.action](actionObject.actionParams);
                        } catch (e){
                            console.log(`Error executing action ${actionObject.action}: ${e.message}`);
                        }
                    });
                }
                // Navigate to next node
                loadNode(choice.next);
            };
            btn.disabled = false;
        }
    });
}

export { loadStory, loadNode };

if (typeof window !== 'undefined') {
    window.loadStory = loadStory;
    window.loadNode = loadNode;
}