import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PlayerRegistration from '@/models/PlayerRegistration';
import { getAuthenticatedAdmin } from '@/lib/auth-server';
import mongoose from 'mongoose';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Administrator authentication required.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid registration ID.' },
        { status: 400 }
      );
    }

    let rejectionReason = '';
    try {
      const body = await req.json();
      if (body && typeof body.rejectionReason === 'string') {
        rejectionReason = body.rejectionReason.trim();
      }
    } catch {
      // Optional body
    }

    await connectToDatabase();
    const registration = await PlayerRegistration.findById(id);

    if (!registration) {
      return NextResponse.json(
        { success: false, message: 'Player registration not found.' },
        { status: 404 }
      );
    }

    // Set rejection data
    registration.status = 'REJECTED';
    registration.rejectedBy = admin.name || 'Admin';
    registration.rejectedById = admin.id || '';
    registration.rejectedAt = new Date();
    registration.rejectionReason = rejectionReason || 'Application rejected by administration.';

    await registration.save();

    return NextResponse.json({
      success: true,
      message: `Player ${registration.fullName} was rejected by ${admin.name}.`,
      registration,
    });
  } catch (error: any) {
    console.error('Admin Player Reject Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to reject player registration.' },
      { status: 500 }
    );
  }
}
