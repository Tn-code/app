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

export default function QuizListScreen({ onSelectQuiz }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const data = await getQuizzes();
      console.log('Quiz chargés:', data); // LOG
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
          console.log('Quiz sélectionné:', item); // LOG
          onSelectQuiz(item);
        }}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardEmoji}>📖</Text>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>
              {item.questions?.length || 0} questions
            </Text>
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

  if (quizzes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🎈</Text>
        <Text style={styles.emptyText}>Aucun quiz pour le moment</Text>
        <Text style={styles.emptySubtext}>Reviens plus tard !</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={quizzes}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
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
  emptySubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 4,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  cardContent: { flexDirection: 'row', alignItems: 'center' },
  cardEmoji: { fontSize: 30, marginRight: 14 },
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
  playIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconText: { fontSize: 20 },
});
