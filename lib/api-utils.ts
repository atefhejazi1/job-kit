import { User } from '@/types/auth.types';

export function createApiHeaders(user: User | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add company ID header for company users
  if (user?.userType === 'COMPANY') {
    const companyId = user.companyId || user.id;
    if (!companyId) {
      console.error('Company user missing company ID. Please log in again.');
    } else {
      headers['x-company-id'] = companyId;
    }
  }

  return headers;
}

export function createApiHeadersWithoutContentType(user: User | null): HeadersInit {
  const headers: HeadersInit = {};

  // Add company ID header for company users
  if (user?.userType === 'COMPANY') {
    const companyId = user.companyId || user.id;
    if (!companyId) {
      console.error('Company user missing company ID. Please log in again.');
    } else {
      headers['x-company-id'] = companyId;
    }
  }

  return headers;
}