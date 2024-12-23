import { Project, User } from '@prisma/client';

export default interface IProjectRepository {
  createProject(userId: number, name: string): Promise<Project>;
  removeProject(projectId: number): Promise<Project>;
  listParticipants(projectId: number): Promise<Partial<User>[]>;
  listAllProjects(userId: number): Promise<Project[]>;
  listCreatedProjects(userId: number): Promise<Project[]>;
  listParticipatedProjects(userId: number): Promise<Project[]>;
  updateName(projectId: number, name: string): Promise<Project>;
  disconnectParticipantFromProject(
    participantId: number,
    projectId: number
  ): Promise<undefined>;
  addNewProjectLeader(userId: number, projectId: number): Promise<undefined>;
  findProjectLeader(userId: number, projectId: number): Promise<User | null>;
  findAllProjectLeaders(projectId: number): Promise<any[] | null>;
  findParticipant(userId: number, projectId: number): Promise<User | null>;
}
