import React, { useContext } from 'react'
import { Image, Platform, Text, View } from 'react-native'
import { COLORS, FONTS, MONTHS, SIZES } from '../constants/theme';
import { useFetchFunctions } from '../infrastructures/functions';
import { AuthContext } from '../navigation/AuthProvider';
import Entypo from "react-native-vector-icons/Entypo"
import Octicons from "react-native-vector-icons/Octicons"
import { translate } from '../i18n/locales/translate';
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const COUNTRY_ISO = {
    // Afrique centrale
    "Gabon": "GA", "Cameroun": "CM", "Tchad": "TD", "Congo": "CG",
    "République Centrafricaine": "CF", "Guinée Équatoriale": "GQ",
    "République Démocratique du Congo": "CD", "RDC": "CD",
    // Afrique de l'Ouest
    "Sénégal": "SN", "Côte d'Ivoire": "CI", "Mali": "ML",
    "Burkina Faso": "BF", "Niger": "NE", "Bénin": "BJ", "Togo": "TG",
    "Guinée": "GN", "Mauritanie": "MR", "Ghana": "GH", "Nigeria": "NG",
    "Liberia": "LR", "Sierra Leone": "SL", "Gambie": "GM",
    "Guinée-Bissau": "GW", "Cap-Vert": "CV",
    // Afrique de l'Est
    "Kenya": "KE", "Tanzanie": "TZ", "Ouganda": "UG", "Rwanda": "RW",
    "Burundi": "BI", "Éthiopie": "ET", "Somalie": "SO", "Djibouti": "DJ",
    "Érythrée": "ER", "Soudan": "SD", "Soudan du Sud": "SS",
    // Afrique australe
    "Afrique du Sud": "ZA", "Madagascar": "MG", "Mozambique": "MZ",
    "Angola": "AO", "Zambie": "ZM", "Zimbabwe": "ZW", "Namibie": "NA",
    "Botswana": "BW", "Malawi": "MW", "Eswatini": "SZ", "Lesotho": "LS",
    // Afrique du Nord
    "Maroc": "MA", "Tunisie": "TN", "Algérie": "DZ", "Libye": "LY",
    "Égypte": "EG",
    // Iles
    "Maurice": "MU", "Seychelles": "SC", "Comores": "KM",
    "São Tomé-et-Príncipe": "ST",
    // Europe de l'Ouest
    "France": "FR", "Allemagne": "DE", "Espagne": "ES", "Italie": "IT",
    "Belgique": "BE", "Pays-Bas": "NL", "Portugal": "PT", "Irlande": "IE",
    "Autriche": "AT", "Grèce": "GR", "Suisse": "CH", "Luxembourg": "LU",
    // Royaume-Uni et variantes
    "Royaume-Uni": "GB", "Angleterre": "GB", "England": "GB",
    "United Kingdom": "GB", "Grande-Bretagne": "GB",
    "Écosse": "GB", "Pays de Galles": "GB",
    // Europe du Nord
    "Suède": "SE", "Norvège": "NO", "Danemark": "DK", "Finlande": "FI",
    "Islande": "IS",
    // Europe de l'Est
    "Pologne": "PL", "Roumanie": "RO", "Hongrie": "HU",
    "République tchèque": "CZ", "Tchéquie": "CZ",
    "Slovaquie": "SK", "Bulgarie": "BG", "Croatie": "HR",
    "Serbie": "RS", "Slovénie": "SI", "Bosnie-Herzégovine": "BA",
    "Monténégro": "ME", "Albanie": "AL", "Macédoine du Nord": "MK",
    "Kosovo": "XK", "Moldavie": "MD", "Biélorussie": "BY",
    "Lituanie": "LT", "Lettonie": "LV", "Estonie": "EE",
    "Russie": "RU", "Ukraine": "UA",
    // Océanie
    "Australie": "AU", "Australia": "AU",
    "Nouvelle-Zélande": "NZ", "New Zealand": "NZ",
    // Amérique du Nord
    "États-Unis": "US", "USA": "US", "Etats-Unis": "US",
    "Canada": "CA", "Mexique": "MX",
    // Amérique du Sud
    "Brésil": "BR", "Argentine": "AR", "Colombie": "CO", "Chili": "CL",
    "Pérou": "PE", "Venezuela": "VE", "Équateur": "EC",
    "Bolivie": "BO", "Paraguay": "PY", "Uruguay": "UY",
    // Amérique centrale et Caraïbes
    "Cuba": "CU", "Haïti": "HT", "République Dominicaine": "DO",
    "Jamaïque": "JM", "Panama": "PA", "Costa Rica": "CR",
    "Guatemala": "GT", "Honduras": "HN",
    // Asie
    "Chine": "CN", "Japon": "JP", "Inde": "IN", "Corée du Sud": "KR",
    "Corée du Nord": "KP", "Thaïlande": "TH", "Vietnam": "VN",
    "Indonésie": "ID", "Malaisie": "MY", "Philippines": "PH",
    "Singapour": "SG", "Pakistan": "PK", "Bangladesh": "BD",
    "Sri Lanka": "LK", "Népal": "NP", "Myanmar": "MM", "Cambodge": "KH",
    // Moyen-Orient
    "Turquie": "TR", "Émirats arabes unis": "AE", "Arabie saoudite": "SA",
    "Liban": "LB", "Israël": "IL", "Jordanie": "JO", "Irak": "IQ",
    "Iran": "IR", "Syrie": "SY", "Qatar": "QA", "Koweït": "KW",
    "Oman": "OM", "Bahreïn": "BH", "Yémen": "YE",
};

const getFlag = (countryName) => {
    if (!countryName) return '';
    // Lookup insensible à la casse
    const key = Object.keys(COUNTRY_ISO).find(
        k => k.toLowerCase() === countryName.toLowerCase()
    );
    const iso = key ? COUNTRY_ISO[key] : null;
    if (!iso) return '';
    return iso.toUpperCase().replace(/./g, c =>
        String.fromCodePoint(c.charCodeAt(0) + 127397)
    );
};

export default function AnnounceBlock({status, date, startCity, endCity, city1, city2,
     company, userId, datee, views, goToModify, name, index = 0, onPress,
     startCountry, endCountry, ...rest}) {

    const {user, language} = useContext(AuthContext);
    const {timeAgo, timeAgoEN} = useFetchFunctions()
    const pressScale = useSharedValue(1);

    const tapGesture = Gesture.Tap()
      .onBegin(() => {
        pressScale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
      })
      .onFinalize(() => {
        pressScale.value = withSpring(1, { damping: 12, stiffness: 180 });
      })
      .onEnd(() => {
        if (onPress) runOnJS(onPress)();
      });

    const pressStyle = useAnimatedStyle(() => ({
      transform: [{ scale: pressScale.value }],
    }));

    const getFormattedDay = (date) => {
        const day = new Date(date).getDate();
        return day.toString().padStart(2, '0');
    };

    const MONTHS_EN = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      const formatDateEN = (date) => {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, "0");
        const month = MONTHS_EN[d.getMonth()];
        const year = d.getFullYear();

        return `${month} ${day}, ${year}`;
      };


  return (
    <Animated.View entering={FadeInUp.delay(index * 100).duration(450).springify().damping(18)}>
    <GestureDetector gesture={tapGesture}>
    <Animated.View  style={[{
        backgroundColor: "#fff",
        borderRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 10,
        marginTop: 5,
        shadowColor: "rgba(0,0,0,0.2)",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }, pressStyle]} {...rest} >

        <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start"
        }}>
        <View>
          <View  style={{
            paddingVertical: 2,
            paddingHorizontal: 2,
            borderRadius: 3,
            backgroundColor: COLORS.light_blue,
            flexDirection: "row",
            alignItems: "center"
          }}>
            <Image
                source={require("../assets/images/calendar.png")}
                style={{
                    height: SIZES.h8,
                    width: SIZES.h8,
                    resizeMode: "contain",
                    marginLeft: 2
                }}
            />
            <Text style={{
                fontFamily: FONTS.bold,
                color: COLORS.primary,
                fontSize: SIZES.h8,

            }}> {language === "English" ? translate.listingItem.dateDepart.en : translate.listingItem.dateDepart.fr}: {language === "English" ? formatDateEN(date) : `${getFormattedDay(date)} ${MONTHS[new Date(date).getMonth()]} ${new Date(date).getFullYear()}` } </Text>
          </View>

          </View>


            {user &&  user && user._id === userId  ? <GestureDetector gesture={Gesture.Tap().onEnd(() => { if(goToModify) runOnJS(goToModify)(status); })}>
            <Animated.View>
            <Text style={{
                fontFamily: FONTS.bold,
                fontSize: SIZES.h3,
                color: COLORS.primary
            }}>...</Text>
            </Animated.View>
            </GestureDetector> : null}

        </View>

        <View  style={{
            marginTop: 15,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row"
        }}>
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                width: "25%",
            }}>
                <View style={{ alignItems: "center", flex: 1 }}>
                    <Text style={{
                        color: COLORS.primary,
                        fontFamily: FONTS.bold,
                        fontSize: SIZES.h4
                    }}>{startCity && startCity.toUpperCase()}</Text>
                    <Text style={{
                        fontFamily: FONTS.ligth,
                        fontSize: SIZES.h7,
                        color: COLORS.primary,
                        textAlign: "center",
                        textTransform: "capitalize"
                    }}>
                        {startCountry || city1}
                    </Text>
                </View>
                {startCountry ? <Text style={{ fontSize: SIZES.h5, marginLeft: 2 }}>{getFlag(startCountry)}</Text> : null}
            </View>

            <View style={{
                marginLeft: 15
            }}>
                <View
                    style={{
                        padding: 2,
                        borderWidth: 1,
                        borderColor: "rgb(237, 112, 107)",
                        borderRadius: 100
                    }}
                 >
                    <View
                        style={{
                            padding: 3,
                            backgroundColor: "rgb(237, 112, 107)",
                            borderRadius: 100
                        }}
                    />
                </View>
            </View>
            <View style={{
                marginLeft: 7,
                marginTop: Platform.OS === "android" ? -2 : 0
            }}>
                <Text style={{
                    color: COLORS.primary,
                    fontFamily: FONTS.regular
                }}>-----</Text>
            </View>

            <View style={{
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderRadius: 100,
                backgroundColor: status === "container" ? COLORS.light_blue : COLORS.orange

            }}>
                <Image source={status === "container" ? require("../assets/images/container1.png") : require("../assets/images/avion3.png") }
                style={{
                    height: SIZES.h3,
                    width: SIZES.h3,
                    resizeMode: "contain"
                }} />

            </View>
            <View style={{

                marginTop: Platform.OS === "android" ? -2 : 0
            }}>
                <Text style={{
                    color: COLORS.primary,
                    fontFamily: FONTS.regular
                }}>-----</Text>
            </View>

            <View style={{
                marginLeft: 7
            }}>
                <View
                    style={{
                        padding: 2,
                        borderWidth: 1,
                        borderColor: "rgb(127, 223, 72)",
                        borderRadius: 100
                    }}
                 >
                    <View
                        style={{
                            padding: 3,
                            backgroundColor: "rgb(127, 223, 72)",
                            borderRadius: 100
                        }}
                    />
                </View>
            </View>

            <View style={{
                marginLeft: 15,
                flexDirection: "row",
                alignItems: "center",
                width: "25%"
            }}>
                {endCountry ? <Text style={{ fontSize: SIZES.h5, marginRight: 2 }}>{getFlag(endCountry)}</Text> : null}
                <View style={{ alignItems: "center", flex: 1 }}>
                    <Text style={{
                        color: COLORS.primary,
                        fontFamily: FONTS.bold,
                        fontSize: SIZES.h4
                    }}>{endCity && endCity.toUpperCase()}</Text>
                    <Text style={{
                        fontFamily: FONTS.ligth,
                        fontSize: SIZES.h7,
                        color: COLORS.primary,
                        textAlign: "center",
                        textTransform: "capitalize"
                    }}>
                        {endCountry || city2}
                    </Text>
                </View>
            </View>




        </View>
        <View style={{

                flexDirection: "row",
                marginTop: 20 ,
                alignItems: "center",
                justifyContent: "space-between"

        }}>

        <View>
            <View style={{
                flexDirection: "row",
                alignItems: "center"
            }}>
                <View style={{
                    backgroundColor: "rgb(222, 105, 43)",
                    height: 20,
                    width: 20
                }}

                />

            <View style={{
                    backgroundColor: COLORS.light_blue,
                    height: 20,
                    width: 20,
                    marginTop: 3,
                    marginLeft: -17
                }}

                />

                <View style={{
                    marginLeft: 10
                }}>
                    <Text style={{
                        fontFamily: FONTS.regular,
                        fontSize: SIZES.h8,
                        color: COLORS.primary,
                        textTransform: "capitalize"
                    }}>{company} {status === "container" && name}</Text>
                </View>

            </View>

            { user && user._id === userId  && <View style={{
            marginTop: 5
        }}>
            <View >
                 </View>
        </View> }
        </View>

           {user && user._id === userId && 1===2  ?  <GestureDetector gesture={Gesture.Tap().onEnd(() => {})}>
           <Animated.View style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                backgroundColor: COLORS.primary,
                borderRadius: 8
            }} >
                <Text style={{
                    color: "#fff",
                    fontSize: SIZES.h7,
                    fontFamily: FONTS.bold
                }}>Booster votre annonce </Text>
            </Animated.View>
            </GestureDetector> : <View style={{
                flexDirection: "row",
                alignItems: "center",
                display: "flex"
            }} >

                   { <Text style={{
                        fontFamily: FONTS.regular,
                        fontSize: SIZES.h7,
                        color: "rgba(0,0,0,0.6)"
                    }}> {language === "English" ? `Posted ${timeAgoEN(new Date(datee))}` : `Publiée ${timeAgo(new Date(datee))}`}</Text>}
                   { views && <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            display: "flex",
                            marginLeft: 2,


                        }} ><Entypo name='dot-single' size={SIZES.h5} color="rgba(0,0,0,0.6)"  />
                    <View>
                        <Text style={{
                             color: "rgba(0,0,0,0.6)",
                             fontSize: SIZES.h7,
                             fontFamily: FONTS.regular,
                             marginLeft: 2,
                             marginTop: 0
                        }}>{views} {views === 1 ? language === "English" ? "view" : "vue" : language === "English" ? "views" :  "vues"} <Octicons  name='eye' size={SIZES.h8} color="rgba(0,0,0,0.6)" /> </Text>
                    </View>
                    </View> }
                 </View>}

        </View>




    </Animated.View>
    </GestureDetector>
    </Animated.View>
  )
}
