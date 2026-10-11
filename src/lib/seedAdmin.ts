import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function ensureAdminSeed() {
  try {
    await connectToDatabase();
    const adminEmail = 'admin@gmail.com';
    const existing = await User.findOne({ email: adminEmail });

    if (!existing) {
      const hashedPassword = await bcrypt.hash('Admin@2026', 10);
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
      });
      console.log('✅ Seeded default Admin user: admin@gmail.com');
    }
  } catch (error) {
    console.error('⚠️ Could not check/seed admin user:', error);
  }
}
