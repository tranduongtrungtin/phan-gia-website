'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateSettings(formData: FormData) {
  const supabase = await createClient()

  const updateData: Record<string, unknown> = {
    hotline: formData.get('hotline') as string,
    email: formData.get('email') as string,
    dia_chi: formData.get('dia_chi') as string,
    zalo_so: formData.get('zalo_so') as string,
    viber_so: formData.get('viber_so') as string,
    updated_at: new Date().toISOString(),
  }

  const file = formData.get('logo_file') as File | null

  if (file && file.size > 0) {
    const ext = file.name.split('.').pop()
    const fileName = `logo-${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage.from('images').upload(fileName, file)

    if (!uploadError) {
      const { data } = supabase.storage.from('images').getPublicUrl(fileName)
      updateData.logo_url = data.publicUrl
    }
  }

  await supabase.from('site_settings').update(updateData).eq('id', 1)

  revalidatePath('/admin/cai-dat')
  revalidatePath('/')
}