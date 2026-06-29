import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

import { useUsers } from './hooks/useUsers';
import { useToast, ToastContainer } from './components/Toast';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import SearchBar from './components/SearchBar';
import FilterModal from './components/FilterModal';
import UserTable from './components/UserTable';
import MobileCards from './components/MobileCards';
import UserForm from './components/UserForm';
import ConfirmDelete from './components/ConfirmDelete';
import Pagination from './components/Pagination';
import EmptyState from './components/EmptyState';

import { debounce, exportToCSV, parseCSV } from './utils/helpers';
import { SEARCH_DEBOUNCE_MS, SORT_DIRECTIONS, LOCAL_STORAGE_KEYS, TOAST_TYPES } from './utils/constants';

import './styles/global.css';
import styles from './App.module.css';

const EMPTY_FILTERS = { firstName: '', lastName: '', email: '', department: '' };

export default function App() {
  // Theme
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem(LOCAL_STORAGE_KEYS.DARK_MODE) === 'true'; } catch { return false; }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    try { localStorage.setItem(LOCAL_STORAGE_KEYS.DARK_MODE, String(darkMode)); } catch {}
  }, [darkMode]);

  // Search / Filters / Sort / Page
  const [rawSearch, setRawSearch] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: SORT_DIRECTIONS.ASC });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSearchChange = useCallback((val) => {
    setRawSearch(val);
    setSearch(val);
    setPage(1);
  }, []);

  function handleSort(key) {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === SORT_DIRECTIONS.ASC
        ? SORT_DIRECTIONS.DESC : SORT_DIRECTIONS.ASC,
    }));
    setPage(1);
  }

  function handleApplyFilters(f) { setFilters(f); setPage(1); }
  function handleClearFilters() { setFilters(EMPTY_FILTERS); setRawSearch(''); setSearch(''); setPage(1); }
  function handlePageSize(s) { setPageSize(s); setPage(1); }

  // Modal state
  const [filterOpen, setFilterOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [currentEditUser, setCurrentEditUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Toast
  const { toasts, add: addToast, remove: removeToast } = useToast();

  // Data hook
  const {
    users, allFilteredUsers, loading, error, actionLoading,
    totalCount, numPages, stats, addUser, editUser: saveEdit,
    deleteUser, importUsers, allUsers, safePage,
  } = useUsers({ search, filters, sortConfig, page, pageSize });

  useEffect(() => { if (error) addToast(error, TOAST_TYPES.ERROR); }, [error]);

  // CRUD
  const handleAddOpen = useCallback(() => { setCurrentEditUser(null); setFormOpen(true); }, []);
  const handleEditOpen = useCallback((user) => { setCurrentEditUser(user); setFormOpen(true); }, []);
  const handleDeleteOpen = useCallback((user) => { setDeleteTarget(user); }, []);

  const handleFormSave = useCallback(async (values) => {
    if (currentEditUser) {
      const res = await saveEdit(currentEditUser.id, values);
      if (res.success) { addToast('User updated successfully.', TOAST_TYPES.SUCCESS); setFormOpen(false); }
      else addToast(res.error, TOAST_TYPES.ERROR);
    } else {
      const res = await addUser(values);
      if (res.success) {
        setPage(1);
        setSortConfig({ key: null, direction: SORT_DIRECTIONS.ASC });
        setFilters(EMPTY_FILTERS);
        setRawSearch('');
        setSearch('');
        addToast('User added successfully.', TOAST_TYPES.SUCCESS);
        setFormOpen(false);
      } else addToast(res.error, TOAST_TYPES.ERROR);
    }
  }, [currentEditUser, addUser, saveEdit, addToast]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    const res = await deleteUser(deleteTarget.id);
    if (res.success) {
      addToast(`${deleteTarget.firstName} ${deleteTarget.lastName} was deleted.`, TOAST_TYPES.SUCCESS);
      setDeleteTarget(null);
    } else addToast(res.error, TOAST_TYPES.ERROR);
  }, [deleteTarget, deleteUser, addToast]);

  // CSV
  const handleExport = useCallback(() => {
    exportToCSV(allFilteredUsers);
    addToast(`Exported ${allFilteredUsers.length} users to CSV.`, TOAST_TYPES.INFO);
  }, [allFilteredUsers, addToast]);

  const handleImport = useCallback((csvText) => {
    const rows = parseCSV(csvText);
    const count = importUsers(rows);
    if (count > 0) {
      setPage(1);
      setSortConfig({ key: null, direction: SORT_DIRECTIONS.ASC });
      setFilters(EMPTY_FILTERS);
      setRawSearch('');
      setSearch('');
    }
    addToast(count > 0 ? `Imported ${count} users from CSV.` : 'No valid rows found in CSV.', count > 0 ? TOAST_TYPES.SUCCESS : TOAST_TYPES.ERROR);
  }, [importUsers, addToast]);

  useEffect(() => {
    // Only adjust the current page downward when it exceeds the available pages.
    // This avoids overriding explicit page changes (e.g. setPage(1) after adding a user).
    if (page > safePage) {
      setPage(safePage);
    }
  }, [page, safePage]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const hasAnyFilter = activeFilterCount > 0 || rawSearch.trim().length > 0;

  return (
    <div className={styles.app}>
      <Header
        darkMode={darkMode}
        onToggleDark={() => setDarkMode((d) => !d)}
        onExport={handleExport}
        onImport={handleImport}
      />

      <main className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.topBar}>
            <div>
              <h2 className={styles.pageTitle}>Team Members</h2>
              <p className={styles.pageDesc}>Manage your organization's users across all departments.</p>
            </div>
            <button className={styles.addBtn} onClick={handleAddOpen} aria-label="Add new user">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add User</span>
            </button>
          </div>

          <StatsCards stats={stats} loading={loading} />

          <div className={styles.toolbar}>
            <SearchBar
              value={rawSearch}
              onChange={handleSearchChange}
              onOpenFilter={() => setFilterOpen(true)}
              activeFilterCount={activeFilterCount}
            />
          </div>

          {/* debug panel removed */}

          <div className={styles.tableCard}>
            <div className={styles.desktopTable}>
              <UserTable
                users={users}
                sortConfig={sortConfig}
                onSort={handleSort}
                onEdit={handleEditOpen}
                onDelete={handleDeleteOpen}
                loading={loading}
              />
            </div>
            <div className={styles.mobileCards}>
              <MobileCards
                users={users}
                onEdit={handleEditOpen}
                onDelete={handleDeleteOpen}
                loading={loading}
              />
            </div>

            {!loading && users.length === 0 && (
              <EmptyState hasFilters={hasAnyFilter} onClear={handleClearFilters} onAdd={handleAddOpen} />
            )}

            {!loading && totalCount > 0 && (
              <div className={styles.paginationWrap}>
                <Pagination
                  page={safePage}
                  numPages={numPages}
                  pageSize={pageSize}
                  totalCount={totalCount}
                  onPage={setPage}
                  onPageSize={handlePageSize}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <FilterModal
        isOpen={filterOpen}
        filters={filters}
        onApply={handleApplyFilters}
        onClose={() => setFilterOpen(false)}
      />
      <UserForm
        isOpen={formOpen}
        user={currentEditUser}
        allUsers={allUsers}
        onSave={handleFormSave}
        onClose={() => setFormOpen(false)}
        loading={actionLoading}
      />
      <ConfirmDelete
        isOpen={Boolean(deleteTarget)}
        user={deleteTarget}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
        loading={actionLoading}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
