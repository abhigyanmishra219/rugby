import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import PlayerRegistration from '@/models/PlayerRegistration';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const registrationId = `RU-PLY-2026-${randomNum}`;

    const newRegistration = await PlayerRegistration.create({
      registrationId,
      fullName: data.fullName,
      fatherName: data.fatherName,
      dob: data.dob,
      district: data.district,
      contactNumber: data.contactNumber,
      email: data.email,
      nsrsId: data.nsrsId || '',
      address: data.address,
      emergencyContact: data.emergencyContact || '',
      status: 'PENDING',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Player registered successfully in MongoDB Atlas',
        registration: newRegistration,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to submit registration',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const registrations = await PlayerRegistration.find().sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch registrations',
      },
      { status: 500 }
    );
  }
}
