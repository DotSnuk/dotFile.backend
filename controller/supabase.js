const {createClient} = require('@supabase/supabase-js');
const subabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API_KEY;
const supabase = createClient(subabaseUrl, supabaseKey);

module.exports = supabase