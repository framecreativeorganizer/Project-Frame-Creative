import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Convert file to Base64 string representation
    const mimeType = file.type || 'image/png'
    const base64Data = buffer.toString('base64')
    const fileUrl = `data:${mimeType};base64,${base64Data}`

    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    console.error('Error during file upload:', error)
    return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 })
  }
}
