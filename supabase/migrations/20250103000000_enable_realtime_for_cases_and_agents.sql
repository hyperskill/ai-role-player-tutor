-- Enable real-time for cases and agents tables
-- This allows Supabase real-time subscriptions to work for case generation progress

-- Enable real-time for cases table
ALTER PUBLICATION supabase_realtime ADD TABLE cases;

-- Enable real-time for agents table
ALTER PUBLICATION supabase_realtime ADD TABLE agents;

-- Enable real-time for subscriptions table (for subscription updates)
ALTER PUBLICATION supabase_realtime ADD TABLE subscriptions;

-- Set replica identity to ensure real-time gets all the data it needs
-- This is important for INSERT/UPDATE/DELETE events
ALTER TABLE cases REPLICA IDENTITY FULL;
ALTER TABLE agents REPLICA IDENTITY FULL;
ALTER TABLE subscriptions REPLICA IDENTITY FULL;
