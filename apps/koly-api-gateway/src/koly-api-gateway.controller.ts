import { Controller } from '@nestjs/common';
import { KolyApiGatewayService } from './koly-api-gateway.service';

@Controller()
export class KolyApiGatewayController {
  constructor(private readonly kolyApiGatewayService: KolyApiGatewayService) {}
}
