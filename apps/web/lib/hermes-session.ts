export const HERMES_SESSION_COOKIE = 'hermes_session';

export const HERMES_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export function hermesSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: HERMES_SESSION_MAX_AGE,
    path: '/',
  };
}
