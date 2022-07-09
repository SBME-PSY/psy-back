const Promisify = require('util').promisify;
const readFile = Promisify(require('fs').readFile);
const path = require('path');

const { responseHandler, asyncHandler } = require('../middleware');
const { questionnaireCategoryModel } = require('../models');
const { questionnaireCategoryValidator } = require('../validators');
const { AppError } = require('../utils');

exports.addCategory = asyncHandler(async (req, res, next) => {
  const { error, value } =
    questionnaireCategoryValidator.cateoryVlaidatorSchema.validate(req.body);
  if (error) {
    return next(new AppError(error, 400));
  }

  if (req.file)
    value.image = `/static/questionnaire/category/${req.file.picture}`;

  const category = await questionnaireCategoryModel.create(value);

  responseHandler.sendResponse(res, 201, 'success', category, null, null);
});

exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await questionnaireCategoryModel.find();
  const data = [];
  await Promise.all(
    categories.map(async (category) => {
      const image = await readFile(
        path.resolve(
          category.picture.replace(
            '/static',
            path.resolve(__dirname, '../public/')
          )
        ),
        'base64'
      );
      data.push({
        // eslint-disable-next-line
        ...category.toObject(),
        base64: `data:image/png;base64,${image}`,
      });
    })
  );

  responseHandler.sendResponse(res, 200, 'success', data, null, null);
});
