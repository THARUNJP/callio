import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
   turbo: {
      root: './webrtc-app', // <- path to your intended root
    },
};

export default nextConfig;
