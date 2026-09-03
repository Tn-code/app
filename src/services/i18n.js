import AsyncStorage from '@react-native-async-storage/async-storage';

// Définition des traductions
const translations = {
  fr: {
    welcome: 'Bienvenue !',
    subtitle: 'Prêt à t\'amuser ? 🚀',
    email: '📧 Email',
    password: '🔒 Mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    signIn: '🎯 Se connecter',
    noAccount: 'Pas encore de compte ?',
    signUp: 'S\'inscrire 🎉',
    createAccount: 'Rejoins-nous !',
    createSubtitle: 'Crée ton compte en un clin d\'œil',
    name: '👤 Ton nom',
    confirmPassword: '🔐 Confirmer',
    register: '🎉 S\'inscrire',
    alreadyAccount: 'Déjà un compte ?',
    login: 'Se connecter 🚀',
    // Quiz
    quizzes: '📚 Quiz disponibles',
    noQuizzes: 'Aucun quiz disponible pour le moment.',
    play: 'Jouer →',
    score: 'Score',
    points: 'points',
    correct: 'Bonne réponse ! +10 points',
    wrong: 'Oups, ce n\'est pas la bonne réponse',
    next: 'Suivant →',
    result: 'Voir le résultat 🏆',
    // Admin
    adminDashboard: '👑 Admin Dashboard',
    createQuiz: '➕ Créer un quiz',
    editQuiz: '✏️ Modifier le quiz',
    deleteQuiz: '🗑️ Supprimer',
    title: 'Titre du quiz *',
    imageUrl: 'URL de l\'image du quiz',
    addQuestion: '➕ Ajouter une question',
    saveQuiz: '💾 Enregistrer le Quiz',
    questionText: 'Texte de la question *',
    option: 'Option',
    correctAnswer: 'Bonne réponse (1-4) *',
    // Catégories
    category: 'Catégorie',
    categories: {
      all: 'Toutes',
      general: 'Général',
      science: 'Science',
      history: 'Histoire',
      geography: 'Géographie',
      sports: 'Sports',
      culture: 'Culture',
      fun: 'Fun',
    },
    // Premium
    premium: '⭐ Premium',
    watchVideo: '🎬 Regarder une vidéo pour débloquer',
    // Timer
    timeBonus: '⏱️ +5 points bonus !',
    timeUp: '⏰ Temps écoulé !',
  },
  en: {
    welcome: 'Welcome!',
    subtitle: 'Ready to have fun? 🚀',
    email: '📧 Email',
    password: '🔒 Password',
    forgotPassword: 'Forgot password?',
    signIn: '🎯 Sign in',
    noAccount: 'Don\'t have an account?',
    signUp: 'Sign up 🎉',
    createAccount: 'Join us!',
    createSubtitle: 'Create your account in a blink',
    name: '👤 Your name',
    confirmPassword: '🔐 Confirm',
    register: '🎉 Sign up',
    alreadyAccount: 'Already have an account?',
    login: 'Login 🚀',
    quizzes: '📚 Available quizzes',
    noQuizzes: 'No quizzes available at the moment.',
    play: 'Play →',
    score: 'Score',
    points: 'points',
    correct: 'Correct! +10 points',
    wrong: 'Oops, not the right answer',
    next: 'Next →',
    result: 'See result 🏆',
    adminDashboard: '👑 Admin Dashboard',
    createQuiz: '➕ Create a quiz',
    editQuiz: '✏️ Edit quiz',
    deleteQuiz: '🗑️ Delete',
    title: 'Quiz title *',
    imageUrl: 'Quiz image URL',
    addQuestion: '➕ Add a question',
    saveQuiz: '💾 Save Quiz',
    questionText: 'Question text *',
    option: 'Option',
    correctAnswer: 'Correct answer (1-4) *',
    category: 'Category',
    categories: {
      all: 'All',
      general: 'General',
      science: 'Science',
      history: 'History',
      geography: 'Geography',
      sports: 'Sports',
      culture: 'Culture',
      fun: 'Fun',
    },
    premium: '⭐ Premium',
    watchVideo: '🎬 Watch a video to unlock',
    timeBonus: '⏱️ +5 bonus points!',
    timeUp: '⏰ Time\'s up!',
  },
  ar: {
    welcome: 'مرحباً!',
    subtitle: 'مستعد للمتعة؟ 🚀',
    email: '📧 البريد الإلكتروني',
    password: '🔒 كلمة المرور',
    forgotPassword: 'نسيت كلمة المرور؟',
    signIn: '🎯 تسجيل الدخول',
    noAccount: 'ليس لديك حساب؟',
    signUp: 'اشتراك 🎉',
    createAccount: 'انضم إلينا!',
    createSubtitle: 'أنشئ حسابك في لمح البصر',
    name: '👤 اسمك',
    confirmPassword: '🔐 تأكيد',
    register: '🎉 اشتراك',
    alreadyAccount: 'لديك حساب بالفعل؟',
    login: 'تسجيل الدخول 🚀',
    quizzes: '📚 الاختبارات المتاحة',
    noQuizzes: 'لا توجد اختبارات متاحة حالياً.',
    play: 'لعب →',
    score: 'النتيجة',
    points: 'نقطة',
    correct: 'إجابة صحيحة! +10 نقاط',
    wrong: 'عفواً، ليست الإجابة الصحيحة',
    next: 'التالي →',
    result: 'عرض النتيجة 🏆',
    adminDashboard: '👑 لوحة التحكم',
    createQuiz: '➕ إنشاء اختبار',
    editQuiz: '✏️ تعديل الاختبار',
    deleteQuiz: '🗑️ حذف',
    title: 'عنوان الاختبار *',
    imageUrl: 'رابط صورة الاختبار',
    addQuestion: '➕ أضف سؤالاً',
    saveQuiz: '💾 حفظ الاختبار',
    questionText: 'نص السؤال *',
    option: 'خيار',
    correctAnswer: 'الإجابة الصحيحة (1-4) *',
    category: 'الفئة',
    categories: {
      all: 'الكل',
      general: 'عام',
      science: 'علوم',
      history: 'تاريخ',
      geography: 'جغرافيا',
      sports: 'رياضة',
      culture: 'ثقافة',
      fun: 'تسلية',
    },
    premium: '⭐ مميز',
    watchVideo: '🎬 شاهد فيديو لفتح',
    timeBonus: '⏱️ +5 نقاط إضافية!',
    timeUp: '⏰ انتهى الوقت!',
  },
};

let currentLanguage = 'fr';
let listeners = [];

export const setLanguage = async (lang) => {
  if (translations[lang]) {
    currentLanguage = lang;
    try {
      await AsyncStorage.setItem('appLanguage', lang);
    } catch (e) {}
    listeners.forEach(fn => fn(lang));
  }
};

export const loadLanguage = async () => {
  try {
    const saved = await AsyncStorage.getItem('appLanguage');
    if (saved && translations[saved]) {
      currentLanguage = saved;
    }
  } catch (e) {}
  return currentLanguage;
};

export const t = (key, params = {}) => {
  const keys = key.split('.');
  let value = translations[currentLanguage];
  for (const k of keys) {
    if (value && value[k] !== undefined) {
      value = value[k];
    } else {
      // fallback vers l'anglais ou français
      let fallback = translations.en;
      for (const k2 of keys) {
        if (fallback && fallback[k2] !== undefined) {
          fallback = fallback[k2];
        } else {
          return key;
        }
      }
      value = fallback;
    }
  }
  if (typeof value === 'string') {
    // remplacer les paramètres {{param}}
    Object.keys(params).forEach(p => {
      value = value.replace(`{{${p}}}`, params[p]);
    });
  }
  return value;
};

export const getCurrentLanguage = () => currentLanguage;
export const getLanguages = () => Object.keys(translations);
export const addListener = (fn) => listeners.push(fn);
export const removeListener = (fn) => {
  listeners = listeners.filter(l => l !== fn);
};

export default { t, setLanguage, loadLanguage, getCurrentLanguage, getLanguages, addListener, removeListener };
