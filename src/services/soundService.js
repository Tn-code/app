import { Platform } from 'react-native';

// Variables pour stocker les contextes audio (web)
let audioContext = null;

// Génère un son simple avec l'API Web Audio (pour le web)
const playWebAudio = (frequency, duration, type = 'sine', volume = 0.3) => {
  if (Platform.OS !== 'web') return;
  
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      // Ne pas fermer l'audioContext pour éviter de recréer à chaque fois
    }, duration);
    return true;
  } catch (e) {
    console.warn('Erreur lecture son Web Audio:', e);
    return false;
  }
};

// Fonction principale pour jouer un son selon l'événement
export const playSoundEvent = (event) => {
  console.log(`🔊 Son joué: ${event}`);
  
  // Sur le web, on utilise l'API Web Audio
  if (Platform.OS === 'web') {
    switch (event) {
      case 'click':
        playWebAudio(660, 100, 'sine', 0.2);
        break;
      case 'correct':
        // Son de succès: deux notes montantes
        playWebAudio(523, 150, 'sine', 0.3);
        setTimeout(() => playWebAudio(659, 150, 'sine', 0.3), 150);
        break;
      case 'wrong':
        // Son d'erreur: note grave et courte
        playWebAudio(220, 300, 'sawtooth', 0.2);
        break;
      case 'complete':
        // Mélodie de victoire: do, mi, sol, do
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
          setTimeout(() => playWebAudio(freq, 200, 'sine', 0.3), i * 150);
        });
        break;
      default:
        console.warn(`Événement sonore inconnu: ${event}`);
    }
    return;
  }
  
  // Sur mobile, on pourrait utiliser expo-av avec des fichiers locaux
  // Pour l'instant, on utilise une alternative simple (à compléter)
  console.warn('Sons sur mobile: à implémenter avec expo-av');
};

// Fonction de chargement (simulée pour le web)
export const loadSounds = async () => {
  console.log('✅ Sons prêts (générés localement)');
  return Promise.resolve();
};

export default {
  playSoundEvent,
  loadSounds,
};
