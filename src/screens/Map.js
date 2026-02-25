import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { AuthContext } from '../navigation/AuthProvider';
import { useFetchFunctions } from '../infrastructures/functions';
import { API } from '../config/api';

export default function TrackContainer({ navigation }) {
  const [bookingRef, setBookingRef] = useState('');
  const [loading, setLoading] = useState(false);
  const {language, token} = useContext(AuthContext);
  const {postFunction} = useFetchFunctions();

  const onSubmit = async () => {
    if (!bookingRef.trim()) {
      Alert.alert(
        language === "English" ? "Error" : "Erreur",
        language === "English" ? "Please enter a booking reference" : "Veuillez entrer une référence de réservation"
      );
      return;
    }

    setLoading(true);
    try {
      const data = await postFunction(
        API.TRACKING_SUBSCRIBE,
        { carrierBookingReference: bookingRef.trim() },
        token
      );

      if (data && (data.status === 0 || data.status === 2)) {
        navigation.navigate("ContainerMap", {
          carrierBookingReference: bookingRef.trim(),
          events: data.events || [],
          subscriptionStatus: data.subscription?.status || "pending",
        });
      } else {
        Alert.alert(
          language === "English" ? "Error" : "Erreur",
          data?.message || (language === "English" ? "Unable to subscribe to tracking" : "Impossible de s'abonner au suivi")
        );
      }
    } catch (err) {
      console.log(err);
      Alert.alert(
        language === "English" ? "Error" : "Erreur",
        language === "English" ? "Network error" : "Erreur réseau"
      );
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{language === "English" ? "Track a container" : "Suivre un container"}</Text>
      <Text style={{
        fontFamily: FONTS.regular,
        fontSize: SIZES.h6,
        color: "#000",
        textAlign: "center",
        marginBottom: 20
      }}>
        {language === "English"
          ? "Enter the Hapag-Lloyd booking reference to track your container's itinerary step by step. This service allows you to monitor the progress of your shipment."
          : "Entrez la référence de réservation Hapag-Lloyd pour suivre l'itinéraire de votre conteneur étape par étape. Ce service vous permet de vérifier l'avancement de l'acheminement de votre marchandise."}
      </Text>
      <TextInput
        style={styles.input}
        placeholder={language === "English" ? "Booking reference (ex: 12345678)" : "Référence de réservation (ex: 12345678)"}
        placeholderTextColor="#aaa"
        value={bookingRef}
        onChangeText={setBookingRef}
        autoCapitalize="characters"
        editable={!loading}
      />
      <TouchableOpacity onPress={onSubmit} style={[styles.button, loading && {opacity: 0.7}]} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>{language === "English" ? "Track now" : "Suivre"}</Text>
        }
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontFamily: FONTS.bold, fontSize: 25, marginBottom: 10, textAlign: 'center', color: COLORS.primary },
  input: { borderWidth: 1, borderColor: COLORS.primary, borderRadius: 8, fontFamily: FONTS.regular, padding: Platform.OS === "android" ? 15 : 20, color: "#000" },
  button: { backgroundColor: COLORS.primary, padding: Platform.OS === "ios" ? 15 : 10, borderRadius: 8, marginTop: 20 },
  buttonText: { color: "#fff", textAlign: 'center', fontSize: 25, fontFamily: FONTS.bold }
});
