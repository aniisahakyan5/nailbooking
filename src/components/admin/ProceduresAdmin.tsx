"use client";

import { useState } from "react";
import { createProcedure, deleteProcedure } from "@/app/actions/procedures";
import styles from "./procedures.module.css";
import { Plus, Trash2, Clock, DollarSign } from "lucide-react";

export default function ProceduresAdmin({ initialData }: { initialData: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    name: "",
    duration: 60,
    price: 5000,
    en: "",
    ru: "",
    hy: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProcedure({
      name: form.name,
      duration: Number(form.duration),
      price: Number(form.price),
      translations: { en: form.en, ru: form.ru, hy: form.hy }
    });
    setIsAdding(false);
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Salon Procedures</h1>
        <button className="btn-primary" onClick={() => setIsAdding(true)}>
          <Plus size={20} /> Add Procedure
        </button>
      </header>

      {isAdding && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} glass-card`}>
            <h2>New Procedure</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label>Identifier (internal)</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Gel Polish" />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label><Clock size={14} /> Duration (min)</label>
                  <input type="number" value={form.duration} onChange={e => setForm({...form, duration: Number(e.target.value)})} />
                </div>
                <div className={styles.field}>
                  <label><DollarSign size={14} /> Price (AMD)</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} />
                </div>
              </div>
              <hr />
              <h3>Translations</h3>
              <div className={styles.field}>
                <label>English Name</label>
                <input required value={form.en} onChange={e => setForm({...form, en: e.target.value})} />
              </div>
              <div className={styles.field}>
                <label>Russian Name</label>
                <input required value={form.ru} onChange={e => setForm({...form, ru: e.target.value})} />
              </div>
              <div className={styles.field}>
                <label>Armenian Name</label>
                <input required value={form.hy} onChange={e => setForm({...form, hy: e.target.value})} />
              </div>
              <div className={styles.actions}>
                <button type="button" onClick={() => setIsAdding(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Procedure</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.grid}>
        {initialData.map(p => (
          <div key={p.id} className="glass-card">
            <div className={styles.cardHeader}>
              <h3>{p.nameKey}</h3>
              <button onClick={() => deleteProcedure(p.id, p.nameKey)}><Trash2 size={18} /></button>
            </div>
            <div className={styles.cardStats}>
              <span><Clock size={16} /> {p.duration} min</span>
              <span><DollarSign size={16} /> {p.price} AMD</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
