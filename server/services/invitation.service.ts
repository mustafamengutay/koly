import { inject, injectable } from 'inversify';

import { IInvitationRepository } from '../repositories/invitation.repository';
import { IUserRepository } from '../repositories/user.repository';
import { ProjectService } from './project.service';

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
   * @param ownerId User ID who is the owner of the project.
   * @param projectId Project ID.
   * @param participantEmail Participant Email.
   */
  public async inviteUserToProject(
    ownerId: number,
    projectId: number,
    participantEmail: string
  ) {
    await this.projectService.ensureUserIsProjectOwner(ownerId, projectId);

    const user = await this.userRepository.findUserByEmail(participantEmail);
    if (!user) {
      throw new HttpError(404, 'The user does not exist');
    }

    await this.ensureInvitationIsNotSent(user.id, projectId);
    await this.invitationRepository.sendProjectInvitation(
      ownerId,
      projectId,
      user.id
    );
  }

  /**
   * List user's project invitations. If any error occurs, it throws that
   * specific error.
   * @param userId User ID.
   * @returns User's project invitations.
   */
  public async listReceivedInvitations(userId: number) {
    return await this.invitationRepository.findReceivedInvitations(userId);
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
    await this.invitationRepository.makeUserProjectParticipant(
      participantId,
      projectId
    );

    const invitation = await this.invitationRepository.findOne(
      participantId,
      projectId
    );

    await this.invitationRepository.removeInvitation(
      participantId,
      invitation!.id
    );
  }

  /**
   * Reject a project invitation. If any error occurs, it throws that
   * specific error.
   * @param participantId User ID who received an invitation.
   */
  public async rejectProjectInvitation(userId: number, invitationId: number) {
    await this.invitationRepository.removeInvitation(userId, invitationId);
  }

  public async ensureInvitationIsNotSent(inviteeId: number, projectId: number) {
    const invitation = await this.invitationRepository.findOne(
      inviteeId,
      projectId
    );
    if (invitation) {
      throw new HttpError(409, 'Invitation is already sent to the user');
    }
  }
}
