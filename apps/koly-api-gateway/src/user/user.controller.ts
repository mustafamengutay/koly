import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  SignupRequestDto,
  SignupResponseDto,
} from '@app/common/user/dtos/signup.dto';
import { Observable } from 'rxjs';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiOperation({ summary: 'Register a user' })
  @ApiCreatedResponse({
    description: 'User',
    type: SignupResponseDto,
  })
  @ApiConflictResponse({ description: 'User already exists' })
  @ApiBadRequestResponse({ description: 'Validation error' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post('signup')
  signup(
    @Body() signupRequestDto: SignupRequestDto,
  ): Observable<SignupResponseDto> {
    return this.usersService.signup(signupRequestDto);
  }
}
