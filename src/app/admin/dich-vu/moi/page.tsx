'use client'

import { useState } from 'react'
import { createService } from '../actions'

function taoSlug(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export default function NewServicePage() {
  const [ten, setTen] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTuDong, setSlugTuDong] = useState(true)

  return (
    <div style={{ padding: '40px', maxWidth: '600px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Thêm dịch vụ mới</h1>

      <form action={createService} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <label>
          Tên dịch vụ
          <input
            name="ten"
            required
            value={ten}
            onChange={(e) => {
              setTen(e.target.value)
              if (slugTuDong) setSlug(taoSlug(e.target.value))
            }}
            style={inputStyle}
          />
        </label>

        <label>
          Slug (tự sinh từ Tên — sửa tay nếu muốn)
          <input
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value)
              setSlugTuDong(false)
            }}
            style={inputStyle}
          />
        </label>

        <label>
          Thứ tự hiển thị
          <input name="so_thu_tu" type="number" defaultValue={0} style={inputStyle} />
        </label>

        <label>
          Mô tả ngắn
          <textarea name="mo_ta_ngan" rows={2} style={inputStyle} />
        </label>

        <label>
          Mô tả chi tiết
          <textarea name="mo_ta_chi_tiet" rows={4} style={inputStyle} />
        </label>

        <label>
          Hình ảnh
          <input name="hinh_anh_file" type="file" accept="image/*" style={inputStyle} />
        </label>

        <label>
          Tags (cách nhau bằng dấu phẩy)
          <input name="tags" placeholder="Bảng hiệu, Mặt tiền, Showroom" style={inputStyle} />
        </label>

        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input name="hien_thi" type="checkbox" defaultChecked />
          Hiển thị trên web
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
          LƯU
        </button>
      </form>
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