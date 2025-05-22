import { db } from '@/db'
import { users } from '@/db/schema/users'
import { getUserIdFromToken } from '@/utils/token.server'
import { compare, hash } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromToken(req)

  if (!userId) {
    return new Response('未登录', { status: 401 })
  }

  const { oldPassword, newPassword } = await req.json()
  const [user] = await db.select().from(users).where(eq(users.id, userId))

  const isValid = !!user.password && (await compare(oldPassword, user.password))
  if (!isValid) {
    return new Response('账号或密码错误', { status: 401 })
  }

  const hashedPassword = await hash(newPassword, 10)
  await db.update(users).set({ password: hashedPassword }).where(eq(users.id, userId))
  return new Response('密码修改成功', { status: 200 })
}
