import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret:
          configService.get<string>('auth.accessSecret') ??
          configService.get<string>('JWT_ACCESS_SECRET') ??
          'dev_access_secret',
        signOptions: {
          expiresIn:
            configService.get<string>('auth.accessExpiresIn') ??
            configService.get<string>('JWT_ACCESS_EXPIRES_IN') ??
            '15m',
        },
      }),
    }),
  ],
  providers: [UserResolver, UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
