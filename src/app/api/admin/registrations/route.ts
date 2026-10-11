import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PlayerRegistration from '@/models/PlayerRegistration';
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
    const statusParam = searchParams.get('status') || 'APPROVED';
    const searchQuery = (searchParams.get('search') || '').trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10', 10)));
    const skip = (page - 1) * limit;

    // Filter by tab status
    const filter: Record<string, any> = {};

    if (['APPROVED', 'PENDING', 'DELETED'].includes(statusParam.toUpperCase())) {
      filter.status = statusParam.toUpperCase();
    } else {
      filter.status = 'APPROVED';
    }

    // Search filter across player name, phone, NSRS ID, registration ID, father name
    if (searchQuery) {
      const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedQuery, 'i');
      filter.$or = [
        { fullName: searchRegex },
        { contactNumber: searchRegex },
        { nsrsId: searchRegex },
        { registrationId: searchRegex },
        { fatherName: searchRegex },
        { district: searchRegex },
      ];
    }

    // Fetch tab-specific matching registrations & total count for pagination
    const [registrations, totalMatching] = await Promise.all([
      PlayerRegistration.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PlayerRegistration.countDocuments(filter),
    ]);

    // Calculate real database counts across all statuses
    const [pendingCount, approvedCount, deletedCount] = await Promise.all([
      PlayerRegistration.countDocuments({ status: 'PENDING' }),
      PlayerRegistration.countDocuments({ status: 'APPROVED' }),
      PlayerRegistration.countDocuments({ status: 'DELETED' }),
    ]);

    const totalCount = pendingCount + approvedCount; // active registered players

    return NextResponse.json({
      success: true,
      registrations,
      pagination: {
        page,
        limit,
        total: totalMatching,
        totalPages: Math.ceil(totalMatching / limit) || 1,
      },
      counts: {
        total: totalCount,
        pending: pendingCount,
        approved: approvedCount,
        deleted: deletedCount,
      },
    });
  } catch (error: any) {
    console.error('Admin Registrations GET Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch player registrations.' },
      { status: 500 }
    );
  }
}
