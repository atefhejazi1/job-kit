import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { createApiHeaders } from '@/lib/api-utils';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    const { public_ids } = await request.json();

    if (!public_ids || !Array.isArray(public_ids)) {
      return NextResponse.json({ error: 'Public IDs required' }, { status: 400 });
    }

    const deleteResults = [];

    for (const public_id of public_ids) {
      try {
        const result = await cloudinary.uploader.destroy(public_id);
        deleteResults.push({
          public_id,
          result: result.result
        });
      } catch (error) {
        console.error(`Failed to delete ${public_id}:`, error);
        deleteResults.push({
          public_id,
          result: 'error',
          error: error
        });
      }
    }

    return NextResponse.json({
      message: 'Files deletion completed',
      results: deleteResults
    });

  } catch (error) {
    console.error('File deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete files' },
      { status: 500 }
    );
  }
}