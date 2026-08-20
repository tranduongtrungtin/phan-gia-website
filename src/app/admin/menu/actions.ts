'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

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

  revalidatePath('/admin/menu')
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