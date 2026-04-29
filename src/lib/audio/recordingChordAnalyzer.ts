import {
  detectChordFromChroma,
  estimateMajorKey,
  summarizeChordSegments,
  type DetectedChordSegment,
  type KeyEstimate,
  type ProgressionSummary,
} from "@/lib/music/chordRecognition";

export type RecordingAnalysisResult = {
  duration: number;
  key: KeyEstimate;
  segments: DetectedChordSegment[];
  progression: ProgressionSummary[];
};

const MIN_MIDI = 40;
const MAX_MIDI = 83;
const WINDOW_SECONDS = 1.35;
const HOP_SECONDS = 0.7;

function midiFrequency(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12);
}

function rms(samples: Float32Array, start: number, end: number): number {
  let sum = 0;
  for (let i = start; i < end; i += 1) {
    sum += samples[i] * samples[i];
  }
  return Math.sqrt(sum / Math.max(end - start, 1));
}

function goertzelPower(
  samples: Float32Array,
  start: number,
  end: number,
  sampleRate: number,
  frequency: number,
): number {
  const n = end - start;
  const k = Math.round((n * frequency) / sampleRate);
  const omega = (2 * Math.PI * k) / n;
  const coeff = 2 * Math.cos(omega);
  let q0 = 0;
  let q1 = 0;
  let q2 = 0;

  for (let i = start; i < end; i += 1) {
    const hann =
      0.5 - 0.5 * Math.cos((2 * Math.PI * (i - start)) / Math.max(n - 1, 1));
    q0 = coeff * q1 - q2 + samples[i] * hann;
    q2 = q1;
    q1 = q0;
  }

  return q1 * q1 + q2 * q2 - coeff * q1 * q2;
}

function chromaForWindow(
  samples: Float32Array,
  start: number,
  end: number,
  sampleRate: number,
): number[] {
  const chroma = Array.from({ length: 12 }, () => 0);

  for (let midi = MIN_MIDI; midi <= MAX_MIDI; midi += 1) {
    const pitchClass = midi % 12;
    const power = goertzelPower(
      samples,
      start,
      end,
      sampleRate,
      midiFrequency(midi),
    );
    chroma[pitchClass] += Math.sqrt(Math.max(power, 0));
  }

  return chroma;
}

function downmix(buffer: AudioBuffer): Float32Array {
  const output = new Float32Array(buffer.length);
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < data.length; i += 1) {
      output[i] += data[i] / buffer.numberOfChannels;
    }
  }
  return output;
}

export async function analyzeRecordingBlob(
  blob: Blob,
): Promise<RecordingAnalysisResult> {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContextClass();
  const arrayBuffer = await blob.arrayBuffer();
  const audioBuffer = await context.decodeAudioData(arrayBuffer.slice(0));
  await context.close();

  const samples = downmix(audioBuffer);
  const sampleRate = audioBuffer.sampleRate;
  const windowSize = Math.max(1024, Math.round(WINDOW_SECONDS * sampleRate));
  const hopSize = Math.max(512, Math.round(HOP_SECONDS * sampleRate));
  const duration = audioBuffer.duration;
  const segments: DetectedChordSegment[] = [];

  for (let start = 0; start + windowSize <= samples.length; start += hopSize) {
    const end = start + windowSize;
    const energy = rms(samples, start, end);
    if (energy < 0.008) continue;

    const chroma = chromaForWindow(samples, start, end, sampleRate);
    const detected = detectChordFromChroma(chroma);
    const confidence = Math.max(
      0,
      Math.min(1, detected.confidence * Math.min(1, energy / 0.04)),
    );

    segments.push({
      ...detected,
      confidence,
      start: start / sampleRate,
      end: end / sampleRate,
      chroma,
    });
  }

  const key = estimateMajorKey(segments);
  const progression = summarizeChordSegments(segments, key.key);

  return {
    duration,
    key,
    segments,
    progression,
  };
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
