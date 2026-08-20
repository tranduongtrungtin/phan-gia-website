import AdminHeader from '../../_components/AdminHeader'
import { createProject } from '../actions'

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div>
      <AdminHeader />
      <div style={{ padding: '40px', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Thêm dự án mới</h1>

        {params.error && (
          <p style={{ color: '#a90000', marginBottom: '16px' }}>Lỗi: {params.error}</p>
        )}

        <form action={createProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label>
            Tên dự án
            <input name="ten" required style={inputStyle} />
          </label>

          <label>
            Slug (không dấu, không khoảng trắng, vd: du-an-01)
            <input name="slug" required style={inputStyle} />
          </label>

          <label>
            Thứ tự hiển thị
            <input name="so_thu_tu" type="number" defaultValue={0} style={inputStyle} />
          </label>

          <label>
            Danh mục
            <input name="danh_muc" placeholder="Bảng hiệu quảng cáo" style={inputStyle} />
          </label>

          <label>
            Mô tả
            <textarea name="mo_ta" rows={2} style={inputStyle} />
          </label>

          <label>
            Nội dung chi tiết
            <textarea name="noi_dung_chi_tiet" rows={4} style={inputStyle} />
          </label>

          <label>
            Hình đại diện
            <input name="hinh_dai_dien_file" type="file" accept="image/*" style={inputStyle} />
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