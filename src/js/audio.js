class AudioManager{
    constructor() {
        this.audioContext = null;
        this.gainNode = null;
        this.audioElement = null;
        this.source = null;
        this.currentMusic = null;
        this.musicFolder = 'src/assets/audio/music/';
    }

    init() {
        // Create audio context (must be called after user interaction)
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
    }

    async changeMusic(musicName, fadeDuration = 3000) {
        let musicPath = this.musicFolder + musicName;
        if (!this.audioContext) this.init();

        // Fade out current music
        if (this.currentMusic) {
            await this.fadeOut(fadeDuration / 2);
            if (this.source) {
                this.source.disconnect();
            }
            if (this.audioElement) {
                this.audioElement.pause();
            }
        }

        // Load and play new music
        this.audioElement = new Audio(musicPath);
        this.audioElement.loop = true;
        this.source = this.audioContext.createMediaElementSource(this.audioElement);
        this.source.connect(this.gainNode);

        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        await this.audioElement.play();

        // Fade in new music
        await this.fadeIn(fadeDuration / 2);
        this.currentMusic = musicPath;
    }

    fadeOut(duration) {
        const currentTime = this.audioContext.currentTime;
        this.gainNode.gain.linearRampToValueAtTime(0, currentTime + duration / 1000);
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    fadeIn(duration) {
        const currentTime = this.audioContext.currentTime;
        this.gainNode.gain.linearRampToValueAtTime(1, currentTime + duration / 1000);
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    setVolume(volume) {
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        }
    }
};

export { AudioManager };