import { Module } from '@nestjs/common';
import { MyProfileService } from './my-profile.service';
import { MyProfileController } from './my-profile.controller';
import { SmsModule } from 'src/services/sms.module';

@Module({
  imports : [SmsModule],
  controllers: [MyProfileController],
  providers: [MyProfileService],
})
export class MyProfileModule {}
