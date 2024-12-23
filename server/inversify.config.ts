import { Container } from 'inversify';

import { UserRepository } from './repositories/user.repository';
import IUserRepository from './types/repositories/IUserRepository';

import { ITokenService, TokenService } from './services/token.service';
import {
  EncryptionService,
  IEncryptionService,
} from './services/encryption.service';
import { AuthenticationService } from './services/authentication.service';
import { AuthenticationController } from './controllers/authentication.controller';

import IProjectRepository from './types/repositories/IProjectRepository';
import { ProjectRepository } from './repositories/project.repository';
import { ProjectService } from './services/project.service';
import { ProjectController } from './controllers/project.controller';

import IIssueRepository from './types/repositories/IIssueRepository';
import { IssueRepository } from './repositories/issue.repository';
import { IssueService } from './services/issue.service';
import {
  IIssueValidator,
  IssueValidator,
} from './services/validators/issueValidator';
import { IssueController } from './controllers/issue.controller';

import ISearchRepository from './types/repositories/ISearchRepository';
import { SearchRepository } from './repositories/search.repository';
import { SearchService } from './services/search.service';
import { SearchController } from './controllers/search.controller';

import IInvitationRepository from './types/repositories/IInvitationRepository';
import { InvitationRepository } from './repositories/invitation.repository';
import { InvitationService } from './services/invitation.service';
import { InvitationController } from './controllers/invitation.controller';

const container = new Container();

container.bind<IUserRepository>('IUserRepository').to(UserRepository);
container.bind<ITokenService>('ITokenService').to(TokenService);
container.bind<IEncryptionService>('IEncryptionService').to(EncryptionService);
container.bind<AuthenticationService>(AuthenticationService).toSelf();
container.bind<AuthenticationController>(AuthenticationController).toSelf();

container.bind<IProjectRepository>('IProjectRepository').to(ProjectRepository);
container.bind<ProjectService>(ProjectService).toSelf();
container.bind<ProjectController>(ProjectController).toSelf();

container.bind<IIssueRepository>('IIssueRepository').to(IssueRepository);
container.bind<IIssueValidator>('IIssueValidator').to(IssueValidator);
container.bind<IssueService>(IssueService).toSelf();
container.bind<IssueController>(IssueController).toSelf();

container.bind<ISearchRepository>('ISearchRepository').to(SearchRepository);
container.bind<SearchService>(SearchService).toSelf();
container.bind<SearchController>(SearchController).toSelf();

container
  .bind<IInvitationRepository>('IInvitationRepository')
  .to(InvitationRepository);
container.bind<InvitationService>(InvitationService).toSelf();
container.bind<InvitationController>(InvitationController).toSelf();

export default container;
