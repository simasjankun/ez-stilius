'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://api.ezstilius.lt';
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';
const HEADERS = {
  'x-publishable-api-key': API_KEY,
  'Content-Type': 'application/json',
};

function getMedusaLocale(): string {
  if (typeof document === 'undefined') return 'lt-LT';
  const lang = document.documentElement.lang;
  return lang === 'en' ? 'en-GB' : 'lt-LT';
}

function getCartId(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|; )cart_id=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function setCartId(id: string) {
  document.cookie = `cart_id=${encodeURIComponent(id)};path=/;max-age=${60 * 60 * 24 * 30};SameSite=Lax`;
}

function clearCartId() {
  document.cookie = 'cart_id=;path=/;max-age=0';
}

export interface CartItem {
  id: string;
  title: string;
  variant_title: string | null;
  thumbnail: string | null;
  quantity: number;
  unit_price: number;
  total: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  /** Grand total (cart.total) — used by CartDrawer */
  subtotal: number;
  /** Items-only subtotal before shipping (cart.item_subtotal) */
  itemsSubtotal: number;
  /** Shipping cost (cart.shipping_total) */
  shippingTotal: number;
  /** True after the initial cart fetch from cookie has settled */
  isInitialized: boolean;
  cartId: string | null;
  isLoading: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItemQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [regionId, setRegionId] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch region ID once on mount
  useEffect(() => {
    fetch(`${MEDUSA_URL}/store/regions`, { headers: HEADERS })
      .then((res) => res.json())
      .then((data) => setRegionId(data.regions?.[0]?.id ?? null))
      .catch(() => {});
  }, []);

  // Load existing cart on mount
  useEffect(() => {
    const cartId = getCartId();
    if (!cartId) {
      setIsInitialized(true);
      return;
    }
    fetch(`${MEDUSA_URL}/store/carts/${cartId}`, { headers: HEADERS })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.cart) setCart(data.cart);
        else clearCartId();
      })
      .catch(() => {})
      .finally(() => setIsInitialized(true));
  }, []);

  async function ensureCart(): Promise<string> {
    const existing = getCartId();
    if (existing) return existing;

    const res = await fetch(`${MEDUSA_URL}/store/carts`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ region_id: regionId, locale: getMedusaLocale() }),
    });
    const data = await res.json();
    const newCartId = data.cart.id;
    setCartId(newCartId);
    setCart(data.cart);
    return newCartId;
  }

  const addItem = useCallback(
    async (variantId: string, quantity: number = 1) => {
      setIsLoading(true);
      try {
        const cartId = await ensureCart();
        const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items`, {
          method: 'POST',
          headers: HEADERS,
          body: JSON.stringify({ variant_id: variantId, quantity }),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.message || `Add item failed: ${res.status}`);
        }
        const data = await res.json();
        setCart(data.cart);
        setIsDrawerOpen(true);
      } catch (e) {
        console.error('Add to cart error:', e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [regionId],
  );

  const updateItemQuantity = useCallback(async (lineItemId: string, quantity: number) => {
    const cartId = getCartId();
    if (!cartId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items/${lineItemId}`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || `Update failed: ${res.status}`);
      }
      const data = await res.json();
      setCart(data.cart);
    } catch (e) {
      console.error('Update quantity error:', e);
      const refetchRes = await fetch(`${MEDUSA_URL}/store/carts/${cartId}`, { headers: HEADERS });
      const refetchData = await refetchRes.json();
      if (refetchData?.cart) setCart(refetchData.cart);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeItem = useCallback(async (lineItemId: string) => {
    const cartId = getCartId();
    if (!cartId) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `${MEDUSA_URL}/store/carts/${cartId}/line-items/${lineItemId}`,
        { method: 'DELETE', headers: HEADERS },
      );
      if (!res.ok) throw new Error(`Remove item failed: ${res.status}`);
      const data = await res.json();
      setCart(data.parent); // DELETE returns cart in "parent" field
    } catch (e) {
      console.error('Remove from cart error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart(null);
    clearCartId();
  }, []);

  const items: CartItem[] = (cart?.items ?? []).map((item: any) => ({
    id: item.id,
    title: item.product_title || item.title || '',
    variant_title: item.variant_title ?? null,
    thumbnail: item.thumbnail ?? null,
    quantity: item.quantity,
    unit_price: Number(item.unit_price),
    total: Number(item.total ?? item.unit_price * item.quantity),
  }));

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = Number(cart?.total ?? cart?.subtotal ?? 0);
  const itemsSubtotal = Number(cart?.item_subtotal ?? cart?.subtotal ?? 0);
  const shippingTotal = Number(cart?.shipping_total ?? 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        itemsSubtotal,
        shippingTotal,
        isInitialized,
        cartId: cart?.id ?? null,
        isLoading,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
