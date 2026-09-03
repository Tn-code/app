import { db } from '../../firebase';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';

export const getUserScore = async (userId) => {
  try {
    const docRef = doc(db, 'scores', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().total || 0;
    } else {
      return 0;
    }
  } catch (error) {
    console.error('Erreur récupération score:', error);
    return 0;
  }
};

export const addUserScore = async (userId, points) => {
  try {
    const docRef = doc(db, 'scores', userId);
    await setDoc(docRef, { total: increment(points) }, { merge: true });
  } catch (error) {
    console.error('Erreur ajout score:', error);
  }
};
