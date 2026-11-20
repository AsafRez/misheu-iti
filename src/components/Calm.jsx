import React, { useState, useEffect, useRef } from 'react';
import Card from './Card.jsx';
import Btn from './Btn.jsx';
import Back from './Back.jsx';
import {
  Play,
  Square,
  Volume2,
  VolumeX,
  Waves,
  Bird,
  Wind,
  Droplets,
  Bell,
  Music,
} from 'lucide-react';

const SOUNDS = [
  { id: 'waves', label: 'גלים מתנפצים', icon: Waves },
  { id: 'birds', label: 'ציפורים מצייצות', icon: Bird },
  { id: 'wind', label: 'משב רוח', icon: Wind },
  { id: 'waterfall', label: 'מפל מים', icon: Droplets },
  { id: 'gong', label: 'גונג מרגיע', icon: Bell },
  { id: 'tone', label: 'צליל הרמוני', icon: Music },
];

export default function Calm({ onBack }) {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState('ready'); // 'ready' | 'inhale' | 'hold' | 'exhale'
  const [count, setCount] = useState(4);
  const [soundOn, setSoundOn] = useState(false);
  const [selectedSound, setSelectedSound] = useState('waves');

  const audioCtxRef = useRef(null);
  const birdTimerRef = useRef(null);
  const gongTimerRef = useRef(null);
  const timerRef = useRef(null);
  const stateRef = useRef({ phase: 'ready', count: 4 });

  // Update document --breath variable
  const updateBreath = (scaleVal) => {
    try {
      document.documentElement.style.setProperty('--breath', String(scaleVal));
    } catch {
      // safe fallback
    }
  };

  // Helper to create white noise buffer
  const createNoiseBuffer = (ctx, durationSec = 3) => {
    const bufferSize = ctx.sampleRate * durationSec;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  };

  // Sound generator functions
  const playWaves = (ctx, masterGain) => {
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx, 4);
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, ctx.currentTime);

    // LFO for wave swelling
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8s swell

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(300, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const waveGain = ctx.createGain();
    waveGain.gain.setValueAtTime(0.08, ctx.currentTime);

    noise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(masterGain);

    noise.start();
    lfo.start();
  };

  const playWind = (ctx, masterGain) => {
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx, 4);
    noise.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(400, ctx.currentTime);
    bandpass.Q.setValueAtTime(2.2, ctx.currentTime);

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // slow breeze gust

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(200, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(bandpass.frequency);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.12, ctx.currentTime);

    noise.connect(bandpass);
    bandpass.connect(windGain);
    windGain.connect(masterGain);

    noise.start();
    lfo.start();
  };

  const playWaterfall = (ctx, masterGain) => {
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx, 4);
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, ctx.currentTime);

    const bass = ctx.createBiquadFilter();
    bass.type = 'lowshelf';
    bass.frequency.setValueAtTime(140, ctx.currentTime);
    bass.gain.setValueAtTime(6, ctx.currentTime);

    const waterGain = ctx.createGain();
    waterGain.gain.setValueAtTime(0.09, ctx.currentTime);

    noise.connect(filter);
    filter.connect(bass);
    bass.connect(waterGain);
    waterGain.connect(masterGain);

    noise.start();
  };

  const playBirds = (ctx, masterGain) => {
    // Ambient forest air background
    const bgNoise = ctx.createBufferSource();
    bgNoise.buffer = createNoiseBuffer(ctx, 4);
    bgNoise.loop = true;

    const bgFilter = ctx.createBiquadFilter();
    bgFilter.type = 'bandpass';
    bgFilter.frequency.setValueAtTime(600, ctx.currentTime);
    bgFilter.Q.setValueAtTime(1, ctx.currentTime);

    const bgGain = ctx.createGain();
    bgGain.gain.setValueAtTime(0.02, ctx.currentTime);

    bgNoise.connect(bgFilter);
    bgFilter.connect(bgGain);
    bgGain.connect(masterGain);
    bgNoise.start();

    const triggerChirp = () => {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
      const now = ctx.currentTime;
      const chirpsCount = Math.floor(Math.random() * 3) + 2;

      for (let i = 0; i < chirpsCount; i++) {
        const chirpStart = now + i * 0.12 + Math.random() * 0.04;
        const osc = ctx.createOscillator();
        const chirpGain = ctx.createGain();

        osc.type = 'sine';
        const startFreq = 2600 + Math.random() * 600;
        const peakFreq = startFreq + 1200 + Math.random() * 400;

        osc.frequency.setValueAtTime(startFreq, chirpStart);
        osc.frequency.exponentialRampToValueAtTime(peakFreq, chirpStart + 0.04);
        osc.frequency.exponentialRampToValueAtTime(startFreq - 200, chirpStart + 0.09);

        chirpGain.gain.setValueAtTime(0.0001, chirpStart);
        chirpGain.gain.exponentialRampToValueAtTime(0.035, chirpStart + 0.02);
        chirpGain.gain.exponentialRampToValueAtTime(0.0001, chirpStart + 0.09);

        osc.connect(chirpGain);
        chirpGain.connect(masterGain);

        osc.start(chirpStart);
        osc.stop(chirpStart + 0.1);
      }
    };

    triggerChirp();
    birdTimerRef.current = setInterval(() => {
      triggerChirp();
    }, 2400);
  };

  const playGong = (ctx, masterGain) => {
    const triggerStrike = () => {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
      const now = ctx.currentTime;
      const gongFreqs = [
        { f: 115, g: 0.1 },
        { f: 162, g: 0.07 },
        { f: 236, g: 0.05 },
        { f: 380, g: 0.03 },
        { f: 550, g: 0.02 },
      ];

      gongFreqs.forEach(({ f, g }) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        oscGain.gain.setValueAtTime(g, now);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 6);
      });
    };

    triggerStrike();
    gongTimerRef.current = setInterval(() => {
      triggerStrike();
    }, 6000);
  };

  const playHarmonicTone = (ctx, masterGain) => {
    const freqs = [
      { f: 174, gain: 0.06 },
      { f: 261.6, gain: 0.035 },
      { f: 329.6, gain: 0.025 },
    ];

    freqs.forEach(({ f, gain }) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      oscGain.gain.setValueAtTime(gain, ctx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();
    });
  };

  // Sound lifecycle
  const stopSound = () => {
    if (birdTimerRef.current) {
      clearInterval(birdTimerRef.current);
      birdTimerRef.current = null;
    }
    if (gongTimerRef.current) {
      clearInterval(gongTimerRef.current);
      gongTimerRef.current = null;
    }

    try {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => { });
        audioCtxRef.current = null;
      }
    } catch {
      // safe fallback
    }
    setSoundOn(false);
  };

  const startSound = (soundType = selectedSound) => {
    stopSound();

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 1.5);
      masterGain.connect(ctx.destination);

      switch (soundType) {
        case 'waves':
          playWaves(ctx, masterGain);
          break;
        case 'birds':
          playBirds(ctx, masterGain);
          break;
        case 'wind':
          playWind(ctx, masterGain);
          break;
        case 'waterfall':
          playWaterfall(ctx, masterGain);
          break;
        case 'gong':
          playGong(ctx, masterGain);
          break;
        case 'tone':
        default:
          playHarmonicTone(ctx, masterGain);
          break;
      }

      setSoundOn(true);
    } catch (err) {
      console.warn('Audio playback error:', err);
      setSoundOn(false);
    }
  };

  const toggleSound = () => {
    if (soundOn) {
      stopSound();
    } else {
      startSound(selectedSound);
    }
  };

  const handleSelectSound = (soundId) => {
    setSelectedSound(soundId);
    if (soundOn) {
      startSound(soundId);
    }
  };

  // Exercise loop
  const stopExercise = () => {
    setIsRunning(false);
    setPhase('ready');
    setCount(4);
    stateRef.current = { phase: 'ready', count: 4 };
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    updateBreath(1);
  };

  const startExercise = () => {
    setIsRunning(true);
    setPhase('inhale');
    setCount(4);
    stateRef.current = { phase: 'inhale', count: 4 };
    updateBreath(1.25);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      let { phase: currentPhase, count: currentCount } = stateRef.current;

      if (currentCount > 1) {
        const nextCount = currentCount - 1;
        stateRef.current.count = nextCount;
        setCount(nextCount);
      } else {
        let nextPhase = 'inhale';
        if (currentPhase === 'inhale') {
          nextPhase = 'hold';
          updateBreath(1.25);
        } else if (currentPhase === 'hold') {
          nextPhase = 'exhale';
          updateBreath(1);
        } else if (currentPhase === 'exhale') {
          nextPhase = 'inhale';
          updateBreath(1.25);
        }

        stateRef.current = { phase: nextPhase, count: 4 };
        setPhase(nextPhase);
        setCount(4);
      }
    }, 1000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopSound();
      updateBreath(1);
    };
  }, []);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'שאפו לאט';
      case 'hold':
        return 'החזיקו בנחת';
      case 'exhale':
        return 'נשפו לאט';
      default:
        return 'מוכנים?';
    }
  };

  const isExpanded = phase === 'inhale' || phase === 'hold';
  const circleScale = isExpanded ? 1 : 0.6;

  return (
    <main
      id="main-content"
      className="max-w-2xl mx-auto px-4 py-6 md:py-8 space-y-6 relative z-10"
    >
      <Back onBack={onBack} />

      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-appInk">
          קשה לי עכשיו
        </h1>
        <p className="text-xl md:text-2xl text-appSoft font-medium">
          נעשה יחד כמה נשימות. אין דרך לטעות.
        </p>
      </div>

      {/* Breathing Circle Area */}
      <Card className="flex flex-col items-center justify-center py-10 md:py-14 min-h-[440px] overflow-hidden">
        <div
          className="breathing-circle rounded-full flex flex-col items-center justify-center transition-all duration-[4000ms] ease-in-out shadow-lg"
          style={{
            width: 'min(80vw, 340px)',
            height: 'min(80vw, 340px)',
            border: '6px solid var(--green)',
            backgroundColor: 'var(--card)',
            transform: `scale(${circleScale})`,
          }}
          aria-live="polite"
        >
          <span className="text-3xl md:text-4xl font-extrabold text-appGreen mb-2 select-none text-center px-4">
            {getPhaseText()}
          </span>

          {isRunning && (
            <span
              className="text-7xl md:text-8xl font-black text-appInk select-none transition-opacity duration-300"
              aria-label={`שניות שנותרו: ${count}`}
            >
              {count}
            </span>
          )}
        </div>
      </Card>

      {/* Breathing Exercise Action Controls */}
      <div className="pt-1">
        {isRunning ? (
          <Btn
            variant="clay"
            onClick={stopExercise}
            className="w-full text-2xl font-bold py-5 gap-3"
            ariaLabel="עצירת תרגיל הנשימה"
          >
            <Square className="w-7 h-7 shrink-0" aria-hidden="true" />
            <span>עצירה</span>
          </Btn>
        ) : (
          <Btn
            variant="green"
            onClick={startExercise}
            className="w-full text-2xl md:text-3xl font-bold py-5 gap-3"
            ariaLabel="התחלת תרגיל נשימה"
          >
            <Play className="w-8 h-8 shrink-0" aria-hidden="true" />
            <span>התחלת תרגיל</span>
          </Btn>
        )}
      </div>

      {/* Sound Selection & Ambient Sound Controls */}
      <Card className="space-y-4 border-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-appInk">
              צלילי רקע מרגיעים
            </h2>
            <p className="text-base text-appSoft">
              בחרו את הצליל שהכי נעים לכם לשמוע בזמן התרגול
            </p>
          </div>

          <Btn
            variant={soundOn ? 'green' : 'outline'}
            onClick={toggleSound}
            ariaPressed={soundOn}
            className="min-h-[56px] text-lg font-bold gap-2 px-5 border-2 border-appLine hover:border-appGreen"
          >
            {soundOn ? (
              <>
                <VolumeX className="w-6 h-6 shrink-0" aria-hidden="true" />
                <span>כיבוי צליל</span>
              </>
            ) : (
              <>
                <Volume2 className="w-6 h-6 shrink-0 text-appGreen" aria-hidden="true" />
                <span>הפעלת צליל</span>
              </>
            )}
          </Btn>
        </div>

        {/* Sound Choices Grid */}
        <div
          role="radiogroup"
          aria-label="בחירת צליל רקע"
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2"
        >
      {SOUNDS.map((s) => {
        const Icon = s.icon;
        const isSelected = selectedSound === s.id;
        return (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => handleSelectSound(s.id)}
            className={`min-h-[64px] p-3 rounded-2xl border-2 flex items-center justify-start text-right gap-3 transition-all ${isSelected
                ? 'border-appGreen bg-emerald-50 dark:bg-emerald-950/40 text-appInk shadow-sm font-extrabold'
                : 'border-appLine bg-appBg text-appSoft hover:border-appGreen/60 hover:text-appInk font-medium'
              }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected
                  ? 'bg-appGreen text-white'
                  : 'bg-appCard text-appSoft border border-appLine'
                }`}
            >
              <Icon className="w-6 h-6" aria-hidden="true" />
            </div>
            <span className="text-lg leading-tight">{s.label}</span>
          </button>
        );
      })}
    </div>
      </Card >
    </main >
  );
}
