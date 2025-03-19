import * as projectService from './project.service';
import * as userRepository from '../repositories/user.repository';
import * as invitationRepository from '../repositories/invitation.repository';
import { HttpError } from '../types/errors';

/**
 * Invite a user to a project. If any error occurs, it throws the error.
 * @param projectLeaderId User ID who is the project leader of the project.
 * @param projectId Project ID.
 * @param participantEmail Participant Email.
 */
export async function inviteUserToProject(
  projectLeaderId: number,
  projectId: number,
  participantEmail: string
) {
  await projectService.ensureUserIsProjectLeader(projectLeaderId, projectId);

  const user = await userRepository.findByEmail(participantEmail);
  if (!user) {
    throw new HttpError(404, 'The user does not exist');
  }

  await ensureInvitationIsNotSent(user.id, projectId);
  await invitationRepository.invite({
    inviterId: projectLeaderId,
    projectId: projectId,
    inviteeId: user.id,
  });
}

/**
 * List user's project invitations. If any error occurs, it throws that
 * specific error.
 * @param userId User ID.
 * @returns User's project invitations.
 */
export async function listReceivedInvitations(userId: number) {
  return await invitationRepository.getReceived(userId);
}

/**
 * Accept a project invitation. If any error occurs, it throws that
 * specific error.
 * @param participantId User ID who received an invitation
 */
export async function acceptProjectInvitation(
  participantId: number,
  projectId: number
) {
  await invitationRepository.addParticipant({
    participantId,
    projectId,
  });

  const invitation = await invitationRepository.findById({
    inviteeId: participantId,
    projectId: projectId,
  });

  await invitationRepository.remove({
    userId: participantId,
    invitationId: invitation!.id,
  });
}

/**
 * Reject a project invitation. If any error occurs, it throws that
 * specific error.
 * @param participantId User ID who received an invitation.
 */
export async function rejectProjectInvitation(
  userId: number,
  invitationId: number
) {
  await invitationRepository.remove({ userId, invitationId });
}

export async function ensureInvitationIsNotSent(
  inviteeId: number,
  projectId: number
) {
  const invitation = await invitationRepository.findById({
    inviteeId,
    projectId,
  });
  if (invitation) {
    throw new HttpError(409, 'Invitation is already sent to the user');
  }
}
