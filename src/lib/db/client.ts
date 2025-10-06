import mysql from "mysql2/promise";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "./schema";

const globalDb = globalThis as unknown as {
  __dbPool?: mysql.Pool;
  __db?: MySql2Database<typeof schema>;
};

function createPool() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }

  return mysql.createPool({
    uri: url,
    waitForConnections: true,
    connectionLimit: 10,
  });
}

function getPool() {
  if (!globalDb.__dbPool) {
    globalDb.__dbPool = createPool();
  }
  return globalDb.__dbPool;
}

function getDb() {
  if (!globalDb.__db) {
    const pool = getPool();
    globalDb.__db = drizzle(pool, { schema, mode: "default" });
  }
  return globalDb.__db;
}

export const pool = new Proxy({} as mysql.Pool, {
  get(_, prop) {
    const actualPool = getPool();
    const value = actualPool[prop as keyof mysql.Pool];
    return typeof value === "function" ? value.bind(actualPool) : value;
  },
});

export const db = new Proxy({} as MySql2Database<typeof schema>, {
  get(_, prop) {
    const actualDb = getDb();
    const value = actualDb[prop as keyof MySql2Database<typeof schema>];
    return typeof value === "function" ? value.bind(actualDb) : value;
  },
});

export type Database = MySql2Database<typeof schema>;
export * as dbSchema from "./schema";
