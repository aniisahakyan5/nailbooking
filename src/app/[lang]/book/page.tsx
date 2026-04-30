import { getTranslations, Locale } from "@/lib/i18n";
import BookingWizard from "@/components/BookingWizard";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function BookPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = await getTranslations(lang);

  return (
    <main style={{ padding: '2rem 5%' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Link href={`/${lang}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.6 }}>
          <ChevronLeft size={20} /> {dict["back_to_home"] || "Back to Home"}
        </Link>
      </header>

      <h1 style={{ textAlign: 'center', fontSize: '2.5rem' }}>{dict["book_appointment"] || "Book an Appointment"}</h1>
      <p style={{ textAlign: 'center', opacity: 0.6, marginBottom: '2rem' }}>
        {dict["book_subtitle"] || "Select your desired services and find a convenient time slot."}
      </p>

      <BookingWizard lang={lang} dict={dict} />
    </main>
  );
}
