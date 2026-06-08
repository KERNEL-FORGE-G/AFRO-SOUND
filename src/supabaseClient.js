import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from '@supabase/supabase-js';

const supabaseUrl = 'https://pijrddmcjivmfezfyvjf.supabase.co';
// Clé "publishable" (publique) : sûre côté app tant que la RLS est activée.
const supabaseAnonKey = 'sb_publishable_frQ87e6W5pZp-uMtUV2aHg_n00GbFtx';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // En mobile, la session arrive via deep link : on l'échange nous-mêmes,
    // donc pas de détection automatique dans l'URL.
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});
