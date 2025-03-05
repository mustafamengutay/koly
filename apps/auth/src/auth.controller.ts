import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto } from '@app/common/auth/dtos/login.dto';
import { AUTH_PATTERNS } from '@app/common/auth/auth.patterns';
import { TokenResponseDto } from '@app/common/auth/dtos/token-response.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  async login(@Payload() loginDto: LoginDto): Promise<TokenResponseDto> {
    return await this.authService.login(loginDto);
  }
}
