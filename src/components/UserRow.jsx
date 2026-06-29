import styles from './UserRow.module.css';

const DEPT_COLORS = {
  Engineering: 'blue',
  HR: 'green',
  Finance: 'purple',
  Marketing: 'orange',
  Operations: 'red',
  IT: 'cyan',
};

export default function UserRow({ user, onEdit, onDelete }) {
  const avatar = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

  return (
    <tr className={styles.row}>
      <td className={styles.td}>
        <span className={styles.id}>#{user.id}</span>
      </td>
      <td className={styles.td}>
        <div className={styles.nameCell}>
          <div className={`${styles.avatar} ${styles[DEPT_COLORS[user.department] ?? 'blue']}`} aria-hidden="true">
            {avatar}
          </div>
          <span>{user.firstName}</span>
        </div>
      </td>
      <td className={styles.td}>{user.lastName}</td>
      <td className={styles.td}>
        <a href={`mailto:${user.email}`} className={styles.email}>{user.email}</a>
      </td>
      <td className={styles.td}>
        <span className={`${styles.dept} ${styles[DEPT_COLORS[user.department] ?? 'blue']}`}>
          {user.department}
        </span>
      </td>
      <td className={styles.td}>
        <div className={styles.actions}>
          <button
            className={styles.editBtn}
            onClick={() => onEdit(user)}
            aria-label={`Edit ${user.firstName} ${user.lastName}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>
          <button
            className={styles.deleteBtn}
            onClick={() => onDelete(user)}
            aria-label={`Delete ${user.firstName} ${user.lastName}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
