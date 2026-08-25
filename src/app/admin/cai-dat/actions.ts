'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function updateSettings(formData: FormData) {
  // 1. Kiểm tra xác thực người dùng
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Bạn không có quyền thực hiện thao tác này. Vui lòng đăng nhập.')
  }

  // 2. Chuẩn bị dữ liệu cập nhật
  const updateData: Record<string, unknown> = {
    hotline: formData.get('hotline') as string,
    email: formData.get('email') as string,
    dia_chi: formData.get('dia_chi') as string,
    zalo_so: formData.get('zalo_so') as string,
    viber_so: formData.get('viber_so') as string,
    map_place_name: formData.get('map_place_name') as string,
    site_title: formData.get('site_title') as string,
    ticker_text: formData.get('ticker_text') as string,
    updated_at: new Date().toISOString(),
  }

  // 3. Xử lý Logo bằng quyền Admin
  if (formData.get('delete_logo') === 'on') {
    updateData.logo_url = null
  } else {
    const file = formData.get('logo_file') as File | null

    if (file && file.size > 0) {
      const ext = file.name.split('.').pop()
      const fileName = `logo-${crypto.randomUUID()}.${ext}`

      const { error: uploadError } = await supabaseAdmin.storage
        .from('images')
        .upload(fileName, file)

      if (!uploadError) {
        const { data } = supabaseAdmin.storage.from('images').getPublicUrl(fileName)
        updateData.logo_url = data.publicUrl
      }
    }
  }

  // 4. Xử lý Hero Images bằng quyền Admin
  if (formData.has('hero_section_touched')) {
    const heroCount = Number(formData.get('hero_count') || 0)
    const finalUrls: string[] = []

    for (let i = 0; i < heroCount; i++) {
      const originalUrl = formData.get(`hero_url_${i}`) as string
      const isDeleted = formData.get(`delete_hero_${i}`) === 'on'
      const replaceFile = formData.get(`replace_hero_${i}`) as File | null

      if (isDeleted) continue

      if (replaceFile && replaceFile.size > 0) {
        const ext = replaceFile.name.split('.').pop()
        const fileName = `hero-${crypto.randomUUID()}.${ext}`

        const { error: uploadError } = await supabaseAdmin.storage
          .from('images')
          .upload(fileName, replaceFile)

        if (!uploadError) {
          const { data } = supabaseAdmin.storage.from('images').getPublicUrl(fileName)
          finalUrls.push(data.publicUrl)
        } else {
          finalUrls.push(originalUrl)
        }
      } else {
        finalUrls.push(originalUrl)
      }
    }

    const newHeroFiles = formData.getAll('new_hero_files') as File[]
    const validNewFiles = newHeroFiles.filter((f) => f && f.size > 0)

    for (const heroFile of validNewFiles) {
      const ext = heroFile.name.split('.').pop()
      const fileName = `hero-${crypto.randomUUID()}.${ext}`

      const { error: uploadError } = await supabaseAdmin.storage
        .from('images')
        .upload(fileName, heroFile)

      if (!uploadError) {
        const { data } = supabaseAdmin.storage.from('images').getPublicUrl(fileName)
        finalUrls.push(data.publicUrl)
      }
    }

    updateData.hero_images = finalUrls
  }

  // 5. Cập nhật bảng site_settings bằng quyền Admin
  const { error: dbError } = await supabaseAdmin
    .from('site_settings')
    .update(updateData)
    .eq('id', 1)

  if (dbError) {
    throw new Error(`Cập nhật thất bại: ${dbError.message}`)
  }

  revalidatePath('/admin/cai-dat')
  revalidatePath('/')

  
}