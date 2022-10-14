import express from "express";
const router = express.Router();

import isAuthenticated from "../middleware/isAuthenticated.js";
import linkByUser from "../controller/userController.js";

router.post("/find/links/:id", isAuthenticated, linkByUser);

export default router;
