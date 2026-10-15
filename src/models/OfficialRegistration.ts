import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOfficialRegistration extends Document {
  registrationId: string;
  type: 'COACH' | 'MANAGER' | 'REFEREE';
  fullName: string;
  email: string;
  contactNumber: string;
  district: string;
  address: string;
  level: 'Level 1' | 'Level 2' | 'Level 3';
  fatherName?: string;
  experienceYears?: string;
  organization?: string;
  isQualificationVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DELETED';
  approvedBy?: string;
  approvedById?: string;
  approvedAt?: Date;
  rejectedBy?: string;
  rejectedById?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  deletedBy?: string;
  deletedById?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OfficialRegistrationSchema: Schema<IOfficialRegistration> = new Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['COACH', 'MANAGER', 'REFEREE'],
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
      index: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    level: {
      type: String,
      enum: ['Level 1', 'Level 2', 'Level 3'],
      required: [true, 'Qualification level is required'],
    },
    fatherName: {
      type: String,
      default: '',
      trim: true,
    },
    experienceYears: {
      type: String,
      default: '',
      trim: true,
    },
    organization: {
      type: String,
      default: '',
      trim: true,
    },
    isQualificationVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: String,
      default: '',
    },
    verifiedAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'DELETED'],
      default: 'PENDING',
      index: true,
    },
    approvedBy: {
      type: String,
      default: '',
    },
    approvedById: {
      type: String,
      default: '',
    },
    approvedAt: {
      type: Date,
    },
    rejectedBy: {
      type: String,
      default: '',
    },
    rejectedById: {
      type: String,
      default: '',
    },
    rejectedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      default: '',
      trim: true,
    },
    deletedBy: {
      type: String,
      default: '',
    },
    deletedById: {
      type: String,
      default: '',
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Helpful compound indexes
OfficialRegistrationSchema.index({ type: 1, status: 1, createdAt: -1 });
OfficialRegistrationSchema.index({ fullName: 'text', contactNumber: 'text', email: 'text', registrationId: 'text' });

if (mongoose.models && mongoose.models.OfficialRegistration) {
  delete (mongoose.models as any).OfficialRegistration;
}

const OfficialRegistration: Model<IOfficialRegistration> =
  mongoose.models.OfficialRegistration ||
  mongoose.model<IOfficialRegistration>('OfficialRegistration', OfficialRegistrationSchema);

export default OfficialRegistration;
