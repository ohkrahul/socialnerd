import { Sequelize } from "sequelize";

/**
 * One Sequelize instance per process, cached on globalThis so Next's dev-mode
 * hot reload doesn't open a new pool on every edit until Neon refuses us.
 *
 * DATABASE_URL points at Neon's *pooled* endpoint (`-pooler` in the host), so
 * connection management largely happens upstream. The local pool is kept small
 * on purpose: serverless functions are many and short-lived, and a big pool per
 * instance is how you exhaust a Postgres connection limit.
 */
function create() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  return new Sequelize(url, {
    dialect: "postgres",
    logging: false,
    dialectOptions: { ssl: { require: true, rejectUnauthorized: true } },
    pool: { max: 3, min: 0, idle: 10_000, acquire: 15_000 },
    define: { underscored: true, timestamps: true },
  });
}

export const sequelize = globalThis.__snSequelize ?? create();
if (process.env.NODE_ENV !== "production") globalThis.__snSequelize = sequelize;
