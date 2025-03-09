import { CreateProjectRequestDto } from '@app/common/project/dtos/create-project.dto';
import { ProjectDto } from '@app/common/project/dtos/project.dto';
import { PROJECT_PATTERNS } from '@app/common/project/project.patterns';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('PROJECT_CLIENT') private readonly projectClient: ClientProxy,
  ) {}

  create(
    userId: number,
    createProjectRequestDto: CreateProjectRequestDto,
  ): Observable<ProjectDto> {
    return this.projectClient.send(PROJECT_PATTERNS.CREATE, {
      userId,
      createProjectRequestDto,
    });
  }
}
