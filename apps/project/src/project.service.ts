import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { Repository } from 'typeorm';
import { ProjectDto } from '@app/common/project/dtos/project.dto';
import { RpcException } from '@nestjs/microservices';
import { CreateProjectData } from '@app/common/project/interfaces/create-project.interface';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createProjectData: CreateProjectData): Promise<ProjectDto> {
    const { userId, createProjectRequestDto } = createProjectData;

    const project = await this.projectRepository.findOne({
      where: { name: createProjectRequestDto.name },
    });
    if (project) {
      throw new RpcException({
        statusCode: 409,
        message: `${createProjectRequestDto.name} already exist. Please provide a different name`,
      });
    }

    const newProject = await this.projectRepository.save({
      leaderIds: [userId],
      name: createProjectRequestDto.name,
    });

    return {
      id: newProject.id,
      name: newProject.name,
      createdAt: newProject.createdAt,
    };
  }
}
