import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { THEMES, useTheme } from '../../context/ThemeContext';

export default function ThemePicker() {
  const { currentTheme, changeTheme } = useTheme();

  const themeOptions = Object.values(THEMES);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎨 Choisis ton thème</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {themeOptions.map((theme) => {
          const isActive = theme.id === currentTheme;
          const bgColor = theme.colors.primary;
          return (
            <TouchableOpacity
              key={theme.id}
              style={[
                styles.themeButton,
                { backgroundColor: bgColor },
                isActive && styles.activeButton,
              ]}
              onPress={() => changeTheme(theme.id)}
              activeOpacity={0.7}
            >
              <View style={styles.themePreview}>
                <View style={[styles.colorDot, { backgroundColor: bgColor }]} />
                <Text style={[styles.themeName, isActive && styles.activeText]}>
                  {theme.name}
                </Text>
                {isActive && <Text style={styles.checkMark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollView: {
    flexDirection: 'row',
  },
  themeButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeButton: {
    borderColor: '#FFFFFF',
  },
  themePreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  themeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 4,
  },
  activeText: {
    fontWeight: 'bold',
  },
  checkMark: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
