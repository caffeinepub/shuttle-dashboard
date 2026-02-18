export function validateNumber(value: number, fieldName: string): string {
  if (isNaN(value)) {
    return `${fieldName} must be a valid number`;
  }
  if (value < 0) {
    return `${fieldName} cannot be negative`;
  }
  return '';
}

export function validateRequired(value: string, fieldName: string): string {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return '';
}

export function validateMonthFormat(value: string): string {
  const regex = /^\d{4}-\d{2}$/;
  if (!regex.test(value)) {
    return 'Month must be in YYYY-MM format';
  }
  
  const [year, month] = value.split('-').map(Number);
  if (month < 1 || month > 12) {
    return 'Month must be between 01 and 12';
  }
  
  if (year < 2000 || year > 2100) {
    return 'Year must be between 2000 and 2100';
  }
  
  return '';
}
