import { Request, Response, NextFunction } from 'express';
import * as jwt from "jsonwebtoken";
import activities from "../models/activities/schema";
import users from "../models/users/schema";
import comments from "../models/comments/schema";
import IJwtPayload from '../models/JWTPayload';
import { Console } from 'console';

const _SECRET: string = 'api+jwt';



export class AuthJWT {

  public async verifyToken(req: Request, res: Response, next: NextFunction) {

    const token = req.header("x-access-token");
    if (!token) return res.status(403).json({ message: "No token provided" });

    try {

      const decoded = jwt.verify(token, _SECRET) as IJwtPayload;

      req.userId = decoded.id;
      const user = await users.findById(req.userId);

      if (!user) return res.status(404).json({ message: "No user found" });

      next();

    } catch (error) {
      return res.status(400).json({ message: "Unauthorized!" });
    }
  }


  public async isOwner(req: Request, res: Response, next: NextFunction) {

    try {
      const userId = req.params.id;
      const user = await users.findById(userId);

      if (!user) return res.status(403).json({ message: "No user found" });
      
      if (user._id != req.userId) return res.status(403).json({ message: "Not Owner" });

      next();

    } catch (error) {
      console.log(error)
      return res.status(500).send({ message: error });
    }
  };

  public async activityOwner(req: Request, res: Response, next: NextFunction) {

    try {
      const activityId = req.params.id;
      const activity = await activities.findById(activityId);

      if (!activity) return res.status(404).json({ message: "No activity found" });

      if (activity.owner != req.userId) return res.status(403).json({ message: "Not Owner" });

      next();

    } catch (error) {
      return res.status(500).send({ message: error });
    }
  };

  public async commentOwner(req: Request, res: Response, next: NextFunction) {
    try {

      const commentId = req.params.id;
      const comment = await comments.findById(commentId);

      if (!comment) return res.status(403).json({ message: "No comment found" });

      if (comment.users != req.userId) return res.status(403).json({ message: "Not Owner" });

      next();

    } catch (error) {
      return res.status(500).send({ message: error });
    }
  };

  public async verifyTokenSocket(socket: any, next: (err?: Error) => void) {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('No token provided'));

    try {
      const decoded = jwt.verify(token, _SECRET) as IJwtPayload;

      socket.userId = decoded.id;
      const user = await users.findById(socket.userId);

      if (!user) return next(new Error('No user found'));

      next();
    } catch (error) {
      next(new Error('Unauthorized'));
    }
  }
}


