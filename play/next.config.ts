import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This address only exists for shared puzzle links; anything else goes to
  // the company site.
  async redirects() {
    return [{ source: "/", destination: "https://eduplica.com", permanent: false }];
  },
};

export default nextConfig;
