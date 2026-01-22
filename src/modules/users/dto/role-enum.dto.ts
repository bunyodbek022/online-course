import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { IsEnum } from "class-validator";

export class RoleEnumDto {
    @ApiProperty({ enum: UserRole, example: UserRole.MENTOR })
      @IsEnum(UserRole)
      role: UserRole;
    
}