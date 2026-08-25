import AdminHeader from '../_components/AdminHeader'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { createAdminUser, deleteAdminUser, changeOwnPassword } from './actions'

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
    <div style={{ minHeight: '100vh', backgroundColor: '#e9e3d5' }}>
      <AdminHeader />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '24px', textTransform: 'uppercase' }}>
          Quản lý Tài khoản Quản trị viên
        </h1>

        {/* 1. Form đổi mật khẩu cá nhân */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Đổi Mật khẩu Cá nhân</h2>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
            Tài khoản hiện tại: <strong>{currentUser?.email}</strong>
          </p>

          <form action={changeOwnPassword} autoComplete="off" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Mật khẩu mới</label>
              <input
                type="password"
                name="newPassword"
                autoComplete="new-password"
                required
                minLength={6}
                placeholder="Tối thiểu 6 ký tự"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Xác nhận mật khẩu mới</label>
              <input
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                required
                minLength={6}
                placeholder="Nhập lại đúng mật khẩu trên"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
              />
            </div>

            <button
              type="submit"
              style={{ padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', height: '42px' }}
            >
              Cập nhật mật khẩu
            </button>
          </form>
        </div>

        {/* 2. Form tạo tài khoản (Chỉ Cấp 1) */}
        {currentCallerLevel === 1 ? (
          <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Thêm Quản trị viên Mới</h2>
            <form action={createAdminUser} autoComplete="off" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  autoComplete="new-password"
                  required
                  placeholder="admin@phangia.vn"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Mật khẩu tạm</label>
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  placeholder="Tối thiểu 6 ký tự"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Cấp bậc</label>
                <select
                  name="role"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', background: '#fff' }}
                >
                  <option value="cap_1">Cấp 1 (Chủ sở hữu)</option>
                  <option value="cap_2">Cấp 2 (Vận hành / Nhân viên)</option>
                </select>
              </div>

              <button
                type="submit"
                style={{ padding: '10px 20px', background: '#171717', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 700, cursor: 'pointer', height: '42px' }}
              >
                + Thêm tài khoản
              </button>
            </form>
          </div>
        ) : (
          <div style={{ background: '#fff', padding: '16px 24px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '24px', color: '#666' }}>
            ℹ️ Bạn đang đăng nhập bằng tài khoản <strong>Cấp 2</strong> (Không có quyền tạo hoặc xóa tài khoản khác).
          </div>
        )}

        {/* 3. Bảng truy vết đăng nhập & quản lý */}
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #ddd', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #eee', fontWeight: 700 }}>
            Danh sách Quản trị viên ({users ? users.length : 0})
          </div>

          {error ? (
            <p style={{ padding: '20px', color: 'red' }}>Lỗi: {error.message}</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#fafafa', borderBottom: '1px solid #eee', fontSize: '13px', color: '#666' }}>
                  <th style={{ padding: '12px 20px' }}>Email</th>
                  <th style={{ padding: '12px 20px' }}>Cấp bậc</th>
                  <th style={{ padding: '12px 20px' }}>Ngày tạo</th>
                  <th style={{ padding: '12px 20px' }}>Đăng nhập gần nhất</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users?.map((u) => {
                  const isCap2 = u.user_metadata?.role === 'cap_2'
                  const isSoleCap1 = !isCap2 && cap1Count <= 1

                  const lastSignInDate = u.last_sign_in_at ? new Date(u.last_sign_in_at) : null
                  const isInactive = !lastSignInDate || lastSignInDate < oneMonthAgo

                  const formattedLastSignIn = lastSignInDate
  ? lastSignInDate.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  : 'Chưa đăng nhập'

                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 600 }}>{u.email}</td>
                      <td style={{ padding: '14px 20px' }}>
                        {isCap2 ? (
                          <span style={{ background: '#f5f5f5', color: '#555', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                            Cấp 2 (Vận hành)
                          </span>
                        ) : (
                          <span style={{ background: '#e3f2fd', color: '#1976d2', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
                            Cấp 1 (Chủ sở hữu)
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#666', fontSize: '13px' }}>
                        {new Date(u.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '13px' }}>
                        <div style={{ color: lastSignInDate ? '#166534' : '#9ca3af', fontWeight: lastSignInDate ? 600 : 400 }}>
                          {formattedLastSignIn}
                        </div>
                        {isInactive && (
                          <span style={{ fontSize: '11px', color: '#b91c1c', background: '#fef2f2', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '2px' }}>
                            &gt; 30 ngày không online
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        {currentCallerLevel === 2 ? (
                          <span style={{ color: '#bbb', fontSize: '13px' }}>Không có quyền</span>
                        ) : isSoleCap1 ? (
                          <span style={{ color: '#aaa', fontSize: '13px' }}>Cấp 1 duy nhất</span>
                        ) : (
                          <form action={deleteAdminUser} style={{ display: 'inline' }}>
                            <input type="hidden" name="userId" value={u.id} />
                            <button
                              type="submit"
                              style={{ color: '#d32f2f', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}
                            >
                              Xóa
                            </button>
                          </form>
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