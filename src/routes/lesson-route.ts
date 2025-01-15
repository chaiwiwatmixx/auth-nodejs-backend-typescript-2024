import express from "express";
import {
  createLesson,
  createSection,
  deleteLesson,
  getLessonsByCourseId,
  updateLesson,
} from "../controllers/lesson-controller";
import authMiddleware from "../middlewares/auth-middleware";
const route = express.Router();

route.post("/:id", authMiddleware, createLesson);
route.get("/:id", authMiddleware, getLessonsByCourseId);
route.post("/section/:id", authMiddleware, createSection);
route.put("/:id", authMiddleware, updateLesson);
route.delete("/:id", authMiddleware, deleteLesson);

export default route;
