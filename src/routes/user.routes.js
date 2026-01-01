import { Router } from "express";
import registerUser from "../controlers/user.controler.js";

const router = Router();

router.post("/register", registerUser);

export default router;
