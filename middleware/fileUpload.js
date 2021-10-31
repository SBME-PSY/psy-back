const multer = require('multer');
const AppError = require('../controllers/errorController');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/doctors/profile-picture');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtention = file.mimetype.split('/')[1];
    const fileName = `doctor-${uniqueSuffix}.${fileExtention}`;
    cb(null, fileName);
  },
});

const filterPicture = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Please Upload an Image', 400), false);
  }
};

const uploadPicture = multer({
  storage: multerStorage,
  fileFilter: filterPicture,
  limits: { fileSize: 1048576 },
});

exports.profilePicture = uploadPicture.single('profilePicture');
