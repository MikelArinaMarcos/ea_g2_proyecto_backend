import { Application, Request, Response } from 'express';
import { ActivityController } from '../controllers/activityController';

export class ActivityRoutes {

    private activity_controller: ActivityController = new ActivityController();

    public route(app: Application) {
        
        app.post('/activity', (req: Request, res: Response) => {
            this.activity_controller.createActivity(req, res);
        });

        app.get('/activity', (req: Request, res: Response) => {
            this.activity_controller.getAll(req, res);
        });

        app.get('/activity/:id', (req: Request, res: Response) => {
            this.activity_controller.getActivity(req, res);
        });

        app.delete('/activity/:id', (req: Request, res: Response) => {
            this.activity_controller.deleteActivity(req, res);
        });

    }
}