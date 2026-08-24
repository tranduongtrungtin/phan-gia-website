'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function uploadIfPresent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData,
  fieldName: string
): Promise<string | null> {
  const file = formData.get(fieldName) as File | null
  if (!file || file.size === 0) return null

  const ext = file.name.split('.').pop()
  const fileName = `${fieldName}-${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from('images').upload(fileName, file)
  if (error) return null

  const { data } = supabase.storage.from('images').getPublicUrl(fileName)
  return data.publicUrl
}

async function updateNoiDungNeuCo(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData
) {
  const textFields = [
    'intro_title', 'intro_text_1', 'intro_text_2',
    'intro_point_1', 'intro_point_2', 'intro_point_3',
    'cap_title', 'cap_desc',
    'cap_1_title', 'cap_1_desc',
    'cap_2_title', 'cap_2_desc',
    'cap_3_title', 'cap_3_desc',
    'cap_4_title', 'cap_4_desc',
  ]

  const updateData: Record<string, unknown> = {}
  let coDuLieu = false

  for (const field of textFields) {
    if (formData.has(field)) {
      updateData[field] = formData.get(field) as string
      coDuLieu = true
    }
  }

  const imageFields = ['intro_image', 'cap_1_image', 'cap_2_image', 'cap_3_image', 'cap_4_image']
  for (const field of imageFields) {
    if (formData.has(field)) {
      const url = await uploadIfPresent(supabase, formData, field)
      if (url) {
        const columnName = field === 'intro_image' ? 'intro_image_url' : field
        updateData[columnName] = url
        coDuLieu = true
      }
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