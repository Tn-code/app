import { Platform } from 'react-native';

let audioContext = null;

const initAudio = () => {
  if (Platform.OS === 'web' && !audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API non supportée');
    }
  }
};

const playTone = (frequency, duration = 150, type = 'sine') => {
  initAudio();
  if (!audioContext) return;

  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (e) {
    console.warn('Erreur lecture son:', e);
  }
};

export const playCorrectSound = () => {
  if (Platform.OS === 'web') {
    playTone(523, 150);
    setTimeout(() => playTone(659, 150), 200);
  } else {
    console.log('🔊 Son correct (mobile)');
  }
};

export const playWrongSound = () => {
  if (Platform.OS === 'web') {
    playTone(220, 300, 'sawtooth');
  } else {
    console.log('🔊 Son incorrect (mobile)');
  }
};

// ✅ Fonction playClickSound (manquante)
export const playClickSound = () => {
  if (Platform.OS === 'web') {
    playTone(880, 50);
  } else {
    console.log('🔊 Clic (mobile)');
  }
};

// ✅ Export par défaut
export default {
  playCorrectSound,
  playWrongSound,
  playClickSound,
};
