import { Router } from "express";
import { Application, Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/authController';

/* router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.post("/signin", authCtrl.signin);
router.post("/signup", authCtrl.signup);

export default router; */

const router = Router();

export class AuthRoutes {

  private auth_controller: AuthController = new AuthController();

  public route(app: Application) {

    app.use((req: Request, res: Response, next: NextFunction) => {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.post('/signin', (req: Request, res: Response) => { this.auth_controller.signin(req, res); });
  }

}