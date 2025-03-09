import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectRequestDto {
  @ApiProperty({ example: 'koly' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
