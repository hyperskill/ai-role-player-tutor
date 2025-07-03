-- Enable users to delete their own cases and agents
-- This migration adds DELETE policies to allow users to remove their own created content

-- Cases table: Allow users to delete their own cases
CREATE POLICY "Users can delete own cases" ON public.cases
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- Agents table: Allow users to delete their own agents
CREATE POLICY "Users can delete own agents" ON public.agents
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- Note: The existing API endpoint in server/api/cases/[slug].delete.ts already handles
-- the cascading deletion of related chats and agents when a case is deleted.
-- These policies simply allow the database operations to proceed for the authenticated user.
