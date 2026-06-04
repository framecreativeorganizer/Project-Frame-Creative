import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'asc' },
    })
    return NextResponse.json({ services })
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, benefits, imageUrl } = body

    if (!name || !description) {
      return NextResponse.json({ error: 'Name and description are required.' }, { status: 400 })
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        benefits: benefits || '',
        imageUrl: imageUrl || '',
      },
    })
    return NextResponse.json({ success: true, service })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Failed to create service.' }, { status: 500 })
  }
}
