import Sound from 'react-native-sound';

// Initialize on import — loads sound once
Sound.setCategory('Playback');

let alertSound: Sound | null = null;

// Preload sound so it plays instantly when needed
export function preloadAlertSound(): void {
  alertSound = new Sound('order_alert.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      // Phase 1: silent failure — file is a placeholder
      console.warn('Sound load error (expected in dev):', error.message);
      alertSound = null;
    }
  });
}

export function playAlertSound(): void {
  if (!alertSound) return;
  alertSound.stop(() => {
    alertSound?.play((success) => {
      if (!success) {
        console.warn('Sound playback failed — check order_alert.mp3');
      }
    });
  });
}

export function stopAlertSound(): void {
  alertSound?.stop();
}
