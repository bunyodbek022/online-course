import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MentorProfileModule } from './mentor-profile/mentor-profile.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    MentorProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
