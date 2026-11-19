
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  createComplaint,
  myComplaints,
  getComplaintDetails,
  getAllComplaints,
  updateComplaintStatus
} from "../controllers/complaintController.js";

import {
  protect,
  adminOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

const uploadDirectory = path.resolve("uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.use(protect);

router.post("/", upload.single("attachment"), createComplaint);
router.get("/my", myComplaints);
router.get("/", adminOnly, getAllComplaints);
router.get("/:id", getComplaintDetails);
router.patch("/:id", adminOnly, updateComplaintStatus);

export default router;
