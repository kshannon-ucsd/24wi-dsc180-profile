import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = '24wi-dsc180-profile'; // Replace with your repository name

const nextConfig: NextConfig = {
  // Tells Next.js that your app lives at /your-repo-name
  basePath: isProd ? `/${repoName}` : '',
  // Makes sure that asset URLs (like CSS, JS, images) are prefixed correctly
  assetPrefix: isProd ? `/${repoName}/` : '',
  // This helps GitHub Pages resolve paths to static files correctly
  trailingSlash: true,
  // Other Next.js config options can go here...
};

export default nextConfig;
