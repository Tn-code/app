import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Définition des thèmes disponibles
export const THEMES = {
  blue: {
    id: 'blue',
    name: 'Bleu',
    colors: {
      primary: '#4F46E5',
      secondary: '#667EEA',
      gradient: ['#667EEA', '#764BA2'],
      card: '#FFFFFF',
      text: '#1A1A1A',
      background: '#F5F7FA',
      accent: '#EEF2FF',
      buttonText: '#FFFFFF',
    },
  },
  rose: {
    id: 'rose',
    name: 'Rose',
    colors: {
      primary: '#EC4899',
      secondary: '#F472B6',
      gradient: ['#EC4899', '#F472B6'],
      card: '#FFFFFF',
      text: '#1A1A1A',
      background: '#FDF2F8',
      accent: '#FCE7F3',
      buttonText: '#FFFFFF',
    },
  },
  black: {
    id: 'black',
    name: 'Noir',
    colors: {
      primary: '#1F2937',
      secondary: '#374151',
      gradient: ['#1F2937', '#111827'],
      card: '#374151',
      text: '#F9FAFB',
      background: '#111827',
      accent: '#4B5563',
      buttonText: '#FFFFFF',
    },
  },
  red: {
    id: 'red',
    name: 'Rouge',
    colors: {
      primary: '#EF4444',
      secondary: '#F87171',
      gradient: ['#EF4444', '#F87171'],
      card: '#FFFFFF',
      text: '#1A1A1A',
      background: '#FEF2F2',
      accent: '#FEE2E2',
      buttonText: '#FFFFFF',
    },
  },
  green: {
    id: 'green',
    name: 'Vert',
    colors: {
      primary: '#10B981',
      secondary: '#34D399',
      gradient: ['#10B981', '#34D399'],
      card: '#FFFFFF',
      text: '#1A1A1A',
      background: '#ECFDF5',
      accent: '#D1FAE5',
      buttonText: '#FFFFFF',
    },
  },
  purple: {
    id: 'purple',
    name: 'Violet',
    colors: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      gradient: ['#8B5CF6', '#A78BFA'],
      card: '#FFFFFF',
      text: '#1A1A1A',
      background: '#F5F3FF',
      accent: '#EDE9FE',
      buttonText: '#FFFFFF',
    },
  },
  orange: {
    id: 'orange',
    name: 'Orange',
    colors: {
      primary: '#F59E0B',
      secondary: '#FBBF24',
      gradient: ['#F59E0B', '#FBBF24'],
      card: '#FFFFFF',
      text: '#1A1A1A',
      background: '#FFFBEB',
      accent: '#FEF3C7',
      buttonText: '#FFFFFF',
    },
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('blue');

  // Charger le thème sauvegardé au démarrage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('userTheme');
        if (savedTheme && THEMES[savedTheme]) {
          setCurrentTheme(savedTheme);
        }
      } catch (error) {
        console.error('Erreur chargement thème:', error);
      }
    };
    loadTheme();
  }, []);

  // Sauvegarder le thème quand il change
  const changeTheme = async (themeId) => {
    if (THEMES[themeId]) {
      setCurrentTheme(themeId);
      try {
        await AsyncStorage.setItem('userTheme', themeId);
      } catch (error) {
        console.error('Erreur sauvegarde thème:', error);
      }
    }
  };

  const theme = THEMES[currentTheme];
  const colors = theme.colors;

  return (
    <ThemeContext.Provider value={{ currentTheme, theme, colors, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
