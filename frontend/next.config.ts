import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const internalApiBaseUrl =
      process.env.INTERNAL_API_BASE_URL ?? "http://127.0.0.1:8000/api/v1";

    return [
      {
        source: "/backend/:path*",
        destination: `${internalApiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
