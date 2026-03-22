import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { useFocusEffect } from '@react-navigation/native'
import { AuthContext } from '../navigation/AuthProvider'
import { translate } from '../i18n/locales/translate'
import { createChatbotSocket } from '../services/chatbotSocket'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const CHATBOT_URL = 'https://grouping.binaire-backend.tech'
const RESPONSE_TIMEOUT = 30000

export default function ChatBot({ navigation }) {

  const { language, setIsTabBarVisible, user, token } = useContext(AuthContext)
  const t = (key) => language === "English" ? key.en : key.fr

  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const socketRef = useRef(null)
  const timeoutRef = useRef(null)
  const flatListRef = useRef(null)

  // Animation des 3 dots
  const dot1 = useRef(new Animated.Value(0)).current
  const dot2 = useRef(new Animated.Value(0)).current
  const dot3 = useRef(new Animated.Value(0)).current

  const suggestions = [
    { fr: "Comment publier une annonce ?", en: "How do I post an ad?" },
    { fr: "Comment rechercher de l'espace ?", en: "How do I search for space?" },
    { fr: "Comment contacter un annonceur ?", en: "How do I contact an advertiser?" },
    { fr: "Comment fonctionne Grouping ?", en: "How does Grouping work?" },
  ]

  // Sanitiser le texte de réponse du bot (markdown simplifié + HTML)
  const sanitizeResponse = (response) => {
    if (typeof response !== 'string') return String(response)
    return response
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&nbsp;/g, ' ')
      // Markdown simplifié: ** bold ** -> texte simple
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .trim()
  }

  // Charger l'historique depuis le serveur
  const loadChatHistory = async (userId) => {
    try {
      const res = await fetch(`${CHATBOT_URL}/messages/${userId}`)
      if (!res.ok) return
      const history = await res.json()
      if (!Array.isArray(history) || history.length === 0) return

      const parsed = history.map((msg, index) => {
        const sender = msg.role === 'assistant' ? 'bot' : 'user'
        // Retirer le préfixe [CONTEXTE: ...] des messages utilisateur
        const content = sender === 'user'
          ? msg.content.replace(/^\[CONTEXTE:[^\]]*\]\n?/, '')
          : sanitizeResponse(msg.content)
        return {
          id: `history-${index}`,
          text: content,
          sender,
        }
      })

      // Inverser pour la FlatList inversée (plus récents en premier)
      setMessages([...parsed.reverse(), createWelcomeMessage()])
      setShowSuggestions(false)
    } catch (err) {
      // L'historique n'est pas critique
      console.log('Historique chatbot non disponible:', err.message)
    }
  }

  const createWelcomeMessage = () => ({
    id: 'welcome',
    text: t(translate.chatbot.welcome),
    sender: 'bot',
    isWelcome: true,
  })

  // Cacher la tab bar
  useFocusEffect(
    React.useCallback(() => {
      setIsTabBarVisible(true)
      return () => {
        setIsTabBarVisible(false)
      }
    }, [])
  )

  // Connexion socket au serveur chatbot
  useEffect(() => {
    setMessages([createWelcomeMessage()])
    setShowSuggestions(true)

    const s = createChatbotSocket()
    socketRef.current = s

    s.on('connect', () => {
      console.log('Chatbot connecté:', s.id)
      setIsConnected(true)

      // Enregistrer l'utilisateur et charger l'historique
      const userId = user?._id || null
      if (userId) {
        s.emit('register', userId)
        loadChatHistory(userId)
      }
    })

    s.on('disconnect', () => {
      console.log('Chatbot déconnecté')
      setIsConnected(false)
    })

    s.on('chat_message', (response) => {
      // Annuler le timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      const cleaned = sanitizeResponse(response)

      const botMsg = {
        id: String(Date.now()),
        text: cleaned,
        sender: 'bot',
        timestamp: Date.now(),
      }

      setMessages((prev) => [botMsg, ...prev])
      setIsLoading(false)
    })

    s.on('connect_error', (err) => {
      console.log('Chatbot erreur:', err.message)
      setIsConnected(false)
      setIsLoading(false)
    })

    s.connect()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      s.removeAllListeners()
      s.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [user?._id])

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

  const sendMessage = (messageText) => {
    const trimmed = messageText.trim()
    if (!trimmed || isLoading) return

    const userMsg = {
      id: String(Date.now()),
      text: trimmed,
      sender: 'user',
      timestamp: Date.now(),
    }

    setMessages((prev) => [userMsg, ...prev])
    setText('')
    setIsLoading(true)
    setShowSuggestions(false)

    if (!socketRef.current?.connected) {
      const errorMsg = {
        id: String(Date.now() + 1),
        text: t(translate.chatbot.connectionError),
        sender: 'bot',
        isError: true,
      }
      setMessages((prev) => [errorMsg, ...prev])
      setIsLoading(false)
      return
    }

    // Préfixer le contexte utilisateur pour l'IA (comme la version web)
    const ctx = `[CONTEXTE: plateforme=mobile, connecte=${user ? 'oui' : 'non'}${user?.name ? ', utilisateur=' + user.name : ''}]`
    socketRef.current.emit('chat_message', `${ctx}\n${trimmed}`)

    // Timeout de réponse
    timeoutRef.current = setTimeout(() => {
      const timeoutMsg = {
        id: String(Date.now() + 2),
        text: t(translate.chatbot.timeout),
        sender: 'bot',
        isError: true,
      }
      setMessages((prev) => [timeoutMsg, ...prev])
      setIsLoading(false)
    }, RESPONSE_TIMEOUT)
  }

  const handleSend = () => sendMessage(text)

  const handleSuggestionPress = (suggestion) => sendMessage(t(suggestion))

  const handleRetry = () => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current.connect()
    }
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

              <View style={{ marginLeft: 15, flex: 1 }}>
                <Text style={styles.headerTitle}>{t(translate.chatbot.title)}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.statusDot, isConnected ? styles.statusOnline : styles.statusOffline]} />
                  <Text style={[styles.headerSubtitle, !isConnected && { color: '#999' }]}>
                    {isConnected
                      ? (language === "English" ? "Online" : "En ligne")
                      : (language === "English" ? "Offline" : "Hors ligne")}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Messages */}
          <View style={{ flex: 1 }}>
            <FlatList
              ref={flatListRef}
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
              ListFooterComponent={
                showSuggestions && messages.length <= 1 ? (
                  <View style={styles.suggestionsContainer}>
                    {suggestions.map((suggestion, i) => (
                      <TouchableOpacity
                        key={i}
                        style={styles.suggestionButton}
                        onPress={() => handleSuggestionPress(suggestion)}
                      >
                        <Text style={styles.suggestionText}>{t(suggestion)}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null
              }
              renderItem={({ item }) => {
                const isUser = item.sender === 'user'
                const isError = item.isError

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
                      isError && styles.errorBubble,
                      { marginTop: 3 }
                    ]}>
                      <Text style={[
                        isUser ? styles.userText : styles.botText,
                        isError && styles.errorText,
                      ]}>
                        {item.text}
                      </Text>
                    </View>
                  </View>
                )
              }}
            />
          </View>

          {/* Reconnect banner */}
          {!isConnected && (
            <TouchableOpacity onPress={handleRetry} style={styles.reconnectBar}>
              <Feather name="wifi-off" size={14} color="#fff" />
              <Text style={styles.reconnectText}>
                {language === "English" ? "Connection lost" : "Connexion perdue"}
              </Text>
              <View style={styles.reconnectButton}>
                <Feather name="refresh-cw" size={12} color={COLORS.primary} />
                <Text style={styles.reconnectButtonText}>
                  {language === "English" ? "Retry" : "Reconnecter"}
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Input Bar */}
          <View style={styles.inputBar}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder={language === "English" ? "Ask me a question..." : "Posez-moi une question..."}
                placeholderTextColor="#bbb"
                multiline={true}
                onChangeText={setText}
                value={text}
                editable={!isLoading && isConnected}
                style={styles.textInput}
              />
            </View>
            <TouchableOpacity
              onPress={handleSend}
              disabled={!text.trim() || isLoading || !isConnected}
              style={[
                styles.sendButton,
                (!text.trim() || isLoading || !isConnected) && styles.sendButtonDisabled,
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
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusOnline: {
    backgroundColor: '#22c55e',
  },
  statusOffline: {
    backgroundColor: '#999',
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
  errorBubble: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
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
  errorText: {
    color: '#dc2626',
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
  suggestionsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.middle_blue,
  },
  suggestionText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.h7,
    color: COLORS.primary,
  },
  reconnectBar: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    gap: 8,
  },
  reconnectText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.h7,
    color: '#fff',
    flex: 1,
  },
  reconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 4,
  },
  reconnectButtonText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.h7,
    color: COLORS.primary,
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
