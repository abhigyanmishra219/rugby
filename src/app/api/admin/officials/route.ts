import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import OfficialRegistration from '@/models/OfficialRegistration';
import { getAuthenticatedAdmin } from '@/lib/auth-server';

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

    const { searchParams } = new URL(req.url);
    const typeParam = (searchParams.get('type') || 'COACH').toUpperCase();
    const statusParam = (searchParams.get('status') || 'APPROVED').toUpperCase();
    const searchQuery = (searchParams.get('search') || '').trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10', 10)));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};

    // Validate type
    if (['COACH', 'MANAGER', 'REFEREE'].includes(typeParam)) {
      filter.type = typeParam;
    } else {
      filter.type = 'COACH';
    }

    // Validate status
    if (['APPROVED', 'PENDING', 'REJECTED', 'DELETED'].includes(statusParam)) {
      filter.status = statusParam;
    } else {
      filter.status = 'APPROVED';
    }

    // Search query
    if (searchQuery) {
      const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedQuery, 'i');
      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { contactNumber: searchRegex },
        { district: searchRegex },
        { registrationId: searchRegex },
        { organization: searchRegex },
        { level: searchRegex },
      ];
    }

    const [officials, totalMatching] = await Promise.all([
      OfficialRegistration.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      OfficialRegistration.countDocuments(filter),
    ]);

    // Live counts across all official categories & statuses
    const [
      pendingCoaches, approvedCoaches,
      pendingManagers, approvedManagers,
      pendingReferees, approvedReferees,
    ] = await Promise.all([
      OfficialRegistration.countDocuments({ type: 'COACH', status: 'PENDING' }),
      OfficialRegistration.countDocuments({ type: 'COACH', status: 'APPROVED' }),
      OfficialRegistration.countDocuments({ type: 'MANAGER', status: 'PENDING' }),
      OfficialRegistration.countDocuments({ type: 'MANAGER', status: 'APPROVED' }),
      OfficialRegistration.countDocuments({ type: 'REFEREE', status: 'PENDING' }),
      OfficialRegistration.countDocuments({ type: 'REFEREE', status: 'APPROVED' }),
    ]);

    return NextResponse.json({
      success: true,
      officials,
      pagination: {
        page,
        limit,
        total: totalMatching,
        totalPages: Math.ceil(totalMatching / limit) || 1,
      },
      counts: {
        coaches: { pending: pendingCoaches, approved: approvedCoaches },
        managers: { pending: pendingManagers, approved: approvedManagers },
        referees: { pending: pendingReferees, approved: approvedReferees },
      },
    });
  } catch (error: any) {
    console.error('Admin Officials GET Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch officials.' },
      { status: 500 }
    );
  }
}
