import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { UserDto } from './user.dto';
import { Expose, Type } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => UserDto)
  @Expose()
  user: UserDto;
}
