import { type Dispatch, type SetStateAction, useEffect } from 'react';

export function getRunnerPlayLabel(playing: boolean, atEnd: boolean) {
  if (atEnd) return 'Replay';
  return playing ? 'Pause' : 'Play';
}

export function toggleOrReplayRunner(
  atEnd: boolean,
  setPlaying: Dispatch<SetStateAction<boolean>>,
  reset: () => void,
) {
  if (atEnd) {
    reset();
    setPlaying(true);
    return;
  }

  setPlaying((value) => !value);
}

export function useAutoRunner({
  playing,
  canAdvance,
  delay = 650,
  onAdvance,
  onStop,
}: {
  playing: boolean;
  canAdvance: boolean;
  delay?: number;
  onAdvance: () => void;
  onStop: () => void;
}) {
  useEffect(() => {
    if (!playing) return;

    if (!canAdvance) {
      onStop();
      return;
    }

    const timer = window.setTimeout(() => {
      if (canAdvance) {
        onAdvance();
      } else {
        onStop();
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [canAdvance, delay, onAdvance, onStop, playing]);
}
