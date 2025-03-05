import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { LoginDto } from '@app/common/auth/dtos/login.dto';
import { TokenResponseDto } from '@app/common/auth/dtos/token-response.dto';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login as a user' })
  @ApiCreatedResponse({
    description: 'Login',
    type: TokenResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('login')
  login(@Body() loginDto: LoginDto): Observable<TokenResponseDto> {
    return this.authService.login(loginDto);
  }
}
