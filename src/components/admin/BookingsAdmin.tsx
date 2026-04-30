"use client";

import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import { getBookingsByDate } from "@/app/actions/bookings_admin";
import { ChevronLeft, ChevronRight, Clock, User, Scissors } from "lucide-react";
import styles from "./bookings.module.css";

export default function BookingsAdmin() {
  const [date, setDate] = useState(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBookingsByDate(date).then(data => {
      setBookings(data);
      setLoading(false);
    });
  }, [date]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Daily Bookings</h1>
        <div className={styles.dateNav}>
          <button onClick={() => setDate(subDays(date, 1))}><ChevronLeft /></button>
          <span>{format(date, "MMMM dd, yyyy")}</span>
          <button onClick={() => setDate(addDays(date, 1))}><ChevronRight /></button>
        </div>
      </header>

      <div className="glass-card" style={{ padding: 0 }}>
        {loading ? (
          <div className={styles.center}>Loading...</div>
        ) : bookings.length === 0 ? (
          <div className={styles.center}>No bookings for this day.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Customer</th>
                <th>Procedure</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b: any) => (
                <tr key={b.id}>
                  <td>
                    <div className={styles.timeInfo}>
                      <Clock size={16} />
                      {format(b.startTime, "HH:mm")} - {format(b.endTime, "HH:mm")}
                    </div>
                  </td>
                  <td>
                    <div className={styles.userInfo}>
                      <User size={16} />
                      <span>{b.user.name} {b.user.surname || ""}</span>
                      <small>{b.user.phone}</small>
                    </div>
                  </td>
                  <td>
                    <div className={styles.procInfo}>
                      <Scissors size={16} />
                      {b.procedure.nameKey}
                    </div>
                  </td>
                  <td>{b.procedure.price} AMD</td>
                  <td>
                    <span className={`${styles.badge} ${styles[b.status.toLowerCase()]}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
