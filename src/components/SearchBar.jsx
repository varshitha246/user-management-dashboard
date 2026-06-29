import { useRef } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ value, onChange, onOpenFilter, activeFilterCount }) {
  const inputRef = useRef(null);

  function handleClear() {
    onChange('');
    inputRef.current?.focus();
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.searchBox}>
        <span className={styles.searchIcon} aria-hidden="true">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="search"
          className={styles.input}
          placeholder="Search by name, email, or department…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onInput={(e) => onChange(e.target.value)}
          aria-label="Search users"
        />
        {value && (
          <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      <button
        className={`${styles.filterBtn} ${activeFilterCount > 0 ? styles.active : ''}`}
        onClick={onOpenFilter}
        aria-label={`Open advanced filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ''}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Filters
        {activeFilterCount > 0 && (
          <span className={styles.badge} aria-label={`${activeFilterCount} active filters`}>
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
}
