import { useEffect } from 'react';
import styles from './ConfirmDelete.module.css';

export default function ConfirmDelete({ isOpen, user, onConfirm, onClose, loading }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="alertdialog" aria-modal="true" aria-label="Confirm user deletion">
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconWrap} aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </div>
        <h2 className={styles.title}>Delete user?</h2>
        <p className={styles.body}>
          You're about to permanently delete{' '}
          <strong>{user.firstName} {user.lastName}</strong>. This action cannot be undone.
        </p>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={loading}>Keep user</button>
          <button className={styles.confirmBtn} onClick={onConfirm} disabled={loading} aria-busy={loading}>
            {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
            {loading ? 'Deleting…' : 'Delete user'}
          </button>
        </div>
      </div>
    </div>
  );
}
