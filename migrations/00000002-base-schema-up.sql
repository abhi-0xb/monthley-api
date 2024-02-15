

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Profile
-- This table will hold the user's information.
CREATE TABLE IF NOT EXISTS "profiles" (
  "user_id" UUID PRIMARY KEY, -- No default, copy user id from auth table
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  "name" TEXT NOT NULL,
  "profile_pic" TEXT NULL
);

-- Non User
-- This table will hold the non-user's information.
CREATE TABLE IF NOT EXISTS "non_users" (
  "id" UUID PRIMARY KEY, -- No default, we will pass uuidv7 from the code
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  "name" TEXT NULL,
  "mobile" TEXT NULL
);

-- Recurring Payments
-- Table for setting up recurring payments
CREATE TABLE IF NOT EXISTS "recurring_payments" (
  "id" UUID PRIMARY KEY, -- No default, we will pass uuidv7 from the code
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  "currency" TEXT NOT NULL,
  "amount" NUMERIC(12, 2) NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NULL,
  "frequency_expression" TEXT NOT NULL,
  "type" UUID NOT NULL,
  "creator" UUID NOT NULL,
  "payer" UUID NULL,
  "payee" UUID NULL,
  "non_user_payer" UUID NULL,
  "non_user_payee" UUID NULL,
  "additional_charges" JSONB NULL
);

-- Payment Instance
-- Table for creating payment instances
CREATE TABLE IF NOT EXISTS "payment_instances" (
  "id" UUID PRIMARY KEY, -- No default, we will pass uuidv7 from the code
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  "currency" TEXT NOT NULL,
  "amount" NUMERIC(12, 2) NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NULL,
  "type" UUID NOT NULL,
  "due_date" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  "paid" BOOLEAN NOT NULL,
  "creator" UUID NOT NULL,
  "payer" UUID NULL,
  "payee" UUID NULL,
  "non_user_payer" UUID NULL,
  "non_user_payee" UUID NULL,
  "additional_charges" JSONB NULL
);

-- Payment Attachments
-- Table for keeping payment instances attachments
CREATE TABLE IF NOT EXISTS "payment_attachments" (
  "id" UUID PRIMARY KEY,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT NOW(),
  "url" TEXT NOT NULL,
  "media_type" TEXT NOT NULL,
  "uploader" UUID NOT NULL,
  "payment_instance" UUID NULL
);

CREATE TRIGGER set_timestamp_profiles
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_non_users
BEFORE UPDATE ON non_users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_payment_instances
BEFORE UPDATE ON payment_instances
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_recurring_payments
BEFORE UPDATE ON recurring_payments
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp_payment_attachments
BEFORE UPDATE ON payment_attachments
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
