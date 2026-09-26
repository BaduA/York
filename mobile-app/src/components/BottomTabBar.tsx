import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { Tab } from '../types';

const TABS: { key: Tab; label: string }[] = [
  { key: 'month', label: 'Bu Ay' },
  { key: 'classics', label: 'Klasikler' },
  { key: 'diy', label: 'Kendin Yap' },
  { key: 'cart', label: 'Sepet' },
];

export default function BottomTabBar() {
  const { state, setTab } = useApp();
  const insets = useSafeAreaInsets();
  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);

  return (
    <View style={[s.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map(tab => {
        const active = state.activeTab === tab.key;
        const isCart = tab.key === 'cart';
        return (
          <TouchableOpacity
            key={tab.key}
            style={s.tab}
            onPress={() => setTab(tab.key)}
            activeOpacity={0.7}
          >
            <View style={[s.indicator, active && s.indicatorActive]} />
            <Text style={[s.label, active && s.labelActive]}>{tab.label}</Text>
            {isCart && cartCount > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(10,10,10,0.92)',
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 7,
    minHeight: 44,
    position: 'relative',
  },
  indicator: {
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  indicatorActive: {
    backgroundColor: '#C8102E',
  },
  label: {
    fontSize: 11,
    fontFamily: 'Barlow_500Medium',
    color: 'rgba(255,255,255,0.62)',
  },
  labelActive: {
    fontFamily: 'Barlow_600SemiBold',
    color: '#fff',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: 12,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    backgroundColor: '#C8102E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'Barlow_700Bold',
  },
});
