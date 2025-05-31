-- 1.1. Tipo para business_size
CREATE TYPE business_size_enum AS ENUM (
  'solo_entrepreneur',
  'small',
  'medium',
  'large'
);

-- 1.2. Tipo para years_in_business
CREATE TYPE years_in_business_enum AS ENUM (
  'less_1_year',
  '1_3_years',
  '4_10_years',
  'more_10_years'
);

CREATE TYPE industry_enum AS ENUM (
  'technology',
  'marketing',
  'healthcare',
  'finance',
  'education',
  'food & Beverage',
  'fashion',
  'travel',
  'fitness',
  'beauty',
  'other'

);

CREATE TYPE type_of_business_enum AS ENUM (
'saas',
'ecommerce',
'service_provider',
'agency',
'restaurant',
'retail_store',
'healthcare',
'education',
'non_profit',
'other'
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