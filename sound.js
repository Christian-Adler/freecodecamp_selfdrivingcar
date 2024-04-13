function beep(frequency) {
    const audioContext = new window.AudioContext();
    const osc = audioContext.createOscillator();
    const envelope = audioContext.createGain();

    osc.frequency.setValueAtTime(frequency, 0);
    osc.connect(envelope);
    osc.start();
    osc.stop(0.4)

    envelope.gain.value = 0; // volume
    envelope.gain.linearRampToValueAtTime(1, 0.1);
    envelope.gain.linearRampToValueAtTime(0, 0.4);
    // envelope.gain.exponentialRampToValueAtTime(1, 0.1);
    // envelope.gain.exponentialRampToValueAtTime(0.01, 0.4);
    envelope.connect(audioContext.destination);


}

class Engine {
    constructor() {
        const audioContext = new window.AudioContext();
        const osc = audioContext.createOscillator();
        const masterGain = audioContext.createGain();

        osc.frequency.setValueAtTime(200, 0);
        osc.connect(masterGain);
        osc.start();

        masterGain.gain.value = 0.2; // volume
        masterGain.connect(audioContext.destination);

        const lfo = audioContext.createOscillator(); // low frequency osci
        lfo.frequency.setValueAtTime(30, 0);
        const mod = audioContext.createGain();
        mod.gain.value = 60;
        lfo.connect(mod);
        mod.connect(osc.frequency);
        lfo.start();

        this.volumne = masterGain.gain;
        this.frequency = osc.frequency;
    }

    setVolume(percent) {
        this.volumne.value = percent;
    }

    setPitch(percent) {
        this.frequency.setValueAtTime(percent * 200 + 100, 0);
    }
}