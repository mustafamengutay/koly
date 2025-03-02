import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { USER_PATTERNS } from '@app/common/user/user.patterns';
import { SignupData } from '@app/common/user/interfaces/signup.interface';
import { SignupResponseDto } from '@app/common/user/dtos/signup.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_CLIENT') private readonly userClient: ClientProxy,
  ) {}

  signup(signUpDto: SignupData): Observable<SignupResponseDto> {
    return this.userClient.send(USER_PATTERNS.SIGNUP, signUpDto);
  }
}
