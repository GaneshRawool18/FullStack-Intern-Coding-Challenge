export const validateForm = (data) => {
  const errors = {};

  // Name validation (20-60 chars)
  if (data.name && (data.name.length < 20 || data.name.length > 60)) {
    errors.name = 'Name must be between 20 and 60 characters';
  }

  // Address validation (max 400 chars)
  if (data.address && data.address.length > 400) {
    errors.address = 'Address must not exceed 400 characters';
  }

  // Password validation (8-16 chars, uppercase, special char)
  if (data.password) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(data.password)) {
      errors.password = 'Password must be 8-16 characters with at least one uppercase and special character';
    }
  }

  // Email validation
  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
  }

  return errors;
};