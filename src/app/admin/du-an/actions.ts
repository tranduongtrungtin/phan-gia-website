'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function uploadImageIfPresent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData
): Promise<string | null> {
  const file = formData.get('hinh_dai_dien_file') as File | null

  if (!file || file.size === 0) {
    return null
  }

  const ext = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from('images').upload(fileName, file)

  if (error) {
    throw new Error(`Lỗi tải ảnh lên: ${error.message}`)
  }

  const { data } = supabase.storage.from('images').getPublicUrl(fileName)
  return data.publicUrl
}

export async function createProject(formData: FormData) {
  const supabase = await createClient()

  let hinh_dai_dien: string | null = null
  try {
    hinh_dai_dien = await uploadImageIfPresent(supabase, formData)
  } catch (e) {
    redirect(`/admin/du-an/moi?error=${encodeURIComponent((e as Error).message)}`)
  }

  const { error } = await supabase.from('projects').insert({
    ten: formData.get('ten') as string,
    slug: formData.get('slug') as string,
    so_thu_tu: Number(formData.get('so_thu_tu') || 0),
    hinh_dai_dien: hinh_dai_dien,
    mo_ta: formData.get('mo_ta') as string,
    noi_dung_chi_tiet: formData.get('noi_dung_chi_tiet') as string,
    danh_muc: formData.get('danh_muc') as string,
    hien_thi: formData.get('hien_thi') === 'on',
  })

  if (error) {
    redirect(`/admin/du-an/moi?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/du-an')
  revalidatePath('/')
  redirect('/admin/du-an')
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient()

  let hinh_dai_dien: string | null = null
  try {
    hinh_dai_dien = await uploadImageIfPresent(supabase, formData)
  } catch (e) {
    redirect(`/admin/du-an/${id}?error=${encodeURIComponent((e as Error).message)}`)
  }

  const updateData: Record<string, unknown> = {
    ten: formData.get('ten') as string,
    slug: formData.get('slug') as string,
    so_thu_tu: Number(formData.get('so_thu_tu') || 0),
    mo_ta: formData.get('mo_ta') as string,
    noi_dung_chi_tiet: formData.get('noi_dung_chi_tiet') as string,
    danh_muc: formData.get('danh_muc') as string,
    hien_thi: formData.get('hien_thi') === 'on',
    updated_at: new Date().toISOString(),
  }

  if (hinh_dai_dien) {
    updateData.hinh_dai_dien = hinh_dai_dien
  }

  const { error } = await supabase.from('projects').update(updateData).eq('id', id)

  if (error) {
    redirect(`/admin/du-an/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/du-an')
  revalidatePath('/')
  redirect('/admin/du-an')
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  await supabase.from('projects').delete().eq('id', id)
  revalidatePath('/admin/du-an')
  revalidatePath('/')
}

export async function toggleProjectVisibility(id: string, current: boolean) {
  const supabase = await createClient()
  await supabase.from('projects').update({ hien_thi: !current }).eq('id', id)
  revalidatePath('/admin/du-an')
  revalidatePath('/')
}