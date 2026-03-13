//==============================================================================
//================================ IMPORTS =====================================
//==============================================================================

import { createClient } from '@supabase/supabase-js';

//==============================================================================
//================================ VARIABLES ===================================
//==============================================================================

//==============================================================================
//================================ FUNCIONS ====================================
//==============================================================================

//==============================================================================
//================================ EXPORTS =====================================
//==============================================================================

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const supabaseUrl = config.public.supabaseUrl || '';
  const supabaseAnonKey = config.public.supabaseAnonKey || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      provide: {
        supabase: null
      }
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const initAuth = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      await supabase.auth.signInAnonymously();
    }
  };

  initAuth();

  return {
    provide: {
      supabase
    }
  };
});
