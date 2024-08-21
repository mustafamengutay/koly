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

const container = new Container();

container.bind<IUserRepository>('IUserRepository').to(UserRepository);
container.bind<ITokenService>('ITokenService').to(TokenService);
container.bind<IEncryptionService>('IEncryptionService').to(EncryptionService);

container.bind<AuthenticationService>(AuthenticationService).toSelf();
container.bind<AuthenticationController>(AuthenticationController).toSelf();

export default container;
