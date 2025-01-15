import "dotenv/config";
import express from "express";
import cors from "cors";
import courseRoute from "./routes/couse-route";
import authRoute from "./routes/auth-route";
import lessonRoute from "./routes/lesson-route";
const app = express();
import errorHandler from "./middlewares/error";

// middleware
app.use(cors());
app.use(express.json());

// route
app.use("/auth", authRoute);
app.use("/course", courseRoute);
app.use("/lesson", lessonRoute);

// error mid
app.use(errorHandler);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`run server on port ${port}`));
