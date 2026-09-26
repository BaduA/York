import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Barlow_400Regular,
  Barlow_500Medium,
  Barlow_600SemiBold,
  Barlow_700Bold,
} from '@expo-google-fonts/barlow';
import {
  BarlowCondensed_700Bold,
} from '@expo-google-fonts/barlow-condensed';
import {
  RubikDirt_400Regular,
} from '@expo-google-fonts/rubik-dirt';
import {
  Caveat_400Regular,
} from '@expo-google-fonts/caveat';

import { AppProvider } from './src/context/AppContext';
import { useApp } from './src/context/AppContext';
import BottomTabBar from './src/components/BottomTabBar';
import ThisMonthScreen from './src/screens/ThisMonthScreen';
import ClassicsScreen from './src/screens/ClassicsScreen';
import DIYScreen from './src/screens/DIYScreen';
import CartScreen from './src/screens/CartScreen';

function AppShell() {
  const { state } = useApp();
  const tab = state.activeTab;

  return (
    <View style={s.container}>
      <StatusBar style="light" />
      {tab === 'month'    && <ThisMonthScreen />}
      {tab === 'classics' && <ClassicsScreen />}
      {tab === 'diy'      && <DIYScreen />}
      {tab === 'cart'     && <CartScreen />}
      <BottomTabBar />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Barlow_400Regular,
    Barlow_500Medium,
    Barlow_600SemiBold,
    Barlow_700Bold,
    BarlowCondensed_700Bold,
    RubikDirt_400Regular,
    Caveat_400Regular,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
});
