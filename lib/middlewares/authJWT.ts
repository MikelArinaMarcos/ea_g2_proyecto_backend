import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose';
import * as jwt from "jsonwebtoken";
import activities from "../models/activities/schema";
import {IUser} from "../models/users/model";
import users from "../models/users/schema";
import comments from "../models/comments/schema";



import IJwtPayload from '../models/JWTPayload';

const _SECRET: string = 'api+jwt';



  // https://dev.to/kwabenberko/extend-express-s-request-object-with-typescript-declaration-merging-1nn5

export async function verifyToken (req: Request, res: Response, next: NextFunction) {
    console.log("verifyToken");
    
    const token = req.header("x-access-token");
    if (!token) return res.status(403).json({ message: "No token provided" });
    console.log(token);

  try {
    
    const decoded = jwt.verify(token, _SECRET) as IJwtPayload;
    console.log("verifyToken");
    console.log(decoded);
    req.params._id = decoded.id;
    const user = await users.find({us: req.params._id}, { password: 0 });
    console.log(user);
    if (!user) return res.status(404).json({ message: "No user found" });

    
    next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

export async function isOwner (req: Request, res: Response, next: NextFunction) {
  try {
    const user = await users.find({username: req.body._id});

    const activityId = req.params.id;
    const activity = await activities.findById(activityId);

    if (!activity) return res.status(403).json({ message: "No user found" });

    if (activity.owner != req.body._id) return res.status(403).json({ message: "Not Owner" });

    next();

  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error });
  }
};

export async function commentOwner (req: Request, res: Response, next: NextFunction) {
  try {
    
    const user = await users.findOne({userId: req.body._id});

    console.log("estas aqui: " + user._id);

    const commentId = req.params.id;
    const comment = await comments.findById(commentId);
    console.log("Post owner: " + comment.users);

    if (!comment) return res.status(403).json({ message: "No user found" });


    if (!user._id.equals(comment.users)) return res.status(403).json({ message: "Not Owner" });

    next();

  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error });
  }
};
