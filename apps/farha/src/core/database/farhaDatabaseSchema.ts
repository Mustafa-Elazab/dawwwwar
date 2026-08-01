export const FARHA_BUDGET_SCHEMA_VERSION = 1;
export const FARHA_BUDGET_STORAGE_KEY = 'farha.budgetPlanner.v1';

export const farhaM1MigrationSql = [
  `CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS budget_categories (
    id TEXT PRIMARY KEY NOT NULL,
    event_id TEXT NOT NULL,
    key TEXT NOT NULL,
    name_key TEXT NOT NULL,
    is_default INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS budget_items (
    id TEXT PRIMARY KEY NOT NULL,
    category_id TEXT NOT NULL,
    title TEXT NOT NULL,
    planned_cost REAL NOT NULL DEFAULT 0,
    actual_cost REAL NOT NULL DEFAULT 0,
    deposit_paid REAL NOT NULL DEFAULT 0,
    due_date TEXT,
    notes TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,
] as const;
