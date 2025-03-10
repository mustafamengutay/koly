import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ProjectDto } from './project.dto';

export class ProjectResponseDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => ProjectDto)
  @Expose()
  project: ProjectDto;
}
