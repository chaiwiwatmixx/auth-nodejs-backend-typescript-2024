import express from "express";
import { createCourse } from "../controllers/course-comtroller";
import authMiddleware from "../middlewares/auth-middleware";
const route = express.Router();

route.post("/", authMiddleware, createCourse);

export default route;
