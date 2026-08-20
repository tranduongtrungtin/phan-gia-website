import Link from 'next/link'
import AdminHeader from '../_components/AdminHeader'
import ConfirmButton from '../_components/ConfirmButton'
import { createClient } from '@/lib/supabase/server'
import { deleteService, toggleVisibility } from './actions'

export default async function DichVuListPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('so_thu_tu', { ascending: true })

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
          <h1 style={{ fontSize: '24px', margin: 0 }}>Quản lý Dịch vụ</h1>
          <Link
            href="/admin/dich-vu/moi"
            style={{
              background: '#a90000',
              color: '#ffffff',
              padding: '10px 18px',
              fontWeight: 700,
              fontSize: '13px',
            }}
          >
            + Thêm dịch vụ
          </Link>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #171717', textAlign: 'left' }}>
              <th style={{ padding: '10px' }}>Thứ tự</th>
              <th style={{ padding: '10px' }}>Tên dịch vụ</th>
              <th style={{ padding: '10px' }}>Trạng thái</th>
              <th style={{ padding: '10px' }}></th>
            </tr>
          </thead>
          <tbody>
            {services?.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{s.so_thu_tu}</td>
                <td style={{ padding: '10px' }}>{s.ten}</td>
                <td style={{ padding: '10px' }}>
                  <form action={toggleVisibility.bind(null, s.id, s.hien_thi)}>
                    <button
                      type="submit"
                      style={{
                        border: 'none',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: s.hien_thi ? '#e6f4ea' : '#f5f5f5',
                        color: s.hien_thi ? '#1a7f37' : '#888',
                      }}
                    >
                      {s.hien_thi ? 'Đang hiện' : 'Đang ẩn'}
                    </button>
                  </form>
                </td>
                <td style={{ padding: '10px', textAlign: 'right' }}>
                  <Link
                    href={`/admin/dich-vu/${s.id}`}
                    style={{ marginRight: '14px', color: '#a90000', fontWeight: 700 }}
                  >
                    Sửa
                  </Link>
                  <form
                    action={deleteService.bind(null, s.id)}
                    style={{ display: 'inline' }}
                  >
                    <ConfirmButton
                      type="submit"
                      confirmText={`Xóa dịch vụ "${s.ten}"? Không thể hoàn tác.`}
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

        {(!services || services.length === 0) && (
          <p style={{ color: '#888', marginTop: '20px' }}>Chưa có dịch vụ nào.</p>
        )}
      </div>
    </div>
  )
}