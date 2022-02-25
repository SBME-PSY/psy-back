const express = require('express');

const router = express.Router({ mergeParams: true });

const { authorize, advancedResults } = require('../middleware');
const { clinicController } = require('../controllers');
const { authFun } = require('../utils');
const slotRouter = require('./slotRouter');

router
  .route('/')
  .post(
    authFun.protect,
    authorize.authorize('doctor'),
    clinicController.addClinic
  )
  .get(
    authFun.protect,
    authorize.authorize('doctor'),
    clinicController.getClinics
  );

router
  .route('/:clinicId')
  .patch(
    authFun.protect,
    authorize.authorize('doctor'),
    advancedResults.filterBody(
      'address',
      'pictures',
      'rating',
      'phoneNumbers',
      'price'
    ),
    clinicController.updateClinic
  );
router.use('/:clinicId/slots', slotRouter);

module.exports = router;
