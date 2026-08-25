import AdminHeader from '../_components/AdminHeader'
import { createClient } from '@/lib/supabase/server'
import { updateSettings } from './actions'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single()

  const heroImages: string[] = Array.isArray(settings?.hero_images)
    ? settings.hero_images
    : []

  return (
    <div>
      <AdminHeader />
      <div style={{ padding: '40px', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Cài đặt chung</h1>

        <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
          Muốn sửa nội dung khối &quot;Giới thiệu&quot; hoặc &quot;Năng lực&quot;? Vào Menu → Sửa mục
          tương ứng.
        </p>

        <form
          action={updateSettings}
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          <input type="hidden" name="hero_section_touched" value="1" />
          <input type="hidden" name="hero_count" value={heroImages.length} />

          <label>
            Số điện thoại (hotline)
            <input name="hotline" defaultValue={settings?.hotline} style={inputStyle} />
          </label>

          <label>
            Email
            <input name="email" defaultValue={settings?.email} style={inputStyle} />
          </label>

          <label>
            Địa chỉ
            <input name="dia_chi" defaultValue={settings?.dia_chi} style={inputStyle} />
          </label>

          <label>
            Tên địa điểm ghim trên bản đồ (VD: Quảng cáo Phan Gia)
            <input
              name="map_place_name"
              defaultValue={settings?.map_place_name}
              placeholder="Quảng cáo Phan Gia"
              style={inputStyle}
            />
          </label>

          <label>
            Số Zalo (để trống nếu chưa muốn hiện nút Zalo)
            <input
              name="zalo_so"
              defaultValue={settings?.zalo_so}
              placeholder="0918173789"
              style={inputStyle}
            />
          </label>

          <label>
            Số Viber (để trống nếu chưa muốn hiện nút Viber)
            <input
              name="viber_so"
              defaultValue={settings?.viber_so}
              placeholder="0918173789"
              style={inputStyle}
            />
          </label>

          {settings?.logo_url && (
            <div>
              <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#666' }}>Logo hiện tại:</p>
              <img
                src={settings.logo_url}
                alt="Logo"
                style={{ height: '50px', border: '1px solid #ddd', padding: '6px' }}
              />
            </div>
          )}

          <label>
  {settings?.logo_url ? 'Đổi logo khác' : 'Tải logo lên'} (để trống thì dùng chữ PHAN GIA)
  <input name="logo_file" type="file" accept="image/*" style={inputStyle} />
</label>

{settings?.logo_url && (
  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a90000' }}>
    <input name="delete_logo" type="checkbox" />
    Xóa logo, dùng lại chữ PHAN GIA mặc định
  </label>
)}

          <div>
            <p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 600 }}>
              Ảnh banner trang chủ ({heroImages.length} ảnh, sẽ tự động chạy slide)
            </p>

            {heroImages.map((url, i) => (
              <div
                key={url}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  border: '1px solid #ddd',
                  padding: '10px',
                  marginBottom: '8px',
                }}
              >
                <input type="hidden" name={`hero_url_${i}`} value={url} />

                <img
                  src={url}
                  alt={`Hero ${i + 1}`}
                  style={{ width: '90px', height: '60px', objectFit: 'cover', flexShrink: 0 }}
                />

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', color: '#666' }}>
                    Thay ảnh này bằng ảnh khác:
                    <input
                      name={`replace_hero_${i}`}
                      type="file"
                      accept="image/*"
                      style={{ ...inputStyle, marginTop: '4px' }}
                    />
                  </label>
                </div>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '13px',
                    fontWeight: 'normal',
                    color: '#a90000',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <input type="checkbox" name={`delete_hero_${i}`} style={{ width: 'auto' }} />
                  Xoá
                </label>
              </div>
            ))}

            <label>
              Thêm ảnh mới (chọn nhiều ảnh cùng lúc)
              <input name="new_hero_files" type="file" accept="image/*" multiple style={inputStyle} />
            </label>
          </div>

          <label>
            Tiêu đề tab trình duyệt (SEO)
            <input
              name="site_title"
              defaultValue={settings?.site_title}
              placeholder="Phan Gia - Quảng cáo & Trang trí"
              style={inputStyle}
            />
          </label>

          <label>
            Nội dung dải chữ chạy (mỗi dòng 1 mục)
            <textarea
              name="ticker_text"
              defaultValue={settings?.ticker_text}
              placeholder={
                '15+ NĂM KINH NGHIỆM\n120+ CÔNG TRÌNH HOÀN THÀNH\nTHIẾT KẾ • SẢN XUẤT • THI CÔNG'
              }
              rows={4}
              style={inputStyle}
            />
          </label>

          <button
            type="submit"
            style={{
              background: '#a90000',
              color: '#ffffff',
              padding: '14px',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            LƯU THAY ĐỔI
          </button>
        </form>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: '6px',
  padding: '10px',
  border: '1px solid #ddd',
  fontSize: '14px',
  boxSizing: 'border-box',
}
