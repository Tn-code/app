// Service de publicité Start.io
import { Platform, Alert } from 'react-native';

// Configuration Start.io
const APP_ID = '207363502';

// Simulation du SDK Start.io (pour le web/développement)
// En production sur mobile, utilisez le vrai SDK
const Startio = {
  init: (appId) => {
    console.log('🔄 Start.io initialisé avec ID:', appId);
  },
  showBanner: (position) => {
    console.log('📢 Banner affiché en position:', position);
    return Promise.resolve();
  },
  showInterstitial: () => {
    console.log('📢 Interstitiel affiché');
    return Promise.resolve();
  },
  showRewardedVideo: () => {
    console.log('🎬 Vidéo récompensée affichée');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
  },
  loadNativeAd: (placement) => {
    console.log('📢 Native ad chargée pour:', placement);
    return Promise.resolve({
      title: '⭐ Offre Spéciale',
      description: 'Découvrez des quiz exclusifs et gagnez des points !',
      icon: 'https://via.placeholder.com/100',
      callToAction: 'En savoir plus',
    });
  }
};

// Initialisation
export const initStartio = () => {
  console.log('🚀 Initialisation de Start.io...');
  Startio.init(APP_ID);
};

// Bannière
export const showBanner = (position = 'bottom') => {
  return Startio.showBanner(position);
};

// Interstitiel
export const showInterstitial = async () => {
  try {
    await Startio.showInterstitial();
    return true;
  } catch (error) {
    console.error('Erreur interstitiel:', error);
    return false;
  }
};

// Vidéo récompensée
export const showRewardedVideo = async () => {
  try {
    const success = await Startio.showRewardedVideo();
    if (success) {
      console.log('✅ Vidéo visionnée ! Récompense attribuée.');
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erreur vidéo récompensée:', error);
    return false;
  }
};

// Native Ads
export const loadNativeAd = async (placement = 'user_profile') => {
  try {
    const ad = await Startio.loadNativeAd(placement);
    return ad;
  } catch (error) {
    console.error('Erreur native ad:', error);
    return null;
  }
};

export default {
  initStartio,
  showBanner,
  showInterstitial,
  showRewardedVideo,
  loadNativeAd,
};
