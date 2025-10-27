-- Contact submissions base table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  ticket_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  service_slug TEXT,
  website TEXT,
  ip TEXT,
  user_agent TEXT,
  referer TEXT,
  admin_sent BOOLEAN DEFAULT FALSE,
  customer_sent BOOLEAN DEFAULT FALSE,
  error TEXT
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
  ON contact_submissions (created_at);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email
  ON contact_submissions (email);

