'use client'

import { deleteAdminUser } from './actions'

interface Props {
  userId: string
  email: string
}

export default function DeleteUserButton({ userId, email }: Props) {
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${email}" không? Thao tác này không thể hoàn tác.`)
    
    if (isConfirmed) {
      const formData = new FormData()
      formData.append('userId', userId)
      await deleteAdminUser(formData)
    }
  }

  return (
    <form onSubmit={handleDelete} style={{ display: 'inline' }}>
      <button
        type="submit"
        style={{
          color: '#ef4444',
          background: 'none',
          border: 'none',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '13px',
        }}
      >
        Xóa
      </button>
    </form>
  )
}