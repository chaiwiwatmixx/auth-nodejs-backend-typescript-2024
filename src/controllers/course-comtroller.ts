import { NextFunction, Request, Response } from "express";

export const createCourse = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.json("test createCourse");
};
