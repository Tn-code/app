import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { Alert } from 'react-native';
import QuizListScreen from './QuizListScreen';
import QuizPlayScreen from './QuizPlayScreen';
import NativeAd from '../components/Ads/NativeAd';
import ThemePicker from '../components/common/ThemePicker';
import { useTheme } from '../context/ThemeContext';
import { showBanner } from '../services/adService';

export default function UserDashboard() {
  const { colors } = useTheme();
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    showBanner('bottom');
  }, []);

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
  };

  const handleFinishQuiz = () => {
    setSelectedQuiz(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      Alert.alert('Erreur', 'Impossible de se déconnecter.');
    }
  };

  if (selectedQuiz) {
    return <QuizPlayScreen quiz={selectedQuiz} onFinish={handleFinishQuiz} />;
  }

  return <KidsDashboard onLogout={handleLogout} onSelectQuiz={handleSelectQuiz} />;
}

function KidsDashboard({ onLogout, onSelectQuiz }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerEmoji}>🎈</Text>
            <Text style={styles.headerTitle}>QuizLand</Text>
          </View>
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>👋</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeEmoji}>🌟</Text>
            <Text style={styles.welcomeText}>
              Salut {auth.currentUser?.email?.split('@')[0] || 'Ami'} !
            </Text>
            <Text style={styles.welcomeSubtext}>Prêt à t'amuser ? 🚀</Text>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>📚 Quiz disponibles</Text>
            <QuizListScreen onSelectQuiz={onSelectQuiz} />
          </View>

          <NativeAd placement="user_profile" />

          <View style={styles.badgeContainer}>
            <Text style={styles.badgeTitle}>🏆 Tes succès</Text>
            <View style={styles.badgeRow}>
              <View style={styles.badgeItem}>
                <Text style={styles.badgeEmoji}>⭐</Text>
                <Text style={styles.badgeText}>0 points</Text>
              </View>
              <View style={styles.badgeItem}>
                <Text style={styles.badgeEmoji}>🎯</Text>
                <Text style={styles.badgeText}>0 quiz joués</Text>
              </View>
              <View style={styles.badgeItem}>
                <Text style={styles.badgeEmoji}>🏅</Text>
                <Text style={styles.badgeText}>0 victoires</Text>
              </View>
            </View>
          </View>

          <ThemePicker />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerEmoji: { fontSize: 28, marginRight: 8 },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: { fontSize: 22 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  welcomeContainer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 24,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    ...Platform.select({ web: { backdropFilter: 'blur(10px)' } }),
  },
  welcomeEmoji: { fontSize: 50, marginBottom: 8 },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  welcomeSubtext: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sectionContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 20,
    ...Platform.select({ web: { backdropFilter: 'blur(10px)' } }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  badgeContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 24,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    ...Platform.select({ web: { backdropFilter: 'blur(10px)' } }),
  },
  badgeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-around' },
  badgeItem: { alignItems: 'center' },
  badgeEmoji: { fontSize: 32 },
  badgeText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
