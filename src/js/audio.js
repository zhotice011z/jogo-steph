class AudioManager {
    constructor() {
        this.audioContext = null;
        this.gainNode = null;
        this.audioElement = null;
        this.source = null;
        this.currentMusic = null;
        this.soundBufferCache = new Map();
        this.sfxGainNode = null;
        this.musicQueue = []; // Add queue
        this.isProcessing = false;
    }

    init() {
        // Create audio context (must be called after user interaction)
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
        // Create master SFX gain node so SFX don't interfere with music gain
        this.sfxGainNode = this.audioContext.createGain();
        this.sfxGainNode.connect(this.audioContext.destination);
        console.log('audio context initialized');
    }

    async changeMusic(music, fadeDuration = 1000) {
        // Support special value "0" to stop music (no music)
        if (music === '0') {
            this.musicQueue.push({ url: null, fadeDuration });
            console.log(`Stop music requested`);
            if (!this.isProcessing) await this.processQueue();
            return;
        }

        // Add music change to queue
        let url = '/src/assets/audio/music/' + music;
        this.musicQueue.push({ url, fadeDuration });
        console.log(`Music '${music}' added to queue`);

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

        // If nextTrack.url is null => stop music request
        if (!nextTrack.url) {
            if (this.currentMusic) {
                console.log(`Stopping music: ${this.currentMusic}`);
                await this.fadeOut(nextTrack.fadeDuration / 2);
                if (this.source) this.source.disconnect();
                if (this.audioElement) {
                    this.audioElement.pause();
                    this.audioElement.src = '';
                }
                this.currentMusic = null;
            } else {
                console.log('No music playing to stop');
            }
            this.isProcessing = false;
            return;
        }

        if (this.currentMusic == nextTrack.url) {
            console.log(`${this.currentMusic} already playing`);
            this.isProcessing = false;
            return;
        }

        if (!this.audioContext) this.init();

        // Fade out current music
        if (this.currentMusic) {
            console.log(`Fading out current music: ${this.currentMusic}`);
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
        console.log(`Fading in new music: ${nextTrack.url}`);
        await this.fadeIn(nextTrack.fadeDuration / 2);
        this.currentMusic = nextTrack.url;

        // Process next in queue
        await this.processQueue();
    }

    async fadeOut(duration) {
        const currentTime = this.audioContext.currentTime;
        this.gainNode.gain.linearRampToValueAtTime(0, currentTime + duration / 1000);
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    async fadeIn(duration) {
        const currentTime = this.audioContext.currentTime;
        this.gainNode.gain.linearRampToValueAtTime(1, currentTime + duration / 1000);
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    setVolume(volume) {
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        }
    }

    async loadSound(url) {
        if (!this.audioContext) this.init();
        if (this.soundBufferCache.has(url)) return this.soundBufferCache.get(url);

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load sound: ${url} (${res.status})`);
        const arrayBuffer = await res.arrayBuffer();

        const audioBuffer = await new Promise((resolve, reject) => {
            try {
                const maybePromise = this.audioContext.decodeAudioData(arrayBuffer, resolve, reject);
                if (maybePromise && typeof maybePromise.then === 'function') {
                    maybePromise.then(resolve).catch(reject);
                }
            } catch (err) {
                // fallback to promise-based decode
                this.audioContext.decodeAudioData(arrayBuffer).then(resolve).catch(reject);
            }
        });

        this.soundBufferCache.set(url, audioBuffer);
        return audioBuffer;
    }

    /**
     * Play a short sound effect without interrupting music.
     * Returns a handle with a stop() method.
     */
    async playSound(sound, { volume = 1, loop = false, basePath = '/src/assets/audio/sfx/' } = {}) {
        if (!this.audioContext) this.init();

        // Resolve relative sound path to full URL if necessary
        let url = '/src/assets/audio/' + sound;

        const buffer = await this.loadSound(url);

        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = !!loop;

        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(volume, this.audioContext.currentTime);

        source.connect(gain);
        (this.sfxGainNode || this.audioContext.destination).connect ? gain.connect(this.sfxGainNode || this.audioContext.destination) : gain.connect(this.audioContext.destination);

        source.start(0);

        let stopped = false;
        return {
            stop() {
                if (stopped) return;
                stopped = true;
                try { source.stop(0); } catch (e) { /* ignore */ }
                try { source.disconnect(); } catch (e) { /* ignore */ }
                try { gain.disconnect(); } catch (e) { /* ignore */ }
            }
        };
    }

    setSfxVolume(volume) {
        if (this.sfxGainNode) {
            this.sfxGainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        }
    }
};

export { AudioManager };
