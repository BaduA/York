export type Tab = 'month' | 'classics' | 'diy' | 'cart';
export type Gate = 'age' | 'pay' | null;
export type DeliveryMode = 'Masaya servis' | 'Bardan al';

export interface CartItem {
  id: number;
  name: string;
  ing: string;
  price: number;
  qty: number;
  custom?: boolean;
}

export interface Classic {
  name: string;
  ing: string;
  price: number;
}

export interface DiyState {
  base: string | null;
  mod: string | null;
  mixer: string | null;
  garnish: string[];
  name: string;
}

export interface AppState {
  activeTab: Tab;
  cart: CartItem[];
  addedKeys: Record<string, boolean>;
  toast: string;
  detail: Classic | null;
  diy: DiyState;
  gate: Gate;
  aged: boolean;
  deliveryMode: DeliveryMode;
  table: string;
}
