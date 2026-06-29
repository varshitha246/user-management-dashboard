import { DEPARTMENTS } from './constants';

export function splitName(fullName) {
  const parts = (fullName || '').trim().split(' ');
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';
  return { firstName, lastName };
}

export function assignDepartment(id) {
  return DEPARTMENTS[(id - 1) % DEPARTMENTS.length];
}

export function transformUser(apiUser) {
  const { firstName, lastName } = splitName(apiUser.name);
  return {
    id: apiUser.id,
    firstName,
    lastName,
    email: apiUser.email,
    department: assignDepartment(apiUser.id),
  };
}

export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function exportToCSV(users, filename = 'users.csv') {
  const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Department'];
  const rows = users.map((u) => [u.id, u.firstName, u.lastName, u.email, u.department]);
  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.replace(/"/g, '').trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.replace(/"/g, '').trim());
    const obj = {};
    headers.forEach((h, i) => (obj[h] = values[i] || ''));
    return {
      firstName: obj['first name'] || obj['firstname'] || '',
      lastName: obj['last name'] || obj['lastname'] || '',
      email: obj['email'] || '',
      department: obj['department'] || '',
    };
  });
}

export function generateId(users) {
  return users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
}
