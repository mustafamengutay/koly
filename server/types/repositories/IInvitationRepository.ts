import { Invitation } from '@prisma/client';

export default interface IInvitationRepository {
  invite(
    inviterId: number,
    projectId: number,
    inviteeId: number
  ): Promise<void>;
  findById(inviteeId: number, projectId: number): Promise<Invitation | null>;
  getReceived(userId: number): Promise<any>;
  addParticipant(participantId: number, projectId: number): Promise<void>;
  remove(userId: number, invitationId: number): Promise<void>;
}
