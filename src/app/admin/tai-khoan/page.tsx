import AdminHeader from '../_components/AdminHeader'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { createAdminUser, changeOwnPassword } from './actions'
import DeleteUserButton from './DeleteUserButton'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()

  const currentCallerLevel = currentUser?.user_metadata?.role === 'cap_2' ? 2 : 1
  const cap1Count = users ? users.filter((u) => u.user_metadata?.role !== 'cap_2').length : 0
  const oneMonthAgo = new Date()
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#e9e3d5', paddingBottom: '60px' }}>
      <AdminHeader />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
          Quản lý Tài khoản Quản trị viên
        </h1>

        {/* 1. Form đổi mật khẩu cá nhân */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Đổi Mật khẩu Cá nhân</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
            Tài khoản hiện tại: <strong style={{ color: '#0f172a' }}>{currentUser?.email}</strong>
          </p>

          <form action={changeOwnPassword} autoComplete="off" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Mật khẩu mới</label>
              <input
                type="password"
                name="newPassword"
                autoComplete="new-password"
                required
                minLength={6}
                placeholder="Tối thiểu 6 ký tự"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Xác nhận mật khẩu mới</label>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                required
                minLength={6}
                placeholder="Nhập lại mật khẩu mới"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              style={{ padding: '10px 22px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', height: '42px' }}
            >
              Cập nhật mật khẩu
            </button>
          </form>
        </div>

        {/* 2. Form thêm tài khoản */}
        {currentCallerLevel === 1 ? (
          <div style={{ background: '#fff', padding: '24px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Thêm Quản trị viên Mới</h2>
            <form action={createAdminUser} autoComplete="off" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  autoComplete="new-password"
                  required
                  placeholder="admin@phangia.vn"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Mật khẩu tạm</label>
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  placeholder="Tối thiểu 6 ký tự"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#334155' }}>Cấp bậc</label>
                <select
                  name="role"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', background: '#fff' }}
                >
                  <option value="cap_1">Cấp 1 (Chủ sở hữu)</option>
                  <option value="cap_2">Cấp 2 (Vận hành / Nhân viên)</option>
                </select>
              </div>

              <button
                type="submit"
                style={{ padding: '10px 22px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', height: '42px' }}
              >
                + Thêm tài khoản
              </button>
            </form>
          </div>
        ) : (
          <div style={{ background: '#eff6ff', padding: '16px 20px', borderRadius: '8px', border: '1px solid #bfdbfe', marginBottom: '24px', color: '#1e40af', fontSize: '14px' }}>
            ℹ️ Bạn đang đăng nhập bằng tài khoản <strong>Cấp 2</strong> (Không có quyền tạo hoặc xóa tài khoản khác).
          </div>
        )}

        {/* 3. Bảng danh sách */}
        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, fontSize: '16px', color: '#0f172a' }}>
            Danh sách Quản trị viên ({users ? users.length : 0})
          </div>

          {error ? (
            <p style={{ padding: '20px', color: '#ef4444' }}>Lỗi: {error.message}</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '13px', color: '#64748b' }}>
                  <th style={{ padding: '14px 20px' }}>Email</th>
                  <th style={{ padding: '14px 20px' }}>Cấp bậc</th>
                  <th style={{ padding: '14px 20px' }}>Ngày tạo</th>
                  <th style={{ padding: '14px 20px' }}>Đăng nhập gần nhất</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((u) => {
                  const isCap2 = u.user_metadata?.role === 'cap_2'
                  const isSoleCap1 = !isCap2 && cap1Count <= 1
                  const isCurrent = u.id === currentUser?.id

                  const lastSignInDate = u.last_sign_in_at ? new Date(u.last_sign_in_at) : null
                  const isInactive = !lastSignInDate || lastSignInDate < oneMonthAgo

                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {isCurrent && (
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }} title="Tài khoản hiện tại" />
                          )}
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{u.email}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {isCap2 ? (
                          <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
                            Cấp 2 (Vận hành)
                          </span>
                        ) : (
                          <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                            Cấp 1 (Chủ sở hữu)
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#64748b', fontSize: '13px' }}>
                        {new Date(u.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '13px' }}>
                        {lastSignInDate ? (
                          <div>
                            <span style={{ color: '#166534', fontWeight: 600, display: 'block' }}>
                              {lastSignInDate.toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span style={{ color: '#64748b', fontSize: '12px' }}>
                              {lastSignInDate.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>Chưa đăng nhập</span>
                        )}
                        {isInactive && (
                          <span style={{ fontSize: '11px', color: '#dc2626', background: '#fee2e2', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '2px' }}>
                            &gt; 30 ngày
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        {currentCallerLevel === 2 ? (
                          <span style={{ color: '#cbd5e1', fontSize: '13px' }}>Không có quyền</span>
                        ) : isSoleCap1 ? (
                          <span style={{ color: '#94a3b8', fontSize: '13px' }}>Cấp 1 duy nhất</span>
                        ) : (
                          <DeleteUserButton userId={u.id} email={u.email ?? ''} />
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}