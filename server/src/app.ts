import express from "express";
import cors from "cors";
import { Keys } from "./config/keys";
import { REQUEST_DATA_LIMIT } from "./constants/index";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: Keys.CORS,
    credentials: true,
}))

app.use(express.json({ limit: REQUEST_DATA_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: REQUEST_DATA_LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());

// route import



// route declarations



export default app;



