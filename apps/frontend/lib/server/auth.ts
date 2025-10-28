import { cookies } from 'next/headers';

/**
 * Server-side auth utility to check authentication status
 * Reads httpOnly cookies from the request
 */

export interface ServerUser {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN';
  emailVerified: boolean;
  theme: 'light' | 'dark' | 'system' | null;
  language: 'en' | 'nb' | null;
}

/**
 * Get user from server-side by validating the access token cookie
 */
export async function getServerUser(): Promise<ServerUser | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return null;
    }

    // Call backend to validate token and get user
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    const response = await fetch(`${API_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `accessToken=${accessToken}`,
      },
      credentials: 'include',
      cache: 'no-store', // Don't cache auth requests
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    return null;
  } catch (error) {
    // Silently fail - user is not authenticated
    console.error('Server auth check error:', error);
    return null;
  }
}

/**
 * Check if user is authenticated on server-side
 */
export async function isServerAuthenticated(): Promise<boolean> {
  const user = await getServerUser();
  return user !== null;
}
