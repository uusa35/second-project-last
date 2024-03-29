/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  // experimental: {
  // webVitalsAttribution: ['CLS', 'LCP', 'FID', 'FCP', 'TTFB', 'LCP'],
  // },
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  async rewrites() {
    return [
      {
        source: '/home',
        destination: '/',
      },
      {
        source: '/about',
        destination: '/vendor/show',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/OrderConfirmation/failure/:slug',
        destination: '/order/status/failure',
        permanent: true,
      },
      {
        source: '/OrderConfirmation/success/:orderId',
        destination: '/order/status/:orderId/success',
        permanent: true,
      },
    ];
  },

  env: {
    SECRET_APP_KEY: '@#8!U.S.A.M.A.!@)8231',
    NEXT_PUBLIC_URL: '/',
    PUBLIC_URL: '/',
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'testbedbynd.com',
      'pages-dash.testbedbynd.com',
      'queue-spaces.nyc3.digitaloceanspaces.com',
      'digitaloceanspaces.com',
      'mybusiness.getq.me',
      'queue-app.sgp1.digitaloceanspaces.com',
    ],
    // minimumCacheTTL: 60 * 60 * 24,
    minimumCacheTTL: 0,
    dangerouslyAllowSVG: true,
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // disableStaticImages: false,
  },
  staticPageGenerationTimeout: 60,
  sentry: {
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
    hideSourceMaps: true,
  },
  // Optional build-time configuration options
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    config.resolve.fallback = { fs: false };
    return config;
  },
};

module.exports = withSentryConfig(nextConfig);
