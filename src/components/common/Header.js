import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Button from './Button';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase';
import { Alert } from 'react-native';

export default function Header({ title }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      Alert.alert('Erreur', 'Impossible de se déconnecter.');
    }
  };

  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <Button
        title="Déconnexion"
        onPress={handleLogout}
        type="danger"
        style={styles.logoutButton}
        textStyle={{ fontSize: 14 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      },
    }),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 0,
  },
});
