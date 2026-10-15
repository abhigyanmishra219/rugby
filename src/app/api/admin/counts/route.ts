import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PlayerRegistration from '@/models/PlayerRegistration';
import OfficialRegistration from '@/models/OfficialRegistration';
import User from '@/models/User';
import { getAuthenticatedAdmin } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Administrator authentication required.' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const [
      approvedPlayers,
      pendingPlayers,
      deletedPlayers,
      approvedCoaches,
      pendingCoaches,
      approvedManagers,
      pendingManagers,
      approvedReferees,
      pendingReferees,
      adminUsersCount,
    ] = await Promise.all([
      PlayerRegistration.countDocuments({ status: 'APPROVED' }),
      PlayerRegistration.countDocuments({ status: 'PENDING' }),
      PlayerRegistration.countDocuments({ status: 'DELETED' }),
      OfficialRegistration.countDocuments({ type: 'COACH', status: 'APPROVED' }),
      OfficialRegistration.countDocuments({ type: 'COACH', status: 'PENDING' }),
      OfficialRegistration.countDocuments({ type: 'MANAGER', status: 'APPROVED' }),
      OfficialRegistration.countDocuments({ type: 'MANAGER', status: 'PENDING' }),
      OfficialRegistration.countDocuments({ type: 'REFEREE', status: 'APPROVED' }),
      OfficialRegistration.countDocuments({ type: 'REFEREE', status: 'PENDING' }),
      User.countDocuments({ isActive: true }),
    ]);

    return NextResponse.json({
      success: true,
      counts: {
        players: {
          approved: approvedPlayers,
          pending: pendingPlayers,
          deleted: deletedPlayers,
          total: approvedPlayers + pendingPlayers,
        },
        coaches: {
          approved: approvedCoaches,
          pending: pendingCoaches,
        },
        managers: {
          approved: approvedManagers,
          pending: pendingManagers,
        },
        referees: {
          approved: approvedReferees,
          pending: pendingReferees,
        },
        admins: {
          total: adminUsersCount,
        },
      },
    });
  } catch (error: any) {
    console.error('Admin Counts GET Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch admin dashboard counts.' },
      { status: 500 }
    );
  }
}
