import { Expose } from 'class-transformer';

export class TokenResponseDto {
  @Expose()
  token: string;
}
