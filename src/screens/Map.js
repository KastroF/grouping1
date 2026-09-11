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

      <View style={{
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        borderRadius: 12,
        padding: 25,
        marginTop: 20,
        alignItems: "center",
      }}>
        <Text style={{
          fontFamily: FONTS.bold,
          fontSize: SIZES.h4,
          color: COLORS.primary,
          textAlign: "center",
          marginBottom: 10,
        }}>
          {language === "English" ? "Coming soon" : "Bientôt disponible"}
        </Text>
        <Text style={{
          fontFamily: FONTS.regular,
          fontSize: SIZES.h6,
          color: "#555",
          textAlign: "center",
          lineHeight: 22,
        }}>
          {language === "English"
            ? "The container tracking feature will be available in the next update. Stay tuned!"
            : "La fonctionnalité de suivi de container sera disponible dans la prochaine mise à jour. Restez connectés !"}
        </Text>
      </View>
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
