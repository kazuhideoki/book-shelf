module.exports = (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    reactStrictMode: true,
    experimental: {
      esmExternals: false,
    },
  };
  return nextConfig;
};
