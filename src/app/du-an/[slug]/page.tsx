import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SiteHeader from '../../_components/SiteHeader'
import SiteFooter from '../../_components/SiteFooter'
import FloatingContact from '../../_components/FloatingContact'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('hien_thi', true)
    .single()

  if (!project) notFound()

  const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 1).single()
  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .eq('hien_thi', true)
    .order('thu_tu', { ascending: true })

  const hotline = settings?.hotline || '0918 17 37 77'
  const hotlineTel = hotline.replace(/\s/g, '')

  return (
    <>
      <SiteHeader menuItems={menuItems} settings={settings} />

      <main className="detail-page">
        <section className="detail-hero">
          {project.hinh_dai_dien && <img src={project.hinh_dai_dien} alt={project.ten} />}
          <div className="detail-hero-overlay">
            <Link href="/#du-an" className="detail-back">
              ← Quay lại Dự án
            </Link>
            <h1>{project.ten}</h1>
            {project.danh_muc && <span className="detail-category">{project.danh_muc}</span>}
          </div>
        </section>

        <section className="detail-body">
          <div className="detail-content">
            {project.mo_ta && <p className="detail-lead">{project.mo_ta}</p>}
            {project.noi_dung_chi_tiet && <p>{project.noi_dung_chi_tiet}</p>}
          </div>

          <div className="detail-cta">
            <a href={`tel:${hotlineTel}`} className="button-primary">
              Tư vấn dự án tương tự
            </a>
            <Link href="/#du-an" className="button-secondary">
              Xem dự án khác
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
      <FloatingContact zaloSo={settings?.zalo_so} viberSo={settings?.viber_so} />
    </>
  )
}