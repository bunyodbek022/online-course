import { UserRole } from '@prisma/client';

export class UserResponseDto {
  id: number;
  phone: string;
  fullName: string;
  image?: string;
  role: UserRole;
  createdAt: Date;
}
