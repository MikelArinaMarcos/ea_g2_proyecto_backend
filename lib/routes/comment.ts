import { Application, Request, Response } from 'express';
import { CommentController } from '../controllers/commentController';
import { AuthJWT } from '../middlewares/authJWT';

export class CommentRoutes {

    private comment_controller: CommentController = new CommentController();
    private auth_JWT: AuthJWT = new AuthJWT();

    public route(app: Application) {
        
        app.post('/comment', (req: Request, res: Response) => {
            this.comment_controller.createComment(req, res);
        });

        app.get('/comment/:id', (req: Request, res: Response) => {
            this.comment_controller.getComment(req, res);
        });

        app.get('/comment/:id/:page', (req: Request, res: Response) => {
            this.comment_controller.getComments(req, res);
        });

        app.get('/commentlength/:id', (req: Request, res: Response) =>{
            this.comment_controller.getLength(req,res);
        });

        app.put('/comment/:id', this.auth_JWT.verifyToken.bind(this.auth_JWT), this.auth_JWT.commentOwner.bind(this.auth_JWT), (req: Request, res: Response) => {
            this.comment_controller.updateComment(req, res);
        });

        app.delete('/comment/:id', this.auth_JWT.verifyToken.bind(this.auth_JWT), this.auth_JWT.commentOwner.bind(this.auth_JWT), (req: Request, res: Response) => {
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