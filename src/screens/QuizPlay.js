import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { getQuizById } from '../services/quizService';

export default function QuizPlay({ route, navigation }) {
  const { quizId, quizTitle, questions: initialQuestions } = route.params;
  const [questions, setQuestions] = useState(initialQuestions || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Si les questions ne sont pas passées en paramètre, on les récupère (cas où on navigue directement)
    if (!initialQuestions) {
      loadQuiz();
    }
  }, []);

  const loadQuiz = async () => {
    try {
      const data = await getQuizById(quizId);
      if (data) {
        setQuestions(data.questions || []);
      } else {
        Alert.alert('Erreur', 'Quiz non trouvé.');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger le quiz.');
    }
  };

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text>Chargement du quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  const handleSelectOption = (index) => {
    if (selectedOption !== null) return; // déjà répondu
    setSelectedOption(index);
    const isCorrect = index + 1 === currentQuestion.correctScore;
    if (isCorrect) {
      setScore(score + 1);
    }
    setTotal(total + 1);
  };

  const handleNext = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      // Fin du quiz
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setTotal(0);
    setShowResult(false);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (showResult) {
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <Text style={styles.resultTitle}>🏁 Quiz terminé !</Text>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>{score} / {total}</Text>
            <Text style={styles.percentageText}>{percentage}% de bonnes réponses</Text>
          </View>
          {percentage >= 80 ? (
            <Text style={styles.congrats}>🎉 Excellent !</Text>
          ) : percentage >= 50 ? (
            <Text style={styles.congrats}>👍 Pas mal, continuez !</Text>
          ) : (
            <Text style={styles.congrats}>📚 Revoyez vos classiques !</Text>
          )}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.restartButton]} onPress={handleRestart}>
              <Text style={styles.buttonText}>Rejouer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.backButton]} onPress={handleBack}>
              <Text style={styles.buttonText}>Retour</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{quizTitle || 'Quiz'}</Text>
        <Text style={styles.headerSubtitle}>{currentIndex + 1} / {totalQuestions}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.questionContainer}>
        {currentQuestion.image ? (
          <Image source={{ uri: currentQuestion.image }} style={styles.questionImage} />
        ) : null}
        <Text style={styles.questionText}>{currentQuestion.text}</Text>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = selectedOption !== null && idx + 1 === currentQuestion.correctScore;
            const isWrong = selectedOption === idx && idx + 1 !== currentQuestion.correctScore;
            let optionStyle = [styles.option];
            if (isSelected) {
              optionStyle.push(styles.optionSelected);
            }
            if (selectedOption !== null && isCorrect) {
              optionStyle.push(styles.optionCorrect);
            }
            if (selectedOption !== null && isWrong) {
              optionStyle.push(styles.optionWrong);
            }
            return (
              <TouchableOpacity
                key={idx}
                style={optionStyle}
                onPress={() => handleSelectOption(idx)}
                disabled={selectedOption !== null}
              >
                <Text style={styles.optionText}>{option}</Text>
                {selectedOption !== null && isCorrect && <Text style={styles.icon}>✅</Text>}
                {selectedOption !== null && isWrong && <Text style={styles.icon}>❌</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedOption !== null && (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex + 1 === totalQuestions ? 'Voir les résultats' : 'Question suivante'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  headerSubtitle: { fontSize: 16, color: '#6B7280' },
  questionContainer: { padding: 20, alignItems: 'center' },
  questionImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 20, resizeMode: 'cover' },
  questionText: { fontSize: 20, fontWeight: '600', color: '#1A1A1A', textAlign: 'center', marginBottom: 30 },
  optionsContainer: { width: '100%' },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionSelected: { borderColor: '#4F46E5', backgroundColor: '#EEF2FF' },
  optionCorrect: { borderColor: '#10B981', backgroundColor: '#D1FAE5' },
  optionWrong: { borderColor: '#EF4444', backgroundColor: '#FEE2E2' },
  optionText: { fontSize: 16, color: '#1A1A1A' },
  icon: { fontSize: 20 },
  nextButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  nextButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  resultContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  resultTitle: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 30 },
  scoreBox: { backgroundColor: '#FFFFFF', padding: 30, borderRadius: 16, alignItems: 'center', width: '100%' },
  scoreText: { fontSize: 48, fontWeight: 'bold', color: '#4F46E5' },
  percentageText: { fontSize: 18, color: '#6B7280', marginTop: 8 },
  congrats: { fontSize: 22, marginTop: 20, color: '#1A1A1A' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 30 },
  button: { paddingVertical: 14, paddingHorizontal: 30, borderRadius: 12, alignItems: 'center' },
  restartButton: { backgroundColor: '#10B981' },
  backButton: { backgroundColor: '#6B7280' },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
