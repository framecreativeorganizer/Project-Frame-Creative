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

    // Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadsDir, { recursive: true })

    // Generate unique name or keep original name
    const ext = path.extname(file.name)
    const fileName = `qris_${Date.now()}${ext || '.png'}`
    const filePath = path.join(uploadsDir, fileName)

    await fs.writeFile(filePath, buffer)

    // Return the public web path
    const fileUrl = `/uploads/${fileName}`
    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    console.error('Error during file upload:', error)
    return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 })
  }
}
