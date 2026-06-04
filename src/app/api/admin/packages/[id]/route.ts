import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { serviceName, name, price, duration, description, features } = body

    const pkg = await prisma.package.update({
      where: { id },
      data: {
        ...(serviceName !== undefined && { serviceName }),
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(duration !== undefined && { duration }),
        ...(description !== undefined && { description }),
        ...(features !== undefined && { features }),
      },
    })
    return NextResponse.json({ success: true, package: pkg })
  } catch (error) {
    console.error('Error updating package:', error)
    return NextResponse.json({ error: 'Failed to update package.' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.package.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json({ error: 'Failed to delete package.' }, { status: 500 })
  }
}
