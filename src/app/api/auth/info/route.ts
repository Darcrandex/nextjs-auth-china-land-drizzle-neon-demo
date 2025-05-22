import { db } from '@/db'
import { users } from '@/db/schema/users'
import { getUserIdFromToken } from '@/utils/token.server'
import { eq } from 'drizzle-orm'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromToken(request)

  if (!userId) {
    return NextResponse.json({ message: '未登录' }, { status: 401 })
  }

  const res = await db.select().from(users).where(eq(users.id, userId))
  return NextResponse.json({ message: '获取成功', data: res[0] })
}
