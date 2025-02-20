import { Controller, Get } from '@nestjs/common';
import { KolyApiGatewayService } from './koly-api-gateway.service';

@Controller()
export class KolyApiGatewayController {
  constructor(private readonly kolyApiGatewayService: KolyApiGatewayService) {}

  @Get()
  getHello(): string {
    return this.kolyApiGatewayService.getHello();
  }
}
