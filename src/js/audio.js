class AudioManager{
    constructor() {
        this.audioContext = null;
        this.gainNode = null;
        this.audioElement = null;
        this.source = null;
        this.currentMusic = null;
        this.musicQueue = []; // Add queue
        this.isProcessing = false;
        this.musicFolder = 'src/assets/audio/music/';
    }

    init() {
        // Create audio context (must be called after user interaction)
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
    }

    async changeMusic(music, fadeDuration = 1000) {
        // Add to queue
        let url = this.musicFolder + music;
        this.musicQueue.push({ url, fadeDuration });
        
        // Start processing if not already
        if (!this.isProcessing) {
            await this.processQueue();
        }
    }

    async processQueue() {
        if (this.musicQueue.length === 0) {
            this.isProcessing = false;
            return;
        }
        
        this.isProcessing = true;
        
        // Get next item (clear queue to only play latest)
        const nextTrack = this.musicQueue[this.musicQueue.length - 1];
        this.musicQueue = []; // Clear all pending requests
        
        if (!this.audioContext) this.init();
        
        // Fade out current music
        if (this.currentMusic) {
            await this.fadeOut(nextTrack.fadeDuration / 2);
            if (this.source) this.source.disconnect();
            if (this.audioElement) {
                this.audioElement.pause();
                this.audioElement.src = '';
            }
        }
        
        // Load new music
        this.audioElement = new Audio(nextTrack.url);
        this.audioElement.loop = true;
        this.source = this.audioContext.createMediaElementSource(this.audioElement);
        this.source.connect(this.gainNode);
        
        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        await this.audioElement.play();
        
        // Fade in
        await this.fadeIn(nextTrack.fadeDuration / 2);
        this.currentMusic = nextTrack.url;
        
        // Process next in queue
        await this.processQueue();
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
