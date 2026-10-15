import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import OfficialRegistration from '@/models/OfficialRegistration';
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
    const registration = await OfficialRegistration.findById(id).lean();

    if (!registration) {
      return NextResponse.json(
        { success: false, message: 'Official registration not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      registration,
    });
  } catch (error: any) {
    console.error('Admin Single Official GET Error:', error);
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
      const deletedRecord = await OfficialRegistration.findByIdAndDelete(id);
      if (!deletedRecord) {
        return NextResponse.json(
          { success: false, message: 'Registration not found or already deleted.' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `${deletedRecord.fullName} was permanently deleted from the database.`,
      });
    }

    // Soft delete
    const registration = await OfficialRegistration.findById(id);
    if (!registration) {
      return NextResponse.json(
        { success: false, message: 'Official registration not found.' },
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
      message: `Registration for ${registration.fullName} was moved to deleted.`,
      registration,
    });
  } catch (error: any) {
    console.error('Admin Official DELETE Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete registration.' },
      { status: 500 }
    );
  }
}
