import { Router } from "express";
import { body } from "express-validator";
import { getUser, getUserByHandle, login, registerUser, updateUser, uploadImage } from "./controllers";
import { handleInputErrors } from "./middlewares/middleware";
import { authenticate } from "./middlewares/auth";

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

router.get("/user",authenticate, getUser);
router.get("/:handle", getUserByHandle);
router.patch("/user",
    body("handle").notEmpty().withMessage("Handle is required"),
    body("description").notEmpty().withMessage("Description is required"),
    handleInputErrors,
    authenticate,
    updateUser);

router.post("/user/image", authenticate, uploadImage);

export default router;