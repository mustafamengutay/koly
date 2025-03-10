import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import * as bcrypt from 'bcryptjs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectService } from './project.service';
import { Project } from './project.entity';
import { CreateProjectData } from '@app/common/project/interfaces/create-project.interface';
import { RpcException } from '@nestjs/microservices';
import { ProjectResponseDto } from '@app/common/project/dtos/project-response.dto';
import { findProjectData } from '@app/common/project/interfaces/find-project.interface';

describe('ProjectService', () => {
  let projectService: ProjectService;
  let projectRepository: DeepMocked<Repository<Project>>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getRepositoryToken(Project),
          useValue: createMock<DeepMocked<Repository<Project>>>(),
        },
      ],
    }).compile();

    projectService = app.get<ProjectService>(ProjectService);
    projectRepository = app.get<DeepMocked<Repository<Project>>>(
      getRepositoryToken(Project),
    );
    jest.spyOn(bcrypt, 'hash');
  });

  it('should define all dependencies', () => {
    expect(projectService).toBeDefined();
    expect(projectRepository).toBeDefined();
  });

  describe('create', () => {
    it('should return project on successful project creation', async () => {
      // Arrange
      const createProjectData: CreateProjectData = {
        userId: 1,
        createProjectRequestDto: { name: 'New Project' },
      };

      const savedProject = {
        id: 2,
        name: 'New Project',
        leaderIds: [1],
        createdAt: new Date(),
      } as Project;

      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(projectRepository, 'save').mockResolvedValue(savedProject);

      const expectedResponse: ProjectResponseDto = {
        project: {
          id: savedProject.id,
          name: savedProject.name,
          createdAt: savedProject.createdAt,
        },
      };

      // Act
      const result = await projectService.create(createProjectData);

      // Assert
      expect(result).toEqual(expectedResponse);
    });

    it('should throw an error if project with the same name already exists', async () => {
      // Arrange
      const createProjectData: CreateProjectData = {
        userId: 1,
        createProjectRequestDto: { name: 'Test Project' },
      };

      jest.spyOn(projectRepository, 'findOne').mockResolvedValue({
        id: 1,
        name: 'Test Project',
        leaderIds: [1],
        createdAt: new Date(),
      } as Project);

      // Act & Assert
      await expect(projectService.create(createProjectData)).rejects.toThrow(
        new RpcException({
          statusCode: 409,
          message:
            'Test Project already exist. Please provide a different name',
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return project if found', async () => {
      // Arrange
      const findData: findProjectData = { userId: 1, projectId: 2 };
      const project: Project = {
        id: 2,
        name: 'Test Project',
        leaderIds: [1],
        createdAt: new Date(),
      } as Project;

      projectRepository.findOne.mockResolvedValue(project);

      const expectedResponse: ProjectResponseDto = {
        project: {
          id: project.id,
          name: project.name,
          createdAt: project.createdAt,
        },
      };

      // Act
      const result = await projectService.findOne(findData);

      // Assert
      expect(result).toEqual(expectedResponse);
    });

    it('should throw RpcException if project is not found', async () => {
      // Arrange
      const findData: findProjectData = { userId: 1, projectId: 99 };
      projectRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(projectService.findOne(findData)).rejects.toThrow(
        new RpcException({ statusCode: 404, message: 'Project not found' }),
      );
    });
  });
});
