export const ACCESS_TOKEN_KEY = 'lms_access_token';
export const REFRESH_TOKEN_KEY = 'lms_refresh_token';
export const TOKEN_TYPE_KEY = 'lms_token_type';
export const EXPIRES_IN_KEY = 'lms_expires_in';

export type UserRole = 'Admin' | 'Manager' | 'Employee';

type AuthSession = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
};

type JwtPayload = {
  role?: string;
};

function getStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

export function persistAuthSession(session: AuthSession): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  storage.setItem(TOKEN_TYPE_KEY, session.tokenType);
  storage.setItem(EXPIRES_IN_KEY, String(session.expiresIn));
}

export function clearAuthSession(): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(REFRESH_TOKEN_KEY);
  storage.removeItem(TOKEN_TYPE_KEY);
  storage.removeItem(EXPIRES_IN_KEY);
}

export function hasAccessToken(): boolean {
  return Boolean(getStorage()?.getItem(ACCESS_TOKEN_KEY));
}

export function readAccessToken(): string | null {
  return getStorage()?.getItem(ACCESS_TOKEN_KEY) ?? null;
}

export function getUserRoleFromSession(): UserRole | null {
  const token = readAccessToken();
  if (!token) {
    return null;
  }

  const payload = parseJwtPayload(token);
  const role = payload?.role;

  if (role === 'Admin' || role === 'Manager' || role === 'Employee') {
    return role;
  }

  return null;
}

export function getRoleHomePath(role: UserRole): '/admin' | '/manager' | '/employee' {
  if (role === 'Admin') {
    return '/admin';
  }

  if (role === 'Manager') {
    return '/manager';
  }

  return '/employee';
}

function parseJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const payloadText = decodeURIComponent(
      atob(padded)
        .split('')
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );

    return JSON.parse(payloadText) as JwtPayload;
  } catch {
    return null;
  }
}
