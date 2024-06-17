import express from "express";
import {
  getQuestions,
  getQuestion,
  postQuestion,
  searchQuestions,
} from "../controllers/questionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getQuestions);
router.get("/:questionId", authMiddleware, getQuestion);
router.post("/", authMiddleware, postQuestion);
router.get("/search/:searchQuery", searchQuestions);

export default router;
