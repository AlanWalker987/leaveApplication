import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@lms/ui', '@lms/types', '@lms/graphql', '@lms/utils'],
};

export default nextConfig;
