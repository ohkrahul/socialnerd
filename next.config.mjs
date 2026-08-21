/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Sequelize and the pg driver load dialects with dynamic requires, which a
   * bundler cannot follow. Keeping them external means Node resolves them at
   * runtime instead of the build trying to trace every dialect it will never use.
   */
  serverExternalPackages: ["sequelize", "pg", "pg-hstore"],
};

export default nextConfig;
