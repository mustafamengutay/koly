import { Module } from '@nestjs/common';
import { AuthZGuard } from './authz.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthZGuard, JwtService, ConfigService],
  exports: [AuthZGuard],
})
export class GuardModule {}
