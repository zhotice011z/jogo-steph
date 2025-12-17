import { changeScene } from "/src/js/navigation.js";

function loadStory() {
    return fetch(`/src/scenes/story.json`)
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
function loadDialogConfig() {
    return fetch(`/src/scenes/dialogConfig.json`)
        .then(response => response.json())
        .then(data => {
            window.dialogConfig = data;
            console.log("Dialog configurations loaded:", window.dialogConfig);
        })
        .catch(e => {
            console.log("Error parsing JSON: " + e.message);
            throw e; // rethrow so callers see the error
        });
}

const actions = {
    changeScene: ({ sceneName, variation }) => {
        changeScene(sceneName, variation);
    },
    changeCharacter: ({ character, image, animation = null }) => {
        const charElem = document.getElementsByClassName('character')[character];
        if (image) {
            charElem.style.backgroundImage = `url('/src/assets/image/characters/${image}')`;
        } else {
            charElem.style.backgroundImage = 'none';
        }
    }
};

const characterTitle = {
    'nix': {
        text: 'Nix',
        color: 'blue'
    },
    'hemera': {
        text: 'Hemera',
        color: 'pink'
    },
    'apolo': {
        text: 'Apolo',
        color: 'orange'
    },
    'dafne': {
        text: 'Dafne',
        color: 'pink'
    },
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

    const dialogTitle = document.getElementById('dialog-title');
    if (node.character) {
        dialogTitle.textContent = characterTitle[node.character].text;
        dialogTitle.parentElement.className = `title-bar ${characterTitle[node.character].color}`;
    } else {
        dialogTitle.textContent = '???';
    }
    const btn1 = document.getElementById('dialog1');
    const btn2 = document.getElementById('dialog2');
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
                if (choice.actions) {
                    choice.actions.forEach(actionObject => {
                        try {
                            actions[actionObject.action](actionObject.actionParams);
                        } catch (e) {
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

async function changeDialogScene(variation) {
    const dialogScene = window.dialogConfig[variation];
    if (dialogScene.character1) {
        actions.changeCharacter({
            character: 0,
            image: dialogScene.character1
        });
    } else {
        actions.changeCharacter({
            character: 0,
            image: ''
        });
    }

    if (dialogScene.character2) {
        actions.changeCharacter({
            character: 1,
            image: dialogScene.character2
        });
    } else {
        actions.changeCharacter({
            character: 1,
            image: ''
        });
    }

    if (dialogScene.background) {
        document.getElementById('scene').style.backgroundImage = `url(/src/assets/image/background/${dialogScene.background})`
    }

    if (dialogScene.music) {
        await window.audioManager.changeMusic(dialogScene.music);
    }

    loadNode(variation);
}


export { loadStory, loadDialogConfig, loadNode, changeDialogScene};

if (typeof window !== 'undefined') {
    window.loadStory = loadStory;
    window.loadDialogConfig = loadDialogConfig
    window.loadNode = loadNode;
    window.changeDialogScene = changeDialogScene;
}