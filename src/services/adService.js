import { Platform, Alert } from 'react-native';

const APP_ID = '207363502';

export const initStartio = () => {
  console.log('🚀 Start.io simulation mode');
  console.log('📱 App ID:', APP_ID);
};

export const showBanner = (position = 'bottom') => {
  console.log(`📢 Banner at ${position}`);
};

export const showInterstitial = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'web') {
      Alert.alert('📢 Publicité', 'Regardez cette annonce !');
      resolve(true);
    } else {
      console.log('📢 Interstitial (simulated)');
      resolve(true);
    }
  });
};

export const showRewardedVideo = () => {
  return new Promise((resolve) => {
    if (Platform.OS === 'web') {
      Alert.alert('🎬 Vidéo récompensée', '+5 points bonus !');
      resolve(true);
    } else {
      console.log('🎬 Rewarded video (simulated)');
      resolve(true);
    }
  });
};

export const loadNativeAd = async () => {
  return {
    title: '⭐ Offre Spéciale',
    description: 'Découvrez nos quiz exclusifs !',
    icon: 'https://via.placeholder.com/100',
    callToAction: 'En savoir plus',
  };
};

export default {
  initStartio,
  showBanner,
  showInterstitial,
  showRewardedVideo,
  loadNativeAd,
};
