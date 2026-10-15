import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPlayerRegistration extends Document {
  registrationId: string;
  fullName: string;
  fatherName: string;
  dob: string;
  district: string;
  contactNumber: string;
  email: string;
  nsrsId?: string;
  address: string;
  emergencyContact?: string;
  // Legacy optional fields for backward compatibility with existing records
  positionOrRole?: string;
  experienceYears?: string;
  clubOrSchool?: string;
  format?: string;
  status: 'PENDING' | 'VERIFIED' | 'APPROVED' | 'REJECTED' | 'DELETED';
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

const PlayerRegistrationSchema: Schema<IPlayerRegistration> = new Schema(
  {
    registrationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    fatherName: {
      type: String,
      required: [true, "Father's name is required"],
      trim: true,
    },
    dob: {
      type: String,
      required: [true, 'Date of birth is required'],
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
    },
    nsrsId: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Permanent address is required'],
      trim: true,
    },
    emergencyContact: {
      type: String,
      default: '',
      trim: true,
    },
    // Obsolete fields made optional for backward compatibility
    positionOrRole: {
      type: String,
      default: '',
    },
    experienceYears: {
      type: String,
      default: '',
    },
    clubOrSchool: {
      type: String,
      default: '',
    },
    format: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'APPROVED', 'REJECTED', 'DELETED'],
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

// Helpful indexes for admin dashboard filtering and sorting
PlayerRegistrationSchema.index({ status: 1, createdAt: -1 });
PlayerRegistrationSchema.index({ fullName: 'text', contactNumber: 'text', nsrsId: 'text' });

// Refresh model during schema updates
if (mongoose.models && mongoose.models.PlayerRegistration) {
  delete (mongoose.models as any).PlayerRegistration;
}

const PlayerRegistration: Model<IPlayerRegistration> =
  mongoose.models.PlayerRegistration ||
  mongoose.model<IPlayerRegistration>('PlayerRegistration', PlayerRegistrationSchema);

export default PlayerRegistration;
