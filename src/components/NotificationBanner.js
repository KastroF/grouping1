import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Platform, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const BANNER_HEIGHT = Platform.OS === 'ios' ? 130 : 100;
const SPRING_CONFIG = { damping: 18, stiffness: 160, mass: 0.8 };

export default function NotificationBanner({ isVisible, onClose, onPress, title, body }) {
  const translateY = useSharedValue(-BANNER_HEIGHT - 30);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  const dismiss = useCallback(() => {
    translateY.value = withTiming(-BANNER_HEIGHT - 30, { duration: 250, easing: Easing.inOut(Easing.ease) });
    opacity.value = withTiming(0, { duration: 200 });
    scale.value = withTiming(0.95, { duration: 200 });
    setTimeout(() => { onClose?.(); }, 260);
  }, [onClose]);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, SPRING_CONFIG);
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, SPRING_CONFIG);

      const timer = setTimeout(() => {
        dismiss();
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      translateY.value = withTiming(-BANNER_HEIGHT - 30, { duration: 250 });
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.95, { duration: 200 });
    }
  }, [isVisible]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY < 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY < -40 || e.velocityY < -500) {
        translateY.value = withTiming(-BANNER_HEIGHT - 30, { duration: 200 });
        opacity.value = withTiming(0, { duration: 200 });
        scale.value = withTiming(0.95, { duration: 200 });
        runOnJS(onClose)();
      } else {
        translateY.value = withSpring(0, SPRING_CONFIG);
      }
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    if (onPress) {
      runOnJS(onPress)();
    } else {
      runOnJS(dismiss)();
    }
  });

  const composed = Gesture.Race(panGesture, tapGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  if (!isVisible && opacity.value === 0) return null;

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.banner}>
          <View style={styles.iconContainer}>
            <Image
              source={require('../assets/images/Grouping.png')}
              style={styles.icon}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title || 'Nouvelle notification'}
            </Text>
            <Text style={styles.body} numberOfLines={2}>
              {body}
            </Text>
          </View>
          <View style={styles.pill} />
        </View>
        <View style={styles.handleBar} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  banner: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginTop: Platform.OS === 'ios' ? 50 : 12,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    gap: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.light_blue || '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: 36,
    width: 28,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: COLORS.primary,
    fontSize: SIZES.h5,
    fontFamily: FONTS.bold,
  },
  body: {
    color: '#666',
    marginTop: 3,
    fontFamily: FONTS.regular,
    fontSize: SIZES.h6,
    lineHeight: SIZES.h5,
  },
  pill: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D0D0D0',
    alignSelf: 'center',
    marginTop: 8,
  },
});
