import { Injectable } from '@nestjs/common';

@Injectable()
export class KolyApiGatewayService {
  getHello(): string {
    return 'Hello World!';
  }
}
