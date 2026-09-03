import { Platform, Alert, Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';

// --- Contexte pour les publicités (gère l'état des modals) ---
import { createContext, useContext } from 'react';

const AdContext = createContext();

export const AdProvider = ({ children }) => {
  const [interstitialVisible, setInterstitialVisible] = useState(false);
  const [rewardedVisible, setRewardedVisible] = useState(false);
  const [rewardedCallback, setRewardedCallback] = useState(null);

  const showInterstitial = () => {
    return new Promise((resolve) => {
      setInterstitialVisible(true);
      // Simule la fermeture après 3 secondes
      setTimeout(() => {
        setInterstitialVisible(false);
        resolve(true);
      }, 3000);
    });
  };

  const showRewardedVideo = () => {
    return new Promise((resolve) => {
      setRewardedVisible(true);
      // Simule une vidéo de 3 secondes
      setTimeout(() => {
        setRewardedVisible(false);
        resolve(true);
      }, 3000);
    });
  };

  return (
    <AdContext.Provider value={{ showInterstitial, showRewardedVideo }}>
      {children}
      <InterstitialModal visible={interstitialVisible} onClose={() => setInterstitialVisible(false)} />
      <RewardedModal visible={rewardedVisible} onClose={() => setRewardedVisible(false)} />
    </AdContext.Provider>
  );
};

export const useAds = () => useContext(AdContext);

// --- Composants de modals ---
const InterstitialModal = ({ visible, onClose }) => {
  if (!visible) return null;
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>📢 Publicité</Text>
        <Text style={styles.modalText}>Regardez cette annonce !</Text>
        <TouchableOpacity style={styles.modalButton} onPress={onClose}>
          <Text style={styles.modalButtonText}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const RewardedModal = ({ visible, onClose }) => {
  if (!visible) return null;
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>🎬 Vidéo récompensée</Text>
        <Text style={styles.modalText}>Regardez la vidéo pour gagner des points !</Text>
        <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#10B981' }]} onPress={onClose}>
          <Text style={styles.modalButtonText}>✓ Gagner mes points</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1A1A1A',
  },
  modalText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// --- Service principal (compatible web/mobile) ---
const APP_ID = '207363502';

let adContext = null;

export const initStartio = () => {
  console.log('🚀 Initialisation de Start.io... (simulation)');
  console.log('🔄 Start.io initialisé avec ID:', APP_ID);
};

// Fonctions qui utilisent le contexte
export const showInterstitial = async () => {
  if (Platform.OS === 'web') {
    // Sur web, on utilise le modal via le contexte
    // Comme on ne peut pas appeler le contexte directement, on utilise une approche alternative
    // On va utiliser Alert.alert comme fallback
    Alert.alert('📢 Publicité', 'Regardez cette annonce !');
    return true;
  } else {
    // Sur mobile, utiliser le vrai SDK plus tard
    console.log('📢 Interstitiel affiché (mobile)');
    return true;
  }
};

export const showRewardedVideo = async () => {
  if (Platform.OS === 'web') {
    Alert.alert('🎬 Vidéo récompensée', 'Vous avez gagné +5 points !');
    return true;
  } else {
    console.log('🎬 Vidéo récompensée affichée (mobile)');
    return true;
  }
};

export const showBanner = (position = 'bottom') => {
  console.log('📢 Banner affiché en position:', position);
  // Le composant BannerAd sera affiché séparément
};

export const loadNativeAd = async (placement = 'user_profile') => {
  console.log('📢 Native ad chargée pour:', placement);
  return {
    title: '⭐ Offre Spéciale',
    description: 'Découvrez des quiz exclusifs et gagnez des points !',
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
