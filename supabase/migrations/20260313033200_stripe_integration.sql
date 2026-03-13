-- Migration: Add Stripe fields to users and create stripe_events table

-- Add Stripe-related columns to the users table
ALTER TABLE users
ADD COLUMN stripe_customer_id text,
ADD COLUMN stripe_subscription_id text,
ADD COLUMN subscription_tier text,
ADD COLUMN subscription_status text;

-- Create an index on the stripe_customer_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users (stripe_customer_id);

-- Create the stripe_events table for webhook idempotency
CREATE TABLE stripe_events (
    id text PRIMARY KEY,
    type text NOT NULL,
    status text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS) on the new table
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

-- Create policies for stripe_events (typically only accessible by service roles/admin)
-- Users shouldn't be able to read or write to stripe_events directly.
CREATE POLICY "Service roles can manage stripe events"
ON stripe_events
FOR ALL
USING (auth.uid() IS NULL); -- Assuming service role requests don't have a user ID

-- Comment on new columns and table
COMMENT ON COLUMN users.stripe_customer_id IS 'The Stripe Customer ID for billing purposes';
COMMENT ON COLUMN users.stripe_subscription_id IS 'The active Stripe Subscription ID, if any';
COMMENT ON COLUMN users.subscription_tier IS 'The current subscription tier (e.g., token_pack, monthly, annual)';
COMMENT ON COLUMN users.subscription_status IS 'The status of the subscription (e.g., active, past_due, canceled)';
COMMENT ON TABLE stripe_events IS 'Stores processed Stripe webhook events for idempotency';
