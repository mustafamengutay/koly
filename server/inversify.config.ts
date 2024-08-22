import { Container } from 'inversify';

import {
  IUserRepository,
  UserRepository,
} from './repositories/user.repository';
import { ITokenService, TokenService } from './services/token.service';
import {
  EncryptionService,
  IEncryptionService,
} from './services/encryption.service';
import { AuthenticationService } from './services/authentication.service';
import { AuthenticationController } from './controllers/authentication.controller';

import {
  IProjectRepository,
  ProjectRepository,
} from './repositories/project.repository';
import { ProjectService } from './services/project.service';
import { ProjectController } from './controllers/project.controller';

import {
  IIssueRepository,
  IssueRepository,
} from './repositories/issue.repository';
import { IssueService } from './services/issue.service';
import {
  IIssueValidator,
  IssueValidator,
} from './services/validators/issueValidator';
import { IssueController } from './controllers/issue.controller';

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

export default container;
