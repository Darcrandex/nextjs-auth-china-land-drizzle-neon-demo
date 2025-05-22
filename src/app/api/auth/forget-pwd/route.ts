import { aesEncrypt } from '@/utils/aes.server'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// 邮件发送方的邮箱和密码
const adminEmail = process.env.ADMIN_EMAIL
const adminEmailKey = process.env.ADMIN_EMAIL_KEY

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  // qq邮箱 smtp 配置
  const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 587,
    auth: { user: adminEmail, pass: adminEmailKey },
  })

  // 用于验证重置密码的签名
  const resetSign = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' })
  const encryptedResetSign = await aesEncrypt(resetSign)

  try {
    // 发送邮件
    await transporter.sendMail({
      from: adminEmail,
      to: email,
      subject: '重置登录密码',
      text: '',
      html: `重置链接 <a href="http://localhost:3000/user/reset-password?sign=${encryptedResetSign}">重置密码</a>`,
    })

    return NextResponse.json({ message: '邮件发送成功' })
  } catch (error) {
    console.error('发送邮件时出错:', error)
    return NextResponse.json({ message: '邮件发送失败' }, { status: 500 })
  }
}
