import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from "jsonwebtoken";
import AuthenticatedRequest from '../interfaces/AuthenticationRequest';


const validateToken = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => { // Corrected spelling
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;
    console.log( '  uthheader ',authHeader);
    if (typeof authHeader === 'string' && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];

        jwt.verify(token, 'durai', (err: any, decoded: any) => {
            if (err) {
                res.status(401);
                throw new Error("User is not authorized");
            }
            console.log(decoded, ' decoded');
            req.user = decoded.user;
            next();
        });
        if (!token) {
            res.status(401);
            throw new Error("User is not authorized or token is missing");
        }
    } else {
        res.status(401);
        throw new Error("User is not authorized or token is missing");
    }
});

export default validateToken;