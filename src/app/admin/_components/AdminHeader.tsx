import Link from 'next/link'
import { logout } from '../actions'

export default function AdminHeader() {
  return (
    <div
      style={{
        background: '#171717',
        color: '#ffffff',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#ffd000', fontWeight: 900, fontSize: '16px' }}>
          PHAN GIA ADMIN
        </Link>
        <Link href="/admin/dich-vu" style={{ color: '#ffffff', fontSize: '13px' }}>
          Dịch vụ
        </Link>
        <Link href="/admin/du-an" style={{ color: '#ffffff', fontSize: '13px' }}>
          Dự án
        </Link>
        <Link href="/admin/menu" style={{ color: '#ffffff', fontSize: '13px' }}>
          Menu
        </Link>
        <Link href="/admin/cai-dat" style={{ color: '#ffffff', fontSize: '13px' }}>
          Cài đặt
        </Link>
      </div>

      <form action={logout}>
        <button
          type="submit"
          style={{
            background: 'transparent',
            border: '1px solid #666',
            color: '#ffffff',
            padding: '8px 14px',
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          Đăng xuất
        </button>
      </form>
    </div>
  )
}