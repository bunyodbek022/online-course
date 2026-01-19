import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SmsModule } from 'src/services/sms.module';

@Module({
  imports : [SmsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
