import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const updates = Object.entries(body).map(async ([key, value]) => {
      if (typeof value === 'string') {
        return prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      }
    })
    
    await Promise.all(updates)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving admin settings:', error)
    return NextResponse.json({ error: 'Failed to save settings.' }, { status: 500 })
  }
}
