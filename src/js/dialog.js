function loadStory(storyName) {
    return fetch(`../stories/${storyName}.json`)
        .then(response => response.json())
        .then(data => {
            currentStory = data;
            loadNode('start');
        })
        .then(() =>
            console.log("Story updated successfully!")
        ).catch(e => {
            console.log("Error parsing JSON: " + e.message);
            throw e; // rethrow so callers see the error
        });
}

const actions = {
    go_to_scene: function (sceneName) {
        // changeScene(sceneName);
        window.open(`${sceneName}.html`, '_blank');
    }
};

// Load a specific story node
function loadNode(nodeId) {
    const node = currentStory[nodeId];

    if (!node) {
        console.log("Error: Node not found!");
        return;
    }

    currentNode = nodeId;
    console.log(`Current Node: ${nodeId}`);
    document.getElementById('dialog-text').textContent = node.text;

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
                if (choice.action && actions[choice.action]) {
                    actions[choice.action](choice.actionParam);
                }
                // Navigate to next node
                loadNode(choice.next);
            };
            btn.disabled = false;
        }
    });
}