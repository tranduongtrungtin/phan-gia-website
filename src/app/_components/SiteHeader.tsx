'use client'

import { useState } from 'react'
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
  const [mobileOpen, setMobileOpen] = useState(false)

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

  const toggleLabel = mobileOpen ? 'Dong' : 'Mo'

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

      <nav className={mobileOpen ? 'is-open' : ''}>
        {items.map((m) => (
          <a
            key={m.id}
            href={m.duong_dan.startsWith('#') ? '/' + m.duong_dan : m.duong_dan}
            onClick={() => setMobileOpen(false)}
          >
            {m.nhan}
          </a>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <Link className="header-button" href="/#lien-he">
          NHẬN BÁO GIÁ
        </Link>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={toggleLabel + ' menu'}
        >
          <span className="menu-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </header>
  )
}
