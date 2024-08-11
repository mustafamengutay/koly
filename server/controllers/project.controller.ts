import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/customRequest';
import { Project } from '@prisma/client';

import { ProjectService } from '../services/project.service';

const projectService = ProjectService.getInstance();

export const postCreateProject = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.body;
  const userId = req.userId!;

  try {
    const newProject: Project = await projectService.createProject(
      userId,
      name
    );

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

export const getListCreatedProjects = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId!;

  try {
    const createdProjects: Project[] = await projectService.listCreatedProjects(
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
