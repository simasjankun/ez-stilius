import HomeHero from '@/components/sections/HomeHero';
import CategoriesSection from '@/components/sections/CategoriesSection';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import AboutStrip from '@/components/sections/AboutStrip';
import USPSection from '@/components/sections/USPSection';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <CategoriesSection />
      <FeaturedProducts />
      <AboutStrip />
      <USPSection />
    </>
  );
}
