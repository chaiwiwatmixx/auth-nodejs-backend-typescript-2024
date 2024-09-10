import { NextFunction, Request, Response } from "express";
import {
  checkExistMail,
  checkUserExist,
  registerUser,
} from "../service/auth-service";
import createError from "../utils/createError";
import { validateRegisterData } from "../utils/validateRegisterData";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password, password2 } = req.body;

    // validate data
    validateRegisterData(username, email, password, password2);

    // check account exists
    const checkMail = await checkExistMail(email);
    if (checkMail) {
      return createError("There is an email in the system.", 400);
    }

    // createUser
    const createUser = await registerUser(username, email, password);

    if (createUser) {
      res.status(200).json(createUser);
    } else {
      return createError("There was an error while registering.", 400);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Check data accuracy
    if (!email || !password) {
      return createError("Please fill in all information.", 400);
    }

    // check account exists
    const checkMail = await checkExistMail(email);
    if (!checkMail) {
      return createError("There is no email in the system.", 400);
    }

    // checkPassword
    const checkPassword = await bcrypt.compare(password, checkMail.password);

    if (checkPassword) {
      if (!JWT_SECRET) {
        return createError("JWT secret key is not defined.", 400);
      }

      // gen token
      const token = jwt.sign({ id: checkMail.id }, JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "1d",
      });

      // remove password
      const { password, ...user } = checkMail;

      res.status(200).json({ user: user, token: token });
    } else {
      return createError("Password is incorrect.", 400);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.userId;

    // check account exists
    const checkUser = await checkUserExist(Number(id));
    if (!checkUser) {
      return createError("user not Found.", 400);
    }

    // remove password
    const { password, ...user } = checkUser;

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
