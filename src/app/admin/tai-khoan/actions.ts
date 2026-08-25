'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

// Kiểm tra người đang thao tác có phải Cấp 1 không
async function getCallerLevel() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Vui lòng đăng nhập.')

  // Mặc định tài khoản đầu tiên hoặc có role 'cap_1' là Cấp 1
  const level = user.user_metadata?.role === 'cap_2' ? 2 : 1
  return { user, level }
}

export async function createAdminUser(formData: FormData) {
  const { level: callerLevel } = await getCallerLevel()

  // Cấp 2 không được quyền tạo tài khoản
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
    user_metadata: { role }, // Lưu cấp bậc vào metadata
  })

  if (error) {
    throw new Error(`Tạo tài khoản thất bại: ${error.message}`)
  }

  revalidatePath('/admin/tai-khoan')
}

export async function deleteAdminUser(formData: FormData) {
  const { user: currentUser, level: callerLevel } = await getCallerLevel()

  // Cấp 2 hoàn toàn không được xóa bất kỳ ai
  if (callerLevel !== 1) {
    throw new Error('Bạn không có quyền xóa tài khoản!')
  }

  const targetUserId = formData.get('userId') as string

  // Đếm số lượng tài khoản Cấp 1 hiện có
  const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
  const cap1Users = users.filter((u) => u.user_metadata?.role !== 'cap_2')

  // Nếu chỉ còn đúng 1 Cấp 1 và muốn xóa chính mình -> Chặn
  if (cap1Users.length <= 1 && targetUserId === currentUser.id) {
    throw new Error('Hệ thống phải có ít nhất một Quản trị viên Cấp 1. Không thể tự xóa!')
  }

  const { error } = await supabaseAdmin.auth.admin.deleteUser(targetUserId)

  if (error) {
    throw new Error(`Xóa tài khoản thất bại: ${error.message}`)
  }

  revalidatePath('/admin/tai-khoan')
}