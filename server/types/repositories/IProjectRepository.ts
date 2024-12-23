import { Project, User } from '@prisma/client';

export default interface IProjectRepository {
  create(userId: number, name: string): Promise<Project>;
  remove(projectId: number): Promise<Project>;
  getParticipants(projectId: number): Promise<Partial<User>[]>;
  getAllProjects(userId: number): Promise<Project[]>;
  getCreatedProjects(userId: number): Promise<Project[]>;
  getParticipatedProjects(userId: number): Promise<Project[]>;
  updateName(projectId: number, name: string): Promise<Project>;
  removeParticipant(participantId: number, projectId: number): Promise<void>;
  addLeader(userId: number, projectId: number): Promise<void>;
  findLeader(userId: number, projectId: number): Promise<User | null>;
  getAllLeaders(projectId: number): Promise<any[] | null>;
  findParticipant(userId: number, projectId: number): Promise<User | null>;
}
