import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  FlatList,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { Alert } from 'react-native';
import QuizPlayScreen from './QuizPlayScreen';
import NativeAd from '../components/Ads/NativeAd';
import BannerAd from '../components/Ads/BannerAd';
import ThemePicker from '../components/common/ThemePicker';
import LanguagePicker from '../components/common/LanguagePicker';
import { useTheme } from '../context/ThemeContext';
import { showBanner } from '../services/adService';
import { t } from '../services/i18n';
import { getQuizzes } from '../services/quizService';
import { getUserScore } from '../services/scoreService';

export default function UserDashboard() {
  const { colors } = useTheme();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userScore, setUserScore] = useState(0);

  useEffect(() => {
    showBanner('bottom');
    loadQuizzes();
    loadUserScore();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const data = await getQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error('Erreur chargement quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserScore = async () => {
    if (auth.currentUser) {
      const score = await getUserScore(auth.currentUser.uid);
      setUserScore(score);
    }
  };

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
  };

  const handleFinishQuiz = () => {
    setSelectedQuiz(null);
    loadUserScore(); // Recharger le score après un quiz
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

  return (
    <KidsDashboard
      onLogout={handleLogout}
      onSelectQuiz={handleSelectQuiz}
      quizzes={quizzes}
      loading={loading}
      userScore={userScore}
    />
  );
}

function KidsDashboard({
  onLogout,
  onSelectQuiz,
  quizzes,
  loading,
  userScore,
}) {
  const { colors } = useTheme();

  const colorsList = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FF9FF3', '#F368E0'];

  const renderQuizItem = ({ item, index }) => {
    const color = colorsList[index % colorsList.length];
    return (
      <TouchableOpacity
        style={[styles.quizCard, { backgroundColor: color }]}
        onPress={() => onSelectQuiz(item)}
        activeOpacity={0.8}
      >
        <View style={styles.quizCardContent}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.quizCardImage} resizeMode="cover" />
          ) : (
            <View style={styles.quizCardImagePlaceholder}>
              <Text style={styles.quizCardEmoji}>📖</Text>
            </View>
          )}
          <View style={styles.quizCardInfo}>
            <Text style={styles.quizCardTitle}>{item.title}</Text>
            <View style={styles.quizCardTags}>
              <Text style={styles.quizCardQuestions}>
                ❓ {item.questions?.length || 0} questions
              </Text>
              {item.isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>⭐ Premium</Text>
                </View>
              )}
            </View>
            {item.timeLimit && (
              <Text style={styles.quizCardTimer}>⏱️ {item.timeLimit}s par question</Text>
            )}
          </View>
          <View style={styles.playButton}>
            <Text style={styles.playButtonText}>▶</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <BannerAd position="top" />

          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeEmoji}>🌟</Text>
            <Text style={styles.welcomeText}>
              {t('welcome')} {auth.currentUser?.email?.split('@')[0] || 'Ami'} !
            </Text>
            <Text style={styles.welcomeSubtext}>{t('subtitle')}</Text>
          </View>

          <View style={styles.pickersRow}>
            <View style={styles.pickerWrapper}>
              <LanguagePicker />
            </View>
          </View>

          <View style={styles.quizSection}>
            <Text style={styles.sectionTitle}>📚 {t('quizzes')}</Text>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>⏳ Chargement...</Text>
              </View>
            ) : quizzes.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyEmoji}>🎈</Text>
                <Text style={styles.emptyText}>{t('noQuizzes')}</Text>
              </View>
            ) : (
              <FlatList
                data={quizzes}
                renderItem={renderQuizItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.quizList}
              />
            )}
          </View>

          <NativeAd placement="user_profile" />

          <View style={styles.badgeContainer}>
            <Text style={styles.badgeTitle}>🏆 {t('score')}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.badgeItem}>
                <Text style={styles.badgeEmoji}>⭐</Text>
                <Text style={styles.badgeText}>{userScore} {t('points')}</Text>
              </View>
              <View style={styles.badgeItem}>
                <Text style={styles.badgeEmoji}>🎯</Text>
                <Text style={styles.badgeText}>{quizzes.length} quiz joués</Text>
              </View>
              <View style={styles.badgeItem}>
                <Text style={styles.badgeEmoji}>🏅</Text>
                <Text style={styles.badgeText}>
                  {userScore >= 100 ? '🏆 Or' : userScore >= 50 ? '🥈 Argent' : '🥉 Bronze'}
                </Text>
              </View>
            </View>
          </View>

          <ThemePicker />

          <BannerAd position="bottom" />
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
  pickersRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  pickerWrapper: {
    flex: 1,
  },
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  quizSection: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({ web: { backdropFilter: 'blur(10px)' } }),
  },
  quizList: {
    paddingTop: 8,
  },
  quizCard: {
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    ...Platform.select({
      web: { boxShadow: '0 4px 8px rgba(0,0,0,0.15)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  quizCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizCardImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  quizCardImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quizCardEmoji: { fontSize: 28 },
  quizCardInfo: {
    flex: 1,
  },
  quizCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  quizCardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 4,
  },
  quizCardQuestions: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 4,
  },
  premiumBadge: {
    backgroundColor: 'rgba(255,215,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  quizCardTimer: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyEmoji: { fontSize: 50, marginBottom: 12 },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  badgeContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 24,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
    ...Platform.select({ web: { backdropFilter: 'blur(10px)' } }),
  },
  badgeTitle: {
    fontSize: 18,
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
