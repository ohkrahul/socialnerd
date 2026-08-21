import { Sequelize } from "sequelize";

/**
 * One Sequelize instance per process, cached on globalThis so Next's dev-mode
 * hot reload doesn't open a new pool on every edit until Neon refuses us.
 *
 * DATABASE_URL points at Neon's *pooled* endpoint (`-pooler` in the host), so
 * connection management largely happens upstream. The local pool is kept small
 * on purpose: serverless functions are many and short-lived, and a big pool per
 * instance is how you exhaust a Postgres connection limit.
 *
 * This module must never throw while being imported. Every model calls
 * sequelize.define() at import time, so a throw here happens before any request
 * handler runs and takes down every route that transitively imports a model —
 * including a homepage that is mostly static text. That is exactly what a
 * missing DATABASE_URL did in production: the build passed and every page 500'd.
 *
 * So a missing URL yields an instance that is fine to define models against and
 * only fails when a query actually runs, where a caller can catch it.
 */

export function dbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function create() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    // Loud, once, rather than silent — this is a misconfiguration, not a mode.
    console.error(
      "DATABASE_URL is not set. Event and subscriber features will fail; the rest of the site still renders.",
    );
    // A syntactically valid URL that resolves nowhere. Lets define() succeed so
    // imports hold, and turns every query into a catchable connection error.
    return new Sequelize("postgres://unset@127.0.0.1:1/unset", {
      dialect: "postgres",
      logging: false,
      pool: { max: 1, min: 0, idle: 1000, acquire: 2000 },
      retry: { max: 0 },
      define: { underscored: true, timestamps: true },
    });
  }

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
