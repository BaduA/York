import React, {
  createContext,
  useContext,
  useReducer,
  useRef,
  useCallback,
} from 'react';
import { AppState, Tab, Gate, Classic, DeliveryMode } from '../types';

const INITIAL_STATE: AppState = {
  activeTab: 'month',
  cart: [
    { id: 1, name: 'York Sunrise', ing: 'Cin, yuzu, nar şerbeti', price: 575, qty: 1 },
    { id: 2, name: 'Long Island Ice Tea', ing: 'Rom, cin, tekila, vodka, kola', price: 580, qty: 2 },
    { id: 3, name: 'Tarifim: Kızıl Yuzu', ing: 'Cin · Yuzu likörü · Tonik · Nane', price: 470, qty: 1, custom: true },
  ],
  addedKeys: {},
  toast: '',
  detail: null,
  diy: { base: null, mod: null, mixer: null, garnish: [], name: '' },
  gate: null,
  aged: false,
  deliveryMode: 'Masaya servis',
  table: 'Masa 12',
};

type Action =
  | { type: 'SET_TAB'; tab: Tab }
  | { type: 'SHOW_TOAST'; text: string }
  | { type: 'CLEAR_TOAST' }
  | { type: 'ADD_ITEM'; key: string; name: string; price: number; ing: string }
  | { type: 'SET_DETAIL'; detail: Classic | null }
  | { type: 'PICK_BASE'; val: string }
  | { type: 'PICK_MOD'; val: string }
  | { type: 'PICK_MIXER'; val: string }
  | { type: 'PICK_GARNISH'; val: string }
  | { type: 'SET_DIY_NAME'; name: string }
  | { type: 'PREFILL_DIY'; base: string; name: string }
  | { type: 'SET_GATE'; gate: Gate }
  | { type: 'CONFIRM_AGE' }
  | { type: 'UPDATE_QTY'; id: number; delta: number }
  | { type: 'SET_DELIVERY_MODE'; mode: DeliveryMode };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.tab };

    case 'SHOW_TOAST':
      return { ...state, toast: action.text };

    case 'CLEAR_TOAST':
      return { ...state, toast: '' };

    case 'ADD_ITEM': {
      const exists = state.cart.find(i => i.name === action.name);
      const newCart = exists
        ? state.cart.map(i => i.name === action.name ? { ...i, qty: i.qty + 1 } : i)
        : [...state.cart, { id: Date.now(), name: action.name, ing: action.ing, price: action.price, qty: 1 }];
      return {
        ...state,
        cart: newCart,
        addedKeys: { ...state.addedKeys, [action.key]: true },
        toast: action.name + ' sepete eklendi',
      };
    }

    case 'SET_DETAIL':
      return { ...state, detail: action.detail };

    case 'PICK_BASE': {
      const d = { ...state.diy };
      d.base = d.base === action.val ? null : action.val;
      d.mod = null;
      return { ...state, diy: d };
    }

    case 'PICK_MOD': {
      const d = { ...state.diy };
      d.mod = d.mod === action.val ? null : action.val;
      return { ...state, diy: d };
    }

    case 'PICK_MIXER': {
      const d = { ...state.diy };
      d.mixer = d.mixer === action.val ? null : action.val;
      return { ...state, diy: d };
    }

    case 'PICK_GARNISH': {
      const d = { ...state.diy };
      d.garnish = d.garnish.includes(action.val)
        ? d.garnish.filter(g => g !== action.val)
        : [...d.garnish, action.val];
      return { ...state, diy: d };
    }

    case 'SET_DIY_NAME':
      return { ...state, diy: { ...state.diy, name: action.name } };

    case 'PREFILL_DIY':
      return {
        ...state,
        activeTab: 'diy',
        detail: null,
        diy: { base: action.base, mod: null, mixer: null, garnish: [], name: action.name },
      };

    case 'SET_GATE':
      return { ...state, gate: action.gate };

    case 'CONFIRM_AGE':
      return { ...state, aged: true, gate: 'pay' };

    case 'UPDATE_QTY': {
      const newCart = state.cart
        .map(i => i.id === action.id ? { ...i, qty: Math.max(0, i.qty + action.delta) } : i)
        .filter(i => i.qty > 0);
      return { ...state, cart: newCart };
    }

    case 'SET_DELIVERY_MODE':
      return { ...state, deliveryMode: action.mode };

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  setTab: (tab: Tab) => void;
  addItem: (key: string, name: string, price: number, ing: string) => void;
  setDetail: (detail: Classic | null) => void;
  pickBase: (val: string) => void;
  pickMod: (val: string) => void;
  pickMixer: (val: string) => void;
  pickGarnish: (val: string) => void;
  setDiyName: (name: string) => void;
  prefillDiy: (base: string, name: string) => void;
  setGate: (gate: Gate) => void;
  confirmAge: () => void;
  updateQty: (id: number, delta: number) => void;
  setDeliveryMode: (mode: DeliveryMode) => void;
}

const AppContext = createContext<AppContextValue>(null!);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const showToast = useCallback((text: string) => {
    clearTimeout(toastTimer.current);
    dispatch({ type: 'SHOW_TOAST', text });
    toastTimer.current = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 2200);
  }, []);

  const addItem = useCallback((key: string, name: string, price: number, ing: string) => {
    clearTimeout(toastTimer.current);
    dispatch({ type: 'ADD_ITEM', key, name, price, ing });
    toastTimer.current = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 2200);
  }, []);

  const value: AppContextValue = {
    state,
    setTab: tab => dispatch({ type: 'SET_TAB', tab }),
    addItem,
    setDetail: detail => dispatch({ type: 'SET_DETAIL', detail }),
    pickBase: val => dispatch({ type: 'PICK_BASE', val }),
    pickMod: val => dispatch({ type: 'PICK_MOD', val }),
    pickMixer: val => dispatch({ type: 'PICK_MIXER', val }),
    pickGarnish: val => dispatch({ type: 'PICK_GARNISH', val }),
    setDiyName: name => dispatch({ type: 'SET_DIY_NAME', name }),
    prefillDiy: (base, name) => dispatch({ type: 'PREFILL_DIY', base, name }),
    setGate: gate => dispatch({ type: 'SET_GATE', gate }),
    confirmAge: () => dispatch({ type: 'CONFIRM_AGE' }),
    updateQty: (id, delta) => dispatch({ type: 'UPDATE_QTY', id, delta }),
    setDeliveryMode: mode => dispatch({ type: 'SET_DELIVERY_MODE', mode }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
