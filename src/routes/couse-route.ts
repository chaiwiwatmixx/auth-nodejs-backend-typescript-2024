import express from "express";
import {
  createCourse,
  deleteCourse,
  getProduct,
  getProducts,
  updateCourse,
} from "../controllers/course-controller";
import authMiddleware from "../middlewares/auth-middleware";
const route = express.Router();
import multer from "multer";

const upload = multer({ dest: "uploads/" });

route.post("/", authMiddleware, upload.single("image"), createCourse);
route.get("/", authMiddleware, getProducts);
route.get("/:id", authMiddleware, getProduct);
route.put("/:id", authMiddleware, upload.single("image"), updateCourse);
route.delete("/:id", authMiddleware, deleteCourse);

export default route;
