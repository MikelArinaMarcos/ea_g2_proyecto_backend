import { Application, Request, Response } from 'express';
import { UserController } from '../controllers/userController';

export class UserRoutes {

    private user_controller: UserController = new UserController();

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

        app.put('/user/:id', (req: Request, res: Response) => {
            this.user_controller.updateUser(req, res);
        });

        app.put('/user/delete/:id', (req: Request, res: Response) => {
            this.user_controller.deleteUser(req, res);
        });

    }
}