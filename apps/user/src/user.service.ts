import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { SignupData } from '@app/common/user/interfaces/signup.interface';
import { SignupResponseDto } from '@app/common/user/dtos/signup.dto';
import { UserResponseDto } from '@app/common/user/dtos/user-response.dto';
import { UserEmailData } from '@app/common/user/interfaces/user-email.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async signup(signupData: SignupData): Promise<SignupResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: signupData.email },
    });
    if (user) {
      throw new RpcException({
        statusCode: 409,
        message: 'User is already exist',
      });
    }

    const hashedPassword = await bcrypt.hash(signupData.password, 12);

    const newUser = await this.userRepository.save({
      name: signupData.name,
      surname: signupData.surname,
      email: signupData.email,
      password: hashedPassword,
    });

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email,
      },
    };
  }

  async findOne(userEmailData: UserEmailData): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: userEmailData.email },
    });

    if (!user) {
      throw new RpcException({ statusCode: 404, message: 'User not found' });
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        password: user.password,
      },
    };
  }
}
