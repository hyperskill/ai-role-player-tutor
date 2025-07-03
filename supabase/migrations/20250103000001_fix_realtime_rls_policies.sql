-- Fix RLS policies to ensure real-time subscriptions work for users' own records
-- Users need to be able to see their own INSERT/UPDATE events via real-time

-- Cases table: Allow users to see their own cases
CREATE POLICY "Users can view own cases" ON public.cases
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cases" ON public.cases
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cases" ON public.cases
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Agents table: Allow users to see their own agents
CREATE POLICY "Users can view own agents" ON public.agents
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own agents" ON public.agents
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own agents" ON public.agents
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
