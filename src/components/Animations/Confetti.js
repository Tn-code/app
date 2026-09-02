import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import ConfettiCannon from 'react-native-confetti';

export default function Confetti({ active, onFinish }) {
  const confettiRef = useRef(null);

  useEffect(() => {
    if (active && confettiRef.current) {
      confettiRef.current.startConfetti();
      // Arrêter automatiquement après 3 secondes
      const timer = setTimeout(() => {
        if (confettiRef.current) {
          confettiRef.current.stopConfetti();
          if (onFinish) onFinish();
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: -10, y: 0 }}
        fallSpeed={3000}
        colors={['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#FF9FF3', '#F368E0']}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 999,
  },
});
