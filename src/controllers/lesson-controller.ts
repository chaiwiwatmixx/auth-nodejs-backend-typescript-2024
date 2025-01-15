import { NextFunction, Request, Response } from "express";
import createError from "../utils/createError";
import { getProductByIdService } from "../service/course-service";

import { checkUserExist } from "../service/auth-service";
import {
  createLessonService,
  createSectionService,
  deleteLessonService,
  getLessonsByCourseIdService,
  updateLessonService,
} from "../service/lesson-service";
import { SectionType } from "../models/course/course-model";

// export const createLesson = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { titleLesson, videos, durationLesson } = req.body;
//     const userId = Number(req.userId);
//     const id = Number(req.params.id);

//     // check data
//     if (!titleLesson) {
//       return createError("Please fill in all information.", 400);
//     }

//     // checkUserExist
//     const user = await checkUserExist(Number(userId));
//     if (!user || user.role !== "admin") {
//       return createError(
//         "There was an error in verifying the admin identity.",
//         400
//       );
//     }

//     // check auth course
//     const getCourse = await getProductByIdService(Number(id));
//     if (!getCourse || getCourse.adminId !== user.id) {
//       return createError("course with incorrect confirmation of rights.", 400);
//     }

//     const lesson = await createLessonService({
//       id,
//       titleLesson,
//       videos,
//       durationLesson,
//     });

//     res
//       .status(200)
//       .json({ message: "Lesson created successfully", data: lesson });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

// export const updateLesson = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { titleLesson, videos, durationLesson } = req.body;
//     const userId = Number(req.userId);
//     const id = Number(req.params.id);

//     // check data
//     if (!titleLesson) {
//       return createError("Please fill in all information.", 400);
//     }

//     // checkUserExist
//     const user = await checkUserExist(Number(userId));
//     if (!user || user.role !== "admin") {
//       return createError(
//         "There was an error in verifying the admin identity.",
//         400
//       );
//     }

//     const lesson = await updateLessonService({
//       id,
//       titleLesson,
//       videos,
//       durationLesson,
//     });
//     if (!lesson) {
//       return createError("Error updating lesson.", 400);
//     }

//     res
//       .status(200)
//       .json({ message: "Lesson updated successfully", data: lesson });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };

export const createLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lessons } = req.body;
    const userId = Number(req.userId);
    const courseId = Number(req.params.id);

    // check data
    if (!lessons || !Array.isArray(lessons)) {
      return createError("Please provide lessons data.", 400);
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
    const getCourse = await getProductByIdService(Number(courseId));
    if (!getCourse || getCourse.adminId !== user.id) {
      return createError("course with incorrect confirmation of rights.", 400);
    }

    // Prepare lesson data
    const lessonsData = lessons.map((lesson) => ({
      lesson: {
        ...lesson,
        id: courseId,
      },
      sections: lesson.sections,
    }));

    const createdLessons = await createLessonService(lessonsData);

    res
      .status(200)
      .json({ message: "Lesson created successfully", data: createdLessons });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getLessonsByCourseId = async (
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

    // get lessons
    const lessons = await getLessonsByCourseIdService(id);

    res
      .status(200)
      .json({ message: "Lessons fetched successfully", data: lessons });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateLesson = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { lessons } = req.body;
    const userId = Number(req.userId);
    const courseId = Number(req.params.id);

    // check data
    if (!lessons || !Array.isArray(lessons)) {
      return createError("Please provide lessons data.", 400);
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
    const getCourse = await getProductByIdService(Number(courseId));
    if (!getCourse || getCourse.adminId !== user.id) {
      return createError("course with incorrect confirmation of rights.", 400);
    }

    // Prepare lesson data
    const lessonsData = lessons.map((lesson) => ({
      lesson: {
        id: lesson.id,
        titleLesson: lesson.titleLesson.trim(),
        videos: Number(lesson.videos) || 0,
        durationLesson: lesson.durationLesson?.trim() || "",
        courseId: courseId,
      },
      sections: lesson.sections.map((section: SectionType) => ({
        id: section.id,
        titleSection: section.titleSection.trim(),
        durationSection: section.durationSection?.trim() || "",
        preview: Boolean(section.preview),
      })),
    }));

    const updateLessons = await updateLessonService(lessonsData);
    if (!updateLessons) {
      return createError("Error updating lesson.", 400);
    }

    res
      .status(200)
      .json({ message: "Lesson created successfully", data: updateLessons });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteLesson = async (
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

    await deleteLessonService(id);

    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const createSection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { titleSection, durationSection, preview } = req.body;
    const userId = Number(req.userId);
    const id = Number(req.params.id);

    // check data
    if (!titleSection) {
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

    const section = await createSectionService({
      id,
      titleSection,
      durationSection,
      preview,
    });

    res
      .status(200)
      .json({ message: "Section updated successfully", data: section });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
