/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Sequelize and the pg driver load dialects with dynamic requires, which a
   * bundler cannot follow. Keeping them external means Node resolves them at
   * runtime instead of the build trying to trace every dialect it will never use.
   */
  serverExternalPackages: ["sequelize", "pg", "pg-hstore"],

  /**
   * Published gallery media is delivered from Cloudinary, and next/image refuses
   * a remote host that is not listed here. Scoped to this account's own path so
   * the optimizer cannot be pointed at somebody else's cloud.
   *
   * The images are still rendered unoptimized (see the Tile components):
   * Cloudinary's f_auto,q_auto already picks AVIF/WebP per browser, so putting
   * them through a second optimizer buys nothing and costs a transformation at
   * both ends. This entry is the guard rail, not the delivery path.
   */
  images: {
    remotePatterns: process.env.CLOUDINARY_CLOUD_NAME
      ? [
          {
            protocol: "https",
            hostname: "res.cloudinary.com",
            pathname: `/${process.env.CLOUDINARY_CLOUD_NAME}/**`,
          },
        ]
      : [],
  },
};

export default nextConfig;
