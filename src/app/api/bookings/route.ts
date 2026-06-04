import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      clientName,
      clientWhatsapp,
      clientEmail,
      eventName,
      eventLocation,
      eventDate,
      eventTime,
      packageName,
      serviceName,
      notes,
      totalPrice
    } = body

    if (!clientName || !clientWhatsapp || !clientEmail || !eventName || !eventLocation || !eventDate || !eventTime || !packageName || !serviceName) {
      return NextResponse.json(
        { error: 'Incomplete data. Please fill all required fields.' },
        { status: 400 }
      )
    }

    // Step 1: Calculate total amounts
    const amount = Number(totalPrice) || 2000000; // Fallback
    const deposit = amount * 0.5;
    const balance = amount * 0.5;

    // Step 2: Generate random/increment invoice code
    const count = await prisma.invoice.count();
    const invoiceNum = String(count + 1).padStart(4, '0');
    const year = new Date().getFullYear();
    const invoiceNo = `FCO-${year}-${invoiceNum}`;

    // Step 3: Transaction to save Booking, Invoice and Payment
    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          clientName,
          clientWhatsapp,
          clientEmail,
          eventName,
          eventLocation,
          eventDate: new Date(eventDate),
          eventTime,
          packageName,
          serviceName,
          notes: notes || null,
          status: 'PENDING',
        },
      });

      const invoice = await tx.invoice.create({
        data: {
          bookingId: booking.id,
          invoiceNo,
          totalAmount: amount,
          depositAmount: deposit,
          balanceAmount: balance,
          status: 'UNPAID',
        },
      });

      const payment = await tx.payment.create({
        data: {
          invoiceId: invoice.id,
          method: 'QRIS',
          amount: deposit,
          status: 'PENDING',
        },
      });

      return { booking, invoice, payment };
    });

    return NextResponse.json(
      { success: true, bookingId: result.booking.id, invoiceId: result.invoice.id, invoiceNo },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'An error occurred while saving the booking. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        invoice: {
          include: {
            payments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings.' },
      { status: 500 }
    )
  }
}
