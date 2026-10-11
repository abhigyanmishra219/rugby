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

    // Restore to PENDING
    registration.status = 'PENDING';
    registration.deletedBy = '';
    registration.deletedById = '';
    registration.deletedAt = undefined;

    await registration.save();

    return NextResponse.json({
      success: true,
      message: `Registration for ${registration.fullName} restored to Pending Approvals.`,
      registration,
    });
  } catch (error: any) {
    console.error('Admin Registration Restore Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to restore player registration.' },
      { status: 500 }
    );
  }
}
