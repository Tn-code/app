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
        <Image source={{ uri: ad.icon }} style={styles.adIcon} />
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
    padding: 12,
    marginVertical: 8,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  adContent: {
    flex: 1,
  },
  adTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  adDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  adButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  adButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
