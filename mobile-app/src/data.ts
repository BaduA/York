export const CLASSICS: [string, string, number][] = [
  ['Aperol Spritz', 'Aperol, Prosecco, maden suyu', 565],
  ['Long Island Ice Tea', 'Rom, Cin, Tekila, Vodka, portakal likörü, kola', 580],
  ['Texas Iced Tea', 'Rom, Cin, Tekila, Vodka, viski, kola', 595],
  ['Margarita', 'Tekila, portakal likörü, lime', 565],
  ['Negroni', 'Cin, Campari, kırmızı vermut', 570],
  ['Whiskey Sour', 'Viski, limon, şeker şurubu', 585],
  ['Piña Colada', 'Rom, ananas suyu, hindistan cevizi', 565],
  ['Cosmopolitan', 'Vodka, portakal likörü, cranberry, lime', 565],
  ['Cuba Libre', 'Rom, kola, lime', 565],
];

export const BASES: [string, number, string][] = [
  ['Cin', 320, '#dfe8ea'],
  ['Vodka', 310, '#e6eef2'],
  ['Tekila', 340, '#efe2c4'],
  ['Rom', 315, '#c99a5e'],
  ['Viski', 360, '#a9682c'],
  ['Alkolsüz', 180, '#cfe3d2'],
];

export const MODS: Record<string, [string, number, string][]> = {
  Cin: [
    ['Elderflower likörü', 70, '#e4dfae'],
    ['Yuzu likörü', 75, '#e8d35c'],
    ['Kırmızı vermut', 60, '#8e2f2a'],
    ['Aperol', 65, '#d8552a'],
  ],
  Vodka: [
    ['Kahve likörü', 80, '#3a2218'],
    ['Şeftali likörü', 65, '#e79a63'],
    ['Cranberry likörü', 70, '#9e2340'],
  ],
  Tekila: [
    ['Portakal likörü', 70, '#e08a2e'],
    ['Agave şurubu', 40, '#cfa657'],
    ['Aperol', 65, '#d8552a'],
  ],
  Rom: [
    ['Falernum', 65, '#c98a4a'],
    ['Hindistan cevizi likörü', 70, '#efe7d8'],
    ['Portakal likörü', 70, '#e08a2e'],
  ],
  Viski: [
    ['Kırmızı vermut', 60, '#8e2f2a'],
    ['Bal likörü', 70, '#d9a63d'],
    ['Amaretto', 65, '#b06a34'],
  ],
  Alkolsüz: [
    ['Yuzu şurubu', 45, '#e8d35c'],
    ['Bitki şurubu', 35, '#7fa06a'],
    ['Nar şerbeti', 45, '#a01f38'],
  ],
};

export const MIXERS: [string, number, string][] = [
  ['Kola', 45, '#3a2318'],
  ['Tonik', 45, '#e9f1f4'],
  ['Maden suyu', 35, '#eef5f7'],
  ['Portakal suyu', 50, '#e79a2e'],
  ['Ananas suyu', 50, '#e6c85f'],
  ['Zencefilli gazoz', 50, '#d9b071'],
];

export const GARNISHES: [string, number][] = [
  ['Lime kabuğu', 0],
  ['Nane dalı', 10],
  ['Sichuan biberi', 15],
  ['Küp buz', 0],
  ['Küre buz', 20],
  ['Kırık buz', 0],
];

export const CLASHES: [string, string][] = [
  ['Cin', 'Kola'],
  ['Viski', 'Tonik'],
  ['Kahve likörü', 'Tonik'],
  ['Hindistan cevizi likörü', 'Kola'],
  ['Aperol', 'Kola'],
];

export function isClash(a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  return CLASHES.some(([p, q]) => (p === a && q === b) || (p === b && q === a));
}

export function priceOf(arr: [string, number, ...unknown[]][], name: string): number {
  return arr.find(x => x[0] === name)?.[1] ?? 0;
}

export function colorOf(arr: [string, number, string][], name: string): string {
  return arr.find(x => x[0] === name)?.[2] ?? '#888';
}
