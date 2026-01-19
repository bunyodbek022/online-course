import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MentorProfileModule } from './modules/mentor-profile/mentor-profile.module';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';

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
    CacheModule.register({
      isGlobal: true, 
      store: 'redis', 
    }),
    MentorProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
