import { Router } from "express";
import { body } from "express-validator";
import { login, registerUser } from "./controllers";
import { handleInputErrors } from "./middlewares/middleware";

const router = Router();

router.post("/auth/register",
    body("handle").notEmpty().withMessage("Handle is required"),
    body("username").notEmpty().withMessage("Username is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    handleInputErrors,
    registerUser);

router.post("/auth/login",
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
    handleInputErrors,
    login);

export default router;