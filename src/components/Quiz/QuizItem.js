import React from 'react';
import { View, Text, StyleSheet, Image, Alert, Platform } from 'react-native';
import Button from '../common/Button';
import { deleteQuiz } from '../../services/quizService';

export default function QuizItem({ quiz, onEdit, onDelete }) {
  console.log('QuizItem reçu:', quiz); // LOG

  const handleDelete = () => {
    console.log('handleDelete appelé pour:', quiz.id); // LOG
    Alert.alert(
      'Supprimer le quiz',
      `Voulez-vous vraiment supprimer le quiz "${quiz.title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Tentative de suppression du quiz:', quiz.id);
              await deleteQuiz(quiz.id);
              console.log('Quiz supprimé avec succès');
              onDelete(quiz.id); // Appel au parent
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer le quiz.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      {quiz.imageUrl ? (
        <Image source={{ uri: quiz.imageUrl }} style={styles.cardImage} resizeMode="cover" />
      ) : null}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{quiz.title}</Text>
        <Text style={styles.cardSubtitle}>
          {quiz.questions?.length || 0} questions
        </Text>
        <Text style={styles.cardCreator}>Créé par {quiz.createdBy || 'admin'}</Text>
        <View style={styles.buttonRow}>
          <Button
            title="✏️ Modifier"
            onPress={() => onEdit(quiz)}
            type="primary"
            style={{ flex: 1, marginRight: 8 }}
            textStyle={{ fontSize: 14 }}
          />
          <Button
            title="🗑️ Supprimer"
            onPress={handleDelete}
            type="danger"
            style={{ flex: 1, marginLeft: 8 }}
            textStyle={{ fontSize: 14 }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 8px rgba(0,0,0,0.08)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  cardImage: {
    width: '100%',
    height: 150,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  cardCreator: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
});
