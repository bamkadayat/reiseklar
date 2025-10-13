import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';

export default function Home() {
  return (
    <>
      <div className="w-full min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-950 to-purple-950 px-4 py-16 sm:py-20">
        <HeroSection />
      </div>
      <FeaturesSection />
    </>
  );
}
