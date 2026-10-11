import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthenticatedAdmin } from '@/lib/auth-server';
import mongoose from 'mongoose';

// GET /api/admin/users/[id] - Fetch single admin details
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
        { success: false, message: 'Invalid administrator user ID.' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(id).select('-password').lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Administrator account not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    console.error('Admin Single User GET Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch administrator details.' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Permanently delete an administrator account
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
        { success: false, message: 'Invalid administrator user ID.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: 'Administrator account not found or already deleted.' },
        { status: 404 }
      );
    }

    // Safeguard 1: Prevent self-deletion
    const isSelfDeleteById = admin.id && admin.id.toString() === targetUser._id.toString();
    const isSelfDeleteByEmail = admin.email && admin.email.toLowerCase() === targetUser.email.toLowerCase();

    if (isSelfDeleteById || isSelfDeleteByEmail) {
      return NextResponse.json(
        {
          success: false,
          message: 'Security safeguard: You cannot delete your own currently authenticated administrator account.',
        },
        { status: 403 }
      );
    }

    // Safeguard 2: Prevent deletion of primary/root seed administrator
    if (targetUser.email.toLowerCase() === 'admin@gmail.com') {
      return NextResponse.json(
        {
          success: false,
          message: 'Security safeguard: The primary system administrator account (admin@gmail.com) is protected and cannot be deleted.',
        },
        { status: 403 }
      );
    }

    // Safeguard 3: Prevent deletion of the last remaining admin account
    const totalAdmins = await User.countDocuments({ role: 'ADMIN' });
    if (totalAdmins <= 1) {
      return NextResponse.json(
        {
          success: false,
          message: 'Security safeguard: Cannot delete the last remaining administrator account in the system.',
        },
        { status: 403 }
      );
    }

    // Perform real MongoDB permanent deletion
    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `Administrator account for ${targetUser.name} (${targetUser.email}) permanently deleted.`,
    });
  } catch (error: any) {
    console.error('Admin User DELETE Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete administrator account.' },
      { status: 500 }
    );
  }
}
