/**
 * The tuner's microphone. Opens the mic with the phone's voice processing off (echo
 * cancellation, noise suppression and automatic gain would all bend a plucked string), and hands
 * blocks of samples to `onBlock` about twenty times a second. Nothing is recorded or sent: each
 * block is looked at once and dropped.
 */
export interface TunerEngine {
  stop(): void;
}

const BLOCK = 8192;
const EVERY_MS = 50;

export async function startTunerEngine(onBlock: (samples: Float32Array, sampleRate: number) => void): Promise<TunerEngine> {
  // iPhones: the microphone and the speaker (reference notes) only work together in this session.
  const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
  try {
    if (session) session.type = "play-and-record";
  } catch {
    // Older Safari: nothing to set.
  }
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  });
  const ctx = new AudioContext();
  if (ctx.state !== "running") await ctx.resume();
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = BLOCK;
  analyser.smoothingTimeConstant = 0;
  source.connect(analyser);
  const block = new Float32Array(BLOCK);
  const timer = window.setInterval(() => {
    analyser.getFloatTimeDomainData(block);
    onBlock(block, ctx.sampleRate);
  }, EVERY_MS);
  return {
    stop() {
      window.clearInterval(timer);
      source.disconnect();
      stream.getTracks().forEach((t) => t.stop());
      void ctx.close();
    },
  };
}

export function microphoneSupported(): boolean {
  return typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
}
