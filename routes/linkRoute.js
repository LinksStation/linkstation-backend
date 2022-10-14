import express from "express";
const router = new express.Router();

import isAuthenticated from "../middleware/isAuthenticated.js";
import { create, userByLink } from "../controller/linkController.js";

router.post("/create/:id", isAuthenticated, create);
router.post("/populate/:id", isAuthenticated, userByLink);

export default router;
