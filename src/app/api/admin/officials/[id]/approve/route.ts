import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import OfficialRegistration from '@/models/OfficialRegistration';
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
    const registration = await OfficialRegistration.findById(id);

    if (!registration) {
      return NextResponse.json(
        { success: false, message: 'Official registration not found.' },
        { status: 404 }
      );
    }

    // Guard against repeated or conflicting approvals
    if (registration.status === 'APPROVED') {
      return NextResponse.json(
        {
          success: false,
          message: `This ${registration.type.toLowerCase()} was already approved by ${registration.approvedBy || 'an administrator'}.`,
        },
        { status: 409 }
      );
    }

    // Set approval data using server authenticated session
    registration.status = 'APPROVED';
    registration.approvedBy = admin.name || 'Admin';
    registration.approvedById = admin.id || '';
    registration.approvedAt = new Date();

    // Clear previous rejection or deletion metadata if any
    registration.rejectedBy = '';
    registration.rejectedById = '';
    registration.rejectedAt = undefined;
    registration.rejectionReason = '';
    registration.deletedBy = '';
    registration.deletedById = '';
    registration.deletedAt = undefined;

    await registration.save();

    const roleName = registration.type === 'COACH' ? 'Coach' : registration.type === 'MANAGER' ? 'Manager' : 'Referee';

    return NextResponse.json({
      success: true,
      message: `${roleName} ${registration.fullName} approved successfully by ${admin.name}.`,
      registration,
    });
  } catch (error: any) {
    console.error('Admin Official Approve Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to approve official registration.' },
      { status: 500 }
    );
  }
}
