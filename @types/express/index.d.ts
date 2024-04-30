import {IUser} from "../../lib/models/users/model"

declare global{
    namespace Express {
        interface Request {
            userId: IUser["_id"]
        }
    }
}