import { Application, Request, Response } from 'express';
import { UserController } from '../controllers/userController';

export class UserRoutes {

    private user_controller: UserController = new UserController();

    public route(app: Application) {
        
        app.post('', (req: Request, res: Response) => {
            this.user_controller.create_user(req, res);
        });

        app.get('/:id', (req: Request, res: Response) => {
            this.user_controller.get_user(req, res);
        });

        app.put('/:id', (req: Request, res: Response) => {
            this.user_controller.update_user(req, res);
        });

        app.delete('/:id', (req: Request, res: Response) => {
            this.user_controller.delete_user(req, res);
        });

    }
}



//import { Request, Response, Router } from "express";

//const router = Router();

/**
 * http://localhost:3002/users [GET]
 */
/* router.get('/users', (req: Request, res: Response) => {
    res.send({data: "AQUÍ_VAN_LOS_MODELOS" });
}); */

//export { router };