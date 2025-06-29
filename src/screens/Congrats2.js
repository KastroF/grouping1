import React, { useState } from 'react'
import { Image, Text, View } from 'react-native'
import Button1 from '../components/Button1'
import Loading from '../components/Loading';
import { COLORS, FONTS, SIZES } from '../constants/theme'

export default function Congrats2({navigation}) {

    const [good, setGood] = useState(false);
    const [MyAnnouncementStack, setMyAnnouncementStack] = useState(null);

    const loadMyAnnouncementStack = async () => {
      const module = await import('../navigation/MyAnnouncementStack');
      setMyAnnouncementStack(() => module.default);
    };
    

    if (good) {

        if (!MyAnnouncementStack) {
          loadMyAnnouncementStack();
          return <Loading />
        }
        return <MyAnnouncementStack />;
      }
    
  return (
   
    <View style={{
        alignItems: "center", 
        justifyContent: "space-around", 
        backgroundColor: "#fff", 
        flex: 1, 
        paddingVertical: 115,
        paddingHorizontal: 30
    }}>
        
        <View style={{
    
        }}>
            <Text style={{
                fontFamily: FONTS.bold, 
                fontSize: SIZES.h2, 
                color: COLORS.primary, 
                textAlign: "center"
                
            }}>

            
                Félicitations !
            </Text>
            <Text style={{
                    fontFamily: FONTS.regular, 
                    color: COLORS.primary, 
                    fontSize: SIZES.h5, 
                    textAlign: "center", 
                    marginTop: 5
                }}>
                Votre annonce a été ajoutée avec succès, vous pouvez la consulter en cliquant sur le bouton ci-dessous.
                Si c'est une annonce pour conteneur, vous devriez attendre une validation avant publication.
            </Text>
         </View>


            <Image 
                source={require("../assets/images/congrats2.png")}
                style={{
                    width: "80%", 
                    height: SIZES.height/2, 
                    resizeMode: "contain"
                }}
            />

        <View style={{width: "100%"}}>
            <Button1 label="Mes annonces" backgroundColor={COLORS.primary} 
            textColor="#fff" fontFamily={FONTS.regular} fontSize={SIZES.h2}  
            onPress={() => {setGood(true)}}
            borderRadius={10}/>
        </View>
 

    </View>

  )
}
