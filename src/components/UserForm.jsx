import { useState, useEffect, useRef } from 'react';
import { DEPARTMENTS } from '../utils/constants';
import { validateUserForm, isFormValid } from '../utils/validators';
import styles from './UserForm.module.css';

const EMPTY = { firstName: '', lastName: '', email: '', department: '' };

export default function UserForm({ isOpen, user, allUsers, onSave, onClose, loading }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const firstRef = useRef(null);

  const isEdit = Boolean(user);

  useEffect(() => {
    if (isOpen) {
      setValues(user ? { firstName: user.firstName, lastName: user.lastName, email: user.email, department: user.department } : EMPTY);
      setErrors({});
      setTouched({});
      setTimeout(() => firstRef.current?.focus(), 50);
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const set = (field) => (e) => {
    const val = e.target.value;
    setValues((v) => ({ ...v, [field]: val }));
    if (touched[field]) {
      const errs = validateUserForm({ ...values, [field]: val }, allUsers, user?.id);
      setErrors(errs);
    }
  };

  const blur = (field) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    const errs = validateUserForm(values, allUsers, user?.id);
    setErrors(errs);
  };

  async function submit() {
    const allTouched = { firstName: true, lastName: true, email: true, department: true };
    setTouched(allTouched);
    const errs = validateUserForm(values, allUsers, user?.id);
    setErrors(errs);
    if (!isFormValid(errs)) return;
    await onSave(values);
  }

  const fields = [
    { key: 'firstName', label: 'First Name', type: 'text', placeholder: 'e.g. Jane' },
    { key: 'lastName', label: 'Last Name', type: 'text', placeholder: 'e.g. Doe' },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'jane@example.com' },
  ];

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit user' : 'Add new user'}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          <div className={styles.headIcon} aria-hidden="true">
            {isEdit ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </div>
          <h2 className={styles.title}>{isEdit ? 'Edit User' : 'Add New User'}</h2>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.row}>
            {fields.slice(0, 2).map(({ key, label, type, placeholder }) => (
              <label key={key} className={styles.field}>
                <span className={styles.lbl}>{label} <span className={styles.req} aria-hidden="true">*</span></span>
                <input
                  ref={key === 'firstName' ? firstRef : undefined}
                  type={type}
                  className={`${styles.input} ${touched[key] && errors[key] ? styles.inputErr : ''}`}
                  value={values[key]}
                  onChange={set(key)}
                  onBlur={blur(key)}
                  placeholder={placeholder}
                  aria-required="true"
                  aria-invalid={Boolean(touched[key] && errors[key])}
                  aria-describedby={touched[key] && errors[key] ? `${key}-err` : undefined}
                />
                {touched[key] && errors[key] && (
                  <span className={styles.errMsg} id={`${key}-err`} role="alert">{errors[key]}</span>
                )}
              </label>
            ))}
          </div>

          {fields.slice(2).map(({ key, label, type, placeholder }) => (
            <label key={key} className={styles.field}>
              <span className={styles.lbl}>{label} <span className={styles.req} aria-hidden="true">*</span></span>
              <input
                type={type}
                className={`${styles.input} ${touched[key] && errors[key] ? styles.inputErr : ''}`}
                value={values[key]}
                onChange={set(key)}
                onBlur={blur(key)}
                placeholder={placeholder}
                aria-required="true"
                aria-invalid={Boolean(touched[key] && errors[key])}
                aria-describedby={touched[key] && errors[key] ? `${key}-err` : undefined}
              />
              {touched[key] && errors[key] && (
                <span className={styles.errMsg} id={`${key}-err`} role="alert">{errors[key]}</span>
              )}
            </label>
          ))}

          <label className={styles.field}>
            <span className={styles.lbl}>Department <span className={styles.req} aria-hidden="true">*</span></span>
            <select
              className={`${styles.input} ${touched.department && errors.department ? styles.inputErr : ''}`}
              value={values.department}
              onChange={set('department')}
              onBlur={blur('department')}
              aria-required="true"
              aria-invalid={Boolean(touched.department && errors.department)}
            >
              <option value="">Select a department…</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            {touched.department && errors.department && (
              <span className={styles.errMsg} role="alert">{errors.department}</span>
            )}
          </label>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>Cancel</button>
          <button className={styles.saveBtn} onClick={submit} disabled={loading} aria-busy={loading}>
            {loading ? (
              <span className={styles.spinner} aria-hidden="true" />
            ) : null}
            {loading ? (isEdit ? 'Saving…' : 'Adding…') : (isEdit ? 'Save changes' : 'Add user')}
          </button>
        </div>
      </div>
    </div>
  );
}
