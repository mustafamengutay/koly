import { Test, TestingModule } from '@nestjs/testing';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import * as bcrypt from 'bcryptjs';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectService } from './project.service';
import { Project } from './project.entity';
import { CreateProjectData } from '@app/common/project/interfaces/create-project.interface';
import { RpcException } from '@nestjs/microservices';
import { ProjectDto } from '@app/common/project/dtos/project.dto';

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

      const expectedResponse: ProjectDto = {
        id: savedProject.id,
        name: savedProject.name,
        createdAt: savedProject.createdAt,
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
});
