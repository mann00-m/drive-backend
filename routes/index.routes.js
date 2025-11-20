const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// === Multer setup ===
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // ensure folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// === Show Home Page With File List ===
router.get("/home", (req, res) => {
  const uploadFolder = path.join(__dirname, "../uploads");

  // Read upload folder files
  let files = [];
  if (fs.existsSync(uploadFolder)) {
    files = fs.readdirSync(uploadFolder).map(file => ({
      name: file,
      url: "/uploads/" + file
    }));
  }

  res.render("home", { files });
});

// === Handle File Upload ===
router.post("/upload", upload.single("myfile"), (req, res) => {
  console.log("Uploaded File:", req.file);
  res.redirect("/index/home");
});

module.exports = router;
