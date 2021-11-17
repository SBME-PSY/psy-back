exports.sendResponse = (res, statusCode, status, data, token, message) =>
  res.status(statusCode).json({
    status: status,
    message: message || null,
    data: data || null,
    token: token || null,
  });
