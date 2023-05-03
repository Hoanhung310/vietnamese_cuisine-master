import dotenv from "dotenv";
require("dotenv").config();

import express from "express";
import cors from "cors";
import { sample_foods, sample_tags, sample_users } from "./data";
import jwt from "jsonwebtoken";
import foodRouter from './routers/food.router';
import userRouter from './routers/user.router';
import { dbConnect } from "./configs/database.config";
import orderRouter from "./routers/order.router";
import path from "path";
dbConnect();

const app = express();
app.use(express.json());

app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200"]
}))

app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);

app.use(express.static('public'));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'index.html'))
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Website served on http://localhost:" + port);
})