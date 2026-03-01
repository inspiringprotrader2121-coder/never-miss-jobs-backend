import { Nav } from '@/components/landing/Nav';
import { Hero } from '@/components/landing/Hero';
import { Problem } from '@/components/landing/Problem';
import { Solution } from '@/components/landing/Solution';
import { Impact } from '@/components/landing/Impact';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Pricing } from '@/components/landing/Pricing';
import { FinalCTA } from '@/components/landing/FinalCTA';

export const metadata = {
  title: 'TradeBooking — Automated Booking & Call Management for Trade Businesses',
  description:
    'TradeBooking captures calls, qualifies enquiries, and books jobs automatically. Built for UK plumbing, electrical, roofing, and building companies.',
};

export default function HomePage() {
  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <Nav />
      <Hero />
      <Problem />
      <Solution />
      <Impact />
      <Features />
      <HowItWorks />
      <Pricing />
      <FinalCTA />
    </div>
  );
}
