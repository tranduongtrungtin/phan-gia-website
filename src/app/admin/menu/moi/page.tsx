import AdminHeader from '../../_components/AdminHeader'
import { createMenuItem } from '../actions'

export default async function NewMenuItemPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div>
      <AdminHeader />
      <div style={{ padding: '40px', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Thêm mục menu</h1>

        {params.error && (
          <p style={{ color: '#a90000', marginBottom: '16px' }}>Lỗi: {params.error}</p>
        )}

        <form action={createMenuItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label>
            Tên hiển thị
            <input name="nhan" required placeholder="Bảng giá" style={inputStyle} />
          </label>

          <label>
            Đường dẫn (vd: #dich-vu để nhảy tới mục Dịch vụ trên trang chủ)
            <input name="duong_dan" required placeholder="#dich-vu" style={inputStyle} />
          </label>

          <label>
            Thứ tự hiển thị
            <input name="thu_tu" type="number" defaultValue={0} style={inputStyle} />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input name="hien_thi" type="checkbox" defaultChecked />
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
            LƯU
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