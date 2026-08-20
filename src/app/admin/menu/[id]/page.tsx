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
