const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUserForm(values, existingUsers, editingId = null) {
  const errors = {};

  if (!values.firstName?.trim()) errors.firstName = 'First name is required.';
  if (!values.lastName?.trim()) errors.lastName = 'Last name is required.';

  if (!values.email?.trim()) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  } else {
    const duplicate = existingUsers.find(
      (u) => u.email.toLowerCase() === values.email.trim().toLowerCase() && u.id !== editingId
    );
    if (duplicate) errors.email = 'This email is already in use.';
  }

  if (!values.department) errors.department = 'Department is required.';

  return errors;
}

export function isFormValid(errors) {
  return Object.keys(errors).length === 0;
}
