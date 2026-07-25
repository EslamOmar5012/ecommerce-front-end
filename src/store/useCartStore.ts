import { create } from 'zustand';

interface CartState {
  cartCount: number;
  isCartOpen: boolean;
  setCartCount: (count: number) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartCount: 0,
  isCartOpen: false,

  setCartCount: (count) => set({ cartCount: count }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}));
