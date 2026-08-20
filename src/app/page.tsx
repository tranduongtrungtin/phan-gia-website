import { createClient } from '@/lib/supabase/server'
import FloatingContact from './_components/FloatingContact'
import SiteHeader from './_components/SiteHeader'
import SiteFooter from './_components/SiteFooter'

export default async function Home() {
  const supabase = await createClient()

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('hien_thi', true)
    .order('so_thu_tu', { ascending: true })

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('hien_thi', true)
    .order('so_thu_tu', { ascending: true })

  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single()

  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('*')
    .eq('hien_thi', true)
    .order('thu_tu', { ascending: true })

  const hotline = settings?.hotline || '0918 17 37 77'
  const email = settings?.email || 'quangcaophangia@gmail.com'
  const diaChi = settings?.dia_chi || '56 Võ Văn Kiệt, P. Bình Thủy, TP. Cần Thơ'
  const hotlineTel = hotline.replace(/\s/g, '')

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(diaChi)}&output=embed`

  const tickerItems = [
    '15+ NĂM KINH NGHIỆM',
    '120+ CÔNG TRÌNH HOÀN THÀNH',
    'THIẾT KẾ • SẢN XUẤT • THI CÔNG',
    'ĐỐI TÁC TIN CẬY TẠI ĐBSCL',
  ]

  return (
    <>
      <main>
        <SiteHeader menuItems={menuItems} settings={settings} />

        {/* HERO */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-text">
              <div className="hero-label">PHAN GIA ADVERTISING</div>

              <h1>
                GIẢI PHÁP
                <br />
                QUẢNG CÁO
                <br />
                <span>CHUYÊN NGHIỆP</span>
              </h1>

              <p>
                Thiết kế, sản xuất và thi công các giải pháp quảng cáo
                chuyên nghiệp cho doanh nghiệp.
              </p>

              <div className="hero-buttons">
                <a href="#lien-he" className="button-primary">
                  NHẬN BÁO GIÁ
                </a>

                <a href="#du-an" className="button-secondary">
                  XEM DỰ ÁN
                </a>
              </div>
            </div>

            <div className="hero-image">
              <img
                src="/images/hero-01.jpg"
                alt="Công trình quảng cáo Phan Gia"
              />

              <div className="image-badge">
                <strong>PHAN GIA</strong>
                <span>THIẾT KẾ • SẢN XUẤT • THI CÔNG</span>
              </div>
            </div>
          </div>
        </section>

        {/* TICKER */}
        <div className="ticker">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>

        {/* GIỚI THIỆU */}
        <section id="gioi-thieu" className="intro">
          <div className="intro-heading">
            <div className="section-label">VỀ PHAN GIA</div>

            <h2>
              Tạo dấu ấn
              <br />
              cho thương hiệu
            </h2>

            <div className="intro-line"></div>
          </div>

          <div className="intro-content">
            <p className="intro-lead">
              Phan Gia cung cấp giải pháp quảng cáo từ thiết kế,
              sản xuất đến thi công, giúp doanh nghiệp xây dựng hình ảnh
              chuyên nghiệp và nổi bật trong không gian kinh doanh.
            </p>

            <p>
              Với định hướng kết hợp giữa ý tưởng, kỹ thuật và khả năng
              sản xuất thực tế, Phan Gia triển khai nhiều hạng mục quảng
              cáo theo nhu cầu riêng của từng khách hàng.
            </p>

            <div className="intro-points">
              <div>
                <strong>01</strong>
                <span>Tư vấn &amp; thiết kế</span>
              </div>

              <div>
                <strong>02</strong>
                <span>Sản xuất theo yêu cầu</span>
              </div>

              <div>
                <strong>03</strong>
                <span>Thi công hoàn thiện</span>
              </div>
            </div>
          </div>
        </section>

        {/* NĂNG LỰC */}
        <section id="nang-luc" className="capabilities">
          <div className="section-heading">
            <div>
              <div className="section-label">NĂNG LỰC</div>

              <h2>
                Một quy trình
                <br />
                đồng bộ
              </h2>
            </div>

            <p>
              Phan Gia chủ động triển khai nhiều công đoạn trong cùng
              một quy trình, giúp kiểm soát tốt chất lượng và tiến độ
              của từng hạng mục.
            </p>
          </div>

          <div className="capability-grid">
            <div className="capability-card">
              <div className="capability-number">01</div>

              <h3>Tư vấn &amp; lên ý tưởng</h3>

              <p>
                Tiếp nhận nhu cầu, khảo sát thực tế và đề xuất phương án
                phù hợp với thương hiệu, không gian và ngân sách.
              </p>
            </div>

            <div className="capability-card">
              <div className="capability-number">02</div>

              <h3>Thiết kế</h3>

              <p>
                Phát triển ý tưởng thành phương án thiết kế trực quan,
                rõ ràng và phù hợp với nhận diện thương hiệu.
              </p>
            </div>

            <div className="capability-card">
              <div className="capability-number">03</div>

              <h3>Sản xuất</h3>

              <p>
                Gia công các hạng mục quảng cáo theo thiết kế và yêu cầu
                kỹ thuật đã thống nhất.
              </p>
            </div>

            <div className="capability-card">
              <div className="capability-number">04</div>

              <h3>Thi công</h3>

              <p>
                Lắp đặt và hoàn thiện công trình tại thực tế, đảm bảo
                tính thẩm mỹ và khả năng sử dụng.
              </p>
            </div>
          </div>
        </section>

        {/* DỊCH VỤ */}
        <section id="dich-vu" className="services">
          <div className="section-heading">
            <div>
              <div className="section-label">DỊCH VỤ</div>

              <h2>
                Giải pháp quảng cáo
                <br />
                trọn gói
              </h2>
            </div>

            <p>
              Từ ý tưởng, thiết kế đến sản xuất và thi công, Phan Gia
              cung cấp giải pháp quảng cáo đồng bộ, phù hợp với từng
              thương hiệu và không gian thực tế.
            </p>
          </div>

          <div className="service-grid">
            {services?.map((s) => (
              <article key={s.id} className="service-card service-card-image">
                {s.hinh_anh && <img src={s.hinh_anh} alt={s.ten} />}

                <div className="service-card-content">
                  <span>{String(s.so_thu_tu).padStart(2, '0')}</span>

                  <h3>{s.ten}</h3>

                  <p>{s.mo_ta_ngan}</p>

                  {s.tags && s.tags.length > 0 && (
                    <div className="service-tags">
                      {s.tags.map((tag: string) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  )}

                  <a href={`/dich-vu/${s.slug}`} className="service-link">
                    XEM DỊCH VỤ →
                  </a>
                </div>
              </article>
            ))}
          </div>

          {(!services || services.length === 0) && (
            <p className="empty-note">Chưa có dịch vụ nào được đăng.</p>
          )}
        </section>

        {/* DỰ ÁN */}
        <section id="du-an" className="projects">
          <div className="section-heading">
            <div>
              <div className="section-label">DỰ ÁN</div>

              <h2>
                Công trình
                <br />
                tiêu biểu
              </h2>
            </div>

            <p>
              Một số công trình tiêu biểu được Phan Gia thực hiện,
              thể hiện năng lực thiết kế, sản xuất và thi công thực tế.
            </p>
          </div>

          <div className="project-grid">
            {projects?.map((p) => (
              <a
                key={p.id}
                href={`/du-an/${p.slug}`}
                className="project-card"
              >
                {p.hinh_dai_dien && (
                  <img src={p.hinh_dai_dien} alt={p.ten} />
                )}

                <div className="project-overlay">
                  <span>{String(p.so_thu_tu).padStart(2, '0')}</span>

                  <div>
                    <strong>{p.ten}</strong>
                    <small>XEM CHI TIẾT →</small>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {(!projects || projects.length === 0) && (
            <p className="empty-note">Chưa có dự án nào được đăng.</p>
          )}
        </section>

        {/* LIÊN HỆ */}
        <section id="lien-he" className="contact">
          <div className="contact-content">
            <div className="section-label yellow">LIÊN HỆ PHAN GIA</div>

            <h2>
              Bạn đang có một
              <br />
              <span className="yellow">dự án quảng cáo?</span>
            </h2>

            <p>
              Hãy gửi nhu cầu của bạn cho Phan Gia. Chúng tôi tư vấn
              giải pháp phù hợp từ ý tưởng, vật liệu đến phương án
              sản xuất và thi công.
            </p>

            <div className="contact-actions">
              <a href={`tel:${hotlineTel}`} className="contact-main-button">
                GỌI NGAY
              </a>

              <a href={`mailto:${email}`} className="contact-outline-button">
                GỬI EMAIL
              </a>
            </div>
          </div>

          <div className="contact-box">
            <span>HOTLINE TƯ VẤN</span>

            <strong>{hotline}</strong>

            <small>{email}</small>

            <small>{diaChi}</small>
          </div>
        </section>

        {/* BẢN ĐỒ */}
        <section
          className="homepage-map"
          style={{
            padding: '70px 48px 80px',
            background: '#d9c3a4',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
            }}
          >
            <div
              className="section-label"
              style={{
                marginBottom: '16px',
              }}
            >
              VỊ TRÍ PHAN GIA
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
              }}
            >
              <div
                style={{
                  width: '420px',
                  maxWidth: '100%',
                }}
              >
                <iframe
                  src={mapUrl}
                  width="420"
                  height="250"
                  style={{
                    border: 0,
                    width: '100%',
                    height: '250px',
                    display: 'block',
                    boxShadow: '0 12px 28px rgba(75,41,19,0.18)',
                  }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bản đồ vị trí Phan Gia"
                />

                <div
                  style={{
                    background: '#4b2913',
                    color: '#ffffff',
                    padding: '14px 18px',
                    fontSize: '13px',
                    lineHeight: 1.5,
                  }}
                >
                  {diaChi}
                </div>
              </div>
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>

      <FloatingContact
        zaloSo={settings?.zalo_so}
        viberSo={settings?.viber_so}
      />
    </>
  )
}