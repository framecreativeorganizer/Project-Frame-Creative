import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: [{ serviceName: 'asc' }, { price: 'asc' }],
    })
    return NextResponse.json({ packages })
  } catch (error) {
    console.error('Error fetching packages:', error)
    return NextResponse.json({ error: 'Failed to fetch packages.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { serviceName, name, price, duration, description, features } = body

    if (!serviceName || !name || price === undefined) {
      return NextResponse.json(
        { error: 'serviceName, name, and price are required.' },
        { status: 400 }
      )
    }

    const pkg = await prisma.package.create({
      data: {
        serviceName,
        name,
        price: parseFloat(price),
        duration: duration || '',
        description: description || '',
        features: features || '',
      },
    })
    return NextResponse.json({ success: true, package: pkg })
  } catch (error) {
    console.error('Error creating package:', error)
    return NextResponse.json({ error: 'Failed to create package.' }, { status: 500 })
  }
}
