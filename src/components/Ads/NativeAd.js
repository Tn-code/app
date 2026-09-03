import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { loadNativeAd } from '../../services/adService';

export default function NativeAd({ placement = 'user_profile' }) {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    loadNativeAd(placement).then(setAd);
  }, [placement]);

  if (!ad) return null;

  return (
    <View style={styles.container}>
      <View style={styles.adContainer}>
        <Image source={{ uri: ad.icon }} style={styles.adIcon} resizeMode="cover" />
        <View style={styles.adContent}>
          <Text style={styles.adTitle}>{ad.title}</Text>
          <Text style={styles.adDescription} numberOfLines={2}>
            {ad.description}
          </Text>
          <TouchableOpacity style={styles.adButton}>
            <Text style={styles.adButtonText}>{ad.callToAction}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 14,
    marginVertical: 10,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  adContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
  },
  adContent: {
    flex: 1,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  adDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  adButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  adButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
