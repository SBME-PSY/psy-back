const fs = require('fs');
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

exports.setUploadParametersSingle =
  (prefix, path, MIME) => (req, res, next) => {
    req.filePrefix = prefix;
    req.filePath = path;
    req.fileMimeType = MIME;
    next();
  };

exports.base64UploadSingle = (base64) => (req, res, next) => {
  if (req.body[base64]) {
    const base64Image = req.body[base64];
    const { filePrefix, filePath } = req;
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtention = base64Image.split(';')[0].split('/')[1];
    const fileName = `${filePrefix}-${uniqueSuffix}.${fileExtention}`;
    const base64Data = base64Image.split(',')[1];
    fs.writeFile(`${filePath}/${fileName}`, base64Data, 'base64', (err) => {
      if (err) {
        return next(new AppError('Error while uploading file', 500));
      }
      req.file = {
        fieldname: base64,
        originalname: null,
        encoding: '7bit',
        mimetype: `image/${fileExtention}`,
        destination: req.filePath,
        filename: fileName,
        path: filePath,
        size: 6,
      };
      next();
    });
  } else {
    next();
  }
};
