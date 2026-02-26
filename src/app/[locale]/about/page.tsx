import { useTranslations } from 'next-intl';
import AboutHero from '@/components/sections/AboutHero';
import AboutStory from '@/components/sections/AboutStory';
import AboutPrinciples from '@/components/sections/AboutPrinciples';
import AboutCTA from '@/components/sections/AboutCTA';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <>
      <AboutHero />
      <AboutStory
        image="/images/about/about-workspace.png"
        imageAlt={t('story.label')}
        label={t('story.label')}
        text={t('story.text')}
        reversed
        bg="bg-cream"
      />
      <AboutStory
        image="/images/about/about-studio.png"
        imageAlt={t('create.label')}
        label={t('create.label')}
        text={t('create.text')}
        bg="bg-sand/20"
      />
      <AboutPrinciples />
      <AboutCTA />
    </>
  );
}
