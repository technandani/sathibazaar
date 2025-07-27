export interface IUser {
    _id: string;
    role: "vendor" | "supplier" | "admin";
    businessName?: string;
    fullName?: string;
    email: string;
    phone: string;
    password: string;
    isVerified: boolean;
    otp?: string;
    otpExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(password: string): Promise<boolean>;
  }