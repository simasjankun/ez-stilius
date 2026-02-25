import HomeHero from '@/components/sections/HomeHero';
import CategoriesSection from '@/components/sections/CategoriesSection';
import FeaturedProducts from '@/components/sections/FeaturedProducts';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <CategoriesSection />
      <FeaturedProducts />
    </>
  );
}
