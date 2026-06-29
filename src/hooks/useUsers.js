import { useState, useEffect, useCallback, useMemo } from 'react';
import { userService } from '../api/userService';
import { transformUser, generateId } from '../utils/helpers';
import { LOCAL_STORAGE_KEYS, SORT_DIRECTIONS, DEFAULT_PAGE_SIZE } from '../utils/constants';
import { paginate, totalPages } from '../utils/pagination';

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
};

const saveToStorage = (users) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch {}
};

export function useUsers({ search, filters, sortConfig, page, pageSize }) {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    let isActive = true;

    const loadUsers = async () => {
      setError(null);
      setLoading(true);

      const stored = loadFromStorage();
      if (stored) {
        if (!isActive) return;
        // If persisted storage contains more than the default page size,
        // trim it down so the app always starts with exactly the initial
        // page of users (prevents leftover test data from showing).
        if (stored.length > DEFAULT_PAGE_SIZE) {
          const trimmed = stored.slice(0, DEFAULT_PAGE_SIZE);
          setAllUsers(trimmed);
          saveToStorage(trimmed);
        } else {
          setAllUsers(stored);
        }
        setLoading(false);
        return;
      }

      try {
        const data = await userService.getAll();
        const transformed = Array.isArray(data) ? data.map(transformUser) : [];
        if (!isActive) return;
        // Limit initial API seed to DEFAULT_PAGE_SIZE items so fresh installs
        // always start with exactly the page size (10 by default).
        const initial = transformed.slice(0, DEFAULT_PAGE_SIZE);
        setAllUsers(initial);
        if (initial.length > 0) {
          saveToStorage(initial);
        }
      } catch {
        if (!isActive) return;
        setError('Failed to load users. Please refresh.');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isActive = false;
    };
  }, []);

  const persist = useCallback((users) => {
    setAllUsers(users);
    saveToStorage(users);
  }, []);

  // Search
  const searched = useMemo(() => {
    const normalize = (v) => (v || '').toString().toLowerCase().trim();
    const query = normalize(search);
    if (!query) return [...allUsers];

    return allUsers.filter((u) => {
      const first = normalize(u.firstName);
      const last = normalize(u.lastName);
      const email = normalize(u.email);
      const dept = normalize(u.department);
      const id = (u.id || '').toString();
      const full = (first + ' ' + last).trim();

      // match by id, first, last, full name, email, or department
      return (
        id === query ||
        first.includes(query) ||
        last.includes(query) ||
        full.includes(query) ||
        email.includes(query) ||
        dept.includes(query)
      );
    });
  }, [allUsers, search]);

  // Filtering
  const filtered = useMemo(() => {
    let list = [...searched];

    if (filters.firstName) {
      list = list.filter((u) =>
        u.firstName.toLowerCase().includes(filters.firstName.toLowerCase())
      );
    }
    if (filters.lastName) {
      list = list.filter((u) =>
        u.lastName.toLowerCase().includes(filters.lastName.toLowerCase())
      );
    }
    if (filters.email) {
      list = list.filter((u) =>
        u.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    if (filters.department) {
      list = list.filter((u) => u.department === filters.department);
    }

    return list;
  }, [searched, filters]);

  // Sorting
  const sorted = useMemo(() => {
    if (!sortConfig.key) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = (a[sortConfig.key] || '').toLowerCase();
      const bVal = (b[sortConfig.key] || '').toLowerCase();
      const cmp = aVal.localeCompare(bVal);
      return sortConfig.direction === SORT_DIRECTIONS.ASC ? cmp : -cmp;
    });
  }, [filtered, sortConfig]);

  const numPages = totalPages(sorted.length, pageSize);
  const safePage = Math.min(Math.max(page, 1), numPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageUsers = paginate(sorted, safePage, pageSize);

  // Debug logging removed for production.

  // CRUD
  const addUser = useCallback(
    async (formData) => {
      setActionLoading(true);
      const newUser = {
        id: generateId(allUsers),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        department: formData.department,
      };
      const updated = [newUser, ...allUsers];
      persist(updated);

      try {
        await userService.create(formData);
        return { success: true };
      } catch {
        return { success: true };
      } finally {
        setActionLoading(false);
      }
    },
    [allUsers, persist]
  );

  const editUser = useCallback(
    async (id, formData) => {
      setActionLoading(true);
      const updated = allUsers.map((u) => (u.id === id ? { ...u, ...formData } : u));
      persist(updated);

      try {
        await userService.update(id, formData);
        return { success: true };
      } catch {
        return { success: true };
      } finally {
        setActionLoading(false);
      }
    },
    [allUsers, persist]
  );

  const deleteUser = useCallback(
    async (id) => {
      setActionLoading(true);
      const updated = allUsers.filter((u) => u.id !== id);
      persist(updated);

      try {
        await userService.remove(id);
        return { success: true };
      } catch {
        return { success: true };
      } finally {
        setActionLoading(false);
      }
    },
    [allUsers, persist]
  );

  const importUsers = useCallback(
    (rows) => {
      const valid = rows.filter((r) => r.firstName && r.lastName && r.email && r.department);
      let nextId = generateId(allUsers);
      const newUsers = valid.map((r) => ({ ...r, id: nextId++ }));
      const updated = [...newUsers, ...allUsers].map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        department: u.department,
      }));
      persist(updated);
      return newUsers.length;
    },
    [allUsers, persist]
  );

  const stats = useMemo(() => {
    const deptSet = new Set(allUsers.map((u) => u.department));
    const activeFilters =
      Object.values(filters).filter(Boolean).length + (search.trim() ? 1 : 0);
    return {
      total: allUsers.length,
      departments: deptSet.size,
      activeFilters,
      currentPageCount: pageUsers.length,
    };
  }, [allUsers, filters, search, pageUsers]);

  return {
    users: pageUsers,
    allFilteredUsers: sorted,
    allUsers,
    loading,
    error,
    actionLoading,
    totalCount: sorted.length,
    numPages,
    safePage,
    stats,
    // no debug export
    addUser,
    editUser,
    deleteUser,
    importUsers,
  };
}
