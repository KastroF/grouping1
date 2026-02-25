import { View, Text, StyleSheet, Image, Platform } from 'react-native'
import React, { useRef } from 'react'
import { FONTS, SIZES } from '../constants/theme'
import { useFetchFunctions } from '../infrastructures/functions'
import Animated, {
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const AnimatedPressable = Animated.createAnimatedComponent(View);

export default function Notification({message, notif, onClick, onClose, index = 0}) {

    const {timeAgo} = useFetchFunctions();
    const pressScale = useSharedValue(1);
    const hasAnimated = useRef(false);

    const tapGesture = Gesture.Tap()
      .onBegin(() => {
        pressScale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
      })
      .onFinalize(() => {
        pressScale.value = withSpring(1, { damping: 12, stiffness: 200 });
      })
      .onEnd(() => {
        if (onClick) runOnJS(onClick)();
      });

    const pressStyle = useAnimatedStyle(() => ({
      transform: [{ scale: pressScale.value }],
    }));

    return (
    <Animated.View entering={!hasAnimated.current ? FadeInRight.delay(index * 80).duration(400).springify().damping(18) : undefined} onLayout={() => { hasAnimated.current = true; }}>
    <GestureDetector gesture={tapGesture}>
    <AnimatedPressable style={[styles.viewBlock, pressStyle]}>
        <View style={styles.flexBoxx}>
        <View>
            <Image
                source={ notif ? require("../assets/images/Grouping.png") : message.user.photo ? {uri: message.user.photo} : require("../assets/images/user.png") }
                style={{
                    height: 40,
                    width: 40,
                    resizeMode: "cover",
                    borderRadius: 8
                }}
            />
        </View>
        <View style={{
            marginLeft: 7,
            flex: 1
        }}>
                <Text style={{
                    color: "#000",
                    fontSize: SIZES.h6,
                    fontFamily: FONTS.bold
                }}>
                   { notif ? "Administrateur" : message.user.name}
                </Text>
                <Text
                numberOfLines={ notif ? 3 : 1}
                style={{
                    marginTop: Platform.OS === "android" ? 10 : 15,
                    color: "#aaa",
                    fontFamily: FONTS.ligth,
                    fontSize: SIZES.h6,
                    lineHeight: SIZES.h5,
                    textAlign: "justify"
                }}>
                    { notif ?  message.body : message.firstMessage.text}
                </Text>
        </View>
       {notif ? <View style={{
            marginLeft: 15
        }}>
            <GestureDetector gesture={Gesture.Tap().onEnd(() => { if (onClose) runOnJS(onClose)(); })}>
            <Animated.View style={{
                marginLeft: -10,
                padding: 5,
            }}>
                <Image
                        source={require("../assets/images/close.png")}
                        style={{
                            height: 21,
                            width: 21,
                            resizeMode: "cover"
                        }}
                    />
            </Animated.View>
            </GestureDetector>
        </View> : null}

        </View>
        <View style={{
            flexDirection: "row",
            marginTop: 10,
            justifyContent: "flex-end"
        }} >
           <Text style={{
                 color: "#aaa",
                 fontFamily: FONTS.ligth,
                 fontSize: SIZES.h7,

           }}> { notif ? timeAgo(new Date(message.date)) : timeAgo(new Date(message.firstMessage.date)) } </Text>
        </View>
    </AnimatedPressable>
    </GestureDetector>
    </Animated.View>

  )
}


const styles = StyleSheet.create({

        viewBlock: {
            paddingHorizontal: 15,
            paddingVertical: 10,
            marginTop: 3,
            backgroundColor: "#fff",
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 4,
        },
        flexBoxx: {
            display: "flex",
            flexDirection: "row",
        }
})
