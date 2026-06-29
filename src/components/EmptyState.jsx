import styles from './EmptyState.module.css';

export default function EmptyState({ hasFilters, onClear, onAdd }) {
  return (
    <div className={styles.wrap} role="status" aria-label="No users found">
      <div className={styles.illustration} aria-hidden="true">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="40" cy="40" r="40" fill="var(--clr-primary-light)" />
          <circle cx="40" cy="32" r="12" fill="var(--clr-primary)" opacity="0.3" />
          <path d="M20 60c0-11.046 8.954-20 20-20s20 8.954 20 20" fill="var(--clr-primary)" opacity="0.15" />
          {hasFilters && (
            <>
              <line x1="54" y1="54" x2="66" y2="66" stroke="var(--clr-warning)" strokeWidth="3.5" strokeLinecap="round"/>
              <circle cx="50" cy="50" r="10" stroke="var(--clr-warning)" strokeWidth="3" fill="none"/>
            </>
          )}
        </svg>
      </div>
      <h3 className={styles.title}>
        {hasFilters ? 'No matching users' : 'No users yet'}
      </h3>
      <p className={styles.desc}>
        {hasFilters
          ? 'Try adjusting your search or filter criteria.'
          : 'Get started by adding your first team member.'}
      </p>
      <div className={styles.actions}>
        {hasFilters && (
          <button className={styles.clearBtn} onClick={onClear}>
            Clear filters
          </button>
        )}
        <button className={styles.addBtn} onClick={onAdd}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add user
        </button>
      </div>
    </div>
  );
}
