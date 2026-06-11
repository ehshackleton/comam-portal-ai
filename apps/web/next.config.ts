import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  ...(process.env.NODE_ENV === 'production' ? { output: 'standalone' as const } : {}),
  transpilePackages: ['@comam/db', '@comam/auth', '@comam/shared', '@comam/ui'],
  serverExternalPackages: ['pdfkit'],
};

export default nextConfig;
