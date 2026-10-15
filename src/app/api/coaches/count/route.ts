import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import OfficialRegistration from '@/models/OfficialRegistration';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();

    // Count strictly approved coach registrations
    // Excludes pending, rejected, deleted, and non-coach (manager/referee) records
    const count = await OfficialRegistration.countDocuments({
      type: 'COACH',
      status: 'APPROVED',
    });

    return NextResponse.json(
      {
        success: true,
        count,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=5, stale-while-revalidate=29',
        },
      }
    );
  } catch (error: any) {
    console.error('Coach count API error:', error);
    return NextResponse.json(
      {
        success: false,
        count: 0,
        error: 'Failed to fetch approved coach count from database',
      },
      { status: 500 }
    );
  }
}
