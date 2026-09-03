import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Modal Interstitiel
export const InterstitialAd = ({ visible, onClose }) => {
  if (!visible) return null;
  
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalEmoji}>📢</Text>
          <Text style={styles.modalTitle}>Publicité</Text>
          <Text style={styles.modalText}>Regardez cette offre exclusive !</Text>
          <TouchableOpacity style={styles.modalButton} onPress={onClose}>
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              style={styles.buttonGradient}
            >
              <Text style={styles.modalButtonText}>Fermer</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Modal Vidéo Récompensée
export const RewardedAd = ({ visible, onClose, onReward }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (visible && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (countdown === 0) {
      // Récompense attribuée
      onReward && onReward();
      setTimeout(() => onClose(), 500);
    }
  }, [visible, countdown]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalEmoji}>🎬</Text>
          <Text style={styles.modalTitle}>Vidéo Récompensée</Text>
          <Text style={styles.modalText}>
            {countdown > 0 
              ? `Regardez la vidéo... ${countdown}s` 
              : '🎉 +5 points bonus !'}
          </Text>
          {countdown > 0 ? (
            <View style={styles.countdownCircle}>
              <Text style={styles.countdownText}>{countdown}</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <LinearGradient
                colors={['#10B981', '#34D399']}
                style={styles.buttonGradient}
              >
                <Text style={styles.modalButtonText}>✓ Recevoir la récompense</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
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
    borderRadius: 24,
    padding: 30,
    width: '80%',
    maxWidth: 360,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 20px 40px rgba(0,0,0,0.3)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
      },
    }),
  },
  modalEmoji: {
    fontSize: 50,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  buttonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  countdownCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  countdownText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
