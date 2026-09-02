import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Login from './src/components/Auth/Login';
import Signup from './src/components/Auth/Signup';
import AdminDashboard from './src/screens/AdminDashboard';
import UserDashboard from './src/screens/UserDashboard';
import { initStartio } from './src/services/adService';

const ADMIN_EMAIL = 'houssinetrabelsi6@gmail.com';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    // Initialiser Start.io
    initStartio();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!user) {
    return isLogin ? (
      <Login onSwitchToSignup={() => setIsLogin(false)} />
    ) : (
      <Signup onSwitchToLogin={() => setIsLogin(true)} />
    );
  }

  const isAdmin = user.email === ADMIN_EMAIL;
  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
});
