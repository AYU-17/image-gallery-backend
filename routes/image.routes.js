import express from "express";
import { uploadImage, getImageFeed, deleteImage, updateImage, toggleLikeImage, getLikedImages } from "../controllers/image.controller.js";
import upload from "../middleware/upload.js";
import { authAdmin } from "../middleware/authAdmin.js";
import { authUser } from "../middleware/authUser.js";

const router = express.Router();

router.post("/upload", authAdmin, upload.single("image"), uploadImage);
router.put("/:id", authAdmin, updateImage);
router.delete("/:id", authAdmin, deleteImage);

// router.post("/test-upload", authAdmin, upload.single("image"), (req, res) => {
  //   res.json({
    //     file: req.file,
    //     body: req.body
    //   });
    // });
    
    
router.get("/", getImageFeed);
router.get("/liked", authUser, getLikedImages);
router.post("/:imageId/like", authUser, toggleLikeImage);

export const imageRoutes =  router;