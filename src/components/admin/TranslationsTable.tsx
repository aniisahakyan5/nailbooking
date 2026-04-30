"use client";

import { useState } from "react";
import { upsertTranslation, deleteTranslation } from "@/app/actions/translations";
import styles from "./translations.module.css";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

export default function TranslationsTable({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ key: "", en: "", ru: "", hy: "" });
  const [isAdding, setIsAdding] = useState(false);

  const handleEdit = (item: any) => {
    setEditingKey(item.key);
    setEditForm(item);
  };

  const handleSave = async () => {
    await upsertTranslation(editForm);
    setEditingKey(null);
    setIsAdding(false);
    // In a real app, we'd refresh the data from server or update locally
    window.location.reload(); 
  };

  const handleDelete = async (key: string) => {
    if (confirm("Are you sure?")) {
      await deleteTranslation(key);
      window.location.reload();
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Content Translation</h1>
        <button className="btn-primary" onClick={() => { setIsAdding(true); setEditForm({ key: "", en: "", ru: "", hy: "" }); }}>
          <Plus size={20} /> Add Key
        </button>
      </header>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Key</th>
              <th>English</th>
              <th>Russian</th>
              <th>Armenian</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(isAdding) && (
              <tr className={styles.editingRow}>
                <td><input value={editForm.key} onChange={e => setEditForm({...editForm, key: e.target.value})} placeholder="new_key" /></td>
                <td><textarea value={editForm.en} onChange={e => setEditForm({...editForm, en: e.target.value})} /></td>
                <td><textarea value={editForm.ru} onChange={e => setEditForm({...editForm, ru: e.target.value})} /></td>
                <td><textarea value={editForm.hy} onChange={e => setEditForm({...editForm, hy: e.target.value})} /></td>
                <td className={styles.actions}>
                  <button onClick={handleSave} className={styles.saveBtn}><Save size={18} /></button>
                  <button onClick={() => setIsAdding(false)}><X size={18} /></button>
                </td>
              </tr>
            )}
            {data.map((item) => (
              editingKey === item.key ? (
                <tr key={item.key} className={styles.editingRow}>
                  <td>{item.key}</td>
                  <td><textarea value={editForm.en} onChange={e => setEditForm({...editForm, en: e.target.value})} /></td>
                  <td><textarea value={editForm.ru} onChange={e => setEditForm({...editForm, ru: e.target.value})} /></td>
                  <td><textarea value={editForm.hy} onChange={e => setEditForm({...editForm, hy: e.target.value})} /></td>
                  <td className={styles.actions}>
                    <button onClick={handleSave} className={styles.saveBtn}><Save size={18} /></button>
                    <button onClick={() => setEditingKey(null)}><X size={18} /></button>
                  </td>
                </tr>
              ) : (
                <tr key={item.key}>
                  <td className={styles.keyCell}>{item.key}</td>
                  <td>{item.en}</td>
                  <td>{item.ru}</td>
                  <td>{item.hy}</td>
                  <td className={styles.actions}>
                    <button onClick={() => handleEdit(item)}><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(item.key)} className={styles.deleteBtn}><Trash2 size={18} /></button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
