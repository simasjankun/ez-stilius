import { useTranslations } from 'next-intl';
import PageHero from '@/components/sections/PageHero';
import ContactInfo from '@/components/contacts/ContactInfo';
import ContactForm from '@/components/contacts/ContactForm';

export default function ContactsPage() {
  const t = useTranslations('contacts');
  const tb = useTranslations('breadcrumb');

  return (
    <>
      <PageHero
        title={t('title')}
        breadcrumbs={[
          { label: tb('home'), href: '/' },
          { label: t('title') },
        ]}
      />

      {/* Contact info + form */}
      <section className="bg-cream py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-16">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Map */}
      <div className="bg-cream pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-[400px] md:h-[450px] rounded-lg overflow-hidden">
            <iframe
              src="https://maps.google.com/maps?q=Liepu+g.+8,+Veivirzenai,+Lithuania&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </>
  );
}
