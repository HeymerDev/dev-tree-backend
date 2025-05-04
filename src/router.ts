import { Router } from "express";
import { registerUser } from "./controllers";

const router = Router();

router.post("/auth/register", registerUser);

router.post("/auth/login", (req, res) => {
    res.send("Login page");
}
);

export default router;