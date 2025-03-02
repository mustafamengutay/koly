import { Catch, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch(RpcException)
export class MicroserviceExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  catch(exception: RpcException) {
    const rpcError = exception.getError() as Record<string, any>;

    const statusCode: unknown = rpcError?.statusCode || 500;
    const message: unknown = rpcError?.message || 'Internal service error';

    const response = {
      statusCode,
      message,
    };

    return throwError(() => response);
  }
}
