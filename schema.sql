-- schema.sql
CREATE TABLE IF NOT EXISTS analytics (
    app_id TEXT PRIMARY KEY,
    hits INTEGER DEFAULT 0
);
