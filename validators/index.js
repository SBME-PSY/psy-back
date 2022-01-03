exports.adminAuthValidators = require('./adminValidators').adminAuthValidators;
exports.adminValidators = require('./adminValidators').adminValidators;

exports.doctorAuthValidators = require('./doctorValidators/doctorSignupValidations');

exports.userAuthValidators = require('./userValidators/userSignupValidations');
exports.articleValidators = require('./articleValidators/articleAllValidators');

exports.questionnaireValidators = require('./questionnaireValidators/questionnaireValidators');
