import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'asc' }
    });

    const packages = await prisma.package.findMany({
      orderBy: { price: 'asc' }
    });

    return NextResponse.json({ services, packages })
  } catch (error) {
    console.error('Error fetching services and packages:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve services and packages.' },
      { status: 500 }
    )
  }
}
