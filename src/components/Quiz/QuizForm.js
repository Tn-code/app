import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import QuestionForm from './QuestionForm';

export default function QuizForm({
  initialData,
  onSave,
  onCancel,
  loading,
}) {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizImageUrl, setQuizImageUrl] = useState('');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (initialData) {
      setQuizTitle(initialData.title || '');
      setQuizImageUrl(initialData.imageUrl || '');
      setQuestions(initialData.questions || []);
    }
  }, [initialData]);

  const handleAddQuestion = (question) => {
    setQuestions([...questions, question]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleSave = () => {
    if (!quizTitle) {
      Alert.alert('Erreur', 'Veuillez entrer un titre pour le quiz.');
      return;
    }
    if (questions.length === 0) {
      Alert.alert('Erreur', 'Ajoutez au moins une question.');
      return;
    }
    const quizData = {
      title: quizTitle,
      imageUrl: quizImageUrl || '',
      questions: questions,
    };
    onSave(quizData);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>
        {initialData ? '✏️ Modifier le quiz' : '✨ Créer un nouveau Quiz'}
      </Text>

      <Input
        label="Titre du quiz *"
        placeholder="Ex: Culture Générale"
        value={quizTitle}
        onChangeText={setQuizTitle}
      />
      <Input
        label="URL de l'image du quiz"
        placeholder="https://exemple.com/image.jpg"
        value={quizImageUrl}
        onChangeText={setQuizImageUrl}
      />

      <View style={styles.divider} />

      <QuestionForm onAddQuestion={handleAddQuestion} />

      {questions.length > 0 && (
        <View style={styles.questionsList}>
          <Text style={styles.subTitle}>Questions ajoutées ({questions.length})</Text>
          {questions.map((q, index) => (
            <View key={index} style={styles.questionCard}>
              <Text style={styles.questionNumber}>Question {index + 1}</Text>
              <Text style={styles.questionText}>{q.text}</Text>
              {q.image ? <Image source={{ uri: q.image }} style={styles.previewImage} /> : null}
              {q.options.map((opt, i) => (
                <Text key={i} style={styles.optionPreview}>
                  {i + 1}. {opt} {i + 1 === q.correctScore ? ' ✅' : ''}
                </Text>
              ))}
              <Button
                title="❌ Supprimer"
                onPress={() => handleRemoveQuestion(index)}
                type="danger"
                style={{ marginTop: 8 }}
              />
            </View>
          ))}
        </View>
      )}

      <View style={styles.buttonRow}>
        <Button
          title="💾 Enregistrer"
          onPress={handleSave}
          loading={loading}
          disabled={loading}
          type="primary"
          style={{ flex: 1, marginRight: 8 }}
        />
        {onCancel && (
          <Button
            title="Annuler"
            onPress={onCancel}
            type="secondary"
            style={{ flex: 1, marginLeft: 8 }}
          />
        )}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 20 },
  subTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 15 },
  questionsList: { marginTop: 10 },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  questionNumber: { fontSize: 14, fontWeight: 'bold', color: '#4F46E5', marginBottom: 5 },
  questionText: { fontSize: 16, color: '#1A1A1A', marginBottom: 8 },
  previewImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 8, resizeMode: 'cover' },
  optionPreview: { fontSize: 14, color: '#374151', paddingVertical: 2 },
  buttonRow: { flexDirection: 'row', marginTop: 20 },
});
