"use client";

import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { getProcedures, getAvailableSlots, createBooking } from "@/app/actions/booking";
import styles from "./BookingWizard.module.css";
import { Loader2, Check, ChevronRight, ChevronLeft } from "lucide-react";

export default function BookingWizard({ lang, dict }: { lang: string, dict: any }) {
  const [step, setStep] = useState(1);
  const [procedures, setProcedures] = useState<any[]>([]);
  const [selectedProcedures, setSelectedProcedures] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    getProcedures().then(setProcedures);
  }, []);

  useEffect(() => {
    if (step === 2 && selectedProcedures.length > 0) {
      setLoading(true);
      getAvailableSlots(selectedDate, selectedProcedures).then(slots => {
        setAvailableSlots(slots);
        setLoading(false);
      });
    }
  }, [step, selectedDate, selectedProcedures]);

  const handleProcedureToggle = (id: string) => {
    setSelectedProcedures(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleBooking = async () => {
    if (!selectedTime) return;
    setLoading(true);
    try {
      const slot = availableSlots.find(s => s.time === selectedTime);
      await createBooking({
        userId: "temp-user-id", // Need actual user session here
        procedureIds: selectedProcedures,
        startTime: slot.dateTime
      });
      setBookingStatus("success");
      setStep(3);
    } catch (err) {
      setBookingStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wizard}>
      <div className={styles.steps}>
        {[1, 2, 3].map((s: number) => (
          <div key={s} className={`${styles.stepIndicator} ${step >= s ? styles.activeStep : ""}`}>
            {s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="animate-fade-in">
          <h2>{dict["select_procedures"] || "Select Procedures"}</h2>
          <div className={styles.list}>
            {procedures.map((p: any) => (
              <div 
                key={p.id} 
                className={`${styles.item} ${selectedProcedures.includes(p.id) ? styles.selected : ""}`}
                onClick={() => handleProcedureToggle(p.id)}
              >
                <div>
                  <h4>{p.nameKey}</h4>
                  <span>{p.duration} min | {p.price} AMD</span>
                </div>
                {selectedProcedures.includes(p.id) && <Check size={20} />}
              </div>
            ))}
          </div>
          <button 
            className="btn-primary" 
            disabled={selectedProcedures.length === 0}
            onClick={() => setStep(2)}
            style={{ marginTop: '2rem', width: '100%' }}
          >
            {dict["next"] || "Next"} <ChevronRight size={20} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <h2>{dict["choose_date_time"] || "Choose Date & Time"}</h2>
          <div className={styles.datePicker}>
            {[0, 1, 2, 3, 4, 5, 6].map((i: number) => {
              const d = addDays(new Date(), i);
              return (
                <div 
                  key={i} 
                  className={`${styles.dateItem} ${format(selectedDate, "yyy-MM-dd") === format(d, "yyy-MM-dd") ? styles.dateSelected : ""}`}
                  onClick={() => setSelectedDate(d)}
                >
                  <span>{format(d, "EEE")}</span>
                  <strong>{format(d, "dd")}</strong>
                </div>
              );
            })}
          </div>

          {loading ? (
            <div className={styles.center}><Loader2 className={styles.spin} /></div>
          ) : (
            <div className={styles.slotsGrid}>
              {availableSlots.map((s: any) => (
                <button
                  key={s.time}
                  disabled={!s.available}
                  className={`${styles.slot} ${selectedTime === s.time ? styles.slotSelected : ""}`}
                  onClick={() => setSelectedTime(s.time)}
                >
                  {s.time}
                </button>
              ))}
            </div>
          )}

          <div className={styles.actions}>
            <button onClick={() => setStep(1)}><ChevronLeft /> {dict["back"] || "Back"}</button>
            <button 
              className="btn-primary" 
              disabled={!selectedTime || loading}
              onClick={handleBooking}
            >
              {dict["confirm_booking"] || "Confirm Booking"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={styles.success}>
          <div className={styles.successIcon}><Check size={60} /></div>
          <h2>{dict["booking_confirmed"] || "Booking Confirmed!"}</h2>
          <p>{dict["success_message"] || "We are looking forward to seeing you at Begumyan Nail."}</p>
          <button className="btn-primary" onClick={() => window.location.href = `/${lang}`}>
            {dict["go_home"] || "Go Home"}
          </button>
        </div>
      )}
    </div>
  );
}
