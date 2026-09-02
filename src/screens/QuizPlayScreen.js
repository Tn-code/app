import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  Platform,
  BackHandler,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { showInterstitial, showRewardedVideo } from '../services/adService';

export default function QuizPlayScreen({ quiz, onFinish }) {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [bonusUsed, setBonusUsed] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef(null);

  const questions = quiz?.questions || [];
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const useNativeDriver = Platform.OS !== 'web';

  // Gestion du bouton retour Android (physique)
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('🔙 Retour physique Android détecté');
      showQuitConfirmation();
      return true;
    });
    return () => backHandler.remove();
  }, []);

  // Nettoyer le timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Animation de transition
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver }),
    ]).start();
  }, [currentIndex]);

  // Fonction de confirmation de sortie (adaptée Web / Mobile)
  const showQuitConfirmation = () => {
    console.log('🛑 Demande de confirmation pour quitter');

    if (Platform.OS === 'web') {
      // Web : utiliser window.confirm (bloquant)
      const confirmed = window.confirm(
        'Voulez-vous vraiment quitter ? Votre progression sera perdue.'
      );
      if (confirmed) {
        console.log('✅ Quitter le quiz (Web)');
        if (timerRef.current) clearTimeout(timerRef.current);
        onFinish();
      }
    } else {
      // Mobile : utiliser Alert.alert avec boutons
      Alert.alert(
        'Quitter le quiz',
        'Voulez-vous vraiment quitter ? Votre progression sera perdue.',
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Quitter',
            style: 'destructive',
            onPress: () => {
              console.log('✅ Quitter le quiz (Mobile)');
              if (timerRef.current) clearTimeout(timerRef.current);
              onFinish();
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const handleSelectOption = (index) => {
    console.log('✅ Option cliquée:', index);
    if (showFeedback || isFinished) return;
    setSelectedOption(index);
    setShowFeedback(true);

    const isCorrect = index + 1 === currentQuestion.correctScore;
    if (isCorrect) setScore(prev => prev + 10);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      goToNextQuestion();
    }, 1500);
  };

  const goToNextQuestion = () => {
    if (currentIndex + 1 < totalQuestions) {
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver }).start(() => {
        setCurrentIndex(currentIndex + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      });
    } else {
      setIsFinished(true);
      showFinalResult();
    }
  };

  const showFinalResult = async () => {
    await showInterstitial();
    const totalPoints = totalQuestions * 10;
    const percentage = Math.round((score / totalPoints) * 100);
    let emoji = '🎉', message = 'Super travail !';
    if (percentage < 40) { emoji = '💪'; message = 'Continue comme ça, tu vas y arriver !'; }
    else if (percentage < 70) { emoji = '😊'; message = 'Pas mal ! Un peu d\'entraînement et ce sera parfait !'; }
    else if (percentage < 90) { emoji = '🌟'; message = 'Excellent ! Tu es vraiment doué !'; }
    else { emoji = '🏆'; message = 'Génial ! Tu as tout déchiré !'; }

    Alert.alert(
      `${emoji} Quiz terminé !`,
      `${message}\n\nTon score : ${score} / ${totalPoints} points (${percentage}%)`,
      [{ text: '🏠 Retour à la liste', onPress: () => { setIsFinished(false); onFinish(); } }]
    );
  };

  const handleWatchRewardedVideo = async () => {
    if (bonusUsed) {
      Alert.alert('Info', 'Tu as déjà utilisé le bonus pour ce quiz.');
      return;
    }
    const watched = await showRewardedVideo();
    if (watched) {
      setScore(prev => prev + 5);
      setBonusUsed(true);
      Alert.alert('🎉 Merci !', '+5 points bonus !');
    }
  };

  if (isFinished) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.gradient}>
          <View style={styles.center}>
            <Text style={styles.finishedText}>🎯 Quiz terminé !</Text>
            <Text style={styles.finishedScore}>Score: {score} points</Text>
            <TouchableOpacity style={styles.finishButton} onPress={onFinish}>
              <Text style={styles.finishButtonText}>🏠 Retour</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (!currentQuestion) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.gradient}>
          <View style={styles.center}>
            <Text style={styles.errorText}>Aucune question dans ce quiz.</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const options = ['A', 'B', 'C', 'D'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.gradient}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              console.log('🔙 Bouton retour cliqué');
              showQuitConfirmation();
            }}
            style={styles.backButton}
            activeOpacity={0.6}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>{quiz.title}</Text>
          <View style={[styles.scoreBadge, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
            <Text style={styles.scoreBadgeText}>⭐ {score}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>🎯 {currentIndex + 1}/{totalQuestions}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${((currentIndex + 1) / totalQuestions) * 100}%`, backgroundColor: '#FFFFFF' }]} />
          </View>
        </View>

        <Animated.View style={[styles.questionContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          {currentQuestion.image ? (
            <Image source={{ uri: currentQuestion.image }} style={styles.questionImage} resizeMode="cover" />
          ) : (
            <View style={styles.questionImagePlaceholder}>
              <Text style={styles.questionImageEmoji}>🤔</Text>
            </View>
          )}
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
        </Animated.View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx + 1 === currentQuestion.correctScore;
            let optionStyle = styles.option;
            let textStyle = styles.optionText;
            let letterStyle = styles.optionLetter;

            if (showFeedback) {
              if (isCorrect) {
                optionStyle = { ...optionStyle, ...styles.optionCorrect };
                textStyle = { ...textStyle, ...styles.optionTextCorrect };
                letterStyle = { ...letterStyle, ...styles.optionLetterCorrect };
              } else if (isSelected && !isCorrect) {
                optionStyle = { ...optionStyle, ...styles.optionWrong };
                textStyle = { ...textStyle, ...styles.optionTextWrong };
                letterStyle = { ...letterStyle, ...styles.optionLetterWrong };
              }
            } else if (isSelected) {
              optionStyle = { ...optionStyle, ...styles.optionSelected };
              textStyle = { ...textStyle, ...styles.optionTextSelected };
              letterStyle = { ...letterStyle, ...styles.optionLetterSelected };
            }

            return (
              <TouchableOpacity
                key={idx}
                style={optionStyle}
                onPress={() => handleSelectOption(idx)}
                disabled={showFeedback || isFinished}
                activeOpacity={0.7}
              >
                <View style={letterStyle}>
                  <Text style={styles.optionLetterText}>{options[idx]}</Text>
                </View>
                <Text style={textStyle}>{option}</Text>
                {showFeedback && isCorrect && <Text style={styles.feedbackIcon}>✅</Text>}
                {showFeedback && isSelected && !isCorrect && <Text style={styles.feedbackIcon}>❌</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {showFeedback && (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackText}>
              {selectedOption + 1 === currentQuestion.correctScore
                ? '✅ Bonne réponse ! +10 points'
                : '❌ Oups, ce n\'est pas la bonne réponse'}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.bonusButton, bonusUsed && styles.bonusUsed]}
          onPress={handleWatchRewardedVideo}
          disabled={bonusUsed}
        >
          <Text style={styles.bonusButtonText}>
            🎬 {bonusUsed ? 'Bonus utilisé' : 'Gagner +5 points (vidéo)'}
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: { fontSize: 24, color: '#FFFFFF' },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 12,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scoreBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  scoreBadgeText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  progressContainer: { paddingHorizontal: 20, marginBottom: 16 },
  progressText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  questionContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    ...Platform.select({
      web: { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  questionImage: { width: '100%', height: 160, borderRadius: 12, marginBottom: 16 },
  questionImagePlaceholder: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionImageEmoji: { fontSize: 50 },
  questionText: { fontSize: 20, fontWeight: 'bold', color: '#2D3748', textAlign: 'center' },
  optionsContainer: { paddingHorizontal: 16, marginBottom: 8 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
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
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionLetterText: { fontSize: 14, fontWeight: 'bold', color: '#4A5568' },
  optionLetterCorrect: { backgroundColor: '#10B981' },
  optionLetterWrong: { backgroundColor: '#EF4444' },
  optionLetterSelected: { backgroundColor: '#4F46E5' },
  optionSelected: { backgroundColor: 'rgba(79,70,229,0.15)', borderWidth: 2, borderColor: '#4F46E5' },
  optionCorrect: { backgroundColor: 'rgba(16,185,129,0.2)', borderWidth: 2, borderColor: '#10B981' },
  optionWrong: { backgroundColor: 'rgba(239,68,68,0.2)', borderWidth: 2, borderColor: '#EF4444' },
  optionText: { fontSize: 16, color: '#1A1A1A', flex: 1 },
  optionTextSelected: { color: '#4F46E5' },
  optionTextCorrect: { color: '#065F46' },
  optionTextWrong: { color: '#991B1B' },
  feedbackIcon: { fontSize: 20, marginLeft: 8 },
  feedbackContainer: { paddingHorizontal: 20, alignItems: 'center', marginTop: 4 },
  feedbackText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  errorText: { fontSize: 16, color: '#FFFFFF' },
  finishedText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  finishedScore: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 24,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  finishButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  finishButtonText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  bonusButton: {
    marginHorizontal: 20,
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,215,0,0.3)',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.5)',
  },
  bonusUsed: {
    backgroundColor: 'rgba(128,128,128,0.3)',
    borderColor: 'rgba(128,128,128,0.5)',
  },
  bonusButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
