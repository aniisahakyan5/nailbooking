"use client";

import { useState } from "react";
import { updateEmployeeRole, createEmployee } from "@/app/actions/employees";
import styles from "./employees.module.css";
import { Shield, Mail, Phone, Plus, UserCheck } from "lucide-react";

export default function EmployeesAdmin({ initialData }: { initialData: any[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({ name: "", surname: "", email: "", phone: "", role: "ADMIN" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEmployee(form);
    setIsAdding(false);
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Staff & Administration</h1>
        <button className="btn-primary" onClick={() => setIsAdding(true)}>
          <Plus size={20} /> Add Staff
        </button>
      </header>

      {isAdding && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} glass-card`}>
            <h2>Add New Staff Member</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <div className={styles.field}><label>Name</label><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                <div className={styles.field}><label>Surname</label><input required value={form.surname} onChange={e => setForm({...form, surname: e.target.value})} /></div>
              </div>
              <div className={styles.field}><label>Email</label><input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div className={styles.field}><label>Phone</label><input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
              <div className={styles.field}>
                <label>Role</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPERADMIN">Super Admin</option>
                </select>
              </div>
              <div className={styles.actions}>
                <button type="button" onClick={() => setIsAdding(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Staff</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.grid}>
        {initialData.map((emp: any) => (
          <div key={emp.id} className="glass-card">
            <div className={styles.cardHeader}>
              <div>
                <h3>{emp.name} {emp.surname}</h3>
                <span className={styles.roleBadge}>{emp.role}</span>
              </div>
              <Shield className={emp.role === "SUPERADMIN" ? styles.superAdmin : styles.admin} />
            </div>
            <div className={styles.details}>
              <span><Mail size={14} /> {emp.email}</span>
              <span><Phone size={14} /> {emp.phone}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
