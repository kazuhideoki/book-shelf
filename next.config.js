module.exports = (phase, { defaultConfig, isServer }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    reactStrictMode: true,
    experimental: {
      esmExternals: false,
    },
    // webpack: (config, { isServer }) => {
    //   if (!isServer) {
    //     config.resolve.fallback.fs = false;
    //     config.resolve.fallback.child_process = false;
    //     config.resolve.fallback.net = false;
    //     config.resolve.fallback.dns = false;
    //     config.resolve.fallback.tls = false;
    //     config.resolve.fallback.http2 = false;
    //     config.resolve.fallback.standalone = false;
    //     config.node = {
    //       fs: "empty",
    //       child_process: "empty",
    //       net: "empty",
    //       nds: "empty",
    //       tls: "empty",
    //       http2: "empty",
    //       standalone: "empty",
    //     };
    //   }

    //   return config;
    // },
  };

  // if (!isServer) {
  //   nextConfig.node = {
  //     fs: "empty",
  //   };
  // }

  return nextConfig;
};
