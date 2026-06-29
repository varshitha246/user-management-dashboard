import { PAGE_SIZE_OPTIONS } from '../utils/constants';
import { getPageRange } from '../utils/pagination';
import styles from './Pagination.module.css';

export default function Pagination({ page, numPages, pageSize, totalCount, onPage, onPageSize }) {
  const range = getPageRange(page, numPages);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  return (
    <div className={styles.wrap} role="navigation" aria-label="Pagination">
      <span className={styles.info} aria-live="polite">
        {totalCount === 0 ? 'No results' : `${start}–${end} of ${totalCount} users`}
      </span>

      <div className={styles.controls}>
        <button
          className={styles.navBtn}
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {range.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className={styles.dots} aria-hidden="true">…</span>
          ) : (
            <button
              key={p}
              className={`${styles.pageBtn} ${p === page ? styles.active : ''}`}
              onClick={() => onPage(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          className={styles.navBtn}
          onClick={() => onPage(page + 1)}
          disabled={page === numPages}
          aria-label="Next page"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className={styles.sizeWrap}>
        <label htmlFor="pageSize" className={styles.sizeLabel}>Rows:</label>
        <select
          id="pageSize"
          className={styles.sizeSelect}
          value={pageSize}
          onChange={(e) => onPageSize(Number(e.target.value))}
          aria-label="Rows per page"
        >
          {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
}
