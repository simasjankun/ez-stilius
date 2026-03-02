export const dynamic = 'force-dynamic';

import CheckoutForm from '@/components/checkout/CheckoutForm';

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <CheckoutForm locale={locale} />;
}
