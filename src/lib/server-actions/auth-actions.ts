'use server';

import { z } from 'zod';
import { FormSchema } from '../types';

import { createClient } from '../supabase/server';

export async function actionLoginUser({
  email,
  password,
}: z.infer<typeof FormSchema>) {
  const supabase = createClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: { message: error.message } };
  }

  return { data };
}
