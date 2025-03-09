import { Controller } from '@nestjs/common';
import { ProjectService } from './project.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PROJECT_PATTERNS } from '@app/common/project/project.patterns';
import { ProjectDto } from '@app/common/project/dtos/project.dto';
import { CreateProjectData } from '@app/common/project/interfaces/create-project.interface';

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @MessagePattern(PROJECT_PATTERNS.CREATE)
  async create(
    @Payload() createProjectData: CreateProjectData,
  ): Promise<ProjectDto> {
    return await this.projectService.create(createProjectData);
  }
}
