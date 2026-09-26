import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Layer {
  color: string;
  height: number;
}

interface Props {
  layers: Layer[];
  iceVisible: boolean;
}

export default function GlassView({ layers, iceVisible }: Props) {
  const empty = layers.length === 0;

  return (
    <View style={s.glass}>
      {empty && (
        <View style={s.emptyLabel}>
          <Text style={s.emptyText}>boş{'\n'}bardak</Text>
        </View>
      )}
      {layers.map((layer, i) => (
        <View
          key={i}
          style={[s.layer, { height: layer.height, backgroundColor: layer.color }]}
        />
      ))}
      {iceVisible && <View style={s.ice} />}
    </View>
  );
}

const s = StyleSheet.create({
  glass: {
    width: 96,
    height: 176,
    borderRadius: 22,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.28)',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    justifyContent: 'flex-end',
  },
  emptyLabel: {
    position: 'absolute',
    inset: 0,
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Barlow_400Regular',
    fontSize: 9,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    lineHeight: 14,
  },
  layer: {
    opacity: 0.9,
  },
  ice: {
    position: 'absolute',
    bottom: 40,
    left: 18,
    width: 26,
    height: 26,
    backgroundColor: 'rgba(255,255,255,0.34)',
    borderRadius: 5,
    transform: [{ rotate: '12deg' }],
  },
});
