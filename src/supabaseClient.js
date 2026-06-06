import 'react-native-url-polyfill/auto';
<<<<<<< HEAD
import { createClient } from '@supabase/supabase-js';
=======
import {createClient} from '@supabase/supabase-js';
>>>>>>> upstream/main

const supabaseUrl = 'https://xwymtclxyqpgqknsfrtu.supabase.co';
const supabaseAnonKey = 'sb_publishable_xNSJ1Ujw3yjG_Xm4k_D8PA_A7b-h6kW';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
