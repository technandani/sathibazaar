// models/User.ts
import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  role: "vendor" | "supplier" | "admin";
  businessName?: string;
  fullName?: string;
  email: string;
  phone: string;
  password: string;
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    role: { type: String, enum: ["vendor", "supplier", "admin"], required: true },
    businessName: {
      type: String,
      required: function () {
        return this.role === "supplier";
      },
    },
    fullName: {
      type: String,
      required: function () {
        return this.role === "vendor" || this.role === "supplier";
      },
    },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

// Pre-save for hashing
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Password check
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUserDocument>("User", userSchema);
