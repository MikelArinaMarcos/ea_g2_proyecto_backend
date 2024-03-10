import { Application, Request, Response } from 'express';
import { ActivityController } from '../controllers/activityController';

export class ActivityRoutes {

    private activity_controller: ActivityController = new ActivityController();

    public route(app: Application) {
        
        app.post('/post', (req: Request, res: Response) => {
            this.activity_controller.createActivity(req, res);
        });

        app.get('/post/:id', (req: Request, res: Response) => {
            this.activity_controller.getActivity(req, res);
        });

        app.delete('/post/:id', (req: Request, res: Response) => {
            this.activity_controller.deleteActivity(req, res);
        });

    }
}