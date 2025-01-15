import { NextFunction, Request, Response } from "express";
import createError from "../utils/createError";
import {
  createCourseService,
  createQAService,
  deleteCourseService,
  getProductByIdService,
  getProductsService,
  updateCourseService,
} from "../service/course-service";

import cloudinary from "../utils/cloudinary";
import { checkUserExist } from "../service/auth-service";

export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      subDescription,
      description,
      originalPrice,
      price,
      whoIsThisFor,
      teacher,
    } = req.body;
    const userId = Number(req.userId);
    const file = req.file;

    // check data
    if (!title || !description || !subDescription || !price) {
      return createError("Please fill in all information.", 400);
    }

    // checkUserExist
    const user = await checkUserExist(Number(userId));
    if (!user || user.role !== "admin") {
      return createError(
        "There was an error in verifying the admin identity.",
        400
      );
    }

    // Upload to Cloudinary
    let image = "";
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "your_folder_name",
        use_filename: true,
        unique_filename: true,
      });
      image = result.secure_url;
    }

    const course = await createCourseService({
      id: userId,
      title,
      subDescription,
      description,
      originalPrice,
      price,
      whoIsThisFor,
      teacher,
      image,
    });

    res.status(201).json(course);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;

    // checkUserExist
    const user = await checkUserExist(Number(userId));
    if (!user || user.role !== "admin") {
      return createError(
        "There was an error in verifying the admin identity.",
        400
      );
    }

    const product = await getProductsService();

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const userId = req.userId;

    // checkUserExist
    const user = await checkUserExist(Number(userId));
    if (!user || user.role !== "admin") {
      return createError(
        "There was an error in verifying the admin identity.",
        400
      );
    }

    // get product
    const product = await getProductByIdService(Number(id));

    if (product && product.adminId === user.id) {
      res.status(200).json(product);
    }
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      title,
      subDescription,
      description,
      originalPrice,
      price,
      whoIsThisFor,
      teacher,
    } = req.body;
    const userId = Number(req.userId);
    const id = Number(req.params.id);
    const file = req.file;

    // check data
    if (!title || !description || !subDescription || !price) {
      return createError("Please fill in all information.", 400);
    }

    // checkUserExist
    const user = await checkUserExist(Number(userId));
    if (!user || user.role !== "admin") {
      return createError(
        "There was an error in verifying the admin identity.",
        400
      );
    }

    // check auth course
    const getCourse = await getProductByIdService(Number(id));
    if (!getCourse || getCourse.adminId !== user.id) {
      return createError("course with incorrect confirmation of rights.", 400);
    }

    // Upload to Cloudinary
    let image = null;
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "your_folder_name",
        use_filename: true,
        unique_filename: true,
      });
      image = result.secure_url;
    }

    const course = await updateCourseService({
      id,
      title,
      subDescription,
      description,
      originalPrice,
      price,
      whoIsThisFor,
      teacher,
      image: image ? image : getCourse.image,
    });

    res.status(201).json(course);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const createQA = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { question, answer } = req.body;
    const userId = Number(req.userId);
    const id = Number(req.params.id);

    // check data
    if (!question || !answer) {
      return createError("Please fill in all information.", 400);
    }

    // checkUserExist
    const user = await checkUserExist(Number(userId));
    if (!user || user.role !== "admin") {
      return createError(
        "There was an error in verifying the admin identity.",
        400
      );
    }

    // check auth course
    const getCourse = await getProductByIdService(Number(id));
    if (!getCourse || getCourse.adminId !== user.id) {
      return createError("course with incorrect confirmation of rights.", 400);
    }

    const qa = await createQAService({
      id,
      question,
      answer,
    });

    res.status(200).json(qa);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.userId);
    const id = Number(req.params.id);

    // checkUserExist
    const user = await checkUserExist(Number(userId));
    if (!user || user.role !== "admin") {
      return createError(
        "There was an error in verifying the admin identity.",
        400
      );
    }

    // check auth course
    const getCourse = await getProductByIdService(Number(id));
    if (!getCourse || getCourse.adminId !== user.id) {
      return createError("course with incorrect confirmation of rights.", 400);
    }

    await deleteCourseService(id);

    res.status(200).json("delete course success");
  } catch (error) {
    console.log(error);
    next(error);
  }
};
