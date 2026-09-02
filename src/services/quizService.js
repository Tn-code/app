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

export const getQuizzes = async () => {
  try {
    const q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const quizzes = [];
    querySnapshot.forEach((doc) => {
      quizzes.push({ id: doc.id, ...doc.data() });
    });
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
    console.log('deleteQuiz appelé avec ID:', quizId);
    const docRef = doc(db, 'quizzes', quizId);
    await deleteDoc(docRef);
    console.log('Suppression réussie');
  } catch (error) {
    console.error('Erreur lors de la suppression du quiz:', error);
    throw error;
  }
};
