import express from "express";
import { getUser, login, register } from "../controllers/auth-controller";
import authMiddleware from "../middlewares/auth-middleware";

const route = express.Router();

route.post("/register", register);
route.post("/login", login);
route.get("/", authMiddleware,getUser);

export default route;
