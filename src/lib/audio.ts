export class AudioEngine {
    private audioCtx: AudioContext | null = null;
    private customBuffer: AudioBuffer | null = null;
    private sourceNode: AudioBufferSourceNode | null = null;
    private gainNode: GainNode | null = null;

    constructor() {
        // Lazy init
    }

    private init() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    public async setCustomAudio(arrayBuffer: ArrayBuffer) {
        this.init();
        if (!this.audioCtx) return;
        try {
            // Decode the audio data
            this.customBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
        } catch (e) {
            console.error("Error decoding audio data", e);
        }
    }

    public toggleAudio(play: boolean, type: 'brown' | 'custom' = 'brown') {
        this.init();
        if (!this.audioCtx) return;

        if (play) {
            if (this.sourceNode) this.sourceNode.stop(); // Stop current if any

            this.sourceNode = this.audioCtx.createBufferSource();
            this.sourceNode.loop = true;

            if (type === 'custom' && this.customBuffer) {
                this.sourceNode.buffer = this.customBuffer;
            } else {
                // Generate Brown Noise if type is brown or no custom buffer
                const bufferSize = 2 * this.audioCtx.sampleRate;
                const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
                const data = buffer.getChannelData(0);

                let lastOut = 0;
                for (let i = 0; i < bufferSize; i++) {
                    const white = Math.random() * 2 - 1;
                    data[i] = (lastOut + (0.02 * white)) / 1.02;
                    lastOut = data[i];
                    data[i] *= 3.5;
                }
                this.sourceNode.buffer = buffer;
            }

            this.gainNode = this.audioCtx.createGain();
            this.gainNode.gain.value = type === 'custom' ? 0.5 : 0.1; // Louder for music, quiet for noise

            this.sourceNode.connect(this.gainNode);
            this.gainNode.connect(this.audioCtx.destination);
            this.sourceNode.start();
        } else {
            if (this.sourceNode) {
                this.sourceNode.stop();
                this.sourceNode.disconnect();
                this.sourceNode = null;
            }
            if (this.gainNode) {
                this.gainNode.disconnect();
                this.gainNode = null;
            }
        }
    }

    // Deprecated wrapper for backward compatibility if needed, but we should update call sites
    public toggleBrownNoise(play: boolean) {
        this.toggleAudio(play, 'brown');
    }

    public playLevelUp() {
        this.init();
        if (!this.audioCtx) return;

        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, this.audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);

        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + 0.5);
    }
}

export const audio = new AudioEngine();
