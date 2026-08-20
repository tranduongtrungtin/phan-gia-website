import Link from 'next/link'

type MenuItem = { id: string; nhan: string; duong_dan: string }
type Settings = { logo_url?: string | null } | null

export default function SiteHeader({
  menuItems,
  settings,
}: {
  menuItems: MenuItem[] | null
  settings: Settings
}) {
  const items =
    menuItems && menuItems.length > 0
      ? menuItems
      : [
          { id: '1', nhan: 'Giới thiệu', duong_dan: '#gioi-thieu' },
          { id: '2', nhan: 'Năng lực', duong_dan: '#nang-luc' },
          { id: '3', nhan: 'Dịch vụ', duong_dan: '#dich-vu' },
          { id: '4', nhan: 'Dự án', duong_dan: '#du-an' },
          { id: '5', nhan: 'Liên hệ', duong_dan: '#lien-he' },
        ]

  return (
    <header className="header">
      {settings?.logo_url ? (
        <Link href="/" className="logo-link">
          <div className="logo-plate">
            <img src={settings.logo_url} alt="Phan Gia" className="logo-img" />
          </div>
        </Link>
      ) : (
        <Link href="/" className="logo">
          <span className="logo-mark">PG</span>
          PHAN<span>GIA</span>
        </Link>
      )}

      <nav>
        {items.map((m) => (
          <a key={m.id} href={m.duong_dan.startsWith('#') ? '/' + m.duong_dan : m.duong_dan}>
            {m.nhan}
          </a>
        ))}
      </nav>

      <Link className="header-button" href="/#lien-he">
        NHẬN BÁO GIÁ
      </Link>
    </header>
  )
}