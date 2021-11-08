const multer = require('multer');
const AppError = require('../controllers/errorController');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, req.filePath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtention = file.mimetype.split('/')[1];
    const fileName = `${req.filePrefix}-${uniqueSuffix}.${fileExtention}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.split('/')[1] === req.fileMimeType ||
    file.mimetype.split('/')[0] === req.fileMimeType
  ) {
    cb(null, true);
  } else {
    cb(new AppError('File type is not supported', 400), false);
  }
};

const uploadfile = multer({
  storage: multerStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1048576 },
});

exports.professionalCV = uploadfile.single('cvFile');

exports.profilePicture = uploadfile.single('profilePicture');

exports.setUploadParameters = (prefix, path, MIME) => (req, res, next) => {
  req.filePrefix = prefix;
  req.filePath = path;
  req.fileMimeType = MIME;
  next();
};
