import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ezstilius-media.fra1.digitaloceanspaces.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
