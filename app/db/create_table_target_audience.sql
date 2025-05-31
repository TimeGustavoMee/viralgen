CREATE TYPE target_age_enum AS ENUM (
  '18–24',
  '25–34',
  '35–44',
  '45–54',
  '55–64',
  '65+'
);

CREATE TYPE target_gender_enum as ENUM (
  'Male',
  'Female',
  'All'
)

CREATE TABLE target_audience (
  user_id    UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  target_age          target_age_enum
  target_gender       target_gender_enum
  target_location     TEXT,
  target_interests    TEXT[],
  target_pain_points  TEXT[],
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
