import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { imagePath } = await request.json();
    
    // If no image path provided, use a default image
    const targetImagePath = imagePath 
      ? path.join(process.cwd(), 'public', imagePath.replace(/^\/+/, ''))
      : path.join(process.cwd(), 'public', 'mint', 'back-card.png');
    
    // Check if the file exists
    let imageBuffer;
    try {
      imageBuffer = fs.readFileSync(targetImagePath);
    } catch (err) {
      console.error(`Image not found at ${targetImagePath}, falling back to default image`);
      
      // Fallback to the default back card image
      const defaultImagePath = path.join(process.cwd(), 'public', 'mint', 'back-card.png');
      imageBuffer = fs.readFileSync(defaultImagePath);
    }
    
    // Convert to base64
    const base64Image = imageBuffer.toString('base64');
    const mimeType = 'image/png';
    
    return NextResponse.json({ 
      composedImage: `data:${mimeType};base64,${base64Image}` 
    });
  } catch (error) {
    console.error('Error getting image:', error);
    return NextResponse.json(
      { error: 'Failed to get image' },
      { status: 500 }
    );
  }
} 