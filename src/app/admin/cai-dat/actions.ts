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
    map_place_name: formData.get('map_place_name') as string,
    site_title: formData.get('site_title') as string,
    ticker_text: formData.get('ticker_text') as string,
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

        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(fileName, replaceFile)

        if (!uploadError) {
          const { data } = supabase.storage.from('images').getPublicUrl(fileName)
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

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, heroFile)

      if (!uploadError) {
        const { data } = supabase.storage.from('images').getPublicUrl(fileName)
        finalUrls.push(data.publicUrl)
      }
    }

    updateData.hero_images = finalUrls
  }

  await supabase.from('site_settings').update(updateData).eq('id', 1)

  revalidatePath('/admin/cai-dat')
  revalidatePath('/')
}