-- 1.1. Tipo para business_size
CREATE TYPE business_size_enum AS ENUM (
  'Solo entrepreneur',
  'Small (2-10 employees)',
  'Medium (11-250 employees)',
  'Large (51+ employees)'
);

-- 1.2. Tipo para years_in_business
CREATE TYPE years_in_business_enum AS ENUM (
  'Less than 1 year',
  '1–3 years',
  '4–10 years',
  'More than 10 years'
);

CREATE TYPE industry_enum AS ENUM (
  'Technology',
  'Marketing',
  'Healthcare',
  'Finance',
  'Education',
  'Food & Beverage',
  'Fashion',
  'Travel',
  'Fitness',
  'Beauty',
  'Other'

);

CREATE TYPE type_of_business_enum AS ENUM (
'Saas',
'ECommerce',
'Service Provider',
'Agency',
'Restaurant',
'Retail Store',
'Healthcare',
'Education',
'Non-Profit',
'Other'
);

CREATE TABLE business_information (
  user_id    UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  business_name    TEXT ,
  business_type    type_of_business_enum ,
  industry         industry_enum ,
  niche            TEXT,
  business_size    business_size_enum ,
  years_in_business years_in_business_enum,
  website          TEXT,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);