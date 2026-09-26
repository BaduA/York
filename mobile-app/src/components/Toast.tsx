import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

interface Props {
  message: string;
  bottomOffset?: number;
}

export default function Toast({ message, bottomOffset = 104 }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(10)).current;
  const visible = !!message;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      opacity.setValue(0);
      translateY.setValue(10);
    }
  }, [visible, message]);

  if (!visible) return null;

  return (
    <Animated.View style={[s.toast, { bottom: bottomOffset, opacity, transform: [{ translateY }] }]}>
      <Text style={s.text}>{message}</Text>
      <Text style={s.sub}>Sepete git</Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 24,
    right: 24,
    padding: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#C8102E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 40,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Barlow_600SemiBold',
  },
  sub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12.5,
    fontFamily: 'Barlow_600SemiBold',
  },
});
