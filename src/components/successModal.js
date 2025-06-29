import React, { useState } from 'react'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
import { COLORS, FONTS, SIZES } from '../constants/theme';

export default function SuccessModal({onGoing, modalVisible}) {

   // const [modalVisible, setModalVisible] = useState(false);

  return (
    <Modal 
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {

                setModalVisible(false);
        }}
    >

        <View style={{
            flex: 1, 
            backgroundColor: "rgba(0,0,0,0.4)", 
            alignItems: "center", 
            justifyContent: "center"
        }}>
            <View style={{
                width: SIZES.width - 150, 
                paddingVertical: 25, 
                paddingHorizontal: 25, 
                backgroundColor: "#fff", 
                borderRadius: 8
            }}>

                <View  style={{
                    alignItems: "center"
                }}>
                    <Text style={{
                        textAlign: "center", 
                        color: COLORS.primary, 
                        fontFamily: FONTS.bold, 
                        fontSize: SIZES.h4 
                    }}>Félicitations</Text>
                </View>

                <View style={{
                    marginTop: 10
                }}>
                    <Text style={{
                        textAlign: "center", 
                        color: "#000", 
                        fontFamily: FONTS.regular, 
                        fontSize: SIZES.h5

                    }}>
                        Votre annonce est en cours de traitement, vous recevrez une notification sous 48h. 
                    </Text>
                </View>

                <TouchableOpacity onPress={onGoing} style={{
                    marginTop: 20, 
                    paddingVertical: 10, 
                    paddingHorizontal: 30, 
                    backgroundColor: COLORS.primary, 
                    borderRadius: 8, 
                    alignItems: "center"
                }}>
                    <Text style={{
                            fontSize: SIZES.h3, 
                            color: "#fff", 
                            fontFamily: FONTS.bold, 
                            textAlign: "center"
                    }} >
                        OK
                    </Text>

                </TouchableOpacity>

            </View>
        </View>

    </Modal>
  )
}
