const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục nếu chưa có
const receiptDir = 'uploads/receipts/';
if (!fs.existsSync(receiptDir)){
  fs.mkdirSync(receiptDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, receiptDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});

const upload = multer({ storage });
module.exports = upload;
