import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SectionHeader from '../../components/SectionHeader';
import BookingForm from '../../components/BookingForm';
import GradientMesh from '../../components/GradientMesh';
import Reveal from '../../components/Reveal';
import { createPageMetadata, siteName } from '../../lib/seo';

export const metadata = createPageMetadata({
  title: `Book a Slot | ${siteName} Digital Marketing & Appointment Booking`,
  description: 'Book a digital marketing strategy slot or an appointment call with the CraftLanee team. Pick a date and time that suits you.',
  path: '/book-slot',
  keywords: ['book a slot CraftLanee', 'digital marketing consultation', 'appointment booking', 'book a call Kuppam'],
});

export default function BookSlotPage() {
  return (
    <main className="min-h-screen bg-theme-background text-theme-primary">
      <Navbar />

      <section className="relative overflow-hidden bg-hero-gradient px-6 py-20 sm:px-10 sm:py-24">
        <GradientMesh />
        <div className="relative mx-auto max-w-4xl">
          <Reveal>
            <SectionHeader
              eyebrow="Book a Slot"
              title="Pick a time that works for you"
              description="Choose a digital marketing session or an appointment call, select a date and time, and our team will be ready for you."
            />
          </Reveal>
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <BookingForm />
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
