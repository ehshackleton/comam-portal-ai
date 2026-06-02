export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variable de entorno requerida: ${name}`);
  }
  return value;
}

export const appConfig = {
  name: process.env.APP_NAME ?? 'COMAM Portal AI',
  url: process.env.APP_URL ?? 'http://localhost:3000',
  adminSessionMaxAge: Number(process.env.ADMIN_SESSION_MAX_AGE_SECONDS ?? 7200),
  authSecret: process.env.AUTH_SECRET ?? 'dev-secret-change-me',
  otpIssuer: process.env.OTP_ISSUER ?? 'COMAM',
  s3: {
    endpoint: process.env.S3_ENDPOINT ?? 'http://localhost:9000',
    bucket: process.env.S3_BUCKET ?? 'comam-documents',
    accessKey: process.env.S3_ACCESS_KEY_ID ?? 'comamadmin',
    secretKey: process.env.S3_SECRET_ACCESS_KEY ?? 'change_me',
    region: process.env.S3_REGION ?? 'us-east-1',
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
  },
};
