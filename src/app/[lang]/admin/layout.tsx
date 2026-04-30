import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LayoutDashboard, Languages, Scissors, Users, Calendar, ShieldCheck } from "lucide-react";
import styles from "./layout.module.css";

export default async function AdminLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const session = await auth();
  
  // Extra safety check despite middleware
  if (!session?.user || (session.user as any).role === "CLIENT") {
    redirect(`/${lang}`);
  }

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>BEGUMYAN BO</div>
        <nav className={styles.nav}>
          <Link href={`/${lang}/admin`}><LayoutDashboard size={20} /> Dashboard</Link>
          <Link href={`/${lang}/admin/translations`}><Languages size={20} /> Translations</Link>
          <Link href={`/${lang}/admin/procedures`}><Scissors size={20} /> Procedures</Link>
          <Link href={`/${lang}/admin/bookings`}><Calendar size={20} /> Bookings</Link>
          <Link href={`/${lang}/admin/customers`}><Users size={20} /> Customers</Link>
          <Link href={`/${lang}/admin/employees`}><ShieldCheck size={20} /> Administration</Link>
        </nav>
      </aside>
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
}
