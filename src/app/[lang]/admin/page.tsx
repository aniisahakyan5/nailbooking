import { db } from "@/lib/db";
import { format } from "date-fns";
import styles from "./dashboard.module.css";
import { Calendar, Users, Scissors, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const bookingsCount = await db.booking.count();
  const customersCount = await db.user.count({ where: { role: "CLIENT" } });
  const proceduresCount = await db.procedure.count();
  
  const recentBookings = await db.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true, procedure: true }
  });

  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>
      
      <div className={styles.stats}>
        <div className="glass-card">
          <Calendar />
          <div>
            <h3>Total Bookings</h3>
            <p>{bookingsCount}</p>
          </div>
        </div>
        <div className="glass-card">
          <Users />
          <div>
            <h3>Customers</h3>
            <p>{customersCount}</p>
          </div>
        </div>
        <div className="glass-card">
          <Scissors />
          <div>
            <h3>Procedures</h3>
            <p>{proceduresCount}</p>
          </div>
        </div>
      </div>

      <section className={styles.recent}>
        <h2>Recent Activity</h2>
        <div className="glass-card" style={{ padding: 0 }}>
          <table className={styles.table}>
            <tbody>
              {recentBookings.map(b => (
                <tr key={b.id}>
                  <td>{format(b.createdAt, "MMM dd")}</td>
                  <td>{b.user.name} booked {b.procedure.nameKey}</td>
                  <td style={{ color: 'var(--primary)' }}>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
