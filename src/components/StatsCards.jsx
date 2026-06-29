import styles from './StatsCards.module.css';

const cards = [
  {
    key: 'total',
    label: 'Total Users',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: 'primary',
  },
  {
    key: 'departments',
    label: 'Departments',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    color: 'success',
  },
  {
    key: 'activeFilters',
    label: 'Active Filters',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
      </svg>
    ),
    color: 'warning',
  },
  {
    key: 'currentPageCount',
    label: 'This Page',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    color: 'danger',
  },
];

export default function StatsCards({ stats, loading }) {
  return (
    <div className={styles.grid} role="region" aria-label="Summary statistics">
      {cards.map(({ key, label, icon, color }) => (
        <div key={key} className={`${styles.card} ${styles[color]}`}>
          <div className={styles.iconWrap}>{icon}</div>
          <div className={styles.content}>
            {loading ? (
              <div className={`skeleton ${styles.numSkeleton}`} />
            ) : (
              <span className={styles.number}>{stats[key] ?? 0}</span>
            )}
            <span className={styles.label}>{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
