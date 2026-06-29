import styles from './MobileCards.module.css';

const DEPT_COLORS = {
  Engineering: 'blue', HR: 'green', Finance: 'purple',
  Marketing: 'orange', Operations: 'red', IT: 'cyan',
};

export default function MobileCards({ users, onEdit, onDelete, loading }) {
  if (loading) {
    return (
      <div className={styles.list}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={styles.card} aria-hidden="true">
            <div className={styles.cardHead}>
              <div className={`skeleton ${styles.avatarSk}`} />
              <div className={styles.nameSk}>
                <div className={`skeleton ${styles.nameLine}`} />
                <div className={`skeleton ${styles.emailLine}`} />
              </div>
            </div>
            <div className={`skeleton ${styles.deptSk}`} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {users.map((user) => {
        const color = DEPT_COLORS[user.department] ?? 'blue';
        const avatar = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();
        return (
          <div key={user.id} className={styles.card}>
            <div className={styles.cardHead}>
              <div className={`${styles.avatar} ${styles[color]}`} aria-hidden="true">{avatar}</div>
              <div className={styles.meta}>
                <span className={styles.name}>{user.firstName} {user.lastName}</span>
                <a href={`mailto:${user.email}`} className={styles.email}>{user.email}</a>
              </div>
              <span className={`${styles.dept} ${styles[color]}`}>{user.department}</span>
            </div>
            <div className={styles.cardFooter}>
              <span className={styles.id}>#{user.id}</span>
              <div className={styles.actions}>
                <button className={styles.editBtn} onClick={() => onEdit(user)} aria-label={`Edit ${user.firstName}`}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Edit
                </button>
                <button className={styles.deleteBtn} onClick={() => onDelete(user)} aria-label={`Delete ${user.firstName}`}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
