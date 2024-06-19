import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import userService from '../models/users/service';
import * as crypto from 'crypto';
import IJwtPayload from '../models/JWTPayload';

export class AuthController {
  private _SECRET: string = 'api+jwt';

  refreshTokenSecret = crypto.randomBytes(64).toString('hex');
  private _REFRESH_SECRET: string = this.refreshTokenSecret;

  private user_service: userService = new userService();

  public async signin(req: Request, res: Response): Promise<Response> {
    const email = req.body.email;
    const password = req.body.password;

    const userFound = await this.user_service.filterUser({ email: email });

    if (!userFound) return res.status(404).json({ message: 'User Not Found' });

    if (
      !(await this.user_service.validatePassword(password, userFound.password))
    ) {
      return res.status(401).json({ token: null, message: 'Invalid Password' });
    }

    const session = { id: userFound._id } as IJwtPayload;

    const token = jwt.sign(session, this._SECRET, {
      expiresIn: 86400,
    });

    const refreshToken = jwt.sign(session, this._REFRESH_SECRET, {
      expiresIn: 604800, // 7 days
    });

    return res
      .status(201)
      .json({ token: token, refreshToken: refreshToken, id: userFound._id });
  }

  public async signingooggle(req: Request, res: Response): Promise<Response> {
    const email = req.body.email;
  
    try {
      const userFound = await this.user_service.filterUser({ email: email });
  
      if (!userFound) {
        return res.status(404).json({ message: 'User Not Found' });
      }
      const session = { id: userFound._id } as IJwtPayload;

    const token = jwt.sign(session, this._SECRET, {
      expiresIn: 86400,
    });

    const refreshToken = jwt.sign(session, this._REFRESH_SECRET, {
      expiresIn: 604800, // 7 days
    });
  
      return res.status(200).json({ token: token, refreshToken: refreshToken, id: userFound._id });
    } catch (error) {
      console.error('Error during signin:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  public async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken = req.body.refresh_token;

      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token missing' });
      }

      const decoded = jwt.verify(
        refreshToken,
        this._REFRESH_SECRET
      ) as IJwtPayload;
      const userFound = await this.user_service.filterUser({ _id: decoded.id });

      if (!userFound) return res.status(404).json({ message: 'No user found' });

      const session = { id: userFound._id } as IJwtPayload;

      const new_token = jwt.sign(session, this._SECRET, {
        expiresIn: 86400,
      });

      const new_refreshToken = jwt.sign(session, this._REFRESH_SECRET, {
        expiresIn: 604800, // 7 days
      });

      console.log(new_token);
      return res
        .status(201)
        .json({ token: new_token, refreshToken: new_refreshToken });
    } catch (error) {
      console.error('Error refreshing token:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
