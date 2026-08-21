'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function updateNoiDungNeuCo(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData
) {
  const introFields = ['intro_title', 'intro_text_1', 'intro_text_2', 'intro_point_1', 'intro_point_2', 'intro_point_3']
  const capFields = [
    'cap_title',
    'cap_desc',
    'cap_1_title', 'cap_1_desc',
    'cap_2_title', 'cap_2_desc',
    'cap_3_title', 'cap_3_desc',
    'cap_4_title', 'cap_4_desc',
  ]
  const allFields = [...introFields, ...capFields]

  const updateData: Record<string, unknown> = {}
  let coDuLieu = false

  for (const field of allFields) {
    if (formData.has(field)) {
      updateData[field] = formData.get(field) as string
      coDuLieu = true
    }
  }

  if (coDuLieu) {
    updateData.updated_at = new Date().toISOString()
    await supabase.from('site_settings').update(updateData).eq('id', 1)
  }
}

export async function createMenuItem(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from('menu_items').insert({
    nhan: formData.get('nhan') as string,
    duong_dan: formData.get('duong_dan') as string,
    thu_tu: Number(formData.get('thu_tu') || 0),
    hien_thi: formData.get('hien_thi') === 'on',
  })

  if (error) {
    redirect(`/admin/menu/moi?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/menu')
  revalidatePath('/')
  redirect('/admin/menu')
}

export async function updateMenuItem(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('menu_items')
    .update({
      nhan: formData.get('nhan') as string,
      duong_dan: formData.get('duong_dan') as string,
      thu_tu: Number(formData.get('thu_tu') || 0),
      hien_thi: formData.get('hien_thi') === 'on',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    redirect(`/admin/menu/${id}?error=${encodeURIComponent(error.message)}`)
  }

  await updateNoiDungNeuCo(supabase, formData)

  revalidatePath('/admin/menu')
  revalidatePath('/admin/cai-dat')
  revalidatePath('/')
  redirect('/admin/menu')
}

export async function deleteMenuItem(id: string) {
  const supabase = await createClient()
  await supabase.from('menu_items').delete().eq('id', id)
  revalidatePath('/admin/menu')
  revalidatePath('/')
}

export async function toggleMenuVisibility(id: string, current: boolean) {
  const supabase = await createClient()
  await supabase.from('menu_items').update({ hien_thi: !current }).eq('id', id)
  revalidatePath('/admin/menu')
  revalidatePath('/')
}