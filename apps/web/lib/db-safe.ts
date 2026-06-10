export type SafeDbResult<T> = {
  data: T;
  dbUnavailable: boolean;
};

function isConnectionError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const err = error as {
    code?: string;
    message?: string;
    cause?: unknown;
  };

  const codes = new Set(['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', '28P01']);
  if (err.code && codes.has(err.code)) return true;

  const message = String(err.message ?? '');
  if (
    message.includes('ECONNREFUSED') ||
    message.includes('connect') ||
    message.includes('Connection refused')
  ) {
    return true;
  }

  if (err.cause) return isConnectionError(err.cause);

  if (error instanceof AggregateError && error.errors?.length) {
    return error.errors.some((e) => isConnectionError(e));
  }

  return false;
}

export async function safeDbQuery<T>(
  fn: () => Promise<T>,
  fallback: T,
): Promise<SafeDbResult<T>> {
  try {
    const data = await fn();
    return { data, dbUnavailable: false };
  } catch (error) {
    if (isConnectionError(error)) {
      return { data: fallback, dbUnavailable: true };
    }
    throw error;
  }
}
