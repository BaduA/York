import React, { useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Animated, Modal, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { DeliveryMode } from '../types';

const DELIVERY_MODES: DeliveryMode[] = ['Masaya servis', 'Bardan al'];

function AgeGate({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[ag.sheet, { paddingBottom: Math.max(insets.bottom, 32) }]}>
      <View style={ag.handle} />
      <Text style={ag.number}>18+</Text>
      <Text style={ag.title}>Yaş Doğrulama</Text>
      <Text style={ag.body}>
        Alkollü içecek sipariş edebilmek için 18 yaşını doldurmuş olman gerekiyor.
        Devam ederek 18 yaşından büyük olduğunu onaylıyorsun.
      </Text>
      <TouchableOpacity style={ag.confirmBtn} onPress={onConfirm} activeOpacity={0.85}>
        <Text style={ag.confirmText}>18 yaşından büyüğüm, devam et</Text>
      </TouchableOpacity>
      <TouchableOpacity style={ag.cancelBtn} onPress={onClose} activeOpacity={0.7}>
        <Text style={ag.cancelText}>Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

function PaySheet({ total, onClose }: { total: number; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[ps.sheet, { paddingBottom: Math.max(insets.bottom, 32) }]}>
      <View style={ps.handle} />
      <Text style={ps.title}>Ödeme</Text>

      <View style={ps.methods}>
        <TouchableOpacity style={[ps.method, ps.methodActive]} activeOpacity={0.8}>
          <View style={ps.cardIcon}>
            <View style={ps.cardStripe} />
          </View>
          <View style={ps.methodInfo}>
            <Text style={ps.methodLabel}>Kayıtlı Kart</Text>
            <Text style={ps.methodSub}>•••• 4782</Text>
          </View>
          <View style={ps.radioActive} />
        </TouchableOpacity>

        <TouchableOpacity style={ps.method} activeOpacity={0.8}>
          <View style={ps.appleIcon}>
            <Text style={ps.appleText}></Text>
          </View>
          <View style={ps.methodInfo}>
            <Text style={ps.methodLabel}>Apple Pay</Text>
          </View>
          <View style={ps.radio} />
        </TouchableOpacity>
      </View>

      <View style={ps.divider} />

      <View style={ps.summary}>
        <View style={ps.summaryRow}>
          <Text style={ps.summaryLabel}>Ara toplam</Text>
          <Text style={ps.summaryVal}>{total}₺</Text>
        </View>
        <View style={ps.summaryRow}>
          <Text style={ps.summaryLabel}>Servis</Text>
          <Text style={ps.summaryVal}>Ücretsiz</Text>
        </View>
        <View style={[ps.summaryRow, ps.summaryTotal]}>
          <Text style={ps.totalLabel}>Toplam</Text>
          <Text style={ps.totalVal}>{total}₺</Text>
        </View>
      </View>

      <TouchableOpacity style={ps.payBtn} onPress={onClose} activeOpacity={0.85}>
        <Text style={ps.payBtnText}>Öde  {total}₺</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CartScreen() {
  const { state, updateQty, setDeliveryMode, setGate, confirmAge } = useApp();
  const insets = useSafeAreaInsets();
  const slideY = useRef(new Animated.Value(500)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  const { cart, deliveryMode, table, gate, aged } = state;
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const empty = cart.length === 0;

  const openGate = (g: 'age' | 'pay') => {
    slideY.setValue(500);
    setGate(g);
    Animated.parallel([
      Animated.spring(slideY, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 200 }),
      Animated.timing(backdrop, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const closeGate = () => {
    Animated.parallel([
      Animated.timing(slideY, { toValue: 500, duration: 220, useNativeDriver: true }),
      Animated.timing(backdrop, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setGate(null as any));
  };

  const handleCheckout = () => {
    if (!aged) {
      openGate('age');
    } else {
      openGate('pay');
    }
  };

  const handleConfirmAge = () => {
    confirmAge();
    Animated.parallel([
      Animated.timing(slideY, { toValue: 500, duration: 180, useNativeDriver: true }),
      Animated.timing(backdrop, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      slideY.setValue(500);
      Animated.parallel([
        Animated.spring(slideY, { toValue: 0, useNativeDriver: true, damping: 22, stiffness: 200 }),
        Animated.timing(backdrop, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    });
  };

  return (
    <View style={s.screen}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <View>
            <View style={s.headerTopRow}>
              <Text style={s.brush}>sipariş</Text>
              <Text style={s.subtitle}>hazır</Text>
            </View>
            <Text style={s.screenTitle}>SEPETİN</Text>
          </View>
          {totalQty > 0 && (
            <View style={s.countBadge}>
              <Text style={s.countText}>{totalQty}</Text>
            </View>
          )}
        </View>

        {/* Delivery mode + table */}
        <View style={s.deliveryRow}>
          <View style={s.toggleWrap}>
            {DELIVERY_MODES.map(m => (
              <TouchableOpacity
                key={m}
                style={[s.toggleBtn, deliveryMode === m && s.toggleBtnActive]}
                onPress={() => setDeliveryMode(m)}
                activeOpacity={0.75}
              >
                <Text style={[s.toggleText, deliveryMode === m && s.toggleTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {deliveryMode === 'Masaya servis' && (
            <Text style={s.tableLabel}>{table}</Text>
          )}
        </View>

        {/* Empty state */}
        {empty && (
          <View style={s.emptyState}>
            <Text style={s.emptyTitle}>Sepet boş</Text>
            <Text style={s.emptyBody}>Bu Ay veya Klasikler sekmesinden kokteyl ekle</Text>
          </View>
        )}

        {/* Cart items */}
        {!empty && (
          <View style={s.itemList}>
            {cart.map((item, i) => (
              <View key={item.id} style={[s.itemRow, i === cart.length - 1 && s.itemRowLast]}>
                <View style={s.itemLeft}>
                  {item.custom && <Text style={s.customTag}>TAİFIM</Text>}
                  <Text style={s.itemName}>{item.name}</Text>
                  <Text style={s.itemIng}>{item.ing}</Text>
                </View>
                <View style={s.itemRight}>
                  <Text style={s.itemPrice}>{item.price * item.qty}₺</Text>
                  <View style={s.qtyRow}>
                    <TouchableOpacity
                      style={s.qtyBtn}
                      onPress={() => updateQty(item.id, -1)}
                      hitSlop={8}
                    >
                      <View style={s.qtyMinus} />
                    </TouchableOpacity>
                    <Text style={s.qtyVal}>{item.qty}</Text>
                    <TouchableOpacity
                      style={s.qtyBtn}
                      onPress={() => updateQty(item.id, 1)}
                      hitSlop={8}
                    >
                      <View style={s.qtyPlus1} />
                      <View style={s.qtyPlus2} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Price summary */}
        {!empty && (
          <View style={s.summary}>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Ara toplam</Text>
              <Text style={s.summaryVal}>{subtotal}₺</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Servis</Text>
              <Text style={s.summaryVal}>Ücretsiz</Text>
            </View>
            <View style={[s.summaryRow, s.summaryTotalRow]}>
              <Text style={s.totalLabel}>Toplam</Text>
              <Text style={s.totalVal}>{subtotal}₺</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Checkout bar */}
      {!empty && (
        <View style={[s.checkoutBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <TouchableOpacity
            style={s.checkoutBtn}
            onPress={handleCheckout}
            activeOpacity={0.85}
          >
            <Text style={s.checkoutBtnText}>Ödemeye Geç</Text>
            <Text style={s.checkoutBtnPrice}>{subtotal}₺</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Age gate / payment modal */}
      {!!gate && (
        <Modal transparent visible animationType="none" onRequestClose={closeGate}>
          <Animated.View style={[s.backdropFill, { opacity: backdrop }]}>
            <Pressable style={StyleSheet.absoluteFill} onPress={closeGate} />
          </Animated.View>
          <Animated.View style={[s.sheetWrap, { transform: [{ translateY: slideY }] }]}>
            {gate === 'age' && (
              <AgeGate onConfirm={handleConfirmAge} onClose={closeGate} />
            )}
            {gate === 'pay' && (
              <PaySheet total={subtotal} onClose={closeGate} />
            )}
          </Animated.View>
        </Modal>
      )}
    </View>
  );
}

const ag = StyleSheet.create({
  sheet: {
    backgroundColor: '#161616',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: 'center',
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'center',
    marginBottom: 28,
  },
  number: {
    fontFamily: 'RubikDirt_400Regular',
    fontSize: 48,
    color: '#C8102E',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Barlow_700Bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 12,
  },
  body: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    marginBottom: 28,
  },
  confirmBtn: {
    width: '100%',
    height: 56,
    borderRadius: 14,
    backgroundColor: '#C8102E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  confirmText: {
    fontFamily: 'Barlow_600SemiBold',
    fontSize: 15,
    color: '#fff',
  },
  cancelBtn: {
    paddingVertical: 12,
  },
  cancelText: {
    fontFamily: 'Barlow_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.38)',
  },
});

const ps = StyleSheet.create({
  sheet: {
    backgroundColor: '#161616',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'RubikDirt_400Regular',
    fontSize: 26,
    color: '#fff',
    marginBottom: 20,
  },
  methods: { gap: 10, marginBottom: 4 },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#1a1a1a',
  },
  methodActive: {
    borderColor: '#C8102E',
    backgroundColor: 'rgba(200,16,46,0.06)',
  },
  cardIcon: {
    width: 36, height: 24,
    borderRadius: 4,
    backgroundColor: '#2a2a2a',
    justifyContent: 'flex-end',
    paddingBottom: 6,
    paddingHorizontal: 6,
  },
  cardStripe: {
    height: 4,
    backgroundColor: '#C8102E',
    borderRadius: 1,
  },
  appleIcon: {
    width: 36, height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleText: {
    fontSize: 18,
    color: '#fff',
  },
  methodInfo: { flex: 1 },
  methodLabel: {
    fontFamily: 'Barlow_600SemiBold',
    fontSize: 14,
    color: '#fff',
  },
  methodSub: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  radio: {
    width: 18, height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  radioActive: {
    width: 18, height: 18,
    borderRadius: 9,
    borderWidth: 5,
    borderColor: '#C8102E',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 20,
  },
  summary: { gap: 10, marginBottom: 24 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  summaryVal: {
    fontFamily: 'Barlow_600SemiBold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  summaryTotal: {},
  totalLabel: {
    fontFamily: 'Barlow_700Bold',
    fontSize: 16,
    color: '#fff',
  },
  totalVal: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 20,
    color: '#fff',
  },
  payBtn: {
    height: 56,
    borderRadius: 14,
    backgroundColor: '#C8102E',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  payBtnText: {
    fontFamily: 'Barlow_700Bold',
    fontSize: 17,
    color: '#fff',
    letterSpacing: 0.3,
  },
});

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0A0A0A' },
  scroll: { flex: 1 },

  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
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
  countBadge: {
    width: 36, height: 36,
    borderRadius: 18,
    backgroundColor: '#C8102E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  countText: {
    fontFamily: 'Barlow_700Bold',
    fontSize: 16,
    color: '#fff',
  },

  deliveryRow: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  toggleWrap: {
    flexDirection: 'row',
    backgroundColor: '#181818',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#C8102E',
  },
  toggleText: {
    fontFamily: 'Barlow_500Medium',
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
  },
  toggleTextActive: {
    color: '#fff',
    fontFamily: 'Barlow_600SemiBold',
  },
  tableLabel: {
    fontFamily: 'Barlow_600SemiBold',
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.3,
  },

  emptyState: {
    paddingHorizontal: 24,
    paddingTop: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: 'RubikDirt_400Regular',
    fontSize: 24,
    color: 'rgba(255,255,255,0.3)',
    marginBottom: 8,
  },
  emptyBody: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.2)',
    textAlign: 'center',
    lineHeight: 20,
  },

  itemList: {
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    marginBottom: 20,
  },
  itemRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    gap: 12,
    alignItems: 'center',
  },
  itemRowLast: { borderBottomWidth: 0 },
  itemLeft: { flex: 1 },
  customTag: {
    fontFamily: 'Barlow_700Bold',
    fontSize: 9,
    letterSpacing: 1.5,
    color: '#D4AF7A',
    marginBottom: 3,
  },
  itemName: {
    fontFamily: 'Barlow_700Bold',
    fontSize: 15,
    color: '#fff',
    marginBottom: 3,
  },
  itemIng: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.42)',
    lineHeight: 16,
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  itemPrice: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 18,
    color: '#fff',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  qtyBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  qtyMinus: {
    width: 14,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 1,
  },
  qtyPlus1: {
    position: 'absolute',
    width: 14,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 1,
  },
  qtyPlus2: {
    position: 'absolute',
    width: 2,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 1,
  },
  qtyVal: {
    fontFamily: 'Barlow_700Bold',
    fontSize: 15,
    color: '#fff',
    minWidth: 16,
    textAlign: 'center',
  },

  summary: {
    marginHorizontal: 24,
    gap: 10,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.45)',
  },
  summaryVal: {
    fontFamily: 'Barlow_600SemiBold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  summaryTotalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  totalLabel: {
    fontFamily: 'Barlow_700Bold',
    fontSize: 17,
    color: '#fff',
  },
  totalVal: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 22,
    color: '#fff',
  },

  checkoutBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: 'rgba(10,10,10,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  checkoutBtn: {
    height: 56,
    borderRadius: 14,
    backgroundColor: '#C8102E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
  },
  checkoutBtnText: {
    fontFamily: 'Barlow_700Bold',
    fontSize: 17,
    color: '#fff',
    letterSpacing: 0.3,
  },
  checkoutBtnPrice: {
    fontFamily: 'BarlowCondensed_700Bold',
    fontSize: 20,
    color: 'rgba(255,255,255,0.85)',
  },

  backdropFill: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  sheetWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
