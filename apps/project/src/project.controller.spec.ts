import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CreateProjectData } from '@app/common/project/interfaces/create-project.interface';
import { ProjectDto } from '@app/common/project/dtos/project.dto';

describe('ProjectController', () => {
  let projectController: ProjectController;
  let projectService: ProjectService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useValue: createMock<DeepMocked<ProjectService>>(),
        },
      ],
    }).compile();

    projectController = app.get<ProjectController>(ProjectController);
    projectService = app.get<ProjectService>(ProjectService);
  });

  describe('create', () => {
    it('should call ProjectService.create with correct parameters', async () => {
      // Arrange
      const createProjectData: CreateProjectData = {
        userId: 1,
        createProjectRequestDto: { name: 'New Project' },
      };

      const projectServiceMock = jest.spyOn(projectService, 'create');

      // Act
      await projectController.create(createProjectData);

      // Assert
      expect(projectServiceMock).toHaveBeenCalledWith(createProjectData);
    });

    it('should return the created project', async () => {
      // Arrange
      const createProjectData: CreateProjectData = {
        userId: 1,
        createProjectRequestDto: { name: 'New Project' },
      };

      const createdProject: ProjectDto = {
        id: 1,
        name: 'New Project',
        createdAt: new Date(),
      };

      const projectServiceMock = jest.spyOn(projectService, 'create');
      projectServiceMock.mockResolvedValue(createdProject);

      // Act
      const result = await projectController.create(createProjectData);

      // Assert
      expect(result).toEqual(createdProject);
    });
  });

  describe('findOne', () => {
    it('should call ProjectService.findOne with correct parameters', async () => {
      // Arrange
      const findProjectData = { userId: 1, projectId: 2 };
      const projectServiceMock = jest.spyOn(projectService, 'findOne');

      // Act
      await projectController.findOne(findProjectData);

      // Assert
      expect(projectServiceMock).toHaveBeenCalledWith(findProjectData);
    });

    it('should return the found project', async () => {
      // Arrange
      const findProjectData = { userId: 1, projectId: 2 };
      const projectResponse = {
        project: {
          id: 2,
          name: 'Test Project',
          createdAt: new Date(),
        },
      };

      jest.spyOn(projectService, 'findOne').mockResolvedValue(projectResponse);

      // Act
      const result = await projectController.findOne(findProjectData);

      // Assert
      expect(result).toEqual(projectResponse);
    });

    it('should throw an error if project is not found', async () => {
      // Arrange
      const findProjectData = { userId: 1, projectId: 99 };
      jest
        .spyOn(projectService, 'findOne')
        .mockRejectedValue(new Error('Project not found'));

      // Act & Assert
      await expect(projectController.findOne(findProjectData)).rejects.toThrow(
        'Project not found',
      );
    });
  });
});
