import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { JSendResponseInterceptor } from '@app/common/inceptors/jsend-response.inceptor';
import { MicroserviceExceptionFilter } from '@app/common/filters/microservice-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.TCP,
      options: { port: 3002 },
    },
  );

  app.useGlobalInterceptors(new JSendResponseInterceptor());
  app.useGlobalFilters(new MicroserviceExceptionFilter());

  await app.listen();
}
bootstrap();
