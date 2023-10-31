import IPublisher from "./models/publishers/types";
import IUser from "./models/users/types";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            publisher?: IPublisher;
            isMaster?: boolean;
        }
    }
}