import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { MicroserviceExceptionFilter } from '@app/common/filters/microservice-exception.filter';
import { JSendResponseInterceptor } from '@app/common/inceptors/jsend-response.inceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options: { port: 3001 },
    },
  );

  app.useGlobalInterceptors(new JSendResponseInterceptor());
  app.useGlobalFilters(new MicroserviceExceptionFilter());

  await app.listen();
}
bootstrap();
