import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        booking: true,
        payments: true,
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error fetching invoice:', error)
    return NextResponse.json(
      { error: 'Failed to fetch invoice.' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, method, amount } = body // status can be "DP_PAID" or "PAID"

    if (!status) {
      return NextResponse.json({ error: 'Missing status' }, { status: 400 })
    }

    const updatedInvoice = await prisma.$transaction(async (tx) => {
      // 1. Update invoice status
      const inv = await tx.invoice.update({
        where: { id },
        data: { status },
      });

      // 2. If booking needs confirmation, set status to CONFIRMED
      if (status === 'DP_PAID' || status === 'PAID') {
        await tx.booking.update({
          where: { id: inv.bookingId },
          data: { status: 'CONFIRMED' },
        });
      }

      // 3. Create success payment trace record
      await tx.payment.create({
        data: {
          invoiceId: id,
          method: method || 'QRIS',
          amount: amount || inv.depositAmount,
          status: 'SUCCESS',
          referenceNumber: `PAY-${Date.now().toString().slice(-6)}`,
        },
      });

      return inv;
    });

    return NextResponse.json({ success: true, invoice: updatedInvoice })
  } catch (error) {
    console.error('Error updating invoice payment:', error)
    return NextResponse.json(
      { error: 'Failed to update invoice payment.' },
      { status: 500 }
    )
  }
}
