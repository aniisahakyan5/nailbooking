import { getTranslations, Locale } from "@/lib/i18n";
import Link from "next/link";
import styles from "./page.module.css";

export default async function LandingPage({ params }: { params: { lang: Locale } }) {
  const dict = await getTranslations(params.lang);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>BEGUMYAN NAIL</div>
        <nav className={styles.nav}>
          <Link href={`/${params.lang}/book`} className="btn-primary">
            {dict["book_now"] || "Book Now"}
          </Link>
          <div className={styles.langPicker}>
            <Link href="/en" className={params.lang === "en" ? styles.activeLang : ""}>EN</Link>
            <Link href="/ru" className={params.lang === "ru" ? styles.activeLang : ""}>RU</Link>
            <Link href="/hy" className={params.lang === "hy" ? styles.activeLang : ""}>ՀԱՅ</Link>
          </div>
        </nav>
      </header>

      <section className={styles.hero}>
        <div className="animate-fade-in">
          <h1 className="gradient-text">{dict["hero_title"] || "Elevate Your Elegance"}</h1>
          <p>{dict["hero_subtitle"] || "Premium nail care and beauty procedures in the heart of Armenia."}</p>
          <Link href={`/${params.lang}/book`} className="btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>
            {dict["get_started"] || "Get Started"}
          </Link>
        </div>
      </section>

      <section className={styles.services}>
        <h2>{dict["our_services"] || "Our Services"}</h2>
        <div className={styles.grid}>
          {/* We would fetch procedures here in a real scenario */}
          <div className="glass-card">
            <h3>{dict["manicure"] || "Manicure"}</h3>
            <p>60 min | 5000 AMD</p>
          </div>
          <div className="glass-card">
            <h3>{dict["pedicure"] || "Pedicure"}</h3>
            <p>90 min | 8000 AMD</p>
          </div>
          <div className="glass-card">
            <h3>{dict["nail_extension"] || "Nail Extension"}</h3>
            <p>120 min | 12000 AMD</p>
          </div>
        </div>
      </section>
    </main>
  );
}
