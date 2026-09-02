import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  type = 'primary', // 'primary' | 'secondary' | 'danger' | 'success'
  style,
  textStyle,
}) {
  const getBackgroundColor = () => {
    if (disabled || loading) return '#9CA3AF';
    switch (type) {
      case 'primary': return '#4F46E5';
      case 'secondary': return '#6B7280';
      case 'danger': return '#EF4444';
      case 'success': return '#10B981';
      default: return '#4F46E5';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: getBackgroundColor() }, style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
