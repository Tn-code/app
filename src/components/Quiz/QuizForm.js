import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import QuestionForm from './QuestionForm';
import { t } from '../../services/i18n';

const CATEGORIES = [
  { id: 'general', label: 'Général' },
  { id: 'science', label: 'Science' },
  { id: 'history', label: 'Histoire' },
  { id: 'geography', label: 'Géographie' },
  { id: 'sports', label: 'Sports' },
  { id: 'culture', label: 'Culture' },
  { id: 'fun', label: 'Fun' },
];

export default function QuizForm({
  initialData,
  onSave,
  onCancel,
  loading,
}) {
  const [quizTitle, setQuizTitle] = useState('');
  const [quizImageUrl, setQuizImageUrl] = useState('');
  const [category, setCategory] = useState('general');
  const [timeLimit, setTimeLimit] = useState('20');
  const [isPremium, setIsPremium] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    if (initialData) {
      setQuizTitle(initialData.title || '');
      setQuizImageUrl(initialData.imageUrl || '');
      setCategory(initialData.category || 'general');
      setTimeLimit(initialData.timeLimit ? String(initialData.timeLimit) : '20');
      setIsPremium(initialData.isPremium || false);
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
      category: category,
      timeLimit: parseInt(timeLimit) || 20,
      isPremium: isPremium,
      questions: questions,
    };
    onSave(quizData);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>
        {initialData ? '✏️ ' + t('editQuiz') : '✨ ' + t('createQuiz')}
      </Text>

      <Input
        label={t('title')}
        placeholder="Ex: Culture Générale"
        value={quizTitle}
        onChangeText={setQuizTitle}
      />
      <Input
        label={t('imageUrl')}
        placeholder="https://exemple.com/image.jpg"
        value={quizImageUrl}
        onChangeText={setQuizImageUrl}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>{t('category')}</Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryButton, category === cat.id && styles.categoryActive]}
              onPress={() => setCategory(cat.id)}
            >
              <Text style={[styles.categoryText, category === cat.id && styles.categoryTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Input
        label="⏱️ Temps par question (secondes)"
        placeholder="20"
        value={timeLimit}
        onChangeText={setTimeLimit}
        keyboardType="numeric"
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>⭐ Quiz Premium</Text>
        <View style={styles.premiumRow}>
          <TouchableOpacity
            style={[styles.premiumButton, !isPremium && styles.premiumActive]}
            onPress={() => setIsPremium(false)}
          >
            <Text style={[styles.premiumText, !isPremium && styles.premiumTextActive]}>Gratuit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.premiumButton, isPremium && styles.premiumActive]}
            onPress={() => setIsPremium(true)}
          >
            <Text style={[styles.premiumText, isPremium && styles.premiumTextActive]}>⭐ Premium</Text>
          </TouchableOpacity>
        </View>
      </View>

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
          title={t('saveQuiz')}
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
    ...Platform.select({
      web: { boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
    }),
  },
  questionNumber: { fontSize: 14, fontWeight: 'bold', color: '#4F46E5', marginBottom: 5 },
  questionText: { fontSize: 16, color: '#1A1A1A', marginBottom: 8 },
  previewImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 8, resizeMode: 'cover' },
  optionPreview: { fontSize: 14, color: '#374151', paddingVertical: 2 },
  buttonRow: { flexDirection: 'row', marginTop: 20 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap' },
  categoryButton: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 6,
  },
  categoryActive: {
    backgroundColor: '#4F46E5',
  },
  categoryText: {
    fontSize: 14,
    color: '#374151',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  premiumRow: { flexDirection: 'row' },
  premiumButton: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 10,
  },
  premiumActive: {
    backgroundColor: '#4F46E5',
  },
  premiumText: {
    fontSize: 14,
    color: '#374151',
  },
  premiumTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
