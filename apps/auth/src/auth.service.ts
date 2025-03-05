import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { catchError, firstValueFrom } from 'rxjs';
import { LoginDto } from '@app/common/auth/dtos/login.dto';
import { TokenResponseDto } from '@app/common/auth/dtos/token-response.dto';
import { SuccessResponse } from '@app/common/types/response.type';
import { UserResponseDto } from '@app/common/user/dtos/user-response.dto';
import { USER_PATTERNS } from '@app/common/user/user.patterns';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_CLIENT') private readonly userClient: ClientProxy,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const userObservable = this.userClient.send<
      SuccessResponse<UserResponseDto>
    >(USER_PATTERNS.FIND_ONE, {
      email: loginDto.email,
    });

    const {
      data: { user },
    } = await firstValueFrom(
      userObservable.pipe(
        catchError((error: string | object) => {
          throw new RpcException(error);
        }),
      ),
    );

    const isPasswordCorrect = await bcrypt.compare(
      loginDto.password,
      user.password!,
    );

    if (!isPasswordCorrect) {
      throw new RpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Password is wrong. Please try again',
      });
    }

    const payload = { id: user.id, name: user.name };

    const secret = this.configService.get<string>('JWT_SECRET');
    const token = await this.jwtService.signAsync(payload, { secret });

    return {
      token,
    };
  }
}
