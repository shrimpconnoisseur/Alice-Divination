'use strict';

const SUPABASE_URL = 'https://ghyealtahxjoeiwrfiuw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_9cTfizwJsqGsc3h6r9Q7ZQ_hYttXG9G'; // this key is safe to have here

const { createClient } = supabase;
window._supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);