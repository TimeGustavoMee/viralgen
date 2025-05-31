CREATE TABLE examples (
  user_id    UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  competitor_urls   TEXT[],
  favorite_content  TEXT,
  content_to_avoid  TEXT,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);