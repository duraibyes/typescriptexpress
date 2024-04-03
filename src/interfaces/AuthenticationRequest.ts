import { Request } from "express";

interface AuthenticatedRequest extends Request {
    user?: any;
}


export default AuthenticatedRequest;