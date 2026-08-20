import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SiteHeader from '../../_components/SiteHeader'
import SiteFooter from '../../_components/SiteFooter'
import FloatingContact from '../../_components/FloatingContact'

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('hien_thi', true)
    .single()

  if (!service) notFound()

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
          {service.hinh_anh && <img src={service.hinh_anh} alt={service.ten} />}
          <div className="detail-hero-overlay">
            <Link href="/#dich-vu" className="detail-back">
              ← Quay lại Dịch vụ
            </Link>
            <h1>{service.ten}</h1>
          </div>
        </section>

        <section className="detail-body">
          <div className="detail-content">
            {service.mo_ta_ngan && <p className="detail-lead">{service.mo_ta_ngan}</p>}
            {service.mo_ta_chi_tiet && <p>{service.mo_ta_chi_tiet}</p>}

            {service.tags && service.tags.length > 0 && (
              <div className="service-tags">
                {service.tags.map((tag: string) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div className="detail-cta">
            <a href={`tel:${hotlineTel}`} className="button-primary">
              Gọi tư vấn ngay
            </a>
            <Link href="/#dich-vu" className="button-secondary">
              Xem dịch vụ khác
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
      <FloatingContact zaloSo={settings?.zalo_so} viberSo={settings?.viber_so} />
    </>
  )
}