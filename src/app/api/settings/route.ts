import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const list = await prisma.setting.findMany()
    const settings: Record<string, string> = {}
    for (const item of list) {
      settings[item.key] = item.value
    }
    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings.' }, { status: 500 })
  }
}
