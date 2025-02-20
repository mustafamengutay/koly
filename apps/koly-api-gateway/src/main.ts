import { NestFactory } from '@nestjs/core';
import { KolyApiGatewayModule } from './koly-api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(KolyApiGatewayModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
