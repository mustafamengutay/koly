import { Module } from '@nestjs/common';
import { KolyApiGatewayController } from './koly-api-gateway.controller';
import { KolyApiGatewayService } from './koly-api-gateway.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [KolyApiGatewayController],
  providers: [KolyApiGatewayService],
})
export class KolyApiGatewayModule {}
