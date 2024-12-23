import { Invitation } from '@prisma/client';

export default interface IInvitationRepository {
  sendProjectInvitation(
    inviterId: number,
    projectId: number,
    inviteeId: number
  ): Promise<void>;
  findOne(inviteeId: number, projectId: number): Promise<Invitation | null>;
  findReceivedInvitations(userId: number): Promise<any>;
  makeUserProjectParticipant(
    participantId: number,
    projectId: number
  ): Promise<void>;
  removeInvitation(userId: number, invitationId: number): Promise<void>;
}
