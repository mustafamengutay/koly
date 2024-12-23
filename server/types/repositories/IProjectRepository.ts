import { Project, User } from '@prisma/client';

export default interface IProjectRepository {
  create(data: { userId: number; name: string }): Promise<Project>;
  remove(projectId: number): Promise<Project>;
  getParticipants(projectId: number): Promise<Partial<User>[]>;
  getAllProjects(userId: number): Promise<Project[]>;
  getCreatedProjects(userId: number): Promise<Project[]>;
  getParticipatedProjects(userId: number): Promise<Project[]>;
  updateName(data: { projectId: number; name: string }): Promise<Project>;
  removeParticipant(data: {
    participantId: number;
    projectId: number;
  }): Promise<void>;
  addLeader(data: { userId: number; projectId: number }): Promise<void>;
  findLeader(data: { userId: number; projectId: number }): Promise<User | null>;
  getAllLeaders(projectId: number): Promise<any[] | null>;
  findParticipant(where: {
    userId: number;
    projectId: number;
  }): Promise<User | null>;
}
