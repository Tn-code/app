import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function RadioButton({
  label,
  options, // ex: [1,2,3,4] ou ['1','2','3','4']
  selected,
  onSelect,
}) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.option, selected === option && styles.selectedOption]}
            onPress={() => onSelect(option)}
          >
            <View style={[styles.radioCircle, selected === option && styles.selectedCircle]}>
              {selected === option && <View style={styles.selectedDot} />}
            </View>
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 8,
  },
  selectedOption: {
    // pas de changement visuel
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4F46E5',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    borderColor: '#4F46E5',
  },
  selectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4F46E5',
  },
  optionText: {
    fontSize: 16,
    color: '#1A1A1A',
  },
});
