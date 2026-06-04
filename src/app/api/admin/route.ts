import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, bookingId, invoiceId, status } = body

    if (action === 'update_booking_status') {
      const updated = await prisma.booking.update({
        where: { id: bookingId },
        data: { status },
      });
      return NextResponse.json({ success: true, booking: updated });
    }

    if (action === 'update_invoice_status') {
      const updated = await prisma.invoice.update({
        where: { id: invoiceId },
        data: { status },
      });
      
      // Auto-update booking status to CONFIRMED if invoice is paid/deposit paid
      if (status === 'DP_PAID' || status === 'PAID') {
        const inv = await prisma.invoice.findUnique({ where: { id: invoiceId } });
        if (inv) {
          await prisma.booking.update({
            where: { id: inv.bookingId },
            data: { status: 'CONFIRMED' },
          });
        }
      }
      return NextResponse.json({ success: true, invoice: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error in admin action:', error)
    return NextResponse.json(
      { error: 'Admin operation failed.' },
      { status: 500 }
    )
  }
}
