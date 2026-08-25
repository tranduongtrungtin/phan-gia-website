'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

// Kiểm tra người đang thao tác
async function getCallerLevel() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Vui lòng đăng nhập.')

  const level = user.user_metadata?.role === 'cap_2' ? 2 : 1
  return { user, level }
}

// 1. Tạo tài khoản (Chỉ Cấp 1)
export async function createAdminUser(formData: FormData) {
  const { level: callerLevel } = await getCallerLevel()

  if (callerLevel !== 1) {
    throw new Error('Chỉ Quản trị viên Cấp 1 mới có quyền tạo tài khoản!')
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = (formData.get('role') as string) || 'cap_2'

  if (!email || !password) {
    throw new Error('Vui lòng điền đầy đủ email và mật khẩu')
  }

  if (password.length < 6) {
    throw new Error('Mật khẩu phải có ít nhất 6 ký tự')
  }

  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role },
  })

  if (error) {
    throw new Error(`Tạo tài khoản thất bại: ${error.message}`)
  }

  revalidatePath('/admin/tai-khoan')
}

// 2. Xóa tài khoản (Chỉ Cấp 1, không được xóa Cấp 1 duy nhất)
export async function deleteAdminUser(formData: FormData) {
  const { user: currentUser, level: callerLevel } = await getCallerLevel()

  if (callerLevel !== 1) {
    throw new Error('Bạn không có quyền xóa tài khoản!')
  }

  const targetUserId = formData.get('userId') as string

  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
  const cap1Users = users.filter((u) => u.user_metadata?.role !== 'cap_2')

  if (cap1Users.length <= 1 && targetUserId === currentUser.id) {
    throw new Error('Hệ thống phải có ít nhất một Quản trị viên Cấp 1. Không thể tự xóa!')
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(targetUserId)

  if (error) {
    throw new Error(`Xóa tài khoản thất bại: ${error.message}`)
  }

  revalidatePath('/admin/tai-khoan')
}

// 3. Đổi mật khẩu cá nhân (Dành cho TẤT CẢ mọi người đang đăng nhập)
export async function changeOwnPassword(formData: FormData) {
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!newPassword || newPassword.length < 6) {
    throw new Error('Mật khẩu mới phải có ít nhất 6 ký tự')
  }

  if (newPassword !== confirmPassword) {
    throw new Error('Mật khẩu xác nhận không trùng khớp')
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Vui lòng đăng nhập lại.')
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    password: newPassword,
  })

  if (error) {
    throw new Error(`Đổi mật khẩu thất bại: ${error.message}`)
  }

  revalidatePath('/admin/tai-khoan')
}