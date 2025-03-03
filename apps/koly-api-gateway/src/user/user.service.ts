import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { USER_PATTERNS } from '@app/common/user/user.patterns';
import { SignupData } from '@app/common/user/interfaces/signup.interface';
import { SignupResponseDto } from '@app/common/user/dtos/signup.dto';
import { UserResponseDto } from '@app/common/user/dtos/user-response.dto';
import { UserEmailData } from '@app/common/user/interfaces/user-email.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_CLIENT') private readonly userClient: ClientProxy,
  ) {}

  signup(signUpData: SignupData): Observable<SignupResponseDto> {
    return this.userClient.send(USER_PATTERNS.SIGNUP, signUpData);
  }

  findOne(userEmailData: UserEmailData): Observable<UserResponseDto> {
    return this.userClient.send(USER_PATTERNS.FIND_ONE, userEmailData);
  }
}
