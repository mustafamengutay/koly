import { Invitation } from '@prisma/client';

export default interface IInvitationRepository {
  invite(data: {
    inviterId: number;
    projectId: number;
    inviteeId: number;
  }): Promise<void>;
  findById(where: {
    inviteeId: number;
    projectId: number;
  }): Promise<Invitation | null>;
  getReceived(userId: number): Promise<any>;
  addParticipant(data: {
    participantId: number;
    projectId: number;
  }): Promise<void>;
  remove(data: { userId: number; invitationId: number }): Promise<void>;
}
