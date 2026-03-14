/**
 * Generates meditation audio using Web Audio API.
 * Creates binaural beats, Om frequencies, and ambient tones.
 */

export interface ToneConfig {
  type: "om" | "binaural" | "singing-bowl" | "ambient" | "nature";
  durationSeconds: number;
  baseFrequency?: number;
}

const PRESETS: Record<string, ToneConfig> = {
  "om-chanting": { type: "om", durationSeconds: 600, baseFrequency: 136.1 },
  "morning-mantra": { type: "ambient", durationSeconds: 480, baseFrequency: 528 },
  "nadi-shodhana": { type: "binaural", durationSeconds: 900, baseFrequency: 432 },
  "yoga-nidra": { type: "ambient", durationSeconds: 1500, baseFrequency: 174 },
  "gratitude-meditation": { type: "singing-bowl", durationSeconds: 720, baseFrequency: 639 },
  "sandhya-evening": { type: "ambient", durationSeconds: 600, baseFrequency: 396 },
  "chakra-healing": { type: "binaural", durationSeconds: 1200, baseFrequency: 256 },
  "manifestation": { type: "ambient", durationSeconds: 900, baseFrequency: 852 },
  "healing-meditation": { type: "singing-bowl", durationSeconds: 1200, baseFrequency: 528 },
};

export function getPresetConfig(trackId: string): ToneConfig {
  // Extract preset name from track id (e.g., "audio-om-chanting" -> "om-chanting")
  const key = trackId.replace("audio-", "").replace("content-", "");
  return PRESETS[key] || { type: "ambient", durationSeconds: 600, baseFrequency: 432 };
}

let audioContext: AudioContext | null = null;
let currentSource: { stop: () => void } | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

export function generateMeditationTone(config: ToneConfig): { audioUrl: string; stop: () => void } {
  const ctx = getAudioContext();
  const sampleRate = ctx.sampleRate;
  const numSamples = sampleRate * Math.min(config.durationSeconds, 30); // Generate 30s chunks
  const buffer = ctx.createBuffer(2, numSamples, sampleRate);
  const baseFreq = config.baseFrequency || 432;

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;

      switch (config.type) {
        case "om": {
          // Om frequency with harmonics and gentle modulation
          const mod = 1 + 0.3 * Math.sin(2 * Math.PI * 0.1 * t);
          sample = 0.3 * Math.sin(2 * Math.PI * baseFreq * t * mod);
          sample += 0.15 * Math.sin(2 * Math.PI * baseFreq * 2 * t);
          sample += 0.1 * Math.sin(2 * Math.PI * baseFreq * 3 * t);
          // Binaural component (slight freq difference between channels)
          if (channel === 1) {
            sample = 0.3 * Math.sin(2 * Math.PI * (baseFreq + 4) * t * mod);
            sample += 0.15 * Math.sin(2 * Math.PI * (baseFreq + 4) * 2 * t);
          }
          break;
        }
        case "binaural": {
          // Binaural beats for deep meditation (theta wave: 4-8Hz)
          const binauralDiff = 6; // 6Hz theta
          const freq = channel === 0 ? baseFreq : baseFreq + binauralDiff;
          sample = 0.25 * Math.sin(2 * Math.PI * freq * t);
          sample += 0.1 * Math.sin(2 * Math.PI * freq * 0.5 * t);
          break;
        }
        case "singing-bowl": {
          // Tibetan singing bowl simulation
          const decay = Math.exp(-t * 0.15);
          const wobble = 1 + 0.002 * Math.sin(2 * Math.PI * 5.5 * t);
          sample = decay * 0.35 * Math.sin(2 * Math.PI * baseFreq * wobble * t);
          sample += decay * 0.2 * Math.sin(2 * Math.PI * baseFreq * 2.01 * t);
          sample += decay * 0.1 * Math.sin(2 * Math.PI * baseFreq * 3.03 * t);
          // Re-strike pattern every ~8 seconds
          const strikePhase = t % 8;
          const strikeEnv = Math.exp(-strikePhase * 0.2);
          sample *= strikeEnv;
          break;
        }
        case "ambient":
        default: {
          // Gentle ambient pad
          const lfo = 1 + 0.15 * Math.sin(2 * Math.PI * 0.05 * t);
          sample = 0.2 * Math.sin(2 * Math.PI * baseFreq * t * lfo);
          sample += 0.12 * Math.sin(2 * Math.PI * baseFreq * 1.5 * t);
          sample += 0.08 * Math.sin(2 * Math.PI * baseFreq * 0.5 * t);
          // Slight stereo spread
          if (channel === 1) {
            sample = 0.2 * Math.sin(2 * Math.PI * (baseFreq + 1) * t * lfo);
            sample += 0.12 * Math.sin(2 * Math.PI * (baseFreq + 1) * 1.5 * t);
          }
          break;
        }
      }

      // Fade in/out
      const fadeIn = Math.min(t / 3, 1); // 3 second fade in
      const fadeOut = Math.min((config.durationSeconds - t) / 3, 1);
      sample *= fadeIn * Math.max(fadeOut, 0);

      data[i] = sample;
    }
  }

  // Create a looping source
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  const gainNode = ctx.createGain();
  gainNode.gain.value = 0.7;

  source.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Stop previous if any
  if (currentSource) {
    try { currentSource.stop(); } catch { /* ignore */ }
  }

  source.start();
  currentSource = source;

  return {
    audioUrl: "generated",
    stop: () => {
      try { source.stop(); } catch { /* ignore */ }
      currentSource = null;
    },
  };
}

export function stopGeneratedAudio() {
  if (currentSource) {
    try { currentSource.stop(); } catch { /* ignore */ }
    currentSource = null;
  }
}
