import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';

import { AuthenticationService } from '../services/authentication.service';

@injectable()
export class AuthenticationController {
  private authenticationService: AuthenticationService;

  public constructor(
    @inject(AuthenticationService)
    authenticationService: AuthenticationService
  ) {
    this.authenticationService = authenticationService;
  }

  postSignUp = async (req: Request, res: Response, next: NextFunction) => {
    const { name, surname, email, password } = req.body;

    try {
      const newUser = await this.authenticationService.signUp(
        name,
        surname,
        email,
        password
      );

      res.status(201).json({
        status: 'success',
        data: {
          user: newUser,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  postLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const token: string = await this.authenticationService.login(
        email,
        password
      );

      res.status(200).json({
        status: 'success',
        data: {
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
