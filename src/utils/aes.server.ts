'use server'

import CryptoJS from 'crypto-js'

const AES_SECRET_KEY = process.env.AES_SECRET_KEY || 'abc'

export async function aesEncrypt(payload: any) {
  const ciphertext = CryptoJS.AES.encrypt(
    CryptoJS.enc.Utf8.parse(JSON.stringify(payload)),
    CryptoJS.enc.Utf8.parse(AES_SECRET_KEY),
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    },
  ).toString()

  return ciphertext
}

export async function aesDecrypt<T = any>(ciphertext: string) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, AES_SECRET_KEY)
  const originalText = bytes.toString(CryptoJS.enc.Utf8)
  const payload = JSON.parse(originalText)

  return payload as T
}
