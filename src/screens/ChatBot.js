import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { useFocusEffect } from '@react-navigation/native'
import { AuthContext } from '../navigation/AuthProvider'
import { translate } from '../i18n/locales/translate'
import { createChatbotSocket } from '../services/chatbotSocket'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CHAT_STORAGE_KEY = '@chatbot_history'
const SIX_WEEKS_MS = 6 * 7 * 24 * 60 * 60 * 1000

export default function ChatBot({ navigation }) {

  const { language, setIsTabBarVisible } = useContext(AuthContext)
  const t = (key) => language === "English" ? key.en : key.fr

  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const socketRef = useRef(null)

  // Animation des 3 dots
  const dot1 = useRef(new Animated.Value(0)).current
  const dot2 = useRef(new Animated.Value(0)).current
  const dot3 = useRef(new Animated.Value(0)).current

  // Charger l'historique depuis AsyncStorage
  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(CHAT_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        const now = Date.now()
        // Supprimer les messages de plus de 6 semaines
        const filtered = parsed.filter(msg => now - msg.timestamp < SIX_WEEKS_MS)
        if (filtered.length !== parsed.length) {
          await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(filtered))
        }
        return filtered
      }
    } catch (e) {
      console.log('Erreur chargement historique chatbot:', e)
    }
    return []
  }

  // Sauvegarder l'historique dans AsyncStorage
  const saveHistory = async (msgs) => {
    try {
      // Ne pas sauvegarder le message de bienvenue
      const toSave = msgs.filter(msg => !msg.isWelcome)
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(toSave))
    } catch (e) {
      console.log('Erreur sauvegarde historique chatbot:', e)
    }
  }

  // Cacher la tab bar
  useFocusEffect(
    React.useCallback(() => {
      setIsTabBarVisible(true)
      return () => {
        setIsTabBarVisible(false)
      }
    }, [])
  )

  // Connexion socket au serveur chatbot + chargement historique
  useEffect(() => {
    const init = async () => {
      const history = await loadHistory()

      const welcome = {
        id: 'welcome',
        text: t(translate.chatbot.welcome),
        sender: 'bot',
        isWelcome: true,
      }

      if (history.length > 0) {
        setMessages([...history, welcome])
      } else {
        setMessages([welcome])
      }
    }

    init()

    const s = createChatbotSocket()
    socketRef.current = s

    s.on('connect', () => {
      console.log('Chatbot connecté:', s.id)
    })

    s.on('chat_message', (response) => {
      const cleaned = typeof response === 'string'
        ? response.replace(/<[^>]*>/g, '')
        : String(response)

      const botMsg = {
        id: String(Date.now()),
        text: cleaned,
        sender: 'bot',
        timestamp: Date.now(),
      }

      setMessages((prev) => {
        const updated = [botMsg, ...prev]
        saveHistory(updated)
        return updated
      })
      setIsLoading(false)
    })

    s.on('connect_error', (err) => {
      console.log('Chatbot erreur:', err.message)
      setIsLoading(false)
    })

    s.connect()

    return () => {
      s.off('connect')
      s.off('chat_message')
      s.off('connect_error')
      s.removeAllListeners()
      s.disconnect()
      socketRef.current = null
    }
  }, [])

  // Mettre à jour le message de bienvenue quand la langue change
  useEffect(() => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.isWelcome ? { ...msg, text: t(translate.chatbot.welcome) } : msg
      )
    )
  }, [language])

  // Animation typing indicator
  useEffect(() => {
    if (!isLoading) return

    const createBounce = (dot, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -6, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      )
    }

    const a1 = createBounce(dot1, 0)
    const a2 = createBounce(dot2, 200)
    const a3 = createBounce(dot3, 400)

    a1.start()
    a2.start()
    a3.start()

    return () => {
      a1.stop()
      a2.stop()
      a3.stop()
      dot1.setValue(0)
      dot2.setValue(0)
      dot3.setValue(0)
    }
  }, [isLoading])

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || isLoading || !socketRef.current) return

    const userMsg = {
      id: String(Date.now()),
      text: trimmed,
      sender: 'user',
      timestamp: Date.now(),
    }

    setMessages((prev) => {
      const updated = [userMsg, ...prev]
      saveHistory(updated)
      return updated
    })

    setText('')
    setIsLoading(true)

    socketRef.current.emit('chat_message', trimmed)
  }

  const TypingIndicator = () => (
    <View style={styles.typingContainer}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View
          key={i}
          style={[styles.typingDot, { transform: [{ translateY: dot }] }]}
        />
      ))}
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.light_blue }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={{ flex: 1, flexDirection: 'column' }}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  source={require('../assets/images/left2.png')}
                  style={{ height: SIZES.h3, width: SIZES.h3, resizeMode: 'contain' }}
                />
              </TouchableOpacity>

              <View style={{ marginLeft: 30 }}>
                <MaterialCommunityIcons name="robot-outline" size={40} color={COLORS.primary} />
              </View>

              <View style={{ marginLeft: 15 }}>
                <Text style={styles.headerTitle}>{t(translate.chatbot.title)}</Text>
                <Text style={styles.headerSubtitle}>
                  {language === "English" ? "Online" : "En ligne"}
                </Text>
              </View>
            </View>
          </View>

          {/* Messages */}
          <View style={{ flex: 1 }}>
            <FlatList
              data={messages}
              inverted={true}
              contentContainerStyle={{ paddingVertical: 10 }}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={
                isLoading ? (
                  <View style={[styles.botBubble, { marginLeft: 15, marginTop: 3, paddingVertical: 18 }]}>
                    <TypingIndicator />
                  </View>
                ) : null
              }
              renderItem={({ item, index }) => {
                const isUser = item.sender === 'user'

                return (
                  <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    paddingLeft: isUser ? '30%' : 15,
                    paddingRight: !isUser ? '30%' : 15,
                  }}>
                    <View style={[
                      isUser ? styles.userBubble : styles.botBubble,
                      { marginTop: 3 }
                    ]}>
                      <Text style={isUser ? styles.userText : styles.botText}>
                        {item.text}
                      </Text>
                    </View>
                  </View>
                )
              }}
            />
          </View>

          {/* Input Bar */}
          <View style={styles.inputBar}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={t(translate.chatbot.placeholder)}
                placeholderTextColor="#bbb"
                multiline={true}
                onChangeText={setText}
                value={text}
                editable={!isLoading}
                style={styles.textInput}
              />
            </View>
            <TouchableOpacity
              onPress={handleSend}
              disabled={!text.trim() || isLoading}
              style={[
                styles.sendButton,
                (!text.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
            >
              <Feather name='send' color='#fff' size={SIZES.h4} />
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 55 : 25,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.h5,
    color: COLORS.primary,
    marginTop: Platform.OS === 'android' ? -3 : 0,
  },
  headerSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.h7,
    color: COLORS.orange,
    marginTop: Platform.OS === 'android' ? -3 : 0,
  },
  userBubble: {
    paddingVertical: Platform.OS === 'android' ? 10 : 15,
    paddingHorizontal: 15,
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    paddingVertical: Platform.OS === 'android' ? 10 : 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 4,
  },
  userText: {
    color: '#fff',
    fontSize: SIZES.h6,
    lineHeight: SIZES.h5,
    fontFamily: FONTS.regular,
  },
  botText: {
    color: COLORS.primary,
    fontSize: SIZES.h6,
    lineHeight: SIZES.h5,
    fontFamily: FONTS.regular,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
    marginHorizontal: 3,
  },
  inputBar: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    paddingVertical: Platform.OS === 'android' ? 10 : 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(245, 245, 245)',
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  textInput: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.h6,
    color: '#000',
    flex: 1,
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
})
