/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  scrollRestoration: true,
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP', 'FID', 'FCP', 'TTFB', 'LCP'],
  },
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localeDetection: false,
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
      'mybusiness.letsform.app',
      'pages-dash.testbedbynd.com',
      'form.testbedbynd.com',
    ],
  },
};

module.exports = nextConfig;
