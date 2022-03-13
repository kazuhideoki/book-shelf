module.exports = (phase, { defaultConfig, isServer }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    reactStrictMode: true,
    experimental: {
      esmExternals: false,
      externalDir: true,
    },
  };

  return nextConfig;
};
