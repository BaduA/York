import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Animated, Modal, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { Classic } from '../types';
import Toast from '../components/Toast';

type Tag = 'Tümü' | 'Ferah' | 'Sert' | 'Ekşi';
const FILTERS: Tag[] = ['Tümü', 'Ferah', 'Sert', 'Ekşi'];

interface ClassicRow {
  name: string;
  ing: string;
  price: number;
  tag: Tag;
  base: string | null;
}

const ROWS: ClassicRow[] = [
  { name: 'Aperol Spritz',      ing: 'Aperol, Prosecco, maden suyu',                       price: 565, tag: 'Ferah', base: null },
  { name: 'Long Island Ice Tea', ing: 'Rom, Cin, Tekila, Vodka, portakal likörü, kola',     price: 580, tag: 'Sert',  base: 'Rom' },
  { name: 'Texas Iced Tea',      ing: 'Rom, Cin, Tekila, Vodka, viski, kola',               price: 595, tag: 'Sert',  base: 'Viski' },
  { name: 'Margarita',           ing: 'Tekila, portakal likörü, lime',                      price: 565, tag: 'Ekşi',  base: 'Tekila' },
  { name: 'Negroni',             ing: 'Cin, Campari, kırmızı vermut',                       price: 570, tag: 'Sert',  base: 'Cin' },
  { name: 'Whiskey Sour',        ing: 'Viski, limon, şeker şurubu',                         price: 585, tag: 'Ekşi',  base: 'Viski' },
  { name: 'Piña Colada',         ing: 'Rom, ananas suyu, hindistan cevizi',                 price: 565, tag: 'Ferah', base: 'Rom' },
  { name: 'Cosmopolitan',        ing: 'Vodka, portakal likörü, cranberry, lime',             price: 565, tag: 'Ekşi',  base: 'Vodka' },
  { name: 'Cuba Libre',          ing: 'Rom, kola, lime',                                    price: 565, tag: 'Ferah', base: 'Rom' },
];

function SheetContent({ item, onClose }: { item: ClassicRow; onClose: () => void }) {
  const { state, addItem, prefillDiy } = useApp();
  const insets = useSafeAreaInsets();
  const isAdded = !!state.addedKeys[item.name];

  return (
    <View style={[sh.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
      <View style={sh.handle} />

      <View style={sh.sheetHeader}>
        <View style={sh.sheetMeta}>
          <Text style={sh.sheetName}>{item.name.toUpperCase()}</Text>
          <Text style={sh.sheetIng}>{item.ing}</Text>
        </View>
        <TouchableOpacity style={sh.closeBtn} onPress={onClose} hitSlop={12}>
          <View style={sh.closeX1} />
          <View style={sh.closeX2} />
        </TouchableOpacity>
      </View>

      <View style={sh.divider} />

      <View style={sh.sheetFooter}>
        <Text style={sh.sheetPrice}>{item.price}₺</Text>
        <TouchableOpacity
          style={[sh.addBtn, isAdded && sh.addBtnDone]}
          onPress={() => {
            addItem(item.name, item.name, item.price, item.ing);
            onClose();
          }}
          activeOpacity={0.85}
        >
          <Text style={sh.addBtnText}>{isAdded ? 'Tekrar Ekle' : 'Sepete Ekle'}</Text>
        </TouchableOpacity>
      </View>

      {item.base && (
        <TouchableOpacity
          style={sh.diyLink}
          onPress={() => { prefillDiy(item.base!, item.name); onClose(); }}
          activeOpacity={0.7}
        >
          <Text style={sh.diyLinkText}>Kendin göre ayarla  →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function ClassicsScreen() {
  const { state, setDetail } = useApp();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Tag>('Tümü');
  const slideY = useRef(new Animated.Value(400)).current;
  const backdrop = useRef(new Animated.Value(0)).current;
  const detail = state.detail as (ClassicRow & Classic) | null;

  useEffect(() => {
    if (detail) {
      Animated.parallel([
        Animated.spring(slideY, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 200 }),
        Animated.timing(backdrop, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY, { toValue: 400, duration: 220, useNativeDriver: true }),
        Animated.timing(backdrop, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [detail]);

  const openDetail = (row: ClassicRow) => {
    slideY.setValue(400);
    setDetail({ name: row.name, ing: row.ing, price: row.price });
  };

  const closeDetail = () => setDetail(null);

  const filtered = filter === 'Tümü' ? ROWS : ROWS.filter(r => r.tag === filter);

  return (
    <View style={s.screen}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerTopRow}>
            <Text style={s.brush}>bir</Text>
            <Text style={s.subtitle}>seçki</Text>
          </View>
          <Text style={s.screenTitle}>KLASİKLER</Text>
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filtersRow}
        >
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[s.chip, filter === f && s.chipActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.75}
            >
              <Text style={[s.chipText, filter === f && s.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Classics list */}
        <View style={s.list}>
          {filtered.map((row, i) => (
            <TouchableOpacity
              key={row.name}
              style={[s.row, i === filtered.length - 1 && s.rowLast]}
              onPress={() => openDetail(row)}
              activeOpacity={0.7}
            >
              <View style={s.rowLeft}>
                <Text style={s.rowName}>{row.name}</Text>
                <Text style={s.rowIng}>{row.ing}</Text>
              </View>
              <View style={s.rowRight}>
                <Text style={s.rowPrice}>{row.price}₺</Text>
                <View style={s.chevron}>
                  <View style={s.chevronArm1} />
                  <View style={s.chevronArm2} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom sheet */}
      {detail && (
        <Modal transparent visible animationType="none" onRequestClose={closeDetail}>
          <Animated.View style={[s.backdropFill, { opacity: backdrop }]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closeDetail} />
          </Animated.View>
          <Animated.View style={[s.sheetWrap, { transform: [{ translateY: slideY }] }]}>
            <SheetContent
              item={ROWS.find(r => r.name === detail.name) ?? ROWS[0]}
              onClose={closeDetail}
            />
          </Animated.View>
        </Modal>
      )}

      <Toast message={state.toast} bottomOffset={104} />
    </View>
  );
}

const sh = StyleSheet.create({
  sheet: {
    backgroundColor: '#161616',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'center',
    marginBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  sheetMeta: { flex: 1 },
  sheetName: {
    fontFamily: 'RubikDirt_400Regular',
    fontSize: 28,
    color: '#fff',
    lineHeight: 30,
    marginBottom: 8,
  },
  sheetIng: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.58)',
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    position: 'relative',
  },
  closeX1: {
    position: 'absolute',
    width: 18,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  closeX2: {
    position: 'absolute',
    width: 18,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 1,
    transform: [{ rotate: '-45deg' }],
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 20,
  },
  sheetFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  sheetPrice: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 34,
    color: '#fff',
    letterSpacing: 0.5,
  },
  addBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#C8102E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDone: {
    backgroundColor: '#2a2a2a',
  },
  addBtnText: {
    fontFamily: 'Barlow_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  diyLink: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  diyLinkText: {
    fontFamily: 'Barlow_600SemiBold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.38)',
    letterSpacing: 0.2,
  },
});

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
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

  filtersRow: {
    paddingHorizontal: 24,
    gap: 10,
    paddingBottom: 20,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'transparent',
  },
  chipActive: {
    backgroundColor: '#C8102E',
    borderColor: '#C8102E',
  },
  chipText: {
    fontFamily: 'Barlow_600SemiBold',
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },
  chipTextActive: {
    color: '#fff',
  },

  list: {
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    gap: 12,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLeft: { flex: 1 },
  rowName: {
    fontFamily: 'Barlow_700Bold',
    fontSize: 15.5,
    color: '#fff',
    marginBottom: 3,
  },
  rowIng: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 17,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowPrice: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
  },
  chevron: {
    width: 12,
    height: 12,
    position: 'relative',
  },
  chevronArm1: {
    position: 'absolute',
    width: 8,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    top: 2,
    left: 0,
    transform: [{ rotate: '40deg' }],
  },
  chevronArm2: {
    position: 'absolute',
    width: 8,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    bottom: 2,
    left: 0,
    transform: [{ rotate: '-40deg' }],
  },

  backdropFill: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  sheetWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
