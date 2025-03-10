import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { Repository } from 'typeorm';
import { ProjectDto } from '@app/common/project/dtos/project.dto';
import { RpcException } from '@nestjs/microservices';
import { CreateProjectData } from '@app/common/project/interfaces/create-project.interface';
import { findProjectData } from '@app/common/project/interfaces/find-project.interface';
import { ProjectResponseDto } from '@app/common/project/dtos/project-response.dto';

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

  async findOne(findProjectData: findProjectData): Promise<ProjectResponseDto> {
    const { userId, projectId } = findProjectData;

    const project = await this.projectRepository.findOne({
      where: {
        id: projectId,
        leaderIds: userId,
      },
    });
    if (!project) {
      throw new RpcException({ statusCode: 404, message: 'Project not found' });
    }

    return {
      project: {
        id: project.id,
        name: project.name,
        createdAt: project.createdAt,
      },
    };
  }
}
