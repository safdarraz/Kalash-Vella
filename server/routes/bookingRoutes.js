import express from "express";
import multer from "multer";
import { createBooking } from "../controllers/bookingController.js";

const router = express.Router();

// multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/", upload.single("receipt"), createBooking);

export default router;
