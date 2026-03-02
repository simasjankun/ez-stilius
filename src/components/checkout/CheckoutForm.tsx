'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, ChevronDown, ChevronUp, Loader2, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
import { useCart } from '@/context/CartContext';

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'https://api.ezstilius.lt';
const API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';
const HEADERS = {
  'x-publishable-api-key': API_KEY,
  'Content-Type': 'application/json',
};

// ─── Helper components (top-level to avoid nested-component focus-loss bug) ────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold tracking-wider text-warm-gray uppercase mb-4">
      {children}
    </h2>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
  className = '',
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-xs text-warm-gray mb-1.5">
        {label} <span className="text-olive">*</span>
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`w-full border rounded-lg px-4 py-3 text-sm bg-white text-charcoal outline-none transition-colors
          ${error ? 'border-red-400 focus:border-red-400' : 'border-sand focus:border-olive focus:ring-1 focus:ring-olive/30'}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function OrderSummaryPanel({
  items,
  itemsSubtotal,
  shippingTotal,
  total,
  shippingLabel,
  t,
}: {
  items: any[];
  itemsSubtotal: number;
  shippingTotal: number;
  total: number;
  shippingLabel?: string;
  t: any;
}) {
  return (
    <div className="space-y-4">
      <SectionHeading>{t('checkout.orderSummary')}</SectionHeading>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-14 h-14 object-cover rounded-lg shrink-0 bg-sand/30"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-sand/30 shrink-0 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-warm-gray/40" strokeWidth={1} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal truncate">{item.title}</p>
              {item.variant_title && (
                <p className="text-xs text-warm-gray mt-0.5">{item.variant_title}</p>
              )}
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-warm-gray">
                  {t('checkout.quantity')}: {item.quantity}
                </p>
                <p className="text-sm font-medium text-charcoal">
                  €{item.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-sand/50 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-warm-gray">
          <span>{t('checkout.subtotal')}</span>
          <span>€{itemsSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-warm-gray">
          <span>{t('checkout.shipping')}</span>
          <span>
            {shippingTotal === 0 && shippingLabel
              ? t('checkout.freeShipping')
              : shippingTotal > 0
                ? `€${shippingTotal.toFixed(2)}`
                : '—'}
          </span>
        </div>
        <div className="flex justify-between text-base font-semibold text-charcoal border-t border-sand/50 pt-2 mt-2">
          <span>{t('checkout.total')}</span>
          <span className="font-serif text-lg">€{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function CheckoutForm({ locale }: { locale: string }) {
  const t = useTranslations();
  const router = useRouter();
  const {
    items,
    itemsSubtotal,
    shippingTotal,
    subtotal,
    isInitialized,
    cartId,
    closeDrawer,
    clearCart,
  } = useCart();

  // ── Form state ──
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Shipping ──
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [shippingLabel, setShippingLabel] = useState<string | undefined>();
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [addressSavedHash, setAddressSavedHash] = useState('');

  // ── Submit ──
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // ── Mobile summary ──
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close cart drawer on mount
  useEffect(() => {
    closeDrawer();
  }, [closeDrawer]);

  // Redirect to shop if cart is empty once initialized
  useEffect(() => {
    if (!isInitialized) return;
    if (!cartId || items.length === 0) {
      router.push('/shop');
    }
  }, [isInitialized, cartId, items.length, router]);

  // ── Field change handler ──
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  // ── Address hash for debounce guard ──
  const addressHash = [
    form.email, form.firstName, form.lastName,
    form.address, form.city, form.postalCode,
  ].join('|');

  const addressComplete =
    form.email.includes('@') &&
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.address.trim() &&
    form.city.trim() &&
    form.postalCode.trim();

  // ── Auto-update cart + fetch shipping when address is complete ──
  const updateCartAndFetchShipping = useCallback(async () => {
    if (!cartId) return;
    setIsLoadingShipping(true);
    try {
      // Update cart with email + address
      const updateRes = await fetch(`${MEDUSA_URL}/store/carts/${cartId}`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          email: form.email,
          shipping_address: {
            first_name: form.firstName,
            last_name: form.lastName,
            address_1: form.address,
            city: form.city,
            postal_code: form.postalCode,
            country_code: 'lt',
            phone: form.phone || undefined,
          },
        }),
      });
      if (!updateRes.ok) return;

      // Fetch shipping options for this cart
      const shippingRes = await fetch(
        `${MEDUSA_URL}/store/shipping-options?cart_id=${cartId}`,
        { headers: HEADERS },
      );
      if (!shippingRes.ok) return;
      const shippingData = await shippingRes.json();
      const options: any[] = shippingData.shipping_options ?? [];
      setShippingOptions(options);

      // Auto-select if only one option
      if (options.length === 1 && !selectedShipping) {
        await selectShippingMethod(options[0].id, options[0].name, cartId);
      }

      setAddressSavedHash(addressHash);
    } catch {
      // Silent fail — will retry on next change
    } finally {
      setIsLoadingShipping(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartId, form, addressHash, selectedShipping]);

  useEffect(() => {
    if (!addressComplete || !cartId) return;
    if (addressHash === addressSavedHash) return;
    const timer = setTimeout(() => {
      updateCartAndFetchShipping();
    }, 700);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressHash, addressComplete, cartId]);

  // ── Select shipping method ──
  async function selectShippingMethod(optionId: string, label: string, overrideCartId?: string) {
    const id = overrideCartId ?? cartId;
    if (!id) return;
    try {
      const res = await fetch(`${MEDUSA_URL}/store/carts/${id}/shipping-methods`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({ option_id: optionId }),
      });
      if (res.ok) {
        setSelectedShipping(optionId);
        setShippingLabel(label);
        if (errors.shipping) setErrors((prev) => ({ ...prev, shipping: '' }));
      }
    } catch {
      // ignore
    }
  }

  // ── Validation ──
  function validate(): boolean {
    const e: Record<string, string> = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRe.test(form.email)) e.email = t('checkout.invalidEmail');
    if (!form.firstName.trim()) e.firstName = t('checkout.required');
    if (!form.lastName.trim()) e.lastName = t('checkout.required');
    if (!form.address.trim()) e.address = t('checkout.required');
    if (!form.city.trim()) e.city = t('checkout.required');
    if (!form.postalCode.trim()) e.postalCode = t('checkout.required');
    if (!form.phone.trim()) e.phone = t('checkout.required');
    if (!selectedShipping) e.shipping = t('checkout.required');
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Submit ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (!cartId) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Final cart update with all fields (incl. phone)
      const updateRes = await fetch(`${MEDUSA_URL}/store/carts/${cartId}`, {
        method: 'POST',
        headers: HEADERS,
        body: JSON.stringify({
          email: form.email,
          shipping_address: {
            first_name: form.firstName,
            last_name: form.lastName,
            address_1: form.address,
            city: form.city,
            postal_code: form.postalCode,
            country_code: 'lt',
            phone: form.phone,
          },
        }),
      });
      if (!updateRes.ok) throw new Error('connection');

      // 2. Initialize payment collection (Medusa v2)
      // Try creating a payment collection first; if it fails, proceed directly to complete
      try {
        const collectionRes = await fetch(`${MEDUSA_URL}/store/payment-collections`, {
          method: 'POST',
          headers: HEADERS,
          body: JSON.stringify({ cart_id: cartId }),
        });
        if (collectionRes.ok) {
          const { payment_collection } = await collectionRes.json();
          if (payment_collection?.id) {
            await fetch(
              `${MEDUSA_URL}/store/payment-collections/${payment_collection.id}/payment-sessions`,
              {
                method: 'POST',
                headers: HEADERS,
                body: JSON.stringify({ provider_id: 'pp_system_default' }),
              },
            );
          }
        }
      } catch {
        // Payment init is optional for system provider — continue to complete
      }

      // 3. Complete cart
      const completeRes = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/complete`, {
        method: 'POST',
        headers: HEADERS,
      });
      if (!completeRes.ok) throw new Error('generic');

      const completeData = await completeRes.json();

      if (completeData.type === 'order' && completeData.order) {
        const order = completeData.order;
        clearCart();
        const orderId = order.display_id ?? order.id;
        router.push(
          `/order-confirmation/${orderId}?email=${encodeURIComponent(form.email)}` as any,
        );
      } else if (completeData.message?.toLowerCase().includes('stock')) {
        throw new Error('stock');
      } else {
        throw new Error('generic');
      }
    } catch (err: any) {
      const msg = err?.message ?? '';
      if (msg === 'connection') setSubmitError(t('checkout.errorConnection'));
      else if (msg === 'stock') setSubmitError(t('checkout.errorStock'));
      else setSubmitError(t('checkout.errorGeneric'));
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Loading state while cart initializes ──
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-olive animate-spin" />
      </div>
    );
  }

  const total = subtotal;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
      {/* Page title */}
      <h1 className="font-serif text-2xl md:text-3xl text-charcoal mb-8">
        {t('checkout.title')}
      </h1>

      {/* Mobile: collapsible order summary */}
      <div className="lg:hidden mb-6 bg-sand/20 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-4 cursor-pointer"
        >
          <span className="text-sm font-medium text-charcoal">
            {mobileOpen ? t('checkout.hideOrder') : t('checkout.showOrder')}
            {' '}
            <span className="text-warm-gray font-normal">
              ({items.length} {t('checkout.items')})
            </span>
          </span>
          <div className="flex items-center gap-3">
            <span className="font-serif text-base text-charcoal">€{total.toFixed(2)}</span>
            {mobileOpen ? (
              <ChevronUp className="w-4 h-4 text-warm-gray" />
            ) : (
              <ChevronDown className="w-4 h-4 text-warm-gray" />
            )}
          </div>
        </button>
        {mobileOpen && (
          <div className="px-5 pb-5">
            <OrderSummaryPanel
              items={items}
              itemsSubtotal={itemsSubtotal}
              shippingTotal={shippingTotal}
              total={total}
              shippingLabel={shippingLabel}
              t={t}
            />
          </div>
        )}
      </div>

      {/* Main layout */}
      <div className="lg:grid lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] lg:gap-12 lg:items-start">

        {/* ── Left: Form ── */}
        <form onSubmit={handleSubmit} noValidate className="space-y-8">

          {/* Error banner */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {submitError}
            </div>
          )}

          {/* Section 1: Contact */}
          <section>
            <SectionHeading>{t('checkout.contact')}</SectionHeading>
            <Field
              label={t('checkout.email')}
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />
          </section>

          <div className="border-t border-sand/50" />

          {/* Section 2: Shipping address */}
          <section>
            <SectionHeading>{t('checkout.shippingAddress')}</SectionHeading>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label={t('checkout.firstName')}
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  autoComplete="given-name"
                />
                <Field
                  label={t('checkout.lastName')}
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  autoComplete="family-name"
                />
              </div>
              <Field
                label={t('checkout.address')}
                name="address"
                value={form.address}
                onChange={handleChange}
                error={errors.address}
                autoComplete="street-address"
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label={t('checkout.city')}
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  error={errors.city}
                  autoComplete="address-level2"
                />
                <Field
                  label={t('checkout.postalCode')}
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  error={errors.postalCode}
                  autoComplete="postal-code"
                />
              </div>
              <Field
                label={t('checkout.phone')}
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
                autoComplete="tel"
              />
              {/* Country: read-only */}
              <div>
                <p className="text-xs text-warm-gray mb-1.5">{t('checkout.country')}</p>
                <p className="text-sm text-charcoal px-4 py-3 border border-sand/50 rounded-lg bg-sand/20">
                  {t('checkout.lithuania')}
                </p>
              </div>
            </div>
          </section>

          <div className="border-t border-sand/50" />

          {/* Section 3: Shipping method */}
          <section>
            <SectionHeading>{t('checkout.shippingMethod')}</SectionHeading>
            {isLoadingShipping ? (
              <div className="flex items-center gap-2 text-sm text-warm-gray py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>…</span>
              </div>
            ) : shippingOptions.length === 0 ? (
              <p className="text-sm text-warm-gray/70 italic">
                {addressComplete ? '—' : t('checkout.fillAddressFirst') }
              </p>
            ) : (
              <div className="space-y-3">
                {shippingOptions.map((opt) => {
                  const price = Number(opt.amount ?? 0);
                  const isSelected = selectedShipping === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer transition-colors
                        ${isSelected ? 'border-olive bg-olive/5' : 'border-sand hover:border-olive/40'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                            ${isSelected ? 'border-olive' : 'border-warm-gray/40'}`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-olive" />}
                        </div>
                        <input
                          type="radio"
                          name="shipping"
                          value={opt.id}
                          checked={isSelected}
                          onChange={() => selectShippingMethod(opt.id, opt.name)}
                          className="sr-only"
                        />
                        <span className="text-sm text-charcoal">{opt.name}</span>
                      </div>
                      <span className="text-sm font-medium text-charcoal">
                        {price === 0 ? t('checkout.freeShipping') : `€${price.toFixed(2)}`}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
            {errors.shipping && (
              <p className="text-xs text-red-500 mt-2">{errors.shipping}</p>
            )}
          </section>

          <div className="border-t border-sand/50" />

          {/* Section 4: Payment */}
          <section>
            <SectionHeading>{t('checkout.paymentMethod')}</SectionHeading>
            <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-olive bg-olive/5 cursor-pointer">
              <div className="w-4 h-4 rounded-full border-2 border-olive flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-olive" />
              </div>
              <span className="text-sm text-charcoal">{t('checkout.paymentBank')}</span>
            </label>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-olive text-cream py-4 rounded text-sm uppercase tracking-widest font-medium hover:bg-olive-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-default cursor-pointer flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('checkout.processing')}
              </>
            ) : (
              <>
                {t('checkout.placeOrder')}
                <span className="opacity-80">€{total.toFixed(2)}</span>
              </>
            )}
          </button>

          {/* Back to shop */}
          <div className="text-center">
            <Link
              href="/shop"
              className="text-sm text-warm-gray hover:text-olive transition-colors"
            >
              ← {t('cart.continueShopping')}
            </Link>
          </div>
        </form>

        {/* ── Right: Order summary (desktop sticky) ── */}
        <aside className="hidden lg:block sticky top-8">
          <div className="bg-sand/20 rounded-2xl p-6">
            <OrderSummaryPanel
              items={items}
              itemsSubtotal={itemsSubtotal}
              shippingTotal={shippingTotal}
              total={total}
              shippingLabel={shippingLabel}
              t={t}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
