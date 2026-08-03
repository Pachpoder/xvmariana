'use server';

import { loginSchema } from '@/lib/validation/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { LoginState } from '@/types/auth';

export async function loginWithPassword(_: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success)
    return {
      status: 'error',
      message: parsed.error.issues[0]?.message ?? 'Revisa los datos ingresados.',
    };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error)
    return { status: 'error', message: 'No fue posible iniciar sesión con esas credenciales.' };

  const { data, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !data?.claims.sub)
    return { status: 'error', message: 'No fue posible verificar la sesión.' };

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.claims.sub)
    .maybeSingle();
  if (profileError || profile?.role !== 'admin') {
    await supabase.auth.signOut();
    return { status: 'error', message: 'Esta cuenta no tiene acceso administrativo.' };
  }

  return { status: 'success' };
}
