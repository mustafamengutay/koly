import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginDto } from '@app/common/auth/dtos/login.dto';
import { AUTH_PATTERNS } from '@app/common/auth/auth.patterns';
import { Observable } from 'rxjs';
import { TokenResponseDto } from '@app/common/auth/dtos/token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_CLIENT') private readonly authClient: ClientProxy,
  ) {}

  login(loginDto: LoginDto): Observable<TokenResponseDto> {
    return this.authClient.send(AUTH_PATTERNS.LOGIN, loginDto);
  }
}
