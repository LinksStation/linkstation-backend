import express from "express";
const router = new express.Router();

import { signup, login, logout } from "../controller/authController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

router.get("/", (req, res) => res.send("ok"));

router.post("/user/signup", signup);
router.post("/user/login", login);
router.post("/user/logout", isAuthenticated, logout);

export default router;
