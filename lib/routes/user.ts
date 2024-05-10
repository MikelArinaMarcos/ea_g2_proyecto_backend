import { Application, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/userController';
import { AuthJWT } from '../middlewares/authJWT';

export class UserRoutes {

    private user_controller: UserController = new UserController();
    private auth_JWT: AuthJWT = new AuthJWT();

    public route(app: Application) {
        
        
        app.post('/user', (req: Request, res: Response) => {
            this.user_controller.createUser(req, res);
        });

        app.get('/user/:page/:limit', (req: Request, res: Response,) => {
            this.user_controller.getAll(req, res);
           
        });

        app.get('/user/:id', (req: Request, res: Response) => {
            this.user_controller.getUser(req, res);
        });

        app.put('/user/:id', this.auth_JWT.verifyToken.bind(this.auth_JWT), this.auth_JWT.isOwner.bind(this.auth_JWT), (req: Request, res: Response, next: NextFunction) => {
            this.user_controller.updateUser(req, res);
        });

        app.put('/user/delete/:id', this.auth_JWT.verifyToken.bind(this.auth_JWT), this.auth_JWT.isOwner.bind(this.auth_JWT), (req: Request, res: Response) => {
            this.user_controller.deleteUser(req, res);
        });

    }
}