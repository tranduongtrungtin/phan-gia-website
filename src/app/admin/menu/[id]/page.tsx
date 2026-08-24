import { notFound } from 'next/navigation'
import AdminHeader from '../../_components/AdminHeader'
import { createClient } from '@/lib/supabase/server'
import { updateMenuItem } from '../actions'

export default async function EditMenuItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const supabase = await createClient()

  const { data: item } = await supabase.from('menu_items').select('*').eq('id', id).single()

  if (!item) notFound()

  const isGioiThieu = item.duong_dan === '#gioi-thieu'
  const isNangLuc = item.duong_dan === '#nang-luc'
  const canEditNoiDung = isGioiThieu || isNangLuc

  let settings: Record<string, any> | null = null
  if (canEditNoiDung) {
    const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single()
    settings = data
  }

  const updateWithId = updateMenuItem.bind(null, id)

  return (
    <div>
      <AdminHeader />
      <div style={{ padding: '40px', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Sửa mục menu</h1>

        {sp.error && <p style={{ color: '#a90000', marginBottom: '16px' }}>Lỗi: {sp.error}</p>}

        <form action={updateWithId} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label>
            Tên hiển thị
            <input name="nhan" defaultValue={item.nhan} required style={inputStyle} />
          </label>

          <label>
            Đường dẫn
            <input name="duong_dan" defaultValue={item.duong_dan} required style={inputStyle} />
          </label>

          <label>
            Thứ tự hiển thị
            <input name="thu_tu" type="number" defaultValue={item.thu_tu} style={inputStyle} />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input name="hien_thi" type="checkbox" defaultChecked={item.hien_thi} />
            Hiển thị trên web
          </label>

          {isGioiThieu && (
            <div style={{ borderTop: '2px solid #eee', paddingTop: '20px', marginTop: '10px' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '14px' }}>Nội dung khối "Giới thiệu"</h2>

              <label>
                Tiêu đề (VD: Tạo dấu ấn cho thương hiệu)
                <input
                  name="intro_title"
                  defaultValue={settings?.intro_title}
                  placeholder="Tạo dấu ấn cho thương hiệu"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: 'block', marginTop: '14px' }}>
                Đoạn văn 1
                <textarea name="intro_text_1" defaultValue={settings?.intro_text_1} rows={3} style={inputStyle} />
              </label>

              <label style={{ display: 'block', marginTop: '14px' }}>
                Đoạn văn 2
                <textarea name="intro_text_2" defaultValue={settings?.intro_text_2} rows={3} style={inputStyle} />
              </label>

              {[1, 2, 3].map((n) => (
                <div key={n} style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px dashed #ddd' }}>
                  <label style={{ display: 'block' }}>
                    {`Mục ${String(n).padStart(2, '0')}`}
                    <input
                      name={`intro_point_${n}`}
                      defaultValue={settings?.[`intro_point_${n}`]}
                      style={inputStyle}
                    />
                  </label>

                  {settings?.[`intro_point_${n}_image`] && (
                    <div style={{ marginTop: '10px' }}>
                      <img
                        src={settings[`intro_point_${n}_image`]}
                        alt={`Mục ${n}`}
                        style={{ width: '120px', height: '80px', objectFit: 'cover', border: '1px solid #ddd' }}
                      />
                    </div>
                  )}

                  <label style={{ display: 'block', marginTop: '10px' }}>
                    {settings?.[`intro_point_${n}_image`] ? 'Đổi ảnh khác' : 'Tải ảnh lên (không bắt buộc)'}
                    <input name={`intro_point_${n}_image`} type="file" accept="image/*" style={inputStyle} />
                  </label>
                </div>
              ))}
            </div>
          )}

          {isNangLuc && (
            <div style={{ borderTop: '2px solid #eee', paddingTop: '20px', marginTop: '10px' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '14px' }}>Nội dung khối "Năng lực"</h2>

              <label>
                Tiêu đề (VD: Một quy trình đồng bộ)
                <input
                  name="cap_title"
                  defaultValue={settings?.cap_title}
                  placeholder="Một quy trình đồng bộ"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: 'block', marginTop: '14px' }}>
                Mô tả ngắn
                <textarea name="cap_desc" defaultValue={settings?.cap_desc} rows={3} style={inputStyle} />
              </label>

              {[1, 2, 3, 4].map((n) => (
                <div key={n} style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px dashed #ddd' }}>
                  <label style={{ display: 'block' }}>
                    Mục {n} — Tiêu đề
                    <input
                      name={`cap_${n}_title`}
                      defaultValue={settings?.[`cap_${n}_title`]}
                      style={inputStyle}
                    />
                  </label>
                  <label style={{ display: 'block', marginTop: '6px' }}>
                    Mục {n} — Mô tả
                    <textarea
                      name={`cap_${n}_desc`}
                      defaultValue={settings?.[`cap_${n}_desc`]}
                      rows={2}
                      style={inputStyle}
                    />
                  </label>

                  {settings?.[`cap_${n}_image`] && (
                    <div style={{ marginTop: '10px' }}>
                      <img
                        src={settings[`cap_${n}_image`]}
                        alt={`Mục ${n}`}
                        style={{ width: '120px', height: '80px', objectFit: 'cover', border: '1px solid #ddd' }}
                      />
                    </div>
                  )}

                  <label style={{ display: 'block', marginTop: '10px' }}>
                    {settings?.[`cap_${n}_image`] ? 'Đổi ảnh khác' : 'Tải ảnh lên'}
                    <input name={`cap_${n}_image`} type="file" accept="image/*" style={inputStyle} />
                  </label>
                </div>
              ))}
            </div>
          )}

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
