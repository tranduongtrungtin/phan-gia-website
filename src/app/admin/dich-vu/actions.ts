'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function parseTags(input: string): string[] {
  return input
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

async function uploadImageIfPresent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  formData: FormData
): Promise<string | null> {
  const file = formData.get('hinh_anh_file') as File | null

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

export async function createService(formData: FormData) {
  const supabase = await createClient()

  let hinh_anh: string | null = null
  try {
    hinh_anh = await uploadImageIfPresent(supabase, formData)
  } catch (e) {
    redirect(`/admin/dich-vu/moi?error=${encodeURIComponent((e as Error).message)}`)
  }

  const { error } = await supabase.from('services').insert({
    ten: formData.get('ten') as string,
    slug: formData.get('slug') as string,
    so_thu_tu: Number(formData.get('so_thu_tu') || 0),
    mo_ta_ngan: formData.get('mo_ta_ngan') as string,
    mo_ta_chi_tiet: formData.get('mo_ta_chi_tiet') as string,
    hinh_anh: hinh_anh,
    tags: parseTags((formData.get('tags') as string) || ''),
    hien_thi: formData.get('hien_thi') === 'on',
  })

  if (error) {
    redirect(`/admin/dich-vu/moi?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/dich-vu')
  revalidatePath('/')
  redirect('/admin/dich-vu')
}

export async function updateService(id: string, formData: FormData) {
  const supabase = await createClient()

  let hinh_anh: string | null = null
  try {
    hinh_anh = await uploadImageIfPresent(supabase, formData)
  } catch (e) {
    redirect(`/admin/dich-vu/${id}?error=${encodeURIComponent((e as Error).message)}`)
  }

  const updateData: Record<string, unknown> = {
    ten: formData.get('ten') as string,
    slug: formData.get('slug') as string,
    so_thu_tu: Number(formData.get('so_thu_tu') || 0),
    mo_ta_ngan: formData.get('mo_ta_ngan') as string,
    mo_ta_chi_tiet: formData.get('mo_ta_chi_tiet') as string,
    tags: parseTags((formData.get('tags') as string) || ''),
    hien_thi: formData.get('hien_thi') === 'on',
    updated_at: new Date().toISOString(),
  }

  // Chỉ đổi ảnh nếu người dùng chọn ảnh mới
  if (hinh_anh) {
    updateData.hinh_anh = hinh_anh
  }

  const { error } = await supabase.from('services').update(updateData).eq('id', id)

  if (error) {
    redirect(`/admin/dich-vu/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/admin/dich-vu')
  revalidatePath('/')
  redirect('/admin/dich-vu')
}

export async function deleteService(id: string) {
  const supabase = await createClient()
  await supabase.from('services').delete().eq('id', id)
  revalidatePath('/admin/dich-vu')
  revalidatePath('/')
}

export async function toggleVisibility(id: string, current: boolean) {
  const supabase = await createClient()
  await supabase.from('services').update({ hien_thi: !current }).eq('id', id)
  revalidatePath('/admin/dich-vu')
  revalidatePath('/')
}