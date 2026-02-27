import Cookies from 'js-cookie';

export interface AuthUser {
  userId: string;
  businessId: string;
  role: 'OWNER' | 'ADMIN' | 'STAFF';
}

function parseJwt(token: string): AuthUser | null {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json) as AuthUser;
  } catch {
    return null;
  }
}

export function saveToken(token: string) {
  Cookies.set('tb_token', token, { expires: 7, sameSite: 'strict' });
}

export function clearToken() {
  Cookies.remove('tb_token');
}

export function getUser(): AuthUser | null {
  const token = Cookies.get('tb_token');
  if (!token) return null;
  return parseJwt(token);
}

export function isAuthenticated(): boolean {
  return Boolean(Cookies.get('tb_token'));
}
