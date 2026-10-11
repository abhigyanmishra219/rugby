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

    await connectToDatabase();
    const registration = await PlayerRegistration.findById(id);

    if (!registration) {
      return NextResponse.json(
        { success: false, message: 'Player registration not found.' },
        { status: 404 }
      );
    }

    // Guard against duplicate or conflicting approvals
    if (registration.status === 'APPROVED') {
      return NextResponse.json(
        {
          success: false,
          message: `This player was already approved by ${registration.approvedBy || 'an administrator'}.`,
        },
        { status: 409 }
      );
    }

    // Set approval data
    registration.status = 'APPROVED';
    registration.approvedBy = admin.name || 'Admin';
    registration.approvedById = admin.id || '';
    registration.approvedAt = new Date();

    // Clear deleted flags if it was previously soft-deleted
    registration.deletedBy = '';
    registration.deletedById = '';
    registration.deletedAt = undefined;

    await registration.save();

    return NextResponse.json({
      success: true,
      message: `Player ${registration.fullName} approved successfully by ${admin.name}.`,
      registration,
    });
  } catch (error: any) {
    console.error('Admin Registration Approve Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to approve player registration.' },
      { status: 500 }
    );
  }
}
