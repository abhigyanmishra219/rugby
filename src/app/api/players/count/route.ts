import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PlayerRegistration from '@/models/PlayerRegistration';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();

    // Count strictly approved player registrations
    // Excludes pending, rejected, deleted, and other non-approved registrations
    const count = await PlayerRegistration.countDocuments({
      status: 'APPROVED',
    });

    return NextResponse.json(
      {
        success: true,
        count,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
        },
      }
    );
  } catch (error: any) {
    console.error('Player count API error:', error);
    return NextResponse.json(
      {
        success: false,
        count: 0,
        error: 'Failed to fetch player count from database',
      },
      { status: 500 }
    );
  }
}
