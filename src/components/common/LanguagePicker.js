import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { getCurrentLanguage, getLanguages, setLanguage, addListener, removeListener, t } from '../../services/i18n';

const LANGUAGE_FLAGS = {
  fr: '🇫🇷',
  en: '🇬🇧',
  ar: '🇸🇦',
};

const LANGUAGE_NAMES = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية',
};

export default function LanguagePicker() {
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());

  useEffect(() => {
    const onLangChange = (lang) => {
      setCurrentLang(lang);
    };
    addListener(onLangChange);
    return () => removeListener(onLangChange);
  }, []);

  const handleSelect = (lang) => {
    setLanguage(lang);
  };

  const languages = getLanguages();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌍 Langue / Language / اللغة</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[
              styles.langButton,
              currentLang === lang && styles.activeLang,
            ]}
            onPress={() => handleSelect(lang)}
            activeOpacity={0.7}
          >
            <Text style={styles.flag}>{LANGUAGE_FLAGS[lang]}</Text>
            <Text style={[styles.langName, currentLang === lang && styles.activeText]}>
              {LANGUAGE_NAMES[lang]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeLang: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  flag: {
    fontSize: 20,
    marginRight: 6,
  },
  langName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activeText: {
    fontWeight: 'bold',
  },
});
