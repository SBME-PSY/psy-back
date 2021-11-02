exports.filterBody =
  (...fields) =>
  (req, res, next) => {
    const filteredFields = {};
    Object.keys(req.body).forEach((field) => {
      if (fields.includes(field)) {
        filteredFields[field] = req.body[field];
      }
    });
    req.body = filteredFields;
    next();
  };
