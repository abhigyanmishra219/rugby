import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { getAuthenticatedAdmin } from '@/lib/auth-server';
import bcrypt from 'bcryptjs';

// GET /api/admin/users - List administrator accounts with counts & search
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
    const searchQuery = (searchParams.get('search') || '').trim();

    const filter: Record<string, any> = { role: 'ADMIN' };

    if (searchQuery) {
      const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedQuery, 'i');
      filter.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    // Exclude password and password hashes from database projection
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate admin counts
    const totalAdmins = await User.countDocuments({ role: 'ADMIN' });
    const activeAdmins = await User.countDocuments({
      role: 'ADMIN',
      isActive: { $ne: false },
    });

    // Count created by current authenticated admin (by ID or name)
    let createdByMe = 0;
    if (admin.id) {
      createdByMe = await User.countDocuments({
        role: 'ADMIN',
        $or: [{ createdById: admin.id }, { createdBy: admin.name }],
      });
    } else {
      createdByMe = await User.countDocuments({
        role: 'ADMIN',
        createdBy: admin.name,
      });
    }

    return NextResponse.json({
      success: true,
      users,
      counts: {
        total: totalAdmins,
        active: activeAdmins,
        createdByMe,
      },
    });
  } catch (error: any) {
    console.error('Admin Users GET Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch administrator accounts.' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create a new administrator account
export async function POST(req: Request) {
  try {
    const admin = await getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Administrator authentication required.' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await req.json();
    const { name, email, password, confirmPassword } = body;

    // 1. Validation: Name
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Full name is required (minimum 2 characters).' },
        { status: 400 }
      );
    }

    // 2. Validation: Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // 3. Validation: Password & Confirmation
    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Password and confirm password do not match.' },
        { status: 400 }
      );
    }

    // 4. Case-insensitive email uniqueness check
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: `An account with the email "${normalizedEmail}" already exists.`,
        },
        { status: 409 }
      );
    }

    // 5. Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create admin user with strictly ADMIN role and verified creator metadata
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'ADMIN',
      createdBy: admin.name || 'Admin',
      createdById: admin.id || '',
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Administrator account for ${newUser.name} created successfully.`,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdBy: newUser.createdBy,
          createdAt: newUser.createdAt,
          isActive: newUser.isActive,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Admin Users POST Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create administrator account.' },
      { status: 500 }
    );
  }
}
