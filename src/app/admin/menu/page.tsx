import Link from 'next/link'
import AdminHeader from '../_components/AdminHeader'
import ConfirmButton from '../_components/ConfirmButton'
import { createClient } from '@/lib/supabase/server'
import { deleteMenuItem, toggleMenuVisibility } from './actions'

export default async function MenuListPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .order('thu_tu', { ascending: true })

  return (
    <div>
      <AdminHeader />
      <div style={{ padding: '40px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h1 style={{ fontSize: '24px', margin: 0 }}>Quản lý Menu</h1>
          <Link
            href="/admin/menu/moi"
            style={{
              background: '#a90000',
              color: '#ffffff',
              padding: '10px 18px',
              fontWeight: 700,
              fontSize: '13px',
            }}
          >
            + Thêm mục menu
          </Link>
        </div>

        <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>
          Đường dẫn (vd: #dich-vu) là vị trí trên trang chủ mà mục menu sẽ nhảy tới khi khách bấm vào.
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #171717', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Thứ tự</th>
              <th style={{ padding: '10px' }}>Tên hiển thị</th>
              <th style={{ padding: '10px' }}>Đường dẫn</th>
              <th style={{ padding: '10px' }}>Trạng thái</th>
              <th style={{ padding: '10px' }}></th>
            </tr>
          </thead>
          <tbody>
            {items?.map((m) => (
              <tr key={m.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{m.thu_tu}</td>
                <td style={{ padding: '10px' }}>{m.nhan}</td>
                <td style={{ padding: '10px', color: '#888' }}>{m.duong_dan}</td>
                <td style={{ padding: '10px' }}>
                  <form action={toggleMenuVisibility.bind(null, m.id, m.hien_thi)}>
                    <button
                      type="submit"
                      style={{
                        border: 'none',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: m.hien_thi ? '#e6f4ea' : '#f5f5f5',
                        color: m.hien_thi ? '#1a7f37' : '#888',
                      }}
                    >
                      {m.hien_thi ? 'Đang hiện' : 'Đang ẩn'}
                    </button>
                  </form>
                </td>
                <td style={{ padding: '10px', textAlign: 'right' }}>
                  <Link
                    href={`/admin/menu/${m.id}`}
                    style={{ marginRight: '14px', color: '#a90000', fontWeight: 700 }}
                  >
                    Sửa
                  </Link>
                  <form action={deleteMenuItem.bind(null, m.id)} style={{ display: 'inline' }}>
                    <ConfirmButton
                      type="submit"
                      confirmText={`Xóa mục menu "${m.nhan}"?`}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#999',
                        cursor: 'pointer',
                        fontWeight: 700,
                      }}
                    >
                      Xóa
                    </ConfirmButton>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!items || items.length === 0) && (
          <p style={{ color: '#888', marginTop: '20px' }}>Chưa có mục menu nào.</p>
        )}
      </div>
    </div>
  )
}