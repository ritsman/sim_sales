import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Assets/images"); // Destination folder
  },
  filename: function (req, file, cb) {
    // File name: originalname + timestamp
    cb(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size if needed
});


  export const MulterMid = (req, res, next) => {
    upload.fields([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
      { name: "image4", maxCount: 1 },
      // Add more objects for additional files if needed
    ])(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred (e.g., file size limit exceeded)
        return res.status(400).json({ message: "Upload failed", error: err });
      } else if (err) {
        // An unknown error occurred
        return res
          .status(500)
          .json({ message: "Internal Server Errors", error: err });
      }
      // Files uploaded successfully
      next();
    });
  };