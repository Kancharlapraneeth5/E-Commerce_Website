import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

const publicOperations = ["AddNewUser"];

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const operationName = req.body.operationName;

    if(publicOperations.includes(operationName)){
        return next();
    }

    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({ error: "No token provided"});
    }

    jwt.verify(token, process.env.JWT_SECRET as Secret, (err, decoded) => {
        if(err){
            return res.status(401).json({ error: "Failed to authenticate token "});
        }
        req.body.userId = (decoded as { id: string }).id;
        next();
    })
}