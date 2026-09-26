import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import Toast from '../components/Toast';

const SEASONAL = [
  { id: 'oak', name: 'Oak Jungle', ing: 'Viski, pandan, meşe dumanı', price: 575, premium: false },
  { id: 'esp', name: 'Espresso Martini', ing: 'Vodka, espresso, kahve likörü', price: 580, premium: false },
  { id: 'gold', name: 'Altın Muson', ing: 'Rom, tamarind, altın varak', price: 620, premium: true },
];

// Red lattice corner accent (top-right)
function LatticeCorner({ size = 96 }: { size?: number }) {
  return (
    <>
      <View style={[ls.h1, { width: size }]} />
      <View style={[ls.v1, { height: size }]} />
      <View style={[ls.h2, { width: size - 16 }]} />
      <View style={[ls.v2, { height: size - 16 }]} />
      <View style={[ls.h3, { width: (size - 16) / 2 }]} />
    </>
  );
}

export default function ThisMonthScreen() {
  const { state, addItem } = useApp();
  const insets = useSafeAreaInsets();
  const added = state.addedKeys;

  const heroAdded = !!added['hero'];
  const toastBottomOffset = 104;

  return (
    <View style={s.screen}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <View>
            <View style={s.headerTopRow}>
              <Text style={s.brush}>bu ayın</Text>
              <Text style={s.subtitle}>imza serisi</Text>
            </View>
            <Text style={s.screenTitle}>BU AYIN{'\n'}KOKTEYLLERİ</Text>
          </View>
          <View style={s.infoBtn}>
            <View style={s.infoDot} />
          </View>
        </View>

        {/* Hero card */}
        <View style={s.heroCard}>
          {/* Image placeholder */}
          <View style={s.heroImage}>
            <Text style={s.heroImageLabel}>kokteyl fotoğrafı 3:4</Text>
            <LinearGradient
              colors={['transparent', 'rgba(18,18,18,0.65)', '#121212']}
              style={s.heroGradient}
              locations={[0.28, 0.66, 1]}
            />
            <LatticeCorner size={96} />
            <View style={s.heroBadge}>
              <Text style={s.heroBadgeText}>EYLÜL İMZASI</Text>
            </View>
          </View>

          {/* Hero content */}
          <View style={s.heroContent}>
            <Text style={s.heroName}>York Sunrise</Text>
            <Text style={s.heroDesc}>
              Cin, yuzu, nar şerbeti ve bir tutam Sichuan biberi — şafak gibi kızıl, akşam gibi uzun.
            </Text>
            <View style={s.heroRow}>
              <Text style={s.heroPrice}>575₺</Text>
              <TouchableOpacity
                style={[s.heroBtn, heroAdded && s.heroBtnDone]}
                onPress={() => addItem('hero', 'York Sunrise', 575, 'Cin, yuzu, nar şerbeti')}
                activeOpacity={0.85}
              >
                <Text style={s.heroBtnText}>{heroAdded ? 'Eklendi ✓' : 'Ekle'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Seasonal header */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>MEVSİMLİKLER</Text>
          <TouchableOpacity><Text style={s.sectionAll}>Tümü</Text></TouchableOpacity>
        </View>

        {/* Seasonal horizontal scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.seasonalRow}
        >
          {SEASONAL.map(item => {
            const k = item.id;
            const isAdded = !!added[k];
            const gold = item.premium;
            return (
              <View key={k} style={[s.seasonCard, gold && s.seasonCardGold]}>
                <View style={[s.seasonImage, gold && s.seasonImageGold]}>
                  <Text style={[s.seasonImageLabel, gold && s.seasonImageLabelGold]}>
                    {item.name.toLowerCase()}
                  </Text>
                  {gold && (
                    <View style={s.premiumBadge}>
                      <Text style={s.premiumText}>PREMIUM</Text>
                    </View>
                  )}
                </View>
                <View style={s.seasonBody}>
                  <Text style={[s.seasonName, gold && s.seasonNameGold]}>{item.name.toUpperCase()}</Text>
                  <Text style={s.seasonIng}>{item.ing}</Text>
                  <View style={s.seasonRow}>
                    <Text style={[s.seasonPrice, gold && s.seasonPriceGold]}>{item.price}₺</Text>
                    <TouchableOpacity
                      style={[
                        s.seasonBtn,
                        isAdded && (gold ? s.seasonBtnDoneGold : s.seasonBtnDone),
                        gold && s.seasonBtnGold,
                      ]}
                      onPress={() => addItem(k, item.name, item.price, item.ing)}
                      activeOpacity={0.8}
                    >
                      <Text style={[s.seasonBtnText, gold && s.seasonBtnTextGold]}>
                        {isAdded ? 'Eklendi' : 'Ekle'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <Text style={s.quote}>"We will wok you."</Text>
      </ScrollView>

      <Toast message={state.toast} bottomOffset={toastBottomOffset} />
    </View>
  );
}

const ls = StyleSheet.create({
  h1: { position: 'absolute', top: 0, right: 0, height: 3, backgroundColor: '#C8102E' },
  v1: { position: 'absolute', top: 0, right: 0, width: 3, backgroundColor: '#C8102E' },
  h2: { position: 'absolute', top: 16, right: 16, height: 3, backgroundColor: '#C8102E' },
  v2: { position: 'absolute', top: 16, right: 16, width: 3, backgroundColor: '#C8102E' },
  h3: { position: 'absolute', top: 32, right: 32, height: 3, backgroundColor: '#C8102E' },
});

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  scroll: { flex: 1 },

  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 6,
  },
  brush: {
    fontFamily: 'Caveat_400Regular',
    fontSize: 22,
    color: '#C8102E',
    lineHeight: 26,
  },
  subtitle: {
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'Barlow_600SemiBold',
  },
  screenTitle: {
    fontFamily: 'RubikDirt_400Regular',
    fontSize: 34,
    lineHeight: 34,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    flexShrink: 0,
  },
  infoDot: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.55)',
    borderRadius: 7,
  },

  // Hero card
  heroCard: {
    marginHorizontal: 24,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  heroImage: {
    height: 300,
    backgroundColor: '#181818',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroImageLabel: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 10.5,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
  },
  heroGradient: {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    height: 120,
  },
  heroBadge: {
    position: 'absolute',
    top: 24,
    left: 24,
    backgroundColor: '#C8102E',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  heroBadgeText: {
    fontFamily: 'Barlow_700Bold',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#fff',
  },
  heroContent: {
    padding: 24,
    paddingTop: 0,
  },
  heroName: {
    fontFamily: 'RubikDirt_400Regular',
    fontSize: 32,
    color: '#fff',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: -16,
  },
  heroDesc: {
    fontSize: 14.5,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.68)',
    marginBottom: 20,
    maxWidth: 280,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heroPrice: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 30,
    color: '#fff',
    letterSpacing: 0.5,
  },
  heroBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#C8102E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBtnDone: {
    backgroundColor: '#1f1f1f',
  },
  heroBtnText: {
    fontFamily: 'Barlow_600SemiBold',
    fontSize: 16,
    color: '#fff',
    letterSpacing: 0.3,
  },

  // Seasonal
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 14,
  },
  sectionTitle: {
    fontFamily: 'Barlow_700Bold',
    fontSize: 13,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.5)',
  },
  sectionAll: {
    fontFamily: 'Barlow_600SemiBold',
    fontSize: 12.5,
    color: '#C8102E',
  },
  seasonalRow: {
    paddingHorizontal: 24,
    gap: 16,
    paddingBottom: 8,
  },
  seasonCard: {
    width: 216,
    backgroundColor: '#121212',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  seasonCardGold: {
    borderColor: 'rgba(212,175,122,0.32)',
  },
  seasonImage: {
    height: 150,
    backgroundColor: '#181818',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seasonImageGold: {
    backgroundColor: '#17140f',
  },
  seasonImageLabel: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 9.5,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.28)',
  },
  seasonImageLabelGold: {
    color: 'rgba(212,175,122,0.4)',
  },
  premiumBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderWidth: 1,
    borderColor: 'rgba(212,175,122,0.5)',
    borderRadius: 3,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  premiumText: {
    fontFamily: 'Barlow_700Bold',
    fontSize: 9,
    letterSpacing: 2,
    color: '#D4AF7A',
  },
  seasonBody: {
    padding: 16,
  },
  seasonName: {
    fontFamily: 'RubikDirt_400Regular',
    fontSize: 18,
    lineHeight: 20,
    color: '#fff',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  seasonNameGold: {
    color: '#D4AF7A',
  },
  seasonIng: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 12.5,
    lineHeight: 17,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 16,
  },
  seasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seasonPrice: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 21,
    color: '#fff',
  },
  seasonPriceGold: {
    color: '#D4AF7A',
  },
  seasonBtn: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seasonBtnDone: {
    backgroundColor: '#242424',
    borderColor: 'rgba(255,255,255,0.22)',
  },
  seasonBtnGold: {
    borderColor: 'rgba(212,175,122,0.45)',
  },
  seasonBtnDoneGold: {
    backgroundColor: 'rgba(212,175,122,0.16)',
  },
  seasonBtnText: {
    fontFamily: 'Barlow_600SemiBold',
    fontSize: 13,
    color: '#fff',
  },
  seasonBtnTextGold: {
    color: '#D4AF7A',
  },

  quote: {
    marginHorizontal: 24,
    marginTop: 32,
    fontFamily: 'Caveat_400Regular',
    fontSize: 17,
    color: 'rgba(255,255,255,0.22)',
    lineHeight: 22,
  },
});
