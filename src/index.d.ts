import IUser from "./models/users/types";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            isMaster?: boolean;
        }
    }
}