import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import OfficialRegistration from '@/models/OfficialRegistration';

const VALID_DISTRICTS = [
  'Dehradun', 'Haridwar', 'Nainital', 'Udham Singh Nagar',
  'Pauri Garhwal', 'Almora', 'Tehri Garhwal', 'Chamoli',
  'Uttarkashi', 'Rudraprayag', 'Pithoragarh', 'Bageshwar', 'Champawat'
];

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();

    const {
      type,
      fullName,
      email,
      contactNumber,
      district,
      address,
      level,
      fatherName,
      experienceYears,
      organization,
    } = data;

    // 1. Validate Type
    if (!type || !['COACH', 'MANAGER', 'REFEREE'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid registration type. Must be COACH, MANAGER, or REFEREE.' },
        { status: 400 }
      );
    }

    // 2. Validate Full Name
    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return NextResponse.json(
        { success: false, error: 'Full name is required.' },
        { status: 400 }
      );
    }

    // 3. Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // 4. Validate Indian Mobile Number (10 digits starting with 6-9, optional +91/91/0)
    const cleanPhone = (contactNumber || '').replace(/[\s\-()]/g, '');
    const indianPhoneRegex = /^(\+91|91|0)?[6-9]\d{9}$/;
    if (!contactNumber || !indianPhoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' },
        { status: 400 }
      );
    }

    // Standardize phone to 10 digits
    const standardizedPhone = cleanPhone.slice(-10);

    // 5. Validate District
    if (!district || !VALID_DISTRICTS.includes(district.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please select a valid Uttarakhand district.' },
        { status: 400 }
      );
    }

    // 6. Validate Address
    if (!address || typeof address !== 'string' || !address.trim()) {
      return NextResponse.json(
        { success: false, error: 'Address is required.' },
        { status: 400 }
      );
    }

    // 7. Validate Level (Level 1, Level 2, Level 3)
    if (!level || !['Level 1', 'Level 2', 'Level 3'].includes(level)) {
      return NextResponse.json(
        { success: false, error: 'Qualification level is required and must be Level 1, Level 2, or Level 3.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 8. Prevent duplicate submissions for the same role
    const existingRegistration = await OfficialRegistration.findOne({
      type,
      status: { $in: ['PENDING', 'APPROVED'] },
      $or: [{ email: cleanEmail }, { contactNumber: standardizedPhone }],
    });

    if (existingRegistration) {
      const roleName = type === 'COACH' ? 'Coach' : type === 'MANAGER' ? 'Manager' : 'Referee';
      return NextResponse.json(
        {
          success: false,
          error: `An active ${roleName} registration with this email or mobile number already exists (${existingRegistration.registrationId}) with status ${existingRegistration.status}.`,
        },
        { status: 409 }
      );
    }

    // 9. Generate Role-Specific Unique Registration ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = type === 'COACH' ? 'RU-COA' : type === 'MANAGER' ? 'RU-MGR' : 'RU-REF';
    const registrationId = `${prefix}-2026-${randomNum}`;

    // 10. Create Registration Document with initial status PENDING
    const newOfficial = await OfficialRegistration.create({
      registrationId,
      type,
      fullName: fullName.trim(),
      email: cleanEmail,
      contactNumber: standardizedPhone,
      district: district.trim(),
      address: address.trim(),
      level,
      fatherName: fatherName ? fatherName.trim() : '',
      experienceYears: experienceYears ? experienceYears.trim() : '',
      organization: organization ? organization.trim() : '',
      isQualificationVerified: false,
      status: 'PENDING',
    });

    const roleName = type === 'COACH' ? 'Coach' : type === 'MANAGER' ? 'Manager' : 'Referee';

    return NextResponse.json(
      {
        success: true,
        message: `Your ${roleName} registration has been submitted successfully to the Uttarakhand Rugby Association. Your registration is awaiting administrative review.`,
        registration: newOfficial,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Officials Registration API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to submit official registration. Please try again.',
      },
      { status: 500 }
    );
  }
}
