export const dynamic = 'force-dynamic';

import HomeHero from '@/components/sections/HomeHero';
import CategoriesSection from '@/components/sections/CategoriesSection';
import FeaturedProductsServer from '@/components/sections/FeaturedProductsServer';
import AboutStrip from '@/components/sections/AboutStrip';
import USPSection from '@/components/sections/USPSection';
import GallerySection from '@/components/sections/GallerySection';

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <CategoriesSection />
      <FeaturedProductsServer />
      <AboutStrip />
      <USPSection />
      <GallerySection />
    </>
  );
}
