interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}


export async function authFetch(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { skipAuth, ...fetchOptions } = options;
  
  // Default headers
  const headers = new Headers(fetchOptions.headers);
  
  if (!headers.has('Content-Type') && fetchOptions.body) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Add legacy auth headers for backward compatibility
  if (!skipAuth) {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        headers.set('x-user-id', userData.id);
        if (userData.companyId) {
          headers.set('x-company-id', userData.companyId);
        }
      } catch {
        // Invalid user data
      }
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: 'include', // Always include cookies
  });

  // Handle 401 - try to refresh token
  if (response.status === 401 && !skipAuth) {
    const refreshResponse = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshResponse.ok) {
      // Token refreshed, retry the original request
      return fetch(url, {
        ...fetchOptions,
        headers,
        credentials: 'include',
      });
    } else {
      // Refresh failed, redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login?session=expired';
      }
    }
  }

  return response;
}

/*
 * GET request with authentication
 */
export function authGet(url: string, options?: FetchOptions): Promise<Response> {
  return authFetch(url, { ...options, method: 'GET' });
}

/*
 * POST request with authentication
 */
export function authPost(
  url: string,
  data?: unknown,
  options?: FetchOptions
): Promise<Response> {
  return authFetch(url, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/*
 * PUT request with authentication
 */
export function authPut(
  url: string,
  data?: unknown,
  options?: FetchOptions
): Promise<Response> {
  return authFetch(url, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/*
 * DELETE request with authentication
 */
export function authDelete(url: string, options?: FetchOptions): Promise<Response> {
  return authFetch(url, { ...options, method: 'DELETE' });
}

/*
 * PATCH request with authentication
 */
export function authPatch(
  url: string,
  data?: unknown,
  options?: FetchOptions
): Promise<Response> {
  return authFetch(url, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}
