import { Application, Request, Response } from 'express';
import { ActivityController } from '../controllers/activityController';
import { AuthJWT } from '../middlewares/authJWT';

export class ActivityRoutes {

    private activity_controller: ActivityController = new ActivityController();
    private auth_JWT: AuthJWT = new AuthJWT();

    public route(app: Application) {
        
        app.post('/activity', (req: Request, res: Response) => {
            this.activity_controller.createActivity(req, res);
        });

        app.get('/activity/:page/:limit', (req: Request, res: Response) => {
            this.activity_controller.getAll(req, res);
        });

        app.get('/activity/:id', (req: Request, res: Response) => {
            this.activity_controller.getActivity(req, res);
        });

        app.get('/activities/:id', (req: Request, res: Response) => {
            this.activity_controller.getUserActivities(req, res);
        });

        app.put('/activity/:id', this.auth_JWT.verifyToken.bind(this.auth_JWT), this.auth_JWT.activityOwner.bind(this.auth_JWT), (req: Request, res: Response) => {
            this.activity_controller.updateActivity(req, res);
        });

        app.put('/activity/delete/:id', this.auth_JWT.verifyToken.bind(this.auth_JWT), this.auth_JWT.activityOwner.bind(this.auth_JWT), (req: Request, res: Response) => {
            console.log("deleting activity");
            this.activity_controller.deleteActivity(req, res);
        });

        app.put('/activity/:id/:activityId', this.auth_JWT.verifyToken.bind(this.auth_JWT), this.auth_JWT.isOwner.bind(this.auth_JWT), (req: Request, res: Response) => {
            this.activity_controller.participateActivity(req, res);
        });

    }
}