import React from 'react'
import { Platform, StyleSheet, TouchableOpacity } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import { COLORS, SIZES } from '../constants/theme'

export default function FloatingChatButton() {
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate('ChatBot')}
      activeOpacity={0.8}
    >
      <MaterialCommunityIcons name="robot-outline" size={SIZES.h2} color="#fff" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 999,
  },
})
