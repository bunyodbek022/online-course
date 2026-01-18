import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MentorProfileModule } from './mentor-profile/mentor-profile.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule], 
      useFactory: async (configService: ConfigService) : Promise<JwtModuleOptions> => ({
        secret: configService.get<string>('JWT_SECRET') as string, 
        signOptions: { 
          expiresIn:  configService.get('JWT_EXPIRATION_TIME', '1h') ,
        },
      }),
      inject: [ConfigService], 
    }),
    MentorProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
