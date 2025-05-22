import { db } from '@/db'
import { users } from '@/db/schema/users'
import { getUserIdFromToken } from '@/utils/token.server'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

// 删除用户
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserIdFromToken(request)
  if (!userId) {
    return NextResponse.json({ message: '未登录' }, { status: 401 })
  }

  const currentUser = await db.select().from(users).where(eq(users.id, userId))
  if (currentUser[0].role !== 'admin') {
    return NextResponse.json({ message: '权限不足' }, { status: 403 })
  }

  const removedId = (await params).id
  const result = await db.delete(users).where(eq(users.id, removedId))
  return NextResponse.json(result)
}
