import AdminHeader from './_components/AdminHeader'
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div>
      <AdminHeader />
      <div style={{ padding: '40px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Trang quản trị</h1>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {/* Nút Quản lý Dịch vụ */}
          <Link
            href="/admin/dich-vu"
            style={{
              display: 'inline-block',
              padding: '20px 30px',
              background: '#f5f5f5',
              border: '1px solid #ddd',
              color: '#171717',
              fontWeight: 700,
              textDecoration: 'none',
              borderRadius: '6px',
            }}
          >
            Quản lý Dịch vụ →
          </Link>

          {/* Nút Quản lý Tài khoản Admin */}
          <Link
            href="/admin/tai-khoan"
            style={{
              display: 'inline-block',
              padding: '20px 30px',
              background: '#f5f5f5',
              border: '1px solid #ddd',
              color: '#171717',
              fontWeight: 700,
              textDecoration: 'none',
              borderRadius: '6px',
            }}
          >
            Quản lý Tài khoản Admin →
          </Link>
        </div>
      </div>
    </div>
  )
}