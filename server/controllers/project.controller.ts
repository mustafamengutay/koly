import { inject, injectable } from 'inversify';
import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/customRequest';

import { ProjectService } from '../services/project.service';

@injectable()
export class ProjectController {
  private projectService: ProjectService;

  public constructor(@inject(ProjectService) projectService: ProjectService) {
    this.projectService = projectService;
  }

  public postCreateProject = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { name } = req.body;
    const userId = req.userId!;

    try {
      const newProject = await this.projectService.createProject(userId, name);

      res.status(201).json({
        status: 'success',
        data: {
          project: newProject,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteRemoveProject = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const projectId = Number(req.params.projectId);
    const userId = req.userId!;

    try {
      const removedProject = await this.projectService.removeProject(
        userId,
        projectId
      );

      res.status(200).json({
        status: 'success',
        data: {
          project: removedProject,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getListParticipants = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const projectId = Number(req.params.projectId);
    const userId = req.userId!;

    try {
      const participants = await this.projectService.listProjectParticipants(
        userId,
        projectId
      );

      res.status(200).json({
        status: 'success',
        data: {
          participants,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getListAllProjects = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.userId!;

    try {
      const allProjects = await this.projectService.listAllProjects(userId);

      res.status(200).json({
        status: 'success',
        data: {
          projects: allProjects,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getListCreatedProjects = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.userId!;

    try {
      const createdProjects = await this.projectService.listCreatedProjects(
        userId
      );

      res.status(200).json({
        status: 'success',
        data: {
          projects: createdProjects,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public getListParticipatedProjects = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.userId!;

    try {
      const participatedProjects =
        await this.projectService.listParticipatedProjects(userId);

      res.status(200).json({
        status: 'success',
        data: {
          projects: participatedProjects,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public patchUpdateProjectName = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const projectId = Number(req.params.projectId);
    const userId = req.userId!;
    const { name } = req.body;

    try {
      const updatedProject = await this.projectService.updateProjectName(
        userId,
        projectId,
        name
      );

      res.status(200).json({
        status: 'success',
        data: {
          project: updatedProject,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteRemoveParticipantFromProject = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const projectId = Number(req.params.projectId);
    const participantId = Number(req.params.participantId);
    const userId = req.userId!;

    try {
      await this.projectService.removeParticipantFromProject(
        userId,
        projectId,
        participantId
      );

      res.status(200).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  };
}
