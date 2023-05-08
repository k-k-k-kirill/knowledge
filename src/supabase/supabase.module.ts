import { Module, Provider } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const supabaseClientProvider: Provider = {
  provide: SupabaseClient,
  useFactory: () =>
    createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY),
};

@Module({
  providers: [supabaseClientProvider],
})
export class SupabaseModule {}
