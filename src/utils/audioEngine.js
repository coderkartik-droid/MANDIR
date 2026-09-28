/**
 * Professional Sacred Audio Engine & Instrumental Temple Symphony
 * Continuous unified composition tuned to the sacred Key of C# (Raga Bhairav / Yaman)
 * Instruments:
 * - Bansuri (Classical Bamboo Flute with breath vibrato & alaap)
 * - Santoor (100-string Hammered Dulcimer cascading arpeggios)
 * - Tanpura Drone (Continuous 4-string Sa-Pa acoustic foundation)
 * - Soft Veena (Plucked sympathetic strings)
 * - Nature Ambience (Gentle wind through banyan leaves & morning birds)
 * - Authentic Ashta-dhatu Temple Bell with long reverb decay & zero harshness
 * - Spatial audio mixing with simulated stone temple hall convolution reverb
 */

class SpiritualAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.reverbNode = null;
    this.reverbGain = null;
    this.analyser = null;
    this.dataArray = null;

    // Track playback state
    this.currentTrack = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.75;
    this.currentTime = 0;
    this.duration = 760;

    // HTML5 audio file element
    this.audioElement = null;
    this.usingFileSource = false;

    // Unified procedural composition state
    this.compositionIntervals = [];
    this.droneNodes = [];
    this.windNode = null;
    this.activeInstrumentType = 'bansuri-tanpura';

    // Sub-busses
    this.rainGain = null;
    this.isRainActive = false;
    this.bellListeners = [];
    this.trackEndCallback = null;

    this.loadSettings();

    // Tab visibility handling (auto-dim)
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.dimAudio(0.2);
        } else {
          this.restoreAudio();
        }
      });
    }
  }

  loadSettings() {
    // Volume and mute state are session-only; not persisted to localStorage
  }

  saveSettings() {
    // No-op: state is session-only
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0.0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Temple Hall Convolution Reverb Node
      this.setupTempleReverb();

      // Master Music Bus
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      // Real-time FFT Analyser
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.85;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      // Route: musicGain -> analyser -> masterGain & reverb
      this.musicGain.connect(this.analyser);
      this.analyser.connect(this.masterGain);
      if (this.reverbNode) {
        this.musicGain.connect(this.reverbNode);
      }

      // Rain Sub-bus
      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      this.rainGain.connect(this.masterGain);

      // Setup HTML5 Audio element for optional dropped-in files
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';

      try {
        const fileSource = this.ctx.createMediaElementSource(this.audioElement);
        fileSource.connect(this.musicGain);
      } catch {}

      this.audioElement.addEventListener('timeupdate', () => {
        this.currentTime = this.audioElement.currentTime;
        if (!isNaN(this.audioElement.duration)) {
          this.duration = this.audioElement.duration;
        }
      });

      this.audioElement.addEventListener('ended', () => {
        if (this.trackEndCallback) this.trackEndCallback();
      });

      this.audioElement.addEventListener('error', () => {
        // Fallback gracefully to synthesized continuous symphony
        if (this.currentTrack) {
          this.startContinuousSymphony(this.currentTrack.synthType || 'bansuri-tanpura');
        }
      });
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Synthesizes an acoustic impulse response matching an ancient Indian stone temple hall
   */
  setupTempleReverb() {
    try {
      const sampleRate = this.ctx.sampleRate;
      const length = sampleRate * 3.2; // 3.2s decay
      const impulse = this.ctx.createBuffer(2, length, sampleRate);
      const left = impulse.getChannelData(0);
      const right = impulse.getChannelData(1);

      for (let i = 0; i < length; i++) {
        const decay = Math.exp(-i / (sampleRate * 0.95));
        left[i] = (Math.random() * 2 - 1) * decay;
        right[i] = (Math.random() * 2 - 1) * decay;
      }

      this.reverbNode = this.ctx.createConvolver();
      this.reverbNode.buffer = impulse;

      this.reverbGain = this.ctx.createGain();
      this.reverbGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

      // Warm lowpass filter on reverb reflections to soften high frequencies
      const reverbFilter = this.ctx.createBiquadFilter();
      reverbFilter.type = 'lowpass';
      reverbFilter.frequency.setValueAtTime(3200, this.ctx.currentTime);

      this.reverbNode.connect(reverbFilter);
      reverbFilter.connect(this.reverbGain);
      this.reverbGain.connect(this.masterGain);
    } catch (err) {
      console.warn("Reverb initialization fallback:", err);
    }
  }

  onBellStrike(callback) {
    this.bellListeners.push(callback);
    return () => {
      this.bellListeners = this.bellListeners.filter((cb) => cb !== callback);
    };
  }

  notifyBellStrike(force = 1.0) {
    this.bellListeners.forEach((cb) => {
      try {
        cb(force);
      } catch (err) {
        console.error(err);
      }
    });
  }

  onTrackEnded(callback) {
    this.trackEndCallback = callback;
  }

  getEqualizerData() {
    if (!this.analyser || !this.dataArray) {
      return [25, 45, 75, 60, 85, 50, 70, 35];
    }
    this.analyser.getByteFrequencyData(this.dataArray);
    const bands = [];
    const step = Math.floor(this.dataArray.length / 8);
    for (let i = 0; i < 8; i++) {
      bands.push(this.dataArray[i * step] || 20);
    }
    return bands;
  }

  /**
   * Starts playing a track with smooth crossfade
   */
  async playTrack(track, fadeInSec = 2.0) {
    this.init();
    if (!track) return;
    this.currentTrack = track;
    this.isPlaying = true;
    this.duration = track.durationSec || 760;

    this.crossfade(fadeInSec);

    // Try playing local file if user placed one in /audio/
    try {
      this.stopContinuousSymphony();
      this.audioElement.src = track.src;
      const p = this.audioElement.play();
      if (p !== undefined) {
        p.then(() => {
          this.usingFileSource = true;
        }).catch(() => {
          this.startContinuousSymphony(track.synthType);
        });
      }
    } catch {
      this.startContinuousSymphony(track.synthType);
    }
  }

  crossfade(duration = 2.0) {
    if (!this.ctx || !this.musicGain) return;
    const t = this.ctx.currentTime;
    this.musicGain.gain.cancelScheduledValues(t);
    this.musicGain.gain.setValueAtTime(0.001, t);
    this.musicGain.gain.linearRampToValueAtTime(0.85, t + duration);
  }

  fadeInAfterEntrance(duration = 4.0) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const target = this.isMuted ? 0.0 : this.volume;
    this.masterGain.gain.cancelScheduledValues(t);
    this.masterGain.gain.setValueAtTime(0.0001, t);
    this.masterGain.gain.linearRampToValueAtTime(target, t + duration);
  }

  /**
   * Unified Continuous Instrumental Composition Engine
   * All tracks are continuous modal improvisations in Key of C# (Raga Bhairav / Yaman)
   */
  startContinuousSymphony(synthType = 'bansuri-tanpura') {
    this.usingFileSource = false;
    this.stopContinuousSymphony();
    this.activeInstrumentType = synthType;

    // 1. Foundation: Sacred 4-String Tanpura (Continuous Sa-Pa-Sa'-Sa drone in C#)
    this.startTanpuraDrone();

    // 2. Continuous Wind through Leaves
    this.startSanctumWind();

    // 3. Instrumental Soloist layer according to chosen ambiance:
    // Scale notes in C# (Hz):
    // Sa = 277.18, Re = 293.66, Ga = 349.23, Ma = 392.00, Pa = 415.30, Dha = 440.00, Ni = 523.25, Sa' = 554.37
    const scale = [277.18, 293.66, 349.23, 392.00, 415.30, 440.00, 523.25, 554.37];

    switch (synthType) {
      case 'santoor':
        // Shimmering Santoor arpeggios & occasional morning bird calls
        const santoorTimer = setInterval(() => {
          if (!this.isPlaying || this.isMuted) return;
          this.playSantoorArpeggio(scale);
        }, 3600);
        const birdTimer = setInterval(() => {
          if (!this.isPlaying || this.isMuted) return;
          this.playMorningBirdCall();
        }, 9000);
        this.compositionIntervals.push(santoorTimer, birdTimer);
        break;

      case 'veena':
        // Meditative Veena plucked notes with sympathetic resonance
        const veenaTimer = setInterval(() => {
          if (!this.isPlaying || this.isMuted) return;
          this.playVeenaNote(scale[Math.floor(Math.random() * scale.length)]);
        }, 4200);
        this.compositionIntervals.push(veenaTimer);
        break;

      case 'rain-bells':
        // Monsoon Rain, distant bells & soft flute whispers
        this.startRainSound();
        const bellTimer = setInterval(() => {
          if (!this.isPlaying || this.isMuted) return;
          this.ringTempleBell(0.4, 0.96 + Math.random() * 0.08);
        }, 8500);
        const fluteTimer2 = setInterval(() => {
          if (!this.isPlaying || this.isMuted) return;
          this.playBansuriPhrase(scale);
        }, 6000);
        this.compositionIntervals.push(bellTimer, fluteTimer2);
        break;

      case 'brahma-muhurta':
        // Soft dawn stillness, solitary flute & gentle distant conch
        const fluteTimer3 = setInterval(() => {
          if (!this.isPlaying || this.isMuted) return;
          this.playBansuriPhrase(scale);
        }, 5500);
        const conchTimer = setInterval(() => {
          if (!this.isPlaying || this.isMuted) return;
          this.playShankh(0.4, 4.0);
        }, 22000);
        this.compositionIntervals.push(fluteTimer3, conchTimer);
        break;

      case 'bansuri-tanpura':
      default:
        // Classical Bamboo Flute alaap over Tanpura
        const fluteTimer = setInterval(() => {
          if (!this.isPlaying || this.isMuted) return;
          this.playBansuriPhrase(scale);
        }, 4800);
        this.compositionIntervals.push(fluteTimer);
        break;
    }
  }

  stopContinuousSymphony() {
    this.compositionIntervals.forEach((timer) => clearInterval(timer));
    this.compositionIntervals = [];

    // Stop tanpura
    this.droneNodes.forEach(({ osc, gain, lfo }) => {
      try {
        gain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1.0);
        setTimeout(() => {
          try {
            osc.stop();
            lfo.stop();
          } catch {}
        }, 1100);
      } catch {}
    });
    this.droneNodes = [];

    // Stop wind
    if (this.windNode) {
      try {
        this.windNode.gain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 1.0);
      } catch {}
      this.windNode = null;
    }

    if (this.isRainActive) {
      this.stopRainSound();
    }
  }

  /**
   * Foundation Tanpura: 4 resonant acoustic strings (Pa - Sa - Sa - Sa) in Key of C#
   */
  startTanpuraDrone() {
    if (!this.ctx || this.droneNodes.length > 0) return;
    const t = this.ctx.currentTime;
    // Pitches: Pa (G#2 / 103.8 Hz), Sa (C#3 / 138.6 Hz), Sa (C#3), Mandra Sa (C#2 / 69.3 Hz)
    const pitches = [103.83, 138.59, 138.59, 69.30];

    pitches.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Triangle wave with lowpass filtering gives the distinctive wooden acoustic string tone
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      // Subtle jawari buzz string frequency modulation
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.18 + idx * 0.05, t);
      lfoGain.gain.setValueAtTime(freq * 0.008, t);
      lfo.connect(osc.frequency);
      lfo.start(t);

      // Stereo panning (spatial immersion)
      let panNode = null;
      if (this.ctx.createStereoPanner) {
        panNode = this.ctx.createStereoPanner();
        panNode.pan.setValueAtTime(idx % 2 === 0 ? -0.35 : 0.35, t);
      }

      // Warm acoustic filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.12 / (idx + 1), t + 3.0);

      osc.connect(filter);
      if (panNode) {
        filter.connect(panNode);
        panNode.connect(gain);
      } else {
        filter.connect(gain);
      }
      gain.connect(this.musicGain);

      osc.start(t);
      this.droneNodes.push({ osc, gain, lfo });
    });
  }

  /**
   * Continuous gentle wind rustling through ancient temple leaves
   */
  startSanctumWind() {
    if (!this.ctx || this.windNode) return;
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (last * 0.96) + (white * 0.04);
      last = data[i];
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(420, t);
    filter.Q.setValueAtTime(1.2, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.06, t + 2.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);
    noise.start(t);

    this.windNode = { noise, gain };
  }

  /**
   * Bansuri (Bamboo Flute) Alaap Phrase
   */
  playBansuriPhrase(scale) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const note = scale[Math.floor(Math.random() * scale.length)];
    const duration = 2.8 + Math.random() * 1.8;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(note * 0.98, t); // gentle scoop
    osc.frequency.linearRampToValueAtTime(note, t + 0.4);

    // Natural breath vibrato
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(5.4, t);
    vibratoGain.gain.setValueAtTime(4.2, t);
    vibrato.connect(osc.frequency);
    vibrato.start(t + 0.35);

    // Envelope
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.7);
    gain.gain.setValueAtTime(0.14, t + duration - 0.7);
    gain.gain.linearRampToValueAtTime(0.0001, t + duration);

    // Wooden warmth filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1250, t);

    // Spatial panning (center-left)
    let panner = null;
    if (this.ctx.createStereoPanner) {
      panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(-0.15, t);
    }

    osc.connect(filter);
    if (panner) {
      filter.connect(panner);
      panner.connect(gain);
    } else {
      filter.connect(gain);
    }
    gain.connect(this.musicGain);

    osc.start(t);
    osc.stop(t + duration);
    vibrato.stop(t + duration);
  }

  /**
   * Santoor: 100-String Hammered Dulcimer cascading arpeggio
   */
  playSantoorArpeggio(scale) {
    if (!this.ctx) return;
    const count = 4 + Math.floor(Math.random() * 3);
    const shuffled = [...scale].sort(() => 0.5 - Math.random());

    for (let i = 0; i < count; i++) {
      const delay = i * 0.22;
      const freq = shuffled[i % shuffled.length];
      this.strikeSantoorString(freq, this.ctx.currentTime + delay);
    }
  }

  strikeSantoorString(freq, time) {
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq * 2, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.09, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.4);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 2.2, time);
    filter.Q.setValueAtTime(3.5, time);

    // Spatial pan (center-right)
    let panner = null;
    if (this.ctx.createStereoPanner) {
      panner = this.ctx.createStereoPanner();
      panner.pan.setValueAtTime(0.25, time);
    }

    osc.connect(filter);
    if (panner) {
      filter.connect(panner);
      panner.connect(gain);
    } else {
      filter.connect(gain);
    }
    gain.connect(this.musicGain);

    osc.start(time);
    osc.stop(time + 2.5);
  }

  /**
   * Veena: Resonant plucked acoustic string with sympathetic buzz
   */
  playVeenaNote(freq) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const duration = 3.6;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, t);
    filter.frequency.exponentialRampToValueAtTime(320, t + 2.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(t);
    osc.stop(t + duration);
  }

  /**
   * Gentle Morning Temple Birds
   */
  playMorningBirdCall() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    // Chirp sweep up and down
    osc.frequency.setValueAtTime(2600, t);
    osc.frequency.linearRampToValueAtTime(3400, t + 0.08);
    osc.frequency.linearRampToValueAtTime(2900, t + 0.16);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, t);
    gain.gain.linearRampToValueAtTime(0.04, t + 0.04);
    gain.gain.linearRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start(t);
    osc.stop(t + 0.2);
  }

  /**
   * Authentic Indian Ashta-dhatu Temple Bell
   * Multi-partial physics, zero harsh frequencies, natural reverb echo & long 5.5s decay
   */
  ringTempleBell(volume = 1.0, pitchMod = 1.0) {
    this.init();
    if (!this.ctx) return;

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([60, 30, 80]);
      } catch {}
    }

    this.notifyBellStrike(volume);

    const t = this.ctx.currentTime;
    const baseFreq = 540 * pitchMod;

    // Harmonic partial ratios with smooth acoustic decay
    const partials = [
      { ratio: 0.5,  amp: 0.6, decay: 5.5 }, // Hum tone (deep peaceful resonance)
      { ratio: 1.0,  amp: 0.9, decay: 4.8 }, // Prime
      { ratio: 1.20, amp: 0.6, decay: 4.0 }, // Minor third tierce
      { ratio: 1.51, amp: 0.5, decay: 3.4 }, // Quint
      { ratio: 2.02, amp: 0.4, decay: 2.8 }, // Nominal
      { ratio: 2.76, amp: 0.2, decay: 2.0 }, // Shimmer
      { ratio: 3.98, amp: 0.1, decay: 1.4 }, // Transient
    ];

    const bellBus = this.ctx.createGain();
    bellBus.gain.setValueAtTime(volume * (this.isMuted ? 0 : 1), t);
    bellBus.connect(this.masterGain);
    if (this.reverbNode) {
      bellBus.connect(this.reverbNode);
    }

    // Warm low-pass filter to guarantee zero harshness
    const antiHarshFilter = this.ctx.createBiquadFilter();
    antiHarshFilter.type = 'lowpass';
    antiHarshFilter.frequency.setValueAtTime(4200, t);

    partials.forEach(({ ratio, amp, decay }) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = ratio > 2.5 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(baseFreq * ratio, t);

      gain.gain.setValueAtTime(amp * 0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);

      osc.connect(gain);
      gain.connect(antiHarshFilter);

      osc.start(t);
      osc.stop(t + decay);
    });

    antiHarshFilter.connect(bellBus);
  }

  /**
   * Resonates the sacred Conch Shell (Shankhadhwani)
   */
  playShankh(volume = 0.85, duration = 4.2) {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const shankhBus = this.ctx.createGain();
    shankhBus.gain.setValueAtTime(0.001, t);
    shankhBus.gain.linearRampToValueAtTime(volume * 0.45, t + 0.9);
    shankhBus.gain.setValueAtTime(volume * 0.45, t + duration - 1.2);
    shankhBus.gain.linearRampToValueAtTime(0.0001, t + duration);
    shankhBus.connect(this.masterGain);
    if (this.reverbNode) {
      shankhBus.connect(this.reverbNode);
    }

    const fundamental = 220;
    const harmonics = [
      { mult: 1, gain: 0.6 },
      { mult: 2, gain: 0.9 },
      { mult: 3, gain: 0.7 },
      { mult: 4, gain: 0.5 },
      { mult: 5, gain: 0.3 },
    ];

    harmonics.forEach(({ mult, gain: harmGain }) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      osc.type = 'sawtooth';
      const targetFreq = fundamental * mult;

      osc.frequency.setValueAtTime(targetFreq * 0.94, t);
      osc.frequency.linearRampToValueAtTime(targetFreq, t + 0.55);

      const lfo = this.ctx.createOscillator();
      const lfoG = this.ctx.createGain();
      lfo.frequency.setValueAtTime(4.8, t);
      lfoG.gain.setValueAtTime(targetFreq * 0.012, t);
      lfo.connect(osc.frequency);
      lfo.start(t);
      lfo.stop(t + duration);

      g.gain.setValueAtTime(harmGain * 0.25, t);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(targetFreq * 1.05, t);
      filter.Q.setValueAtTime(4.0, t);

      osc.connect(filter);
      filter.connect(g);
      g.connect(shankhBus);

      osc.start(t);
      osc.stop(t + duration);
    });
  }

  playGateOpeningSound() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    const t = this.ctx.currentTime;
    const dur = 3.2;

    const gateBus = this.ctx.createGain();
    gateBus.gain.setValueAtTime(0.001, t);
    gateBus.gain.linearRampToValueAtTime(0.3, t + 0.6);
    gateBus.gain.setValueAtTime(0.3, t + dur - 0.8);
    gateBus.gain.linearRampToValueAtTime(0.0001, t + dur);
    gateBus.connect(this.masterGain);

    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(55, t);
    osc.frequency.linearRampToValueAtTime(42, t + dur);

    const oscGain = this.ctx.createGain();
    oscGain.gain.setValueAtTime(0.35, t);
    osc.connect(oscGain);
    oscGain.connect(gateBus);
    osc.start(t);
    osc.stop(t + dur);

    const bufferSize = Math.floor(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, t);
    filter.frequency.linearRampToValueAtTime(180, t + dur);

    noise.connect(filter);
    filter.connect(gateBus);
    noise.start(t);
  }

  startRainSound() {
    this.init();
    if (!this.ctx || this.isRainActive) return;
    this.isRainActive = true;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (last * 0.95) + (white * 0.05);
      last = data[i];
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.rainGain);
    noise.start();

    const t = this.ctx.currentTime;
    this.rainGain.gain.cancelScheduledValues(t);
    this.rainGain.gain.setValueAtTime(this.rainGain.gain.value, t);
    this.rainGain.gain.linearRampToValueAtTime(0.4, t + 1.5);
  }

  stopRainSound() {
    if (!this.ctx || !this.isRainActive) return;
    this.isRainActive = false;
    const t = this.ctx.currentTime;
    this.rainGain.gain.cancelScheduledValues(t);
    this.rainGain.gain.linearRampToValueAtTime(0.0001, t + 1.2);
  }

  pauseTrack() {
    this.isPlaying = false;
    if (this.usingFileSource && this.audioElement) {
      this.audioElement.pause();
    } else {
      this.stopContinuousSymphony();
    }
  }

  resumeTrack() {
    this.init();
    this.isPlaying = true;
    if (this.usingFileSource && this.audioElement) {
      this.audioElement.play().catch(() => {
        if (this.currentTrack) this.startContinuousSymphony(this.currentTrack.synthType);
      });
    } else if (this.currentTrack) {
      this.startContinuousSymphony(this.currentTrack.synthType);
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.saveSettings();
    if (!this.isMuted && this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    this.saveSettings();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(
        this.isMuted ? 0.0 : this.volume,
        this.ctx.currentTime + 0.25
      );
    }
    return this.isMuted;
  }

  seekTo(ratio) {
    if (this.usingFileSource && this.audioElement && !isNaN(this.audioElement.duration)) {
      this.audioElement.currentTime = ratio * this.audioElement.duration;
    } else {
      this.currentTime = ratio * this.duration;
    }
  }

  dimAudio(factor = 0.2) {
    if (this.masterGain && this.ctx && !this.isMuted) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.setValueAtTime(this.volume * factor, t);
    }
  }

  restoreAudio() {
    if (this.masterGain && this.ctx && !this.isMuted) {
      const t = this.ctx.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(this.volume, t + 1.0);
    }
  }

  toggleAmbient() {
    this.init();
    if (this.isPlaying) {
      this.pauseTrack();
    } else {
      if (this.currentTrack) {
        this.resumeTrack();
      } else {
        this.startContinuousSymphony('bansuri-tanpura');
        this.isPlaying = true;
      }
    }
    return this.isPlaying;
  }

  setTimeMode(mode) {
    // adapts atmosphere
  }
}

export const soundEngine = new SpiritualAudioEngine();
