// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

// module.exports = nextConfig;

module.exports = (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    swcMinify: false,
    reactStrictMode: true,
    experimental: {
      esmExternals: false,
    },
  };
  return nextConfig;
};
