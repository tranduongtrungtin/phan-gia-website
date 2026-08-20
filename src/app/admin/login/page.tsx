import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const hasError = params.error === '1'

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#171717',
      }}
    >
      <form
        action={login}
        style={{
          background: '#ffffff',
          padding: '40px',
          width: '360px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '22px', color: '#171717' }}>Đăng nhập Admin</h1>
        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>PHAN GIA ADVERTISING</p>

        {hasError && (
          <p style={{ margin: 0, fontSize: '13px', color: '#a90000' }}>
            Email hoặc mật khẩu không đúng.
          </p>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          style={{ padding: '12px', border: '1px solid #ddd', fontSize: '14px' }}
        />
        <input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          required
          style={{ padding: '12px', border: '1px solid #ddd', fontSize: '14px' }}
        />

        <button
          type="submit"
          style={{
            padding: '14px',
            background: '#a90000',
            color: '#ffffff',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          ĐĂNG NHẬP
        </button>
      </form>
    </div>
  )
}