import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    // Use the specific common.png image
    const imagePath = path.join(process.cwd(), 'public', 'marketplace', 'mythic-2-square.png');
    
    // Check if the file exists
    let imageBuffer;
    try {
      imageBuffer = fs.readFileSync(imagePath);
    } catch (err) {
      console.error('common.png not found, falling back to any available image');
      
      // Fallback to any image in the marketplace folder
      const marketplacePath = path.join(process.cwd(), 'public', 'marketplace');
      const files = fs.readdirSync(marketplacePath);
      const imageFile = files.find(file => file.endsWith('.png') || file.endsWith('.jpg'));
      
      if (!imageFile) {
        throw new Error('No image files found in marketplace directory');
      }
      
      imageBuffer = fs.readFileSync(path.join(marketplacePath, imageFile));
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