class ProgressTracker {
    constructor() {
        this.storyProgress = 0;
        this.progressElement = null;
        this.storyPoints = {
            nix: false,
            delfos: false,
            hemera: false,
            apolo: false,
            dafne: false,
            retorno: false,
            pandora: false
        };
        this.endingsUnlocked = 0;
        this.endingElement = null;
        this.endings = {
            nix: false,
            apolo: false,
            pandora: false
        };
    }
    init(progress_id, endings_id) {
        this.progressElement = document.getElementById(progress_id);
        this.endingElement = document.getElementById(endings_id);
        this.updateProgress();
        this.updateEndings();
    }

    updateProgress(point) {
        if (point) this.storyPoints[point] = true;
        console.log(this.storyPoints);
        this.storyProgress = Object.values(this.storyPoints).filter(Boolean).length / Object.values(this.storyPoints).length;
        this.progressElement.innerText = `Progresso da história: ${(this.storyProgress * 100).toFixed(0)}%`;
    }

    updateEndings(ending) {
        if (ending) this.endings[ending] = true;
        console.log(this.endings);
        this.endingsUnlocked = Object.values(this.endings).filter(Boolean).length;
        this.endingElement.innerText = `Finais descobertos: ${this.endingsUnlocked}/${Object.values(this.endings).length}`;
    }
}

export {ProgressTracker};