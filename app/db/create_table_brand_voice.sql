CREATE TABLE brand_voice (
  user_id    UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  brand_values       TEXT[],
  brand_personality  TEXT,
  brand_description  TEXT,
  created_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
