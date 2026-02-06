import Image from "../models/image.js";
import User from "../models/user.js";

export const uploadImage = async (req, res) => {
    console.log("➡️ Upload API hit");
  try {
    console.log("File:", req.file);
    console.log("Body:", req.body);
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image file required" });
    }

    const image = await Image.create({
      title,
      imageUrl: req.file.path,
      uploadedBy: req.adminId
    });

    res.status(201).json({
      message: "Image uploaded successfully",
      image
    });

  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
};

export const getImageFeed = async (req, res) => {
  try {
    const { sort } = req.query;

    let sortOption = {};

    switch (sort) {
      case "oldest":
        sortOption = { createdAt: 1 };
        break;

      case "popular":
        sortOption = { likesCount: -1 };
        break;

      case "newest":
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const images = await Image.find()
      .populate("uploadedBy", "email")
      .sort(sortOption);

    res.status(200).json(images);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch image feed",
      error
    });
  }
};

export const toggleLikeImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const userId = req.userId;

    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const user = await User.findById(userId);

    const alreadyLiked = image.likedBy.some(id => id.toString() === userId);

    if (alreadyLiked) {
      image.likedBy.pull(userId);
      image.likesCount = Math.max(0, image.likesCount - 1); // Prevent negative counts

      user.likedImages.pull(imageId);

      await image.save();
      await user.save();

      return res.status(200).json({
        message: "Image unliked",
        likesCount: image.likesCount,
        likedBy: image.likedBy
      });
    } else {
      image.likedBy.push(userId);
      image.likesCount += 1;

      user.likedImages.push(imageId);
      
      await image.save();
      await user.save(); // Ensure user changes are saved

      return res.status(200).json({
        message: "Image liked",
        likesCount: image.likesCount,
        likedBy: image.likedBy
      });
    }

  } catch (error) {
    res.status(500).json({
      message: "Like/unlike failed",
      error
    });
  }
};

export const getLikedImages = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate("likedImages");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.likedImages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch liked images", error });
  }
};

export const deleteImage = async (req, res) => {
  await Image.findByIdAndDelete(req.params.id);
  res.json({ message: "Image deleted" });
};

export const updateImage = async (req, res) => {
  const { title } = req.body;
  await Image.findByIdAndUpdate(req.params.id, { title });
  res.json({ message: "Image updated" });
};