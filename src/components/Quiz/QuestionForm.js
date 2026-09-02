import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import RadioButton from '../common/RadioButton';

export default function QuestionForm({ onAddQuestion }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [correctScore, setCorrectScore] = useState(null); // 1-4

  const handleAdd = () => {
    if (!text || !option1 || !option2 || !option3 || !option4 || correctScore === null) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs et choisir la bonne réponse.');
      return;
    }
    const question = {
      text,
      image: image || '',
      options: [option1, option2, option3, option4],
      correctScore,
    };
    onAddQuestion(question);
    // Reset
    setText('');
    setImage('');
    setOption1('');
    setOption2('');
    setOption3('');
    setOption4('');
    setCorrectScore(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Ajouter une question</Text>

      <Input label="Texte de la question *" placeholder="Quelle est la capitale de la France ?" value={text} onChangeText={setText} />
      <Input label="URL de l'image (optionnel)" placeholder="https://exemple.com/question.jpg" value={image} onChangeText={setImage} />

      <View style={styles.row}>
        <Input label="Option 1 *" placeholder="Paris" value={option1} onChangeText={setOption1} style={{ flex: 1, marginRight: 8 }} />
        <Input label="Option 2 *" placeholder="Londres" value={option2} onChangeText={setOption2} style={{ flex: 1, marginLeft: 8 }} />
      </View>
      <View style={styles.row}>
        <Input label="Option 3 *" placeholder="Berlin" value={option3} onChangeText={setOption3} style={{ flex: 1, marginRight: 8 }} />
        <Input label="Option 4 *" placeholder="Madrid" value={option4} onChangeText={setOption4} style={{ flex: 1, marginLeft: 8 }} />
      </View>

      <RadioButton
        label="Bonne réponse (choisissez le numéro) *"
        options={[1, 2, 3, 4]}
        selected={correctScore}
        onSelect={setCorrectScore}
      />

      <Button title="➕ Ajouter la question" onPress={handleAdd} type="success" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
  },
});
