import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_PATTERNS } from '@app/common/user/user.patterns';
import {
  SignupRequestDto,
  SignupResponseDto,
} from '@app/common/user/dtos/signup.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(USER_PATTERNS.SIGNUP)
  async signup(
    @Payload() signupRequestDto: SignupRequestDto,
  ): Promise<SignupResponseDto> {
    return await this.userService.signup(signupRequestDto);
  }
}
