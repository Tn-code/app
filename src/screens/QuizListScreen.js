import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { getQuizzes } from '../services/quizService';
import CategoryPicker from '../components/common/CategoryPicker';
import { t } from '../services/i18n';

export default function QuizListScreen({ onSelectQuiz }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadQuizzes(selectedCategory);
  }, [selectedCategory]);

  const loadQuizzes = async (category) => {
    setLoading(true);
    try {
      const filters = {};
      if (category && category !== 'all') {
        filters.category = category;
      }
      const data = await getQuizzes(filters);
      setQuizzes(data);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger les quiz.');
    } finally {
      setLoading(false);
    }
  };

  const colors = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FF9FF3', '#F368E0'];

  const renderItem = ({ item, index }) => {
    const color = colors[index % colors.length];
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: color }]}
        onPress={() => {
          // Vérifier si le quiz est premium
          if (item.isPremium) {
            Alert.alert(
              '⭐ Quiz Premium',
              'Ce quiz est premium. Regardez une vidéo pour y accéder !',
              [
                { text: 'Annuler', style: 'cancel' },
                { text: '🎬 Regarder la vidéo', onPress: () => onSelectQuiz(item) },
              ]
            );
          } else {
            onSelectQuiz(item);
          }
        }}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>📖</Text>
            {item.isPremium && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumText}>⭐ Premium</Text>
              </View>
            )}
          </View>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>
              {item.questions?.length || 0} questions
            </Text>
            {item.timeLimit && (
              <Text style={styles.cardTimer}>⏱️ {item.timeLimit}s par question</Text>
            )}
            <Text style={styles.cardCategory}>📂 {t(`categories.${item.category || 'general'}`)}</Text>
          </View>
          <View style={styles.playIcon}>
            <Text style={styles.playIconText}>▶️</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CategoryPicker selected={selectedCategory} onSelect={setSelectedCategory} />
      {quizzes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🎈</Text>
          <Text style={styles.emptyText}>{t('noQuizzes')}</Text>
        </View>
      ) : (
        <FlatList
          data={quizzes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingBottom: 16 },
  loadingContainer: { padding: 40, alignItems: 'center' },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyEmoji: { fontSize: 60, marginBottom: 12 },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
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
  cardContent: { flex: 1 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardEmoji: { fontSize: 30 },
  premiumBadge: {
    backgroundColor: 'rgba(255,215,0,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardTextContainer: { flex: 1 },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  cardTimer: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  cardCategory: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  playIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconText: { fontSize: 20 },
});
