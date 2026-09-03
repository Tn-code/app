import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { t } from '../../services/i18n';

const CATEGORIES = [
  { id: 'all', icon: '📋' },
  { id: 'general', icon: '🌟' },
  { id: 'science', icon: '🔬' },
  { id: 'history', icon: '📜' },
  { id: 'geography', icon: '🌍' },
  { id: 'sports', icon: '⚽' },
  { id: 'culture', icon: '🎭' },
  { id: 'fun', icon: '🎮' },
];

export default function CategoryPicker({ selected, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryButton, isActive && styles.activeCategory]}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{cat.icon}</Text>
            <Text style={[styles.categoryName, isActive && styles.activeText]}>
              {t(`categories.${cat.id}`)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeCategory: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  icon: {
    fontSize: 18,
    marginRight: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activeText: {
    fontWeight: 'bold',
  },
});
