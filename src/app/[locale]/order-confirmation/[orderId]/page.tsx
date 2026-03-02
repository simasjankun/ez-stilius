export const dynamic = 'force-dynamic';

import { getTranslations } from 'next-intl/server';
import { CheckCircle2 } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; orderId: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { orderId } = await params;
  const { email } = await searchParams;
  const t = await getTranslations('orderConfirmation');

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <CheckCircle2
          className="w-16 h-16 text-olive mx-auto mb-6"
          strokeWidth={1.5}
        />

        <h1 className="font-serif text-2xl md:text-3xl text-charcoal mb-4">
          {t('title')}
        </h1>

        <div className="bg-sand/20 rounded-2xl px-8 py-6 mb-8 space-y-3">
          <p className="text-sm text-warm-gray">
            {t('orderNumber')}:{' '}
            <span className="font-semibold text-charcoal">#{orderId}</span>
          </p>
          {email && (
            <p className="text-sm text-warm-gray">
              {t('emailSent')}:{' '}
              <span className="text-charcoal">{email}</span>
            </p>
          )}
        </div>

        <Link
          href="/shop"
          className="inline-block bg-olive text-cream px-8 py-4 rounded text-sm uppercase tracking-widest font-medium hover:bg-olive-dark transition-colors duration-200"
        >
          {t('backToShop')}
        </Link>
      </div>
    </div>
  );
}
