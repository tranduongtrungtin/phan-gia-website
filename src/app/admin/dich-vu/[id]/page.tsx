import { notFound } from 'next/navigation'
import AdminHeader from '../../_components/AdminHeader'
import { createClient } from '@/lib/supabase/server'
import { updateService } from '../actions'

export default async function EditServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const supabase = await createClient()

  const { data: service } = await supabase.from('services').select('*').eq('id', id).single()

  if (!service) notFound()

  const updateWithId = updateService.bind(null, id)

  return (
    <div>
      <AdminHeader />
      <div style={{ padding: '40px', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Sửa dịch vụ</h1>

        {sp.error && <p style={{ color: '#a90000', marginBottom: '16px' }}>Lỗi: {sp.error}</p>}

        <form action={updateWithId} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label>
            Tên dịch vụ
            <input name="ten" defaultValue={service.ten} required style={inputStyle} />
          </label>

          <label>
            Slug
            <input name="slug" defaultValue={service.slug} required style={inputStyle} />
          </label>

          <label>
            Thứ tự hiển thị
            <input name="so_thu_tu" type="number" defaultValue={service.so_thu_tu} style={inputStyle} />
          </label>

          <label>
            Mô tả ngắn
            <textarea name="mo_ta_ngan" rows={2} defaultValue={service.mo_ta_ngan} style={inputStyle} />
          </label>

          <label>
            Mô tả chi tiết
            <textarea
              name="mo_ta_chi_tiet"
              rows={4}
              defaultValue={service.mo_ta_chi_tiet}
              style={inputStyle}
            />
          </label>

          {service.hinh_anh && (
            <div>
              <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#666' }}>Ảnh hiện tại:</p>
              <img
                src={service.hinh_anh}
                alt={service.ten}
                style={{ width: '160px', height: '100px', objectFit: 'cover', border: '1px solid #ddd' }}
              />
            </div>
          )}

          <label>
            Đổi ảnh khác (để trống nếu giữ ảnh cũ)
            <input name="hinh_anh_file" type="file" accept="image/*" style={inputStyle} />
          </label>

          <label>
            Tags (cách nhau bằng dấu phẩy)
            <input
              name="tags"
              defaultValue={(service.tags || []).join(', ')}
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input name="hien_thi" type="checkbox" defaultChecked={service.hien_thi} />
            Hiển thị trên web
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