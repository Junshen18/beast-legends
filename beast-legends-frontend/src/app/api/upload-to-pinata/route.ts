import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';

export async function POST(request: Request) {
  try {
    const { image, metadata } = await request.json();
    
    // The image is already in base64 format with data URL prefix
    const base64Data = image.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Upload image to Pinata
    const imageFormData = new FormData();
    imageFormData.append('file', imageBuffer, {
      filename: 'beast-legend-nft.png',
      contentType: 'image/png',
    });
    
    const imageResponse = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      imageFormData,
      {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${imageFormData.getBoundary()}`,
          'pinata_api_key': process.env.PINATA_API_KEY,
          'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY,
        },
      }
    );
    
    const imageIpfsHash = imageResponse.data.IpfsHash;
    const imageUri = `ipfs://${imageIpfsHash}`;
    
    // Use the metadata from the request
    const metadataResponse = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      {
        ...metadata,
        image: imageUri,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': process.env.PINATA_API_KEY,
          'pinata_secret_api_key': process.env.PINATA_SECRET_API_KEY,
        },
      }
    );
    
    const metadataIpfsHash = metadataResponse.data.IpfsHash;
    const metadataUri = `ipfs://${metadataIpfsHash}`;
    
    return NextResponse.json({ 
      imageUri: imageUri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
      metadataUri
    });
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    return NextResponse.json(
      { error: 'Failed to upload to Pinata' },
      { status: 500 }
    );
  }
} 