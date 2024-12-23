import { inject, injectable } from 'inversify';

import { ProjectService } from './project.service';

import IUserRepository from '../types/repositories/IUserRepository';
import IInvitationRepository from '../types/repositories/IInvitationRepository';
import { HttpError } from '../types/errors';

@injectable()
export class InvitationService {
  private projectService: ProjectService;
  private userRepository: IUserRepository;
  private invitationRepository: IInvitationRepository;

  public constructor(
    @inject(ProjectService) projectService: ProjectService,
    @inject('IUserRepository') userRepository: IUserRepository,
    @inject('IInvitationRepository') invitationRepository: IInvitationRepository
  ) {
    this.projectService = projectService;
    this.userRepository = userRepository;
    this.invitationRepository = invitationRepository;
  }

  /**
   * Invite a user to a project. If any error occurs, it throws the error.
   * @param projectLeaderId User ID who is the project leader of the project.
   * @param projectId Project ID.
   * @param participantEmail Participant Email.
   */
  public async inviteUserToProject(
    projectLeaderId: number,
    projectId: number,
    participantEmail: string
  ) {
    await this.projectService.ensureUserIsProjectLeader(
      projectLeaderId,
      projectId
    );

    const user = await this.userRepository.findByEmail(participantEmail);
    if (!user) {
      throw new HttpError(404, 'The user does not exist');
    }

    await this.ensureInvitationIsNotSent(user.id, projectId);
    await this.invitationRepository.invite(projectLeaderId, projectId, user.id);
  }

  /**
   * List user's project invitations. If any error occurs, it throws that
   * specific error.
   * @param userId User ID.
   * @returns User's project invitations.
   */
  public async listReceivedInvitations(userId: number) {
    return await this.invitationRepository.getReceived(userId);
  }

  /**
   * Accept a project invitation. If any error occurs, it throws that
   * specific error.
   * @param participantId User ID who received an invitation
   */
  public async acceptProjectInvitation(
    participantId: number,
    projectId: number
  ) {
    await this.invitationRepository.addParticipant(participantId, projectId);

    const invitation = await this.invitationRepository.findById(
      participantId,
      projectId
    );

    await this.invitationRepository.remove(participantId, invitation!.id);
  }

  /**
   * Reject a project invitation. If any error occurs, it throws that
   * specific error.
   * @param participantId User ID who received an invitation.
   */
  public async rejectProjectInvitation(userId: number, invitationId: number) {
    await this.invitationRepository.remove(userId, invitationId);
  }

  public async ensureInvitationIsNotSent(inviteeId: number, projectId: number) {
    const invitation = await this.invitationRepository.findById(
      inviteeId,
      projectId
    );
    if (invitation) {
      throw new HttpError(409, 'Invitation is already sent to the user');
    }
  }
}
