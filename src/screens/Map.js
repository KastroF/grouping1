import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';

export default function TrackContainer({ navigation }) {
  const [containerNumber, setContainerNumber] = useState('');

  const onSubmit = () => {
    if (!containerNumber.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un numéro de container");
      return;
    }

    // Rediriger vers la carte avec le numéro
   // navigation.navigate("ContainerMap", { containerNumber });
   alert("Prochaine Mise à jour")
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suivre un container</Text>
      <Text style={{
        fontFamily: FONTS.regular, 
        fontSize: SIZES.h6, 
        color: "#000", 
        textAlign: "center", 
        marginBottom: 20
      }}>
      Entrez le numéro du container tel qu’indiqué sur le connaissement (BL) pour suivre en temps réel sa position 
      géographique sur la carte. 
      Ce service vous permet de vérifier l’avancement de l’acheminement de votre marchandise.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Numéro du container (ex: MSCU1234567)"
        value={containerNumber}
        onChangeText={setContainerNumber}
        autoCapitalize="characters"
      />
      <TouchableOpacity onPress={onSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Suivre</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontFamily: FONTS.bold, fontSize: 25, marginBottom: 10, textAlign: 'center', color: COLORS.primary },
  input: { borderWidth: 1, borderColor: COLORS.primary, borderRadius: 8, fontFamily: FONTS.regular, padding: Platform.OS === "android" ? 15 : 20 },
  button: { backgroundColor: COLORS.primary, padding: Platform.OS === "ios" ? 15 : 10, borderRadius: 8, marginTop: 20,  },
  buttonText: { color: "#fff", textAlign: 'center', fontSize: 25 , fontFamily: FONTS.bold}
});
