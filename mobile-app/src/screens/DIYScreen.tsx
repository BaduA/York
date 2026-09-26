import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import GlassView from '../components/GlassView';
import Toast from '../components/Toast';
import { BASES, MODS, MIXERS, GARNISHES, isClash, colorOf, priceOf } from '../data';

const STEPS = ['Baz Spirit', 'Likör', 'Mixer', 'Süsleme'];

function buildLayers(
  base: string | null,
  mod: string | null,
  mixer: string | null,
): { color: string; height: number }[] {
  const layers: { color: string; height: number }[] = [];
  if (mixer) layers.push({ color: colorOf(MIXERS, mixer), height: 54 });
  if (base)  layers.push({ color: colorOf(BASES, base),   height: 64 });
  if (mod) {
    const modList = base ? (MODS[base] ?? []) : [];
    layers.push({ color: colorOf(modList as [string, number, string][], mod), height: 30 });
  }
  return layers;
}

function calcPrice(
  base: string | null,
  mod: string | null,
  mixer: string | null,
  garnish: string[],
): number {
  const bp = base  ? priceOf(BASES,                       base)  : 0;
  const mp = mod   ? priceOf(base ? MODS[base] ?? [] : [], mod)  : 0;
  const xp = mixer ? priceOf(MIXERS,                      mixer) : 0;
  const gp = garnish.reduce((acc, g) => acc + priceOf(GARNISHES as [string,number][], g), 0);
  return bp + mp + xp + gp;
}

export default function DIYScreen() {
  const { state, pickBase, pickMod, pickMixer, pickGarnish, setDiyName, addItem } = useApp();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(() => state.diy.base ? 1 : 0);
  const { base, mod, mixer, garnish, name } = state.diy;

  const layers = buildLayers(base, mod, mixer);
  const iceVisible = !!mixer || !!base;
  const price = calcPrice(base, mod, mixer, garnish);
  const clash = isClash(mod ?? base, mixer);
  const canAdd = !!base;

  const modList: [string, number, string][] = base ? (MODS[base] ?? []) : [];

  const handlePickBase = (val: string) => {
    pickBase(val);
    if (step === 0) setStep(1);
  };

  const handleAddToCart = () => {
    if (!canAdd) return;
    const parts = [base, mod, mixer, ...garnish].filter(Boolean);
    const ing = parts.join(' · ');
    const label = name.trim() || (base ? `Tarifim: ${base}` : 'Kendi Tarifim');
    addItem(`diy-${Date.now()}`, label, price, ing);
  };

  return (
    <View style={s.screen}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={s.header}>
          <View>
            <View style={s.headerTopRow}>
              <Text style={s.brush}>yarat</Text>
              <Text style={s.subtitle}>kendi tarifin</Text>
            </View>
            <Text style={s.screenTitle}>KENDİN YAP</Text>
          </View>
        </View>

        {/* Glass + price row */}
        <View style={s.glassRow}>
          <GlassView layers={layers} iceVisible={iceVisible} />
          <View style={s.glassInfo}>
            <Text style={s.priceLabel}>tahmini fiyat</Text>
            <Text style={s.priceValue}>{price > 0 ? `${price}₺` : '—'}</Text>
            {clash && (
              <View style={s.clashBadge}>
                <Text style={s.clashText}>uyumsuz kombinasyon</Text>
              </View>
            )}
            {base && (
              <View style={s.selectionSummary}>
                {[base, mod, mixer].filter(Boolean).map(x => (
                  <Text key={x} style={s.selSumItem}>{x}</Text>
                ))}
                {garnish.map(g => (
                  <Text key={g} style={s.selSumItem}>{g}</Text>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Step dots */}
        <View style={s.stepDots}>
          {STEPS.map((label, i) => (
            <TouchableOpacity
              key={i}
              style={s.dotWrap}
              onPress={() => setStep(i)}
              activeOpacity={0.7}
            >
              <View style={[s.dot, step === i && s.dotActive, i < step && s.dotDone]} />
              <Text style={[s.dotLabel, step === i && s.dotLabelActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Step content */}
        <View style={s.stepContent}>
          <Text style={s.stepTitle}>{STEPS[step].toUpperCase()} SEÇ</Text>

          {step === 0 && (
            <View style={s.chipsGrid}>
              {BASES.map(([bname]) => (
                <TouchableOpacity
                  key={bname}
                  style={[s.chipLg, base === bname && s.chipLgActive]}
                  onPress={() => handlePickBase(bname)}
                  activeOpacity={0.75}
                >
                  <Text style={[s.chipLgText, base === bname && s.chipLgTextActive]}>{bname}</Text>
                  <Text style={[s.chipLgPrice, base === bname && s.chipLgPriceActive]}>
                    {priceOf(BASES, bname)}₺
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {step === 1 && (
            <>
              {!base && (
                <Text style={s.stepHint}>Önce baz spirit seçin</Text>
              )}
              {base && modList.length === 0 && (
                <Text style={s.stepHint}>Bu baz için likör yok</Text>
              )}
              {base && modList.length > 0 && (
                <View style={s.chipsWrap}>
                  {modList.map(([mname, mprice]) => (
                    <TouchableOpacity
                      key={mname}
                      style={[s.chip, mod === mname && s.chipActive]}
                      onPress={() => pickMod(mname)}
                      activeOpacity={0.75}
                    >
                      <Text style={[s.chipText, mod === mname && s.chipTextActive]}>{mname}</Text>
                      <Text style={[s.chipSub, mod === mname && s.chipSubActive]}>+{mprice}₺</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={[s.chip, !mod && s.chipSkip]}
                    onPress={() => { pickMod(mod ?? ''); setStep(2); }}
                    activeOpacity={0.75}
                  >
                    <Text style={s.chipSkipText}>Likörsüz</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {step === 2 && (
            <View style={s.chipsWrap}>
              {MIXERS.map(([mxname, mxprice]) => {
                const bad = isClash(mod ?? base, mxname);
                return (
                  <TouchableOpacity
                    key={mxname}
                    style={[s.chip, mixer === mxname && s.chipActive, bad && s.chipClash]}
                    onPress={() => pickMixer(mxname)}
                    activeOpacity={0.75}
                  >
                    <Text style={[s.chipText, mixer === mxname && s.chipTextActive, bad && s.chipClashText]}>
                      {mxname}
                    </Text>
                    <Text style={[s.chipSub, mixer === mxname && s.chipSubActive]}>+{mxprice}₺</Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                style={[s.chip, !mixer && s.chipSkip]}
                onPress={() => { pickMixer(mixer ?? ''); setStep(3); }}
                activeOpacity={0.75}
              >
                <Text style={s.chipSkipText}>Mixersiz</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <>
              <Text style={s.multiHint}>Birden fazla seçebilirsin</Text>
              <View style={s.chipsWrap}>
                {GARNISHES.map(([gname, gprice]) => (
                  <TouchableOpacity
                    key={gname}
                    style={[s.chip, garnish.includes(gname) && s.chipActive]}
                    onPress={() => pickGarnish(gname)}
                    activeOpacity={0.75}
                  >
                    <Text style={[s.chipText, garnish.includes(gname) && s.chipTextActive]}>{gname}</Text>
                    {gprice > 0 && (
                      <Text style={[s.chipSub, garnish.includes(gname) && s.chipSubActive]}>+{gprice}₺</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={s.nameInput}>
                <TextInput
                  style={s.nameField}
                  value={name}
                  onChangeText={setDiyName}
                  placeholder="Tarifine bir isim ver…"
                  placeholderTextColor="rgba(255,255,255,0.22)"
                  maxLength={40}
                />
              </View>
            </>
          )}
        </View>

        {/* Prev / Next */}
        <View style={s.navRow}>
          {step > 0 && (
            <TouchableOpacity style={s.navBtn} onPress={() => setStep(p => p - 1)} activeOpacity={0.7}>
              <Text style={s.navBtnText}>← Geri</Text>
            </TouchableOpacity>
          )}
          {step < 3 && (
            <TouchableOpacity
              style={[s.navBtn, s.navBtnNext]}
              onPress={() => setStep(p => p + 1)}
              activeOpacity={0.7}
            >
              <Text style={[s.navBtnText, s.navBtnNextText]}>İleri →</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Sticky bottom bar */}
      <View style={[s.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <View style={s.bottomInfo}>
          <Text style={s.bottomPriceLabel}>toplam</Text>
          <Text style={s.bottomPrice}>{price > 0 ? `${price}₺` : '—'}</Text>
        </View>
        <TouchableOpacity
          style={[s.addBtn, !canAdd && s.addBtnDisabled]}
          onPress={handleAddToCart}
          disabled={!canAdd}
          activeOpacity={0.85}
        >
          <Text style={s.addBtnText}>Sepete Ekle</Text>
        </TouchableOpacity>
      </View>

      <Toast message={state.toast} bottomOffset={96} />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0A0A0A' },
  scroll: { flex: 1 },

  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 4,
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
    letterSpacing: 0.5,
  },

  glassRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    gap: 24,
    marginBottom: 28,
  },
  glassInfo: {
    flex: 1,
    paddingBottom: 8,
  },
  priceLabel: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 4,
  },
  priceValue: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 40,
    color: '#fff',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  clashBadge: {
    backgroundColor: 'rgba(212,175,122,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,122,0.45)',
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  clashText: {
    fontFamily: 'Barlow_600SemiBold',
    fontSize: 11,
    color: '#D4AF7A',
    letterSpacing: 0.5,
  },
  selectionSummary: {
    gap: 4,
  },
  selSumItem: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },

  stepDots: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 0,
    marginBottom: 24,
  },
  dotWrap: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dotActive: {
    backgroundColor: '#C8102E',
    width: 22,
    borderRadius: 4,
  },
  dotDone: {
    backgroundColor: 'rgba(200,16,46,0.45)',
  },
  dotLabel: {
    fontFamily: 'Barlow_500Medium',
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
  },
  dotLabelActive: {
    color: '#fff',
    fontFamily: 'Barlow_600SemiBold',
  },

  stepContent: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  stepTitle: {
    fontFamily: 'Barlow_700Bold',
    fontSize: 12,
    letterSpacing: 2.5,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 16,
  },
  stepHint: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.35)',
  },
  multiHint: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 12,
  },

  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chipLg: {
    width: '47%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: '#121212',
  },
  chipLgActive: {
    borderColor: '#C8102E',
    backgroundColor: 'rgba(200,16,46,0.1)',
  },
  chipLgText: {
    fontFamily: 'Barlow_600SemiBold',
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 4,
  },
  chipLgTextActive: { color: '#fff' },
  chipLgPrice: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 16,
    color: 'rgba(255,255,255,0.4)',
  },
  chipLgPriceActive: { color: '#C8102E' },

  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: 'rgba(200,16,46,0.12)',
    borderColor: '#C8102E',
  },
  chipClash: {
    borderColor: 'rgba(212,175,122,0.45)',
    backgroundColor: 'rgba(212,175,122,0.06)',
  },
  chipSkip: {
    borderStyle: 'dashed',
  },
  chipText: {
    fontFamily: 'Barlow_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
  },
  chipTextActive: { color: '#fff' },
  chipClashText: { color: '#D4AF7A' },
  chipSkipText: {
    fontFamily: 'Barlow_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.3)',
  },
  chipSub: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
  },
  chipSubActive: { color: '#C8102E' },

  nameInput: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    paddingBottom: 8,
  },
  nameField: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 16,
    color: '#fff',
    paddingVertical: 4,
  },

  navRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  navBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  navBtnNext: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  navBtnText: {
    fontFamily: 'Barlow_600SemiBold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
  },
  navBtnNextText: {
    color: '#fff',
  },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: 'rgba(10,10,10,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  bottomInfo: { gap: 1 },
  bottomPriceLabel: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.35)',
  },
  bottomPrice: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 26,
    color: '#fff',
  },
  addBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#C8102E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: {
    backgroundColor: '#2a2020',
    opacity: 0.5,
  },
  addBtnText: {
    fontFamily: 'Barlow_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});
