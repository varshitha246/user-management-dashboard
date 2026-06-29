import { useState, useEffect } from 'react';
import { DEPARTMENTS } from '../utils/constants';
import styles from './FilterModal.module.css';

const EMPTY = { firstName: '', lastName: '', email: '', department: '' };

export default function FilterModal({ isOpen, filters, onApply, onClose }) {
  const [draft, setDraft] = useState(filters);

  useEffect(() => { setDraft(filters); }, [filters, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const set = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }));

  function apply() { onApply(draft); onClose(); }
  function reset() { setDraft(EMPTY); onApply(EMPTY); onClose(); }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Advanced filters">
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          <h2 className={styles.title}>Advanced Filters</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close filter panel">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          {['firstName', 'lastName', 'email'].map((field) => (
            <label key={field} className={styles.field}>
              <span className={styles.lbl}>{field === 'firstName' ? 'First Name' : field === 'lastName' ? 'Last Name' : 'Email'}</span>
              <input
                type="text"
                className={styles.input}
                value={draft[field]}
                onChange={set(field)}
                placeholder={`Filter by ${field === 'firstName' ? 'first name' : field === 'lastName' ? 'last name' : 'email'}…`}
              />
            </label>
          ))}

          <label className={styles.field}>
            <span className={styles.lbl}>Department</span>
            <select className={styles.input} value={draft.department} onChange={set('department')}>
              <option value="">All departments</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>
        </div>

        <div className={styles.footer}>
          <button className={styles.resetBtn} onClick={reset}>Reset all</button>
          <button className={styles.applyBtn} onClick={apply}>Apply filters</button>
        </div>
      </div>
    </div>
  );
}
