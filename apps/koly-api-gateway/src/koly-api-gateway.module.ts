import { Module } from '@nestjs/common';
import { KolyApiGatewayController } from './koly-api-gateway.controller';
import { KolyApiGatewayService } from './koly-api-gateway.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './project/project.module';
import { GuardModule } from '@app/common/guards/guard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/koly-api-gateway/.env',
    }),
    UserModule,
    AuthModule,
    ProjectModule,
    GuardModule,
  ],
  controllers: [KolyApiGatewayController],
  providers: [KolyApiGatewayService],
})
export class KolyApiGatewayModule {}
