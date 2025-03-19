import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types/customRequest';
import * as projectService from '../services/project.service';

export async function postCreateProject(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const { name } = req.body;
  const userId = req.userId!;

  try {
    const newProject = await projectService.createProject(userId, name);

    res.status(201).json({
      status: 'success',
      data: {
        project: newProject,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteRemoveProject(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const projectId = Number(req.params.projectId);
  const userId = req.userId!;

  try {
    const removedProject = await projectService.removeProject(
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
}

export async function getListParticipants(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const projectId = Number(req.params.projectId);
  const userId = req.userId!;

  try {
    const participants = await projectService.listProjectParticipants(
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
}

export async function getListAllProjects(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.userId!;

  try {
    const allProjects = await projectService.listAllProjects(userId);

    res.status(200).json({
      status: 'success',
      data: {
        projects: allProjects,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getListCreatedProjects(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.userId!;

  try {
    const createdProjects = await projectService.listCreatedProjects(userId);

    res.status(200).json({
      status: 'success',
      data: {
        projects: createdProjects,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getListParticipatedProjects(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const userId = req.userId!;

  try {
    const participatedProjects = await projectService.listParticipatedProjects(
      userId
    );

    res.status(200).json({
      status: 'success',
      data: {
        projects: participatedProjects,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function patchUpdateProjectName(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const projectId = Number(req.params.projectId);
  const userId = req.userId!;
  const { name } = req.body;

  try {
    const updatedProject = await projectService.updateProjectName(
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
}

export async function deleteRemoveParticipantFromProject(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const projectId = Number(req.params.projectId);
  const participantId = Number(req.params.participantId);
  const userId = req.userId!;

  try {
    await projectService.removeParticipantFromProject(
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
}

export async function patchMakeParticipantProjectLeader(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const projectId = Number(req.params.projectId);
  const participantId = Number(req.params.participantId);
  const userId = req.userId!;

  try {
    await projectService.makeParticipantProjectLeader(
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
}
