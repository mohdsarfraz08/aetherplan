export class AudioEngine {
    private audioCtx: AudioContext | null = null;
    private noiseNode: AudioBufferSourceNode | null = null;
    private gainNode: GainNode | null = null;

    constructor() {
        // Lazy init
    }

    private init() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    public toggleBrownNoise(play: boolean) {
        this.init();
        if (!this.audioCtx) return;

        if (play) {
            if (this.noiseNode) return; // Already playing

            const bufferSize = 2 * this.audioCtx.sampleRate;
            const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
            const data = buffer.getChannelData(0);

            // Generate Brown Noise
            let lastOut = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                data[i] = (lastOut + (0.02 * white)) / 1.02;
                lastOut = data[i];
                data[i] *= 3.5; // Compensate for gain
            }

            this.noiseNode = this.audioCtx.createBufferSource();
            this.noiseNode.buffer = buffer;
            this.noiseNode.loop = true;

            this.gainNode = this.audioCtx.createGain();
            this.gainNode.gain.value = 0.1; // Low volume for focus

            this.noiseNode.connect(this.gainNode);
            this.gainNode.connect(this.audioCtx.destination);
            this.noiseNode.start();
        } else {
            if (this.noiseNode) {
                this.noiseNode.stop();
                this.noiseNode.disconnect();
                this.noiseNode = null;
            }
            if (this.gainNode) {
                this.gainNode.disconnect();
                this.gainNode = null;
            }
        }
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
