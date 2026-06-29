import { SORTABLE_COLUMNS, SORT_DIRECTIONS } from '../utils/constants';
import UserRow from './UserRow';
import styles from './UserTable.module.css';

function SortIcon({ active, direction }) {
  return (
    <span className={`${styles.sortIcon} ${active ? styles.sortActive : ''}`} aria-hidden="true">
      {!active ? '↕' : direction === SORT_DIRECTIONS.ASC ? '↑' : '↓'}
    </span>
  );
}

export default function UserTable({ users, sortConfig, onSort, onEdit, onDelete, loading }) {
  const cols = [
    { key: 'id', label: 'ID', sortable: false },
    { key: 'firstName', label: 'First Name', sortable: true },
    { key: 'lastName', label: 'Last Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'department', label: 'Department', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  return (
    <div className={styles.wrapper} role="region" aria-label="Users table">
      <table className={styles.table} aria-label="User list">
        <thead className={styles.thead}>
          <tr>
            {cols.map(({ key, label, sortable }) => (
              <th
                key={key}
                className={`${styles.th} ${sortable ? styles.sortable : ''} ${sortConfig.key === key ? styles.thActive : ''}`}
                onClick={sortable ? () => onSort(key) : undefined}
                aria-sort={
                  sortConfig.key === key
                    ? sortConfig.direction === SORT_DIRECTIONS.ASC ? 'ascending' : 'descending'
                    : sortable ? 'none' : undefined
                }
                tabIndex={sortable ? 0 : undefined}
                onKeyDown={sortable ? (e) => e.key === 'Enter' && onSort(key) : undefined}
              >
                {label}
                {sortable && <SortIcon active={sortConfig.key === key} direction={sortConfig.direction} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
            : users.map((user) => (
                <UserRow key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
              ))}
        </tbody>
      </table>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className={styles.skeletonRow} aria-hidden="true">
      {[40, 100, 110, 160, 90, 80].map((w, i) => (
        <td key={i} className={styles.td}>
          <div className={`skeleton ${styles.skeletonCell}`} style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}
