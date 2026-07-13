CREATE TABLE IF NOT EXISTS chat_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_hash TEXT NOT NULL,
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  accept_language TEXT,
  referrer TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  timezone TEXT,
  user_message TEXT NOT NULL,
  assistant_message TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('fast', 'thinking')),
  conversation_json TEXT,
  request_metadata_json TEXT,
  cache_hit INTEGER NOT NULL DEFAULT 0,
  model TEXT,
  duration_ms INTEGER,
  retrieval_ms INTEGER,
  generation_ms INTEGER,
  retrieval_chunks INTEGER,
  retrieval_top_score REAL,
  retrieval_keys_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_log_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  row_count INTEGER NOT NULL DEFAULT 0
);

INSERT OR IGNORE INTO chat_log_state (id, row_count) VALUES (1, 0);
