import { Module } from '@nestjs/common';
import { KolyApiGatewayController } from './koly-api-gateway.controller';
import { KolyApiGatewayService } from './koly-api-gateway.service';

@Module({
  imports: [],
  controllers: [KolyApiGatewayController],
  providers: [KolyApiGatewayService],
})
export class KolyApiGatewayModule {}
