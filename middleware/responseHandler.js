exports.sendResponse = (
  res,
  statusCode,
  status,
  data = null,
  token = null,
  message = null
) => res.status(statusCode).json({ status, message, data, token });
