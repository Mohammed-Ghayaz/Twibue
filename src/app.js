import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import xss from "xss-clean"
import rateLimit from "express-rate-limit";
import expressMongoSanitize from "express-mongo-sanitize";


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(helmet());

// Limit repeated requests
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Sanitize request data
app.use(xss());
app.use(expressMongoSanitize());


import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import commentRouter from "./routes/comment.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"


app.use("/api/v1/user", userRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/tweet", tweetRouter);
app.use("/api/v1/dashboard", dashboardRouter)
app.use("/api/v1/subscription", subscriptionRouter)
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/playlist", playlistRouter)

export { app };