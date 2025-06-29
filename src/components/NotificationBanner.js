import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { COLORS, FONTS, SIZES } from '../constants/theme';

export default function NotificationBanner({ isVisible, onClose, title, body, ...rest }) {
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    setVisible(isVisible);
    if (isVisible) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, 6000); // auto-dismiss après 4 sec
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <Modal
      isVisible={visible}
      animationIn="slideInDown"
      animationOut="slideOutUp"
      backdropOpacity={0}
      style={styles.modal}
    >
      <TouchableOpacity onPress={() => {
        setVisible(false);
        onClose?.();
      }} {...rest}>
        <View style={styles.banner}>
          <View>
            <Image source={require("../assets/images/Grouping.png")} style={{
                height: 80, 
                width: 50, 
                resizeMode: "contain"
            }} />
          </View>
          <View style={{
            flex: 1
          }}>
            <Text style={styles.title}>{title || "Nouvelle notification"}</Text>
            <Text style={styles.body}>{body}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-start',
    margin: 0,
  },
  banner: {
    backgroundColor: COLORS.light_blue,
    padding: 15,
    paddingTop: Platform.OS === "android" ? 15 : 60,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    elevation: 4,
    flexDirection: "row", 
    shadowColor: '#000',           // couleur de l’ombre
    shadowOffset: {
      width: 0,                    // décalage horizontal
      height: 2                   // décalage vertical
    },
    shadowOpacity: 0.25,          // opacité de l’ombre (0 à 1)
    shadowRadius: 3.84,
    gap: 20
  },
  title: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: SIZES.h4,
    fontFamily: FONTS.bold
  },
  body: {
    color: '#000',
    marginTop: 5,
    fontFamily: FONTS.regular, 
    fontSize: SIZES.h6
  },
});
