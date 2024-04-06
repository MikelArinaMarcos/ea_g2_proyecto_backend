import { Application, Request, Response } from 'express';
import { CommentController } from '../controllers/commentController';

export class CommentRoutes {

    private comment_controller: CommentController = new CommentController();

    public route(app: Application) {
        
        app.post('/comment', (req: Request, res: Response) => {
            console.log("1");
            this.comment_controller.createComment(req, res);
        });

        app.get('/comment/:id', (req: Request, res: Response) => {
            console.log("2");
            this.comment_controller.getComment(req, res);
        });

        app.get('/comment/:id/:page', (req: Request, res: Response) => {
            console.log("3");
            this.comment_controller.getComments(req, res);
        });

        app.get('/commentlength/:id', (req: Request, res: Response) =>{
            console.log("4");
            this.comment_controller.getLength(req,res);
        });

        app.put('/comment/:id', (req: Request, res: Response) => {
            console.log("5");
            this.comment_controller.updateComment(req, res);
        });

        app.delete('/comment/:id', (req: Request, res: Response) => {
            console.log("6");
            this.comment_controller.deleteComment(req, res);
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