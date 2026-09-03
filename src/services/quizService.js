import { db } from '../../firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

export const saveQuiz = async (quizData) => {
  try {
    const docRef = await addDoc(collection(db, 'quizzes'), {
      ...quizData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du quiz:', error);
    throw error;
  }
};

export const getQuizzes = async (filters = {}) => {
  try {
    // Récupère tous les quiz triés par date
    const q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    let quizzes = [];
    querySnapshot.forEach((doc) => {
      quizzes.push({ id: doc.id, ...doc.data() });
    });

    // Filtrage côté client
    if (filters.category && filters.category !== 'all') {
      quizzes = quizzes.filter(q => q.category === filters.category);
    }

    return quizzes;
  } catch (error) {
    console.error('Erreur lors de la récupération des quiz:', error);
    throw error;
  }
};

export const updateQuiz = async (quizId, quizData) => {
  try {
    const docRef = doc(db, 'quizzes', quizId);
    await updateDoc(docRef, quizData);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du quiz:', error);
    throw error;
  }
};

export const deleteQuiz = async (quizId) => {
  try {
    const docRef = doc(db, 'quizzes', quizId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Erreur lors de la suppression du quiz:', error);
    throw error;
  }
};
