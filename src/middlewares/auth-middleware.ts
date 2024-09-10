import { NextFunction, Request, Response } from "express";
import createError from "../utils/createError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../prisma";
import { checkUserExist } from "../service/auth-service";

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //check token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return createError("Authorization token missing or invalid.", 401);
    }
    const token = authHeader.split(" ")[1];

    // verify token
    if (!JWT_SECRET) {
      return createError("JWT_SECRET not found.", 500);
    }
    const decode = jwt.verify(token, JWT_SECRET) as JwtPayload;

    //check token id exist
    const user = await checkUserExist(decode.id);
    if (!user) {
      return createError("User not found.", 404);
    }

    //return id
    req.userId = user.id;
    next();
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;
