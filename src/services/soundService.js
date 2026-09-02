import { Audio } from 'expo-av';
import { Platform } from 'react-native';

// Définition des sons (encodés en base64 pour éviter les fichiers externes)
// Pour simplifier, on va générer des sons synthétiques avec l'API Web Audio sur le web,
// et utiliser des fichiers audio locaux sur mobile.
// Pour l'instant, on va utiliser des sons générés dynamiquement (web) ou des fichiers statiques.
// Mais la solution la plus simple est d'utiliser des sons en ligne (URLs) ou des fichiers dans le bundle.

// Je vais utiliser des fichiers sonores courts hébergés sur un CDN (pour démonstration)
// Vous pouvez les remplacer par vos propres fichiers.

const SOUNDS = {
  correct: 'https://cdn.pixabay.com/audio/2022/03/10/audio_f3b0d6f4c1.mp3', // son de succès
  wrong: 'https://cdn.pixabay.com/audio/2022/03/10/audio_2c6e8b3a2a.mp3', // son d'erreur
  complete: 'https://cdn.pixabay.com/audio/2022/03/10/audio_5d9e8f6c2b.mp3', // victoire
  click: 'https://cdn.pixabay.com/audio/2022/03/10/audio_8f9e2c6d4a.mp3', // clic
};

// Objet pour stocker les sons chargés
let soundObjects = {};

// Charger les sons
export const loadSounds = async () => {
  try {
    for (const [key, url] of Object.entries(SOUNDS)) {
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { volume: 0.5 }
      );
      soundObjects[key] = sound;
    }
    console.log('✅ Sons chargés avec succès');
  } catch (error) {
    console.error('❌ Erreur chargement des sons:', error);
  }
};

// Jouer un son
export const playSound = async (key) => {
  try {
    if (soundObjects[key]) {
      await soundObjects[key].replayAsync();
    } else {
      console.warn(`Son "${key}" non trouvé`);
    }
  } catch (error) {
    console.error(`Erreur lecture du son "${key}":`, error);
  }
};

// Libérer les ressources (à appeler lors du démontage)
export const unloadSounds = async () => {
  for (const sound of Object.values(soundObjects)) {
    await sound.unloadAsync();
  }
  soundObjects = {};
};

// Version simplifiée pour le web (si les sons ne se chargent pas)
// On peut utiliser l'API Web Audio pour générer des sons simples
export const playBeep = (frequency = 440, duration = 200) => {
  if (Platform.OS === 'web') {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, duration);
    } catch (e) {
      // Fallback silencieux
    }
  }
};

// Fonction pour jouer un son selon l'événement
export const playSoundEvent = (event) => {
  switch (event) {
    case 'correct':
      playSound('correct').catch(() => playBeep(880, 200));
      break;
    case 'wrong':
      playSound('wrong').catch(() => playBeep(220, 300));
      break;
    case 'complete':
      playSound('complete').catch(() => {
        // Jouer une mélodie simple
        [523, 659, 784, 1047].forEach((freq, i) => {
          setTimeout(() => playBeep(freq, 150), i * 150);
        });
      });
      break;
    case 'click':
      playSound('click').catch(() => playBeep(660, 100));
      break;
    default:
      break;
  }
};

export default {
  loadSounds,
  playSound,
  playSoundEvent,
  unloadSounds,
};
