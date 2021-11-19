const Joi = require('joi');

exports.adminApproveApplicationSchema = Joi.object({
  status: Joi.string().valid('approved', 'refused').required(),
});
