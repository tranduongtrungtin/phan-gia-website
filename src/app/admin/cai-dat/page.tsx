import AdminHeader from '../_components/AdminHeader'
import { createClient } from '@/lib/supabase/server'
import { updateSettings } from './actions'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single()

  return (
    <div>
      <AdminHeader />
      <div style={{ padding: '40px', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Cài đặt chung</h1>

        <form
          action={updateSettings}
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          <label>
            Số điện thoại (hotline)
            <input name="hotline" defaultValue={settings?.hotline} style={inputStyle} />
          </label>

          <label>
            Email
            <input name="email" defaultValue={settings?.email} style={inputStyle} />
          </label>

          <label>
            Địa chỉ
            <input name="dia_chi" defaultValue={settings?.dia_chi} style={inputStyle} />
          </label>

          <label>
            Số Zalo (để trống nếu chưa muốn hiện nút Zalo)
            <input
              name="zalo_so"
              defaultValue={settings?.zalo_so}
              placeholder="0918173789"
              style={inputStyle}
            />
          </label>

          <label>
            Số Viber (để trống nếu chưa muốn hiện nút Viber)
            <input
              name="viber_so"
              defaultValue={settings?.viber_so}
              placeholder="0918173789"
              style={inputStyle}
            />
          </label>

          {settings?.logo_url && (
            <div>
              <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#666' }}>Logo hiện tại:</p>
              <img
                src={settings.logo_url}
                alt="Logo"
                style={{ height: '50px', border: '1px solid #ddd', padding: '6px' }}
              />
            </div>
          )}

          <label>
            {settings?.logo_url ? 'Đổi logo khác' : 'Tải logo lên'} (để trống thì dùng chữ PHAN GIA)
            <input name="logo_file" type="file" accept="image/*" style={inputStyle} />
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