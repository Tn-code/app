import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, FlatList, View, Text } from 'react-native';
import { getQuizzes } from '../services/quizService';
import Header from '../components/common/Header';
import QuizForm from '../components/Quiz/QuizForm';
import QuizItem from '../components/Quiz/QuizItem';
import Button from '../components/common/Button';
import { showBanner } from '../services/adService';

export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadQuizzes();
    showBanner('bottom');
  }, []);

  const loadQuizzes = async () => {
    try {
      const data = await getQuizzes();
      setQuizzes(data);
    } catch (error) {
      console.error('Erreur chargement quiz:', error);
    }
  };

  const handleAddNew = () => {
    setEditingQuiz(null);
    setShowForm(true);
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingQuiz(null);
  };

  const handleSave = async (quizData) => {
    setLoading(true);
    try {
      const { saveQuiz, updateQuiz } = await import('../services/quizService');
      if (editingQuiz) {
        await updateQuiz(editingQuiz.id, quizData);
      } else {
        await saveQuiz(quizData);
      }
      await loadQuizzes();
      setShowForm(false);
      setEditingQuiz(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (quizId) => {
    setQuizzes(prevQuizzes => prevQuizzes.filter(q => q.id !== quizId));
  };

  if (showForm) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title={editingQuiz ? '✏️ Modifier le quiz' : '✨ Nouveau quiz'} />
        <QuizForm
          initialData={editingQuiz}
          onSave={handleSave}
          onCancel={handleCancel}
          loading={loading}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="👑 Admin Dashboard" />
      <View style={styles.headerActions}>
        <Button
          title="➕ Créer un quiz"
          onPress={handleAddNew}
          type="primary"
          style={{ alignSelf: 'flex-start' }}
        />
      </View>
      {quizzes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun quiz créé pour le moment.</Text>
        </View>
      ) : (
        <FlatList
          data={quizzes}
          renderItem={({ item }) => (
            <QuizItem quiz={item} onEdit={handleEdit} onDelete={handleDelete} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  headerActions: { paddingHorizontal: 20, paddingVertical: 12 },
  list: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  emptyText: { fontSize: 16, color: '#6B7280', textAlign: 'center' },
});
