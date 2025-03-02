import { Test, TestingModule } from '@nestjs/testing';
import { KolyApiGatewayController } from './koly-api-gateway.controller';
import { KolyApiGatewayService } from './koly-api-gateway.service';

describe('KolyApiGatewayController', () => {
  let kolyApiGatewayController: KolyApiGatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [KolyApiGatewayController],
      providers: [KolyApiGatewayService],
    }).compile();

    kolyApiGatewayController = app.get<KolyApiGatewayController>(
      KolyApiGatewayController,
    );
  });

  describe('root', () => {});
});
