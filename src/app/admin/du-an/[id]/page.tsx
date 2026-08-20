import { notFound } from 'next/navigation'
import AdminHeader from '../../_components/AdminHeader'
import { createClient } from '@/lib/supabase/server'
import { updateProject } from '../actions'

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const supabase = await createClient()

  const { data: project } = await supabase.from('projects').select('*').eq('id', id).single()

  if (!project) notFound()

  const updateWithId = updateProject.bind(null, id)

  return (
    <div>
      <AdminHeader />
      <div style={{ padding: '40px', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Sửa dự án</h1>

        {sp.error && <p style={{ color: '#a90000', marginBottom: '16px' }}>Lỗi: {sp.error}</p>}

        <form action={updateWithId} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label>
            Tên dự án
            <input name="ten" defaultValue={project.ten} required style={inputStyle} />
          </label>

          <label>
            Slug
            <input name="slug" defaultValue={project.slug} required style={inputStyle} />
          </label>

          <label>
            Thứ tự hiển thị
            <input name="so_thu_tu" type="number" defaultValue={project.so_thu_tu} style={inputStyle} />
          </label>

          <label>
            Danh mục
            <input name="danh_muc" defaultValue={project.danh_muc} style={inputStyle} />
          </label>

          <label>
            Mô tả
            <textarea name="mo_ta" rows={2} defaultValue={project.mo_ta} style={inputStyle} />
          </label>

          <label>
            Nội dung chi tiết
            <textarea
              name="noi_dung_chi_tiet"
              rows={4}
              defaultValue={project.noi_dung_chi_tiet}
              style={inputStyle}
            />
          </label>

          {project.hinh_dai_dien && (
            <div>
              <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#666' }}>Ảnh hiện tại:</p>
              <img
                src={project.hinh_dai_dien}
                alt={project.ten}
                style={{ width: '160px', height: '100px', objectFit: 'cover', border: '1px solid #ddd' }}
              />
            </div>
          )}

          <label>
            Đổi ảnh khác (để trống nếu giữ ảnh cũ)
            <input name="hinh_dai_dien_file" type="file" accept="image/*" style={inputStyle} />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input name="hien_thi" type="checkbox" defaultChecked={project.hien_thi} />
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