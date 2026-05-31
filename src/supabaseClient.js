import 'react-native-url-polyfill/auto';
import {createClient} from '@supabase/supabase-js';

const supabaseUrl = 'https://xwymtclxyqpgqknsfrtu.supabase.co';
const supabaseAnonKey = 'sb_publishable_xNSJ1Ujw3yjG_Xm4k_D8PA_A7b-h6kW';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
