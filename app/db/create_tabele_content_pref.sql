CREATE TYPE content_tone_enum as ENUM (
    'professional',
    'casual',
    'funny',
    'serious',
    'inspirational',
    'educational',
    'conversational',
);

CREATE TYPE content_formality_enum as ENUM (
    'formal',
    'semi_formal',
    'casual',
    'very_casual',
);

CREATE TYPE content_length_enum as ENUM (
    'short',
    'medium',
    'long',
);

CREATE TYPE content_frequency_enum as ENUM (
    'daily',
    'several_times_a_week',
    'weekly',
    'bi_weekly',
    'monthly',
);

CREATE TABLE content_preferences (
    user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    preferred_tone     content_tone_enum,
    preferred_formality content_formality_enum,
    preferred_length   content_length_enum,
    preferred_frequency content_frequency_enum,
    use_emojis         BOOLEAN DEFAULT FALSE,
    use_hashtags       BOOLEAN DEFAULT FALSE,
    cta          BOOLEAN DEFAULT FALSE,
    created_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);