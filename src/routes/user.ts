import { Request, Response, Router } from "express";

const router = Router();

/**
 * http://localhost:3002/users [GET]
 */
router.get('/users', (req: Request, res: Response) => {
    res.send({data: "AQUÍ_VAN_LOS_MODELOS" });
});

export { router };