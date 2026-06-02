import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@comam/db', '@comam/auth', '@comam/shared', '@comam/ui'],
};

export default nextConfig;
