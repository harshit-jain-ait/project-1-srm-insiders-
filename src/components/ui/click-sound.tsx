"use client";

import { useEffect } from "react";

export function ClickSound() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let audioCtx: AudioContext | null = null;

    const playClickSound = (target: HTMLElement | null) => {
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;

        if (!audioCtx) {
          audioCtx = new AudioContextClass();
        }
        if (audioCtx.state === "suspended") {
          audioCtx.resume();
        }

        const isInteractive = Boolean(
          target &&
            (target.closest("button") ||
              target.closest("a") ||
              target.closest("input") ||
              target.closest("textarea") ||
              target.closest("select") ||
              target.closest("[role='button']") ||
              window.getComputedStyle(target).cursor === "pointer")
        );

        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        // Subtle, crisp acoustic pop
        osc.type = "sine";
        const startFreq = isInteractive ? 880 : 660;
        const endFreq = isInteractive ? 420 : 310;

        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.045);

        // Gentle volume level - non-intrusive and pleasing
        const peakVolume = isInteractive ? 0.07 : 0.04;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(peakVolume, now + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.055);
      } catch {
        // Silently ignore if audio cannot play
      }
    };

    const handleClick = (e: MouseEvent) => {
      playClickSound(e.target as HTMLElement | null);
    };

    window.addEventListener("pointerdown", handleClick, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handleClick);
      if (audioCtx && audioCtx.state !== "closed") {
        audioCtx.close().catch(() => {});
      }
    };
  }, []);

  return null;
}

