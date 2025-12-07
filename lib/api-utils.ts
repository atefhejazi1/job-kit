import { User } from '@/types/auth.types';

export function createApiHeaders(): HeadersInit; // Allow calls without user parameter
export function createApiHeaders(user: User | null): HeadersInit;
export function createApiHeaders(user?: User | null): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add user ID header (required for all authenticated requests)
  if (user?.id) {
    headers['x-user-id'] = user.id;
  }

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

export function createApiHeadersWithoutContentType(): HeadersInit; // Allow calls without user parameter
export function createApiHeadersWithoutContentType(user: User | null): HeadersInit;
export function createApiHeadersWithoutContentType(user?: User | null): HeadersInit {
  const headers: HeadersInit = {};

  // Add user ID header (required for all authenticated requests)
  if (user?.id) {
    headers['x-user-id'] = user.id;
  }

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