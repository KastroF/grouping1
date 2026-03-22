import React, { useContext, useState } from 'react'
import { ActivityIndicator, Image, Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { COLORS, FONTS, SIZES } from '../constants/theme'
import { AuthContext } from '../navigation/AuthProvider'
import Button1 from '../components/Button1'
import ErrorMessage from '../components/ErrorMessage'
import { useFetchFunctions } from '../infrastructures/functions'
import { API } from '../config/api'
import Feather from 'react-native-vector-icons/Feather'

export default function Parrainage({ navigation }) {

  const { token, language, setAccount, idd, setIdd, setUserId } = useContext(AuthContext)
  const { postFunction } = useFetchFunctions()
  const [isSponsored, setIsSponsored] = useState(null) // null = not chosen, true = yes, false = no
  const [sponsorCode, setSponsorCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const t = (key) => language === 'English' ? key.en : key.fr

  const skipToApp = () => {
    setAccount(false)
    setUserId(idd)
    setIdd(null)
  }

  const goToCongrats = () => {
    navigation.navigate('Congrats')
  }

  const validateSponsorCode = () => {
    setErrorMessage('')

    if (!sponsorCode.trim()) {
      setErrorMessage(t({
        fr: 'Veuillez entrer le code de parrainage.',
        en: 'Please enter the referral code.'
      }))
      return
    }

    setLoading(true)

    postFunction(API.USER_APPLY_REFERRAL, { referralCode: sponsorCode.trim().toUpperCase() }, token)
      .then((data) => {
        setLoading(false)

        if (data && data.status === 0) {
          goToCongrats()
        } else {
          setErrorMessage(data?.message || t({
            fr: 'Code de parrainage invalide.',
            en: 'Invalid referral code.'
          }))
        }
      }, (err) => {
        console.log(err)
        setLoading(false)
        setErrorMessage(t({
          fr: 'Erreur de connexion. Veuillez réessayer.',
          en: 'Connection error. Please try again.'
        }))
      })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 30,
          paddingVertical: 40,
          justifyContent: 'center',
        }}
      >
        {/* Icon */}
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(255,255,255,0.15)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Feather name="users" size={40} color="#fff" />
          </View>
        </View>

        {/* Title */}
        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <Text style={{
            fontFamily: FONTS.bold,
            fontSize: 26,
            color: '#fff',
            textAlign: 'center',
          }}>
            {t({ fr: 'Parrainage', en: 'Referral' })}
          </Text>
        </View>

        {/* Subtitle */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Text style={{
            fontFamily: FONTS.regular,
            fontSize: SIZES.h5,
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'center',
          }}>
            {t({
              fr: 'Avez-vous été parrainé par un utilisateur Grouping ?',
              en: 'Were you referred by a Grouping user?'
            })}
          </Text>
        </View>

        {isSponsored === null && (
          <View>
            {/* Yes button */}
            <TouchableOpacity
              onPress={() => setIsSponsored(true)}
              style={{
                backgroundColor: '#fff',
                paddingVertical: 18,
                borderRadius: 15,
                alignItems: 'center',
                marginBottom: 15,
              }}
            >
              <Text style={{
                fontFamily: FONTS.bold,
                fontSize: SIZES.h3,
                color: COLORS.primary,
              }}>
                {t({ fr: 'Oui, j\'ai un code', en: 'Yes, I have a code' })}
              </Text>
            </TouchableOpacity>

            {/* No button */}
            <TouchableOpacity
              onPress={goToCongrats}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                paddingVertical: 18,
                borderRadius: 15,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.4)',
              }}
            >
              <Text style={{
                fontFamily: FONTS.regular,
                fontSize: SIZES.h3,
                color: '#fff',
              }}>
                {t({ fr: 'Non, continuer', en: 'No, continue' })}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isSponsored === true && (
          <View>
            {/* Referral code input */}
            <View style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              borderRadius: 15,
              paddingHorizontal: 20,
              paddingVertical: Platform.OS === 'android' ? 5 : 15,
              marginBottom: 15,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.3)',
            }}>
              <Text style={{
                fontFamily: FONTS.bold,
                fontSize: SIZES.h6,
                color: 'rgba(255,255,255,0.7)',
                marginBottom: Platform.OS === 'android' ? 0 : 5,
              }}>
                {t({ fr: 'Code de parrainage', en: 'Referral code' })}
              </Text>
              <TextInput
                placeholder={t({ fr: 'Ex: GRP-AB12CD', en: 'E.g: GRP-AB12CD' })}
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={sponsorCode}
                onChangeText={(text) => setSponsorCode(text.toUpperCase())}
                autoCapitalize="characters"
                style={{
                  fontFamily: FONTS.bold,
                  fontSize: SIZES.h2,
                  color: '#fff',
                  letterSpacing: 2,
                  paddingVertical: Platform.OS === 'android' ? 5 : 0,
                }}
              />
            </View>

            {errorMessage ? <ErrorMessage errorMessage={errorMessage} /> : null}

            {/* Validate button */}
            <TouchableOpacity
              onPress={validateSponsorCode}
              disabled={loading}
              style={{
                backgroundColor: '#fff',
                paddingVertical: 18,
                borderRadius: 15,
                alignItems: 'center',
                marginBottom: 15,
                marginTop: 10,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.primary} />
              ) : (
                <Text style={{
                  fontFamily: FONTS.bold,
                  fontSize: SIZES.h3,
                  color: COLORS.primary,
                }}>
                  {t({ fr: 'Valider le code', en: 'Validate code' })}
                </Text>
              )}
            </TouchableOpacity>

            {/* Skip button */}
            <TouchableOpacity
              onPress={goToCongrats}
              style={{
                alignItems: 'center',
                paddingVertical: 10,
              }}
            >
              <Text style={{
                fontFamily: FONTS.regular,
                fontSize: SIZES.h5,
                color: 'rgba(255,255,255,0.7)',
                textDecorationLine: 'underline',
              }}>
                {t({ fr: 'Passer cette étape', en: 'Skip this step' })}
              </Text>
            </TouchableOpacity>

            {/* Back to choice */}
            <TouchableOpacity
              onPress={() => { setIsSponsored(null); setErrorMessage(''); setSponsorCode(''); }}
              style={{
                alignItems: 'center',
                paddingVertical: 5,
              }}
            >
              <Text style={{
                fontFamily: FONTS.regular,
                fontSize: SIZES.h6,
                color: 'rgba(255,255,255,0.5)',
              }}>
                {t({ fr: 'Retour', en: 'Back' })}
              </Text>
            </TouchableOpacity>
          </View>
        )}

      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}
