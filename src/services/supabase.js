// supabase.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://msyamhipiqrodsygmeyd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zeWFtaGlwaXFyb2RzeWdtZXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxOTc3MzksImV4cCI6MjAyODc3MzczOX0.JRkrEMjfki1kRFH-xKU0-GedO8z2qGR9Wq-HzesZbVw';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;