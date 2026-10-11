import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await connectToDatabase();
    const readyState = mongoose.connection.readyState;
    const stateNames: Record<number, string> = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    return NextResponse.json({
      success: true,
      status: stateNames[readyState] || 'unknown',
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to connect to MongoDB Atlas',
      },
      { status: 500 }
    );
  }
}
