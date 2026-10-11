import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PlayerRegistration from '@/models/PlayerRegistration';
import { getAuthenticatedAdmin } from '@/lib/auth-server';
import mongoose from 'mongoose';

export async function GET(
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
    const registration = await PlayerRegistration.findById(id).lean();

    if (!registration) {
      return NextResponse.json(
        { success: false, message: 'Player registration not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      registration,
    });
  } catch (error: any) {
    console.error('Admin Single Registration GET Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch registration details.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const { searchParams } = new URL(req.url);
    const isPermanent = searchParams.get('permanent') === 'true';

    if (isPermanent) {
      // Real permanent MongoDB deletion operation
      const deletedRecord = await PlayerRegistration.findByIdAndDelete(id);
      if (!deletedRecord) {
        return NextResponse.json(
          { success: false, message: 'Player registration not found or already deleted.' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Player ${deletedRecord.fullName} was permanently deleted from the database.`,
      });
    }

    // Soft deletion (moves to Deleted Players tab with audit trail)
    const registration = await PlayerRegistration.findById(id);
    if (!registration) {
      return NextResponse.json(
        { success: false, message: 'Player registration not found.' },
        { status: 404 }
      );
    }

    registration.status = 'DELETED';
    registration.deletedBy = admin.name || 'Admin';
    registration.deletedById = admin.id || '';
    registration.deletedAt = new Date();
    await registration.save();

    return NextResponse.json({
      success: true,
      message: `Registration for ${registration.fullName} moved to Deleted Players.`,
      registration,
    });
  } catch (error: any) {
    console.error('Admin Registration DELETE Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete registration.' },
      { status: 500 }
    );
  }
}
